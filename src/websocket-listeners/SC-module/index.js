const WebSocketService  = require('./../../websocket/websocket-service');
const SCModuleService = require('./service');

const EVENTS = {
  GET_CURRENTTIME: 'currentTime',
  GET_CURRENTTIMEMS: 'currentTimeMs',
  COUNTDOWN: 'countDown',
  CUE_COUNTDOWN: "cueCountDown",
  SETTINGS: 'settings',
};

async function start() {
  setInterval(async () => {
    const currentTime   = SCModuleService.currentTime();
    const currentTimeMs = SCModuleService.currentTimeMs();
    const countDown     = await SCModuleService.countDown();
    const settings      = await SCModuleService.settings();
    const cueCountDown  = await SCModuleService.cueCountDown();

    WebSocketService.broadcastToAll(EVENTS.GET_CURRENTTIME, currentTime);
    WebSocketService.broadcastToAll(EVENTS.GET_CURRENTTIMEMS, currentTimeMs);
    WebSocketService.broadcastToAll(EVENTS.COUNTDOWN, countDown);
    WebSocketService.broadcastToAll(EVENTS.CUE_COUNTDOWN, cueCountDown);
    WebSocketService.broadcastToAll(EVENTS.SETTINGS, settings);

  }, 1000);
}
start();
