const UtilityService = require('./src/services/utility-service');
UtilityService.loadEnvironmentConfiguration();

const Server = require('./src/server');
console.log("---------------> ./index.js");

async function start() {
    try {
        await Server.startServer();
        await Server.startSocket();
        return { success: true };
    } catch (error) {
        console.log('Error caught: ', error && error.message ? error.message : '');
        if (error && error.stack) {
            console.log('Error stack : ', error.stack);
        }

        if(error.message === "Listen method has been called more than once without closing.") {
            return { success: false, error: "Server is already running" };
        }
        
        return { success: false, error: error.message || "Unknown error occurred" };
    }

}

module.exports = {
    start
}