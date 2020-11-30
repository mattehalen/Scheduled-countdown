const socket = io({ path: '/ws' });
const SOCKET_MESSAGE_BUCKET = [];

socket.on('connect', () => {
    console.log('SocketConnected!');

    // Not sure if this is required or not. Depends on situation.
    // Send stored socket messages.
    // while (SOCKET_MESSAGE_BUCKET.length > 0) {
    //     const { key, data } = SOCKET_MESSAGE_BUCKET.shift();
    //     sendSocketMessage(key, data);
    // }
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
    console.log('message received from server - ', data);
});


// Use this method to send socket message
function sendSocketMessage(key, data = {}) {
    // console.log('isSocketConnected: ', socket.connected);
    if (socket && socket.connected) {
        let message = {
            type: key,
            message: data
        }
        socket.emit('message', message);
    } else {
        console.log(`Socket is not connected. Therefore, cannot send socket message. Key-${key}   Data-${JSON.stringify(data)}`);
        SOCKET_MESSAGE_BUCKET.push({
            key: key,
            data: data
        });
    }
}
