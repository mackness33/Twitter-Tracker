//SOCKET

var socket = io(
	'http://' + document.domain + ':' + location.port + '/base',
	{
		reconnectionAttempts: 10,
		reconnectionDelay: 250,
		reconnectionDelayMax: 10000,
		autoConnect: false
	}
);

$(document).ready(function() {
  // start up the SocketIO connection to the server - the namespace 'test' is also included here if necessary
  // this is a callback that triggers when the "my response" event is emitted by the server.
  // socket.on('my response', function(msg) {
  //   $('#log').append('<p>Received: ' + msg.data + '</p>');
  // });
	socket.on('connect', function() {
		console.log('connecting ' + socket.id + 'to the SocketIOServer...');
		socket.emit('connection');
	});

  socket.on('connection_done', function() {
		console.log('successfully connected to the SocketServer...');
	});

	socket.on('tweet', function(msg) {
		console.log(msg);
		print_stream_tweets(msg);
	});

	socket.on('disconnect_client', function(msg) {
		socket.disconnect();
		console.log(msg);
	});

    $('form#form_lookup').submit(function(event) {
        if (!socket.disconnected)
            socket.emit('disconnect_server');
    });

  $('form#form_stream').submit(function(event) {
		console.log('retryin to connect')
		remove_old_tweets();
		// if (!socket.connected){
		// 	socket.connect();
		// }
		ferma_stream1();
	});

	ferma_stream1();
	// socket.connect();
	// socket.emit('start_sample');
});

//Per fermare/avviare lo stream dal pulsante switch
function ferma_stream1() {
	console.log(esporta_stream);
	if(pulisci_schermo){
		word_cloud_text = "";
		remove_old_tweets();
	}

	if(document.getElementById("switch-1").checked) {
		console.log("Checked: ");
		if (!socket.connected){
			let input = document.getElementById("input_stream").value
      console.log("input: " + input);

      let types = []
      if (document.getElementById("area_geografica_stream").checked)
        types.push(document.getElementById("area_geografica_stream").value)
      if (document.getElementById("luogo_stream").checked)
        types.push(document.getElementById("luogo_stream").value)
      if (document.getElementById("parola_chiave_stream").checked)
        types.push(document.getElementById("parola_chiave_stream").value)
      if (document.getElementById("persona_stream").checked)
        types.push(document.getElementById("persona_stream").value)

      // var types = document.getElementsByName('cbg_stream');
      // types.forEach((item, i) => {
      //   console.log("type: " + item + " at: " + i);
      // });
      console.log("types: " + types);

			socket.connect();

			socket.emit('start_stream', {"input": input, "type": types})
			// if (input != null && input != ""){
			// 	console.log("filtereeeed ");
			// 	socket.emit('start_filtered', input);
			// }else{
			// 	console.log("sampleee ");
			// 	socket.emit('start_sample');
			// 	// socket.emit('start_filtered', input);
			// }
		}
	}
	else {
		console.log("Not checked: ");
		if (socket.connected){
			socket.disconnect()
			console.log("disconnecting: " + socket.id);
		}
	}
}
