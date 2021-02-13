//SOCKET
var socket = io.connect(
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
		console.log('connectin ' + socket.id + 'to the SocketServer...');
		socket.emit('connection');
		// socket.emit('start_sample', {data: 'Starting sample stream'});
	});

  socket.on('connection_done', function() {
		console.log('successfully connected to the SocketServer...');
		socket.emit('start_sample');
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
		if (!socket.connected){
			socket.connect();
		}

	});

	socket.connect();
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
			socket.connect();
			console.log("connecting: " + socket.id);
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

//gestione visualizzazione tweet&mappa&worldcloud
function vedi_tweet(){
    var visibiletweet = document.getElementById("tweet_visibile");
    if (visibiletweet.checked){
        document.getElementById("visualizzazione_tw").style.display = "block";
    }
    else {
        document.getElementById("visualizzazione_tw").style.display = "none";
    }
    ridimensiona();
}
function vedi_mappa(){
    var visibilemap = document.getElementById("mappa_visibile");
    if (visibilemap.checked){
        document.getElementById("container-map").style.display = "block";
    }
    else {
        document.getElementById("container-map").style.display = "none";
    }
    ridimensiona();
}
function vedi_wordcloud(){
    var visibilecloud = document.getElementById("wordcloud_visibile");
    if (visibilecloud.checked){
        document.getElementById("word_cloud").style.display = "block";
    }
    else {
        document.getElementById("word_cloud").style.display = "none";
    }
    ridimensiona();
}

function ridimensiona(){
    var visibiletweet = document.getElementById("tweet_visibile");
    var visibilemap = document.getElementById("mappa_visibile");
    var visibilecloud = document.getElementById("wordcloud_visibile");
    if (visibiletweet.checked && visibilemap.checked && visibilecloud.checked) {
        document.getElementById("visualizzazione_tw").style.width = "33%";
        document.getElementById("container-map").style.width = "33%";
        document.getElementById("word_cloud").style.width = "33%";
    }
    else if ((visibiletweet.checked && visibilemap.checked) || (visibiletweet.checked && visibilecloud.checked) || (visibilecloud.checked && visibilemap.checked)){
        document.getElementById("visualizzazione_tw").style.width = "50%";
        document.getElementById("container-map").style.width = "50%";
        document.getElementById("word_cloud").style.width = "50%";
    }
    else {
        if (!socket.disconnected){
            socket.disconnect()
            console.log("disconnected");
        }
    }
}

var file_export; //per esportare ed importare i dati di ricerca
var pulisci_schermo = false; //controllo se pulire lo schermo
var isStream = true; //controlla se il file da esportare è uno stream o una ricerca

/*gestione tweet raccolti*/
function richiesta_dati(){
    $.ajax({
        type: "POST",
        url: "/base",
        data: $("#form_lookup").serialize(), // serializes the form's elements.
        dataType: "json",
        success: function (response) {
            isStream = false;
            file_export = response;
            esporta_stream = {
                data : [],
                includes : {
                    places : [],
                    users : []
                }
            }
            console.log('this is the response: ', response);
            if (response.data !== "ERROR")
                if (typeof response.data==="undefined")
                    alert('No results found')
                else
                    print_tweets(response);
            else
                alert(response.text);
        }
    });
    pulisci_schermo = true;
    document.getElementById("switch-1").checked = false;
}

let word_cloud_text = "";

var esporta_stream = {  //per esportare lo stream
        data : [],
        includes : {
            places : [],
            users : []
        }
    }

var coordinate = [];

var giornitweet = [
    {
        giorno: "Domenica",
        numeroTweet: 0
    },
    {
        giorno: "Lunedì",
        numeroTweet: 0
    },
    {
        giorno: "Martedì",
        numeroTweet: 0
    },
    {
        giorno: "Mercoledì",
        numeroTweet: 0
    },
    {
        giorno: "Giovedì",
        numeroTweet: 0
    },
    {
        giorno: "Venerdì",
        numeroTweet: 0
    },
    {
        giorno: "Sabato",
        numeroTweet: 0
    }
  ];

function print_stream_tweets(response){
    isStream = true;
    esporta_stream.data.push(response.data);
    if (typeof response.includes !== "undefined") {
        if (typeof response.includes.places !== "undefined") {
            esporta_stream.includes.places.push(response.includes.places[0])
        }
        if (typeof response.includes.users !== "undefined") {
            esporta_stream.includes.users.push(response.includes.users[0])
        }
    }
    let tweet = response.data;
    let aggiorna_wordcloud = false;
    let user = response.includes.users;
    let word_cloud_tmp = word_cloud_text;

    word_cloud_text = word_cloud_text + aggiornaHashtagCloud(tweet);

    aggiorna_wordcloud = (word_cloud_text!=word_cloud_tmp);

    if(aggiorna_wordcloud){
          word_cloud(word_cloud_text);
    }

    // visualizzazione tweet
    tweet_visualization(tweet, user)

    var giorno = new Date(tweet.created_at);
    var indicegiorno = giorno.getDay();
    giornitweet[indicegiorno].numeroTweet = giornitweet[indicegiorno].numeroTweet + 1

    //grafico giorni
    temporal(giornitweet)

    // maps
    var aggiorna_coordinate = false;
    if (typeof tweet.geo !== "undefined"){
        if (typeof tweet.geo.coordinates!=="undefined"){
            var long = tweet.geo.coordinates.coordinates[0];
            var lat = tweet.geo.coordinates.coordinates[1];
        }
        else if (typeof response.includes !== "undefined") {
            if (typeof response.includes.places !== "undefined"){
                var long = (response.includes.places[0].geo.bbox[0]+response.includes.places[0].geo.bbox[2])/2;
                var lat = (response.includes.places[0].geo.bbox[1]+response.includes.places[0].geo.bbox[3])/2;
            }
        }
        if (typeof tweet.attachments!=="undefined"){     //immagine
            var indiceimmagine = 0;
            while (indiceimmagine < response.includes.media.length){
                if (tweet.attachments.media_keys[0]==response.includes.media[indiceimmagine].media_key){
                    var immaginetweet = response.includes.media[indiceimmagine].url;
                    indiceimmagine = response.includes.media.length;
                }
                else{
                    indiceimmagine = indiceimmagine + 1;
                }
            }
        }
        if (typeof immaginetweet!=="undefined"){
            var latlong = [lat, long, tweet.text, response.includes.users[0].username, immaginetweet];
        }
        else{
            var latlong = [lat, long, tweet.text, response.includes.users[0].username];
        }
        coordinate.push(latlong);
        aggiorna_coordinate = true;
    }

    if(aggiorna_coordinate){
        initialize(coordinate);
    }
}

function tweet_visualization(tweet, utente){

    var indiceUser = 0;
    while (indiceUser<utente.length){
        if (tweet.author_id == utente[indiceUser].id){
            var usernameStream = utente[indiceUser].username;
            indiceUser = utente.length;
        }
        else{
            indiceUser = indiceUser + 1;
        }
    }

    let container = document.createElement("div");
    container.setAttribute("class", "tweet_container");

    let username = document.createElement("div");
    username.setAttribute("class", "tweet_userName");
    username.innerHTML = usernameStream;

    let text = document.createElement("div");
    text.setAttribute("class", "tweet_text");
    text.innerHTML = tweet.text;

    container.appendChild(username);
    container.appendChild(text);
    let tweet_list = document.getElementById("visualizzazione_tw");
    tweet_list.insertBefore(container, tweet_list.childNodes[0]);
}

function remove_old_tweets(){
    var node = document.getElementById("visualizzazione_tw")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    pulisci_schermo = false;
}

function aggiornaHashtagCloud(tweet){
    var testo = "";
    var testo_agg = tweet.text;
    if (typeof tweet.entities !== "undefined"){
        if (typeof tweet.entities.mentions !== "undefined"){
            for (element of tweet.entities.mentions){
                testo_agg = testo_agg.replace("@"+element.username, "");
            }
        }
        if (typeof tweet.entities.urls !== "undefined"){
            for (element of tweet.entities.urls){
                testo_agg = testo_agg.replace(element.url, "");
            }
        }
    }
    testo = testo + " " + testo_agg;
    return testo
}

function print_tweets(data){
    // TODO: handle results with undefined data, ergo: 0 tweets found
    var dati = data.data
    var utente = data.includes.users;
    ripristinatempo();
    //word cloud;
    var testo = "";

    for (element of dati){
        testo = testo + " " + aggiornaHashtagCloud(element);
    }
    word_cloud(testo);

    //visualizzazione tweet
    var node = document.getElementById("visualizzazione_tw")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    dati.forEach(element => {
        tweet_visualization(element,utente);
        var giorno = new Date(element.created_at);
        var indicegiorno = giorno.getDay();
        giornitweet[indicegiorno].numeroTweet = giornitweet[indicegiorno].numeroTweet + 1
    });

    //grafico giorni
    temporal(giornitweet)

    //colloca su mappa
    var coordinate = [];
    for (element of dati){
        if (typeof element.geo!=="undefined"){
            var indicePlace = 0;
            while (indicePlace < data.includes.places.length){
                if (data.includes.places[indicePlace].id==element.geo.place_id){
                    var long = (data.includes.places[indicePlace].geo.bbox[0] + data.includes.places[indicePlace].geo.bbox[2])/2;
                    var lat = (data.includes.places[indicePlace].geo.bbox[1] + data.includes.places[indicePlace].geo.bbox[3])/2;
                    var indiceUtente = 0;
                    while (indiceUtente < data.includes.users.length){
                        if (data.includes.users[indiceUtente].id==element.author_id){
                            var nome_utente = data.includes.users[indiceUtente].username;
                            indiceUtente = data.includes.users.length;
                        }
                        else {
                            indiceUtente = indiceUtente + 1;
                        }
                    }
                    indicePlace = data.includes.places.length;
                }
                else {
                    indicePlace = indicePlace + 1;
                }
            }
            var immaginetweet;
            if (typeof element.attachments!=="undefined"){     //immagine
                var indiceimmagine = 0;
                while (indiceimmagine < data.includes.media.length){
                    if (element.attachments.media_keys[0]==data.includes.media[indiceimmagine].media_key){
                        immaginetweet = data.includes.media[indiceimmagine].url;
                        indiceimmagine = data.includes.media.length;
                    }
                    else{
                        indiceimmagine = indiceimmagine + 1;
                    }
                }
            }
            var testo_tweet = element.text;
            if (typeof immaginetweet!=="undefined"){
                var latlong_text = [lat, long, testo_tweet, nome_utente, immaginetweet];
            }
            else{
                var latlong_text = [lat, long, testo_tweet, nome_utente];
            }
            coordinate.push(latlong_text);
        }
    }

    initialize (coordinate);
}
