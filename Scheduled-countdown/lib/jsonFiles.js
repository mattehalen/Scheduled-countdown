const fs = require('fs').promises;

async function read(filename){
  const data = await fs.readFile(filename)
  return JSON.parse(data);
}

async function write(filename, data){
  await fs.writeFile(filename, JSON.stringify(data, null, 4));
}

module.exports = {
  read,
  write,
};
