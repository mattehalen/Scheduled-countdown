// Using the exposed APIs from the preload script
async function get_github_revision() {
  try {
    const revision = await window.api.getGithubRevision();
    const packageInfo = await window.api.getPackageInfo();
    // packageInfo may be an object with name/version or an error object
    if (packageInfo && packageInfo.name && packageInfo.version) {
      $("#appTitle").text(packageInfo.name + " V." + packageInfo.version + " [" + revision + "]");
    } else {
      $("#appTitle").text("Unknown App V.unknown [" + revision + "]");
    }
  } catch (error) {
    console.error('Error getting revision:', error);
  }
}

// Initialize
(async function init() {
    await get_github_revision();
    await getNetworkIPs();
})();

var myIpArray = "";
async function getNetworkIPs() {
  try {
    const ips = await window.api.getNetworkIPs();
    myIpArray = ips;
    console.log("Log All ips from Socket", myIpArray);
  } catch (error) {
    console.error('Error getting network IPs:', error);
    myIpArray = [];
  }

}

$('#SaveIP_Button').click(async function () {
  try {
    var port = document.getElementById("port");
    console.log("SaveIP_Button = " + port);
    const result = await window.api.saveIP({
      port: port.value
    });
    if (!result.success) {
      console.error('Failed to save IP:', result.error);
    }
  } catch (error) {
    console.error('Error in SaveIP_Button:', error);
  }
});

$('#LoopbackIP_Button').click(async function () {
  try {
    var port = document.getElementById("port");
    console.log("LoopbackIP_Button = ");
    const result = await window.api.loopbackIP({
      ipadress: "127.0.0.1",
      port: port.value
    });
    if (!result.success) {
      console.error('Failed to set loopback IP:', result.error);
    }
    console.log("LoopbackIP_Button");
  } catch (error) {
    console.error('Error in LoopbackIP_Button:', error);
  }
});
$(document).ready(function() {
    console.log('Document ready');
    console.log('API object available:', !!window.api);
});

$('#start_server').click(async function () {
  try {
    console.log("start_server button clicked");
    console.log("API object:", window.api);
    if (!window.api) {
      console.error('API not available');
      return;
    }
    const result = await window.api.startServer();
    console.log("Start server result:", result);
    if (result && result.success) {
      $('#app_state').text("Online !");
      $('#start_server').hide();
      $('#stop_server').show();
      $('#openLinks').show();
    } else {
      console.error('Failed to start server:', result ? result.error : 'No result');
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }
});

$('#stop_server').click(async function () {
  try {
    console.log("stop_server = ");
    const result = await window.api.stopServer();
    if (result.success) {
      $('#app_state').text("Offline !");
      $('#start_server').show();
      $('#stop_server').hide();
      $('#openLinks').hide();
    } else {
      console.error('Failed to stop server:', result.error);
    }
  } catch (error) {
    console.error('Error stopping server:', error);
  }
});

$('#open_admin').click(async function () {
  try {
    var port = document.getElementById("port");
    const result = await window.api.openAdmin({
      port: port.value
    });
    if (!result.success) {
      console.error('Failed to open admin:', result.error);
    }
  } catch (error) {
    console.error('Error opening admin:', error);
  }
});

$('#open_root').click(async function () {
  try {
    var port = document.getElementById("port");
    const result = await window.api.openRoot({
      port: port.value
    });
    if (!result.success) {
      console.error('Error opening root:', result.error);
    }
  } catch (error) {
    console.error('Error opening root:', error);
  }
});
$('#AutoStart').change(async function () {
  try {
    console.log("AutoStart Checkbox");
    var AutoStart = document.getElementById("AutoStart");
    const result = await window.api.setAutoStart({
      autoStart: AutoStart.checked
    });
    if (!result.success) {
      console.error('Failed to set AutoStart:', result.error);
    }
  } catch (error) {
    console.error('Error setting AutoStart:', error);
  }
});

$('#openLog').click(async function () {
  try {
    console.log("openLog Button was pressed");
    const result = await window.api.openLog();
    if (!result.success) {
      console.error('Failed to open log:', result.error);
    }
  } catch (error) {
    console.error('Error opening log:', error);
  }
});

async function getAutoStart() {
  try {
    const settings = await window.api.getAutoStart();
    if (settings && settings.autoStart) {
      $("#start_server").click();
    }
    $("#AutoStart").prop('checked', settings.autoStart);
    return settings.autoStart;
  } catch (error) {
    console.error('Error getting AutoStart:', error);
    return false;
  }
}
getAutoStart();

async function getPort() {
  try {
    const port = await window.api.getPort();
    if (port) {
      $("#port").val(port);
    }
  } catch (error) {
    console.error('Error getting port:', error);
  }
}
getPort();