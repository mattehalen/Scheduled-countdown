const UtilityService = require('./src/services/utility-service');
UtilityService.loadEnvironmentConfiguration();

const Server = require('./src/server');
console.log("---------------> ./index.js");

function start() {
    Server.startServer()
        .then(output => {
            Server.startSocket();
        })
        .catch(error => {
            console.log('Error caught: ', error && error.message ? error.message : '');
            if (error && error.stack) {
                console.log('Error stack : ', error.stack);
            }

            if(error.message != "Listen method has been called more than once without closing."){
                process.exit(1); // Stopping Nodejs Application completely on error.
            }
            
        });

}

module.exports = {
    start
}