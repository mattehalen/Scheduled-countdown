var getNetworkIPs = (function () {
  const ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

  const exec = require('child_process').exec;
  var cached;
  var command;
  var filterRE;

  switch (process.platform) {
    case 'win32':
      //case 'win64': // TODO: test
      command = 'ipconfig';
      filterRE = /\bIPv[46][^:\r\n]+:\s*([^\s]+)/g;
      break;
    case 'darwin':
      command = 'ifconfig';
      filterRE = /\binet\s+([^\s]+)/g;
      // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
      break;
    default:
      command = 'ifconfig';
      filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
      // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
      break;
  }

  return function (callback, bypassCache) {
    if (cached && !bypassCache) {
      callback(null, cached);
      return;
    }
    // system call
    exec(command, function (error, stdout) {
      cached = [];
      var ip;
      var matches = stdout.match(filterRE) || [];
      //if (!error) {
      for (var i = 0; i < matches.length; i++) {
        ip = matches[i].replace(filterRE, '$1')
        if (!ignoreRE.test(ip)) {
          cached.push(ip);
        }
      }
      //}
      callback(error, cached);
    });
  };
})();

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

function getPort() {
  const defaultPort = '8080'; //default port
  return process.env.PORT || defaultPort;
}

function loadEnvironmentConfiguration() {
  // load dotenv here - future use.
  // For reference: https://www.npmjs.com/package/dotenv
}

module.exports = {
  getPort,
  loadEnvironmentConfiguration,
  getNetworkIPs,
  sleep
}