// Internal Imports
const http = require('http');
const path = require('path');


// External Imports
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');


// Custom Imports
const UtilityService    = require('./services/utility-service');

// ExpressJs Server App
const app = express();


// PORT Set
const PORT = async () => {
    return await UtilityService.getPort();
}
 


// Creating Http Server
const httpServer = http.createServer(app);
// ------------------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
// ------------------------------------------------------------


// Middlewares and PORT Set
app.set('port', async () => {
    return await UtilityService.getPort();}
)
app.use(cors()) // Always put CORS as first line in middleware. This is very important.
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, '..', 'public')))
// app.use('/static', express.static(path.join(__dirname, '..', 'public')))
// ------------------------------------------------------------


// Routes Registering
app.get('/favicon.ico', (req, res) => res.status(204).send());
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use('/',      require('./apis/index'));
app.use('/admin', require('./apis/admin'));
app.use('/users',  require('./apis/user'));
// ------------------------------------------------------------



// OnError handler for httpServer
async function onError(error) {
    _port = await UtilityService.getPort();
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error('Port ' + _port + ' requires elevated privileges');
            break;
        case 'EADDRINUSE':
            console.error('Port ' + _port + ' is already in use');
            break;
        default:
            throw error;
    }
}


module.exports = {
    startServer: async () => {
        _port = await UtilityService.getPort();
        console.log(_port);
        return new Promise((resolve, reject) => {
            httpServer.on('error', error => {
                console.log('Error while starting server: ', error.message);
                onError(error);
                reject(error);
            });
            httpServer.listen(_port, () => {
                console.log('HTTP Server listening on http://localhost:' + _port + '/');
                resolve();
            });
        })
    },

    startSocket: () => {
        // WebSocket Initialize - socket should be started only after HTTP Server is started.
        const WebSocketService = require('./websocket/websocket-service');
        WebSocketService.start(httpServer);

        const WebSocketListeners = require('./websocket-listeners');
        WebSocketListeners.registerSocketListeners();
    },
    stopServer: async () => {
        const WebSocketService = require('./websocket/websocket-service');

        console.log("----------> ./src/server -> stopServer");
        httpServer.close()
        WebSocketService.stop();
    },
}
