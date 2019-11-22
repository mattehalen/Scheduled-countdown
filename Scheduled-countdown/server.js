const express = require('express');
const app = express();


const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});


app.get('/', (req, res) => {
  res.send('Hello World! this world is Another test');
});
