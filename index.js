const UtilityService = require('./src/services/utility-service');
UtilityService.loadEnvironmentConfiguration();

const Server = require('./src/server');
Server.startServer()
    .then(output => {
        Server.startSocket();
    })
    .catch(error => {
        console.log('Error caught: ', error && error.message ? error.message : '');
        if (error && error.stack) {
            console.log('Error stack : ', error.stack);
        }
        process.exit(1); // Stopping Nodejs Application completely on error.
    });
