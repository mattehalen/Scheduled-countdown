const jsonFiles = require('./jsonFiles');

const filepath = './public/admin-settings-backup.json';

let currentState;

async function get() {
  if (!currentState) {
    currentState = await jsonFiles.read(filepath);
  }

  return currentState;
}

async function write(data) {
  currentState = data;
  await jsonFiles.write(filepath, currentState);
}

module.exports = {
  get,
  write,
};
