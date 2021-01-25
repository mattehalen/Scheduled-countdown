const { ipcRenderer } = require('electron')


var myIpArray = "";
var getNetworkIPs = (function() {
    var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;
  
    var exec = require('child_process').exec;
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
  
    return function(callback, bypassCache) {
      if (cached && !bypassCache) {
        callback(null, cached);
        return;
      }
      // system call
      exec(command, function(error, stdout, sterr) {
        cached = [];
        var ip;
        var matches = stdout.match(filterRE) || [];
        //if (!error) {
        for (var i = 0; i < matches.length; i++) {
          ip = matches[i].replace(filterRE, '$1')
          if (!ignoreRE.test(ip)) {
            addToSelect(ip);
            cached.push(ip);
          }
        }
        //}
        callback(error, cached);
      });
    };
  })();
  getNetworkIPs(function(error, ip) {
    myIpArray = ip
    console.log("Log All ips from Socket", myIpArray);
  
    if (error) {
      console.log('error:', error);
    }
  }, false);

function addToSelect(ip) {
    var x = document.getElementById("ipSelect");
    var option = document.createElement("option");
    option.text = ip;
    x.add(option);
}

$('#SaveIP_Button').click(function(){
    var e = document.getElementById("ipSelect");
    var port = document.getElementById("port");
    var selectedIP = e.options[e.selectedIndex].value;
    console.log("SaveIP_Button = "+selectedIP);
    ipcRenderer.send('saveIP', {
      ipadress:selectedIP,
      port: port.value
    })
 });
 $('#LoopbackIP_Button').click(function(){
  var port = document.getElementById("port");
  console.log("LoopbackIP_Button = ");
  ipcRenderer.send('loopbackIP', {
    ipadress:"127.0.0.1",
    port: port.value
  })
    console.log("LoopbackIP_Button");
 });

 $('#start_server').click(function(){
  console.log("start_server = ");
  ipcRenderer.send('start_server', {})
 });

 $('#stop_server').click(function(){
  console.log("stop_server = ");
  ipcRenderer.send('stop_server', {})
 });


