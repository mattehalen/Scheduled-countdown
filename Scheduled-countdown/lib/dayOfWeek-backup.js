const jsonFiles = require('./jsonFiles');

const filepath = './public/admin-settings.json';

let currentState;

async function get() {
  if (!currentState) {
    currentState = await jsonFiles.read(filepath);
  }
// console.log(currentState.dayOfWeek);

  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var n = weekday[d.getDay()];



  const entries = Object.entries(currentState.dayOfWeek)
  var i=0;
  for (const [day, value] of entries) {
    // console.log("dayOfWeek day + value = " + day + " - " + value);

    if (day === n) {
      return value;
    }
  }



}

async function write(data) {
  currentState = data;
  await jsonFiles.write(filepath, currentState);
}

module.exports = {
  get,
  write,
};
