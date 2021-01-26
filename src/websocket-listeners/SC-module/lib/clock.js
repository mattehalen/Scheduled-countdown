//console.log("---------- Clock.js");
function CurrentTime() {
    const date = new Date();

    var time = "";
    time += (10 > date.getHours() ? "0" : "") + date.getHours() + ":";
    time += (10 > date.getMinutes() ? "0" : "") + date.getMinutes() + ":";
    time += (10 > date.getSeconds() ? "0" : "") + date.getSeconds();

    return time;
}
function CurrentTimeInMs() {
    var date = new Date();
    var dInMs = date.getTime()
    return dInMs
}


module.exports = {
  CurrentTime,
  CurrentTimeInMs
}
