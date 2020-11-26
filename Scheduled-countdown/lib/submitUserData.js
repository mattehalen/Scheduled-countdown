const FileOperation = require('./../services/file-operations');

let currentState = null;


async function get(user) {
  if (!currentState) {
    const filepath = './public/CueLists/' + user + ".json";
    currentState = await FileOperation.readFromFile(filepath);
  }
  return currentState;
}

async function write(user, data) {
  const filepath = './public/CueLists/' + user + ".json";
  await FileOperation.writeToFile(filepath, currentState);
  currentState = data;
}

module.exports = {
  get,
  write,
}
