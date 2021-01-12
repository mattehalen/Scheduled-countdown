const socket = io({ path: '/ws' });

// It stores socket messages untill socket is connecter, or socket is disconnected.
// Once socket is connected, it will send all stored messages.
const storeSocketMessageIfNotConnected = true;
const SOCKET_MESSAGE_BUCKET = [];

socket.on('connect', () => {
    console.log('SocketConnected!');
    onSocketConnected();
});
socket.on('disconnect', () => {
    console.log('Socket Disonnected!');
});
socket.on('reconnect', () => {
    console.log('Socket Reconnected!');
});
socket.on('error', (error) => {
    console.log('Socket Error - ', error);
});
socket.on('message', (data) => {
    //console.log('message received from server - ', data);
    const { type, message } = data;
    WebSocketService.onMessage(type, message);
});

// This method will gets called when socket is connected.
function onSocketConnected() {
    if (storeSocketMessageIfNotConnected) {
        while (SOCKET_MESSAGE_BUCKET.length > 0) {
            const { key, data } = SOCKET_MESSAGE_BUCKET.shift();
            WebSocketService.sendSocketMessage(key, data);
        }
    }
    //WebSocketService.sendSocketMessage('get_currentTime', 'some-data');
}

// Use this method to send socket message
function sendSocketMessage(key, data = {}) {
    // console.log('isSocketConnected: ', socket.connected);
    if (socket && socket.connected) {
        let message = { type: key, message: data };
        socket.emit('message', message);
    } else {
        console.log(`Socket is not connected. Therefore, cannot send socket message. Key-${key}   Data-${JSON.stringify(data)}`);
        if (storeSocketMessageIfNotConnected) {
            SOCKET_MESSAGE_BUCKET.push({ key, data });
            console.log('SOCKET_MESSAGE_BUCKET - ', SOCKET_MESSAGE_BUCKET.length);
        }
    }
}


// Class to handle events send/receive/store
class WebSocketService {
    static #callback = {};

    static KEYS = {

    };

    static onEvent(key, callback) {
        if (Array.isArray(this.#callback[key])) {
            this.#callback[key].push(callback);
        } else {
            this.#callback[key] = [callback];
        }
    }

    static onMessage(key, data) {
        if (Array.isArray(this.#callback[key])) {
            this.#callback[key].forEach(callback => {
                setTimeout(() => {
                    callback(data);
                }, 0);
            })
        } else {
            this.#callback[key] = [];
        }
    }

    static sendSocketMessage(key, data) {
        sendSocketMessage(key, data);
    }
}



/*
    ---------------------------------------------------------------------------
    Examples
    ---------------------------------------------------------------------------

    // Capture websocket message from Server like this.
    WebSocketService.onEvent(WebSocketService.KEYS.GET_TIME_CODE, (message) => {
        console.log('Message from server: ', message);
    })

    // Send websocket message to server
    WebSocketService.sendSocketMessage('key', 'some-data');
    ---------------------------------------------------------------------------
*/
