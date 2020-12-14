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
const Clock             = require('./websocket-clock/clock');
const CountDown         = require('./websocket-clock/countDown');
const TimeArraySorting  = require('./websocket-clock/TimeArraySorting');
// const a = CountDown.CueCountDown();
// a.then(function(data){
//     console.log(data);
// })


// ExpressJs Server App
const app = express();


// PORT Set
const PORT = UtilityService.getPort();


// Creating Http Server
const httpServer = http.createServer(app);
// ------------------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
// ------------------------------------------------------------


// Middlewares and PORT Set
app.set('port', UtilityService.getPort())
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
app.use('/',      require('./apis/index'));
app.use('/admin', require('./apis/admin'));
app.use('/users',  require('./apis/user'));
// ------------------------------------------------------------



// OnError handler for httpServer
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error('Port ' + PORT + ' requires elevated privileges');
            break;
        case 'EADDRINUSE':
            console.error('Port ' + PORT + ' is already in use');
            break;
        default:
            throw error;
    }
}


module.exports = {
    startServer: () => {
        return new Promise((resolve, reject) => {
            httpServer.on('error', error => {
                console.log('Error while starting server: ', error.message);
                onError(error);
                reject(error);
            });
            httpServer.listen(PORT, () => {
                console.log('HTTP Server listening on http://localhost:' + PORT + '/');
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
}
