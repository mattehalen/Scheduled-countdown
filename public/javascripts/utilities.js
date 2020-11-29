// Sleep Function
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

async function getAdminSettingsJson() {
    const response = await fetch('/admin-settings.json');
    const json = await response.json();
    return json;
}
