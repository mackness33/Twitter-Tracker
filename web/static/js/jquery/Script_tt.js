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

    if (typeof tweet.entities !== "undefined"){
        if (typeof tweet.entities.hashtags !== "undefined"){
            tweet.entities.hashtags.forEach(hashtag => {
                word_cloud_text = word_cloud_text + " " + hashtag.tag;
            });
            aggiorna_wordcloud = true;
        }
    }
    
    if(aggiorna_wordcloud){
          word_cloud(word_cloud_text);
      }

    // visualizzazione tweet
    // TODO: set a maximum quantity of tweets to be visualize
    // TIP: use a Queue
    tweet_visualization(tweet, user)

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
        var latlong = [lat, long, tweet.text, response.includes.users[0].username];
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

function print_tweets(data){
    // TODO: handle results with undefined data, ergo: 0 tweets found
    var dati = data.data
    var utente = data.includes.users;
    //word cloud;
    var testo = "";

    for (element of dati){
        pk = 0;
        if (typeof element.entities!=="undefined"){
            if (typeof element.entities.hashtags!=="undefined"){
                while (typeof element.entities.hashtags[pk]!=="undefined"){
                    testo = testo + " " + element.entities.hashtags[pk].tag;
                    pk=pk+1;
                }
            }
        }
    }
    word_cloud(testo);

    //visualizzazione tweet
    var node = document.getElementById("visualizzazione_tw")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    //var index = 0
    dati.forEach(element => {
        tweet_visualization(element,utente)
    });

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
            var testo_tweet = element.text;
            var latlong_text = [lat, long, testo_tweet, nome_utente];
            coordinate.push(latlong_text);
        }
    }

    initialize (coordinate);
}

//Pulisce mappa e wordcloud ad ogni ricerca sullo stream e imposta su attivo 
function aggiustamenti_stream(){
    word_cloud_text = "";
    coordinate = [];
    initialize(coordinate);
    word_cloud(word_cloud_text);
    document.getElementById("switch-1").checked = true;
}