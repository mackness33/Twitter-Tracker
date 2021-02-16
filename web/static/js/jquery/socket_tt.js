//SOCKET
var socket = io.connect(
    'http://' + document.domain + ':' + location.port + '/base',
    {reconnectionDelayMax: 10000}
);
$(document).ready(function() {
    // start up the SocketIO connection to the server - the namespace 'test' is also included here if necessary
    // this is a callback that triggers when the "my response" event is emitted by the server.
    // socket.on('my response', function(msg) {
    //   $('#log').append('<p>Received: ' + msg.data + '</p>');
    // });

    socket.on('connection_done', function() {
        console.log('successfully connected to the SocketServer...');
        socket.emit('start_sample', {data: 'Starting sample stream'});
    });

    socket.on('tweet', function(msg) {
        console.log(msg);
        print_stream_tweets(msg)
    });

    socket.on('disconnect_client', function(msg) {
        socket.disconnect()
        console.log(msg);
    });

    $('form#form_lookup').submit(function(event) {
        if (!socket.disconnected)
            socket.emit('disconnect_server');
    });

    $('form#form_stream').submit(function() {
        console.log('retryin to connect')
        remove_old_tweets()
        if (!socket.connected){
            socket.connect();
        }
    });
});

//Per fermare/avviare lo stream dal pulsante switch
function ferma_stream1() {
    if(pulisci_schermo){
        word_cloud_text = "";
        coordinate = [];
        initialize(coordinate);
        word_cloud(word_cloud_text);
        remove_old_tweets();
    }
    if(document.getElementById("switch-1").checked) {
        if (!socket.connected){
            socket.connect();
        }
    }
    else {
        if (!socket.disconnected){
            socket.disconnect()
            console.log("disconnected");
        }
    }
}