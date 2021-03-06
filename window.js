const {
  ipcRenderer
} = require('electron')
const package = require('./package.json');
// const revision = require('child_process')
//   .execSync('git rev-parse HEAD')
//   .toString().trim()

async function get_github_revision() {
  var data = await ipcRenderer.sendSync('get_github_revision', 'get_github_revision');
  $("#appTitle").text(package.name + " V." + package.version + " [" + data + "]");
}
get_github_revision();

var myIpArray = "";
var getNetworkIPs = (function () {
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

  return function (callback, bypassCache) {
    if (cached && !bypassCache) {
      callback(null, cached);
      return;
    }
    // system call
    exec(command, function (error, stdout, sterr) {
      cached = [];
      var ip;
      var matches = stdout.match(filterRE) || [];
      //if (!error) {
      for (var i = 0; i < matches.length; i++) {
        ip = matches[i].replace(filterRE, '$1')
        if (!ignoreRE.test(ip)) {
          // addToSelect(ip);
          cached.push(ip);
        }
      }
      //}
      callback(error, cached);
    });
  };
})();
getNetworkIPs(function (error, ip) {
  myIpArray = ip
  console.log("Log All ips from Socket", myIpArray);

  if (error) {
    console.log('error:', error);
  }
}, false);

$('#SaveIP_Button').click(function () {
  var e = document.getElementById("ipSelect");
  var port = document.getElementById("port");
  //var selectedIP = e.options[e.selectedIndex].value;
  console.log("SaveIP_Button = " + port);
  ipcRenderer.send('saveIP', {
    //ipadress:selectedIP,
    port: port.value
  })
});
$('#LoopbackIP_Button').click(function () {
  var port = document.getElementById("port");
  console.log("LoopbackIP_Button = ");
  ipcRenderer.send('loopbackIP', {
    ipadress: "127.0.0.1",
    port: port.value
  })
  console.log("LoopbackIP_Button");
});
$('#start_server').click(function () {
  console.log("start_server");
  ipcRenderer.send('start_server', {})
  $('#app_state').text("Online !");
  $('#start_server').hide();
  $('#stop_server').show();
  $('#openLinks').show();

});
$('#stop_server').click(function () {
  console.log("stop_server = ");
  ipcRenderer.send('stop_server', {})
  $('#app_state').text("Offline !");
  $('#start_server').show();
  $('#stop_server').hide();
  $('#openLinks').hide();
});
$('#open_admin').click(function () {
  var port = document.getElementById("port");
  ipcRenderer.send('open_admin', {
    port: port.value
  })
});
$('#open_root').click(function () {
  var port = document.getElementById("port");
  ipcRenderer.send('open_root', {
    port: port.value
  })
});
$('#AutoStart').change(function () {
  console.log("AutoStart Checkbox");
  var AutoStart = document.getElementById("AutoStart");
  ipcRenderer.send('AutoStart', {
    autoStart: AutoStart.checked
  })
});
$('#openLog').click(function () {
  console.log("openLog Button was presed");
  ipcRenderer.send('openLog')
});

async function getAutoStart() {
  var bool = await ipcRenderer.sendSync('getAutoStart', 'ping').autoStart;

  if (bool) {
    $("#start_server").click();
  }


  $("#AutoStart").prop('checked', bool);
  return bool
}
getAutoStart();
async function getPort() {
  var data = await ipcRenderer.sendSync('get_port', 'get_port');
  $("#port").val(data);
}
getPort();