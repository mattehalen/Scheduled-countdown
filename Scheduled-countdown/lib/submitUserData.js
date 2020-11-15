const jsonFiles = require('./jsonFiles');

// const filepath = './public/admin-settings.json';

let currentState;

async function get(user) {
  if (!currentState) {
    // const filepath = './public/admin-settings.json';
    const filepath = './public/CueLists/'+user+".json"
    currentState = await jsonFiles.read(filepath);
  }

  return currentState;
}

async function write(user,data) {
  const filepath = './public/CueLists/'+user+".json"
  currentState = data;
  await jsonFiles.write(filepath, currentState);
}

module.exports = {
  get,
  write,
};
