const socket = io({ path: '/ws' });

socket.on('connect', () => {
    console.log('SocketConnected!');
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
function sendSocketMessage(key, data) {
    if (socket && socket.connected) {
        return {
            type: key,
            message: data
        }
    } else {
        console.log('Socket is not conncted. Therefore, cannot send socket message.');
        console.log('Key  - ', key);
        console.log('Data - ', data);
        console.log();
    }
}
