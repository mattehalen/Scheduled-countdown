const { v4: uuidv4 } = require('uuid');
const socketio = require('socket.io');

const EVENT_CALLBACKS = {};


function createMessage(key, data = {}) {
  return {
    type: key,
    message: data
  }
}

class WebSocket {
  socket = null
  allClients = [];

  socketOptions = {
    'path': '/ws',
    'pingInterval': 10000
  }

  constructor(httpServer) {
    //-------------------------------------------------------
    // this.socket = socketio(httpServer, this.socketOptions);
    //-------------------------------------------------------
    this.socket = socketio();
    this.socket.attach(httpServer, this.socketOptions);
    //-------------------------------------------------------

    this.socket.on('connection', (client) => {
      this.onConnection(client);
    });
    this.socket.on('error', this.onClientError);
  }

  onConnection(client) {
    client.uuid = uuidv4();
    console.log('New User/SocketClient is connected.');

    this.addClient(client);

    client.on('disconnect', (reason) => {
      this.removeClient(client);
    })

    client.on('message', (data) => {
      console.log('Message Received from UI - ' + JSON.stringify(data));

      const callbackForSendToClient   = async (data2) => client.emit('message', data2);
      const callbackForBroadcastToAll = async (key, data2) => this.broadcastToAll(key, data2);

      const messageEvent = new MessageEvent(data, callbackForSendToClient, callbackForBroadcastToAll);

      this.sendToCallbacks(messageEvent);
    });
  }

  sendToCallbacks(messageEvent) {
    if (Array.isArray(EVENT_CALLBACKS[messageEvent.type])) {
      EVENT_CALLBACKS[messageEvent.type].forEach(callback => {
        callback(messageEvent);
      })
    } else {
      EVENT_CALLBACKS[messageEvent.type] = [];
    }
  }

  onDisconnection(msg) {
    console.log('Client disconnected - ', msg);
  }

  onClientError(error) {
    console.log('Client error - ', error);
  }

  static onEvent(key, callback) {
    if ((typeof key === 'string') && (key.length > 0) && (typeof callback === 'function')) {
      if (Array.isArray(EVENT_CALLBACKS[key])) {
        EVENT_CALLBACKS[key].push(callback);
      } else {
        EVENT_CALLBACKS[key] = [callback];
      }
    }
  }

  broadcastToAll(key, data) {
    this.socket.emit('message', createMessage(key, data));
  }

  addClient(client) {
    this.allClients.push(client);
  }

  removeClient(disconnectedClient) {
    for (let i = 0; i < this.allClients.length; i++) {
      if (this.allClients[i].uuid === disconnectedClient.uuid) {
        this.allClients.splice(i, 1);
        break;
      }
    }
  }

  stopServer() {
    // this.socket.close();
  }
}

class MessageEvent {
  type     = null;
  message  = null;

  callbackForSendToClient  = null;
  callbackForBroadcastToAll = null;

  constructor(data, callbackForSendToClient = null, callbackForBroadcastToAll = null) {
    this.type    = data.type;
    this.message = data.message;

    this.callbackForSendToClient = callbackForSendToClient;
    this.callbackForBroadcastToAll = callbackForBroadcastToAll;
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }

  sendToClient(key, data) {
    if (this.callbackForSendToClient) {
      this.callbackForSendToClient(createMessage(key, data));
    }
  }

  broadcastToAll(key, data) {
    if (this.callbackForBroadcastToAll) {
      this.callbackForBroadcastToAll(key, data)
    }
  }

}

module.exports = WebSocket;
