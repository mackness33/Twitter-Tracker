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

    $('form#form_stream').submit(function(event) {
		console.log('retryin to connect')
		remove_old_tweets()
		if (!socket.connected){
			socket.connect();
		}
	});
});
//Per fermare/avviare lo stream dal pulsante switch
function ferma_stream1() {
	console.log(esporta_stream);
		if(pulisci_schermo){
			word_cloud_text = "";
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
        document.getElementById("visualizzazione_tw").style.width = "100%";
        document.getElementById("container-map").style.width = "100%";
        document.getElementById("word_cloud").style.width = "100%";
    }
}

//gestione form da mostrare
function visualizza_form_ricerca(){ //rende visibile solo uno dei due form
    document.getElementById("form_lookup").style.display = "block";
    document.getElementById("form_stream").style.display = "none";
    document.getElementById("start_stop").style.display = "none";
};

function visualizza_form_stream(){ //vedi sopra
    document.getElementById("form_stream").style.display = "block";
    document.getElementById("form_lookup").style.display = "none";
    document.getElementById("start_stop").style.display = "block";
};

var file_export; //per esportare ed importare i dati di ricerca
var esporta_stream = []; //per esportare lo stream
var pulisci_schermo = false; //controllo se pulire lo schermo

/*gestione tweet raccolti*/
function richiesta_dati(){
    $.ajax({
        type: "POST",
        url: "/base",
        data: $("#form_lookup").serialize(), // serializes the form's elements.
        dataType: "json",
        success: function (response) {
            file_export = response;
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

//var conta_tweet = 0; //da valutare

var esporta_stream = {
        data : []
    }

function print_stream_tweets(response){
    //conta_tweet = conta_tweet + 1;
    //document.getElementById("conta").innerHTML = conta_tweet;
    console.log(esporta_stream);
    esporta_stream.data.push(response.data);
    console.log(esporta_stream);
    console.log(JSON.stringify(esporta_stream));
    console.log(JSON.parse(JSON.stringify(esporta_stream)));
    let tweet = response.data;
    let aggiorna_wordcloud = false;


    if (typeof tweet.entities !== "undefined"){
        if (typeof tweet.entities.hashtags !== "undefined"){
            tweet.entities.hashtags.forEach((hashtag, index) => {
                word_cloud_text = word_cloud_text + " " + hashtag.tag;
            });
            aggiorna_wordcloud = true;
        }
    }
    //console.log('word_cloud_text: ', word_cloud_text);
    if(aggiorna_wordcloud){
          word_cloud(word_cloud_text);
      }

    // visualizzazione tweet
    // TODO: set a maximum quantity of tweets to be visualize
    // TIP: use a Queue
    tweet_visualization(tweet)

    // maps
    var coordinate = [];
    var aggiorna_coordinate = false;
    if (typeof tweet.geo !== "undefined"){ //test mappa
        //console.log('GEO: ', tweet.geo);
        if (typeof tweet.geo.coordinates!=="undefined"){
        //console.log(typeof tweet.geo.coordinates.coordinates[0]);
        var long = tweet.geo.coordinates.coordinates[0];
        var lat = tweet.geo.coordinates.coordinates[1];
        var latlong = [lat, long];
        coordinate.push(latlong);
        aggiorna_coordinate = true;
        }
    }

    if(aggiorna_coordinate){
        marker(coordinate);  //da aggiustare
      }
    //initialize (coordinate);
}

function tweet_visualization(tweet){

    let container = document.createElement("div");
    container.setAttribute("id", "tweet" + tweet.id);
    container.setAttribute("class", "tweet_container");

    let username = document.createElement("div");
    username.setAttribute("id", "tweet" + tweet.id + "_userName");
    username.setAttribute("class", "tweet_userName");
    username.innerHTML = tweet.author_id;

    let text = document.createElement("div");
    text.setAttribute("id", "tweet" + tweet.id + "_text");
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
    //word cloud;
    var testo2 = "";
    var geo = true;   //test mappa
    if (typeof dati==="undefined")
        return

    for (element of dati){
        pk = 0;
        if (typeof element.entities!=="undefined"){
            if (typeof element.entities.hashtags!=="undefined"){
            while (typeof element.entities.hashtags[pk]!=="undefined"){
                testo2 = testo2 + " " + element.entities.hashtags[pk].tag;
            pk=pk+1;
            }
        }
        }
        if (typeof element.geo!=="undefined"){ //test mappa
            //console.log(element.geo);
        }
    }
    word_cloud(testo2);

    //controllo risposte
    //console.log(dati);// show response from the server.

    //visualizzazione tweet
    var node = document.getElementById("visualizzazione_tw")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    var index = 0
    dati.forEach(element => {
        var tmp = document.createElement("div");
        tmp.setAttribute("id", "tweet" + index);
        tmp.setAttribute("class", "tweet_container");
        var tmp2 = document.createElement("div");
        tmp2.setAttribute("id", "tweet" + index + "_userName");
        tmp2.setAttribute("class", "tweet_userName");
        tmp2.innerHTML = element.author_id;
        var tmp3 = document.createElement("div");
        tmp3.setAttribute("id", "tweet" + index + "_text");
        tmp3.setAttribute("class", "tweet_text");
        tmp3.innerHTML = element.text;
        tmp.appendChild(tmp2);
        tmp.appendChild(tmp3);
        document.getElementById("visualizzazione_tw").appendChild(tmp);
        index = index +1;
    });

    //colloca su mappa
    var coordinate = [];
    for (element of dati){
        if (typeof element.geo!=="undefined"){
        if (typeof element.geo.coordinates!=="undefined"){
            console.log(typeof element.geo.coordinates.coordinates[0]);
            var long = element.geo.coordinates.coordinates[0];
            var lat = element.geo.coordinates.coordinates[1];
            var nome_utente = element.author_id;
            var testo_tweet = element.text;
            var latlong_text = [lat, long, testo_tweet, nome_utente];
            coordinate.push(latlong_text);
        }
        }
    }

    initialize (coordinate);
}

/*mappa*/
function initialize(coordinate) {
    /* Style of the map */
    var styles = [{
          stylers: [
            { hue: "#00ffe6" },
            { saturation: -20 }
          ]
    },
    {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
          ]
    },
    {
          featureType: "road",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
    },
        {
             featureType: "poi",
             elementType: "labels",
             stylers: [
                   { visibility: "off" }
             ]
         }
      ];


      // Create a new StyledMapType object, passing it the array of styles,
      // as well as the name to be displayed on the map type control.
      var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

      /* Lat. and Lon. of the center of the map */
      var myCenter = new google.maps.LatLng(44.302700, 11.21504);

      // Create a map object, and include the MapTypeId to add
      // to the map type control.
      var mapOptions = {
        zoom: 3, 				//zoom level
        center: myCenter, 		//center position
        scrollwheel: false, 	//zoom when scroll disable
        zoomControl: true, 		//show control zoom

        mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }

      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

      //Associate the styled map with the MapTypeId and set it to display.
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');

      marker(coordinate, map);
}

//funzione per marker
function marker(coordinate, map){


    for(element of coordinate){

        var cas1 = Math.random()/10000+1;
        var cas2 = Math.random()/10000+1;
        var myLatlng = new google.maps.LatLng((element[0]*cas1), (element[1]*cas2));
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
        });

        var contentString = '<div class= "container_popup"><h2>' + element[3] + '</h2><hr>' + '<p class = "testo_popup">' + element[2] + '</p></div>';

        pop_up(contentString, map, marker);

    }

}

function pop_up(contentString, map, marker){
    var infowindow = new google.maps.InfoWindow({

        content: contentString,

          maxWidth: 150,

        maxHeight: 200,

    });

    google.maps.event.addListener(marker, 'click', function() {

        infowindow.open(map,marker);

    });

}


google.maps.event.addDomListener(window, 'load', initialize);

//wordcloud
function word_cloud(hashtags) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("word_cloud", am4plugins_wordCloud.WordCloud);
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.tooltipText = "{word}: {value}";
    series.fontFamily = "Courier New";
    series.maxFontSize = am4core.percent(30);
    series.labels.template.fill = am4core.color("rgb(0, 174, 255)");
    series.text = hashtags;
};

//alert export ed import
function AlertEsporta(){
    document.getElementById("switch-1").checked = false;
    if(pulisci_schermo){
        pulisci_schermo = false;	//evita di cancellare lo schermo
        var tmp = true;
    }
    else{
        var tmp = false;
    }
    ferma_stream1();
    if (tmp) {
        pulisci_schermo = true;
    }
    try{$( "#dialog" ).dialog( "close" );}
    finally{
        var salva = prompt("Nome salvataggio");
        if ((!non_valid(salva)) && (salva!=null)){
            if (window.localStorage.getItem(salva)==null){
                esporta(salva);
            }
            else {
                var conferma = confirm("Il nome utilizzato è già stato salvato, vuoi sovrascrivere?");
                if (conferma==true){
                    //aggiorna lista chiavi
                    var indice_rimozione = listaChiavi.indexOf(salva);
                    listaChiavi.splice(indice_rimozione, 1);
                    //aggiorna local storage
                    var locsto = window.localStorage.getItem("");
                    var sottostringa = salva + ",";
                    locsto = locsto.replace(sottostringa, "");
                    window.localStorage.setItem("",locsto);
                    //esporta
                    esporta(salva);
                }
                else {
                    AlertEsporta();
                }
            }
        }
        else if (non_valid(salva)){
            alert("Inserisci un nome per salvare");
            AlertEsporta();
        }
    }
}

function non_valid(stringa) {
    return (vuota(stringa) || virgola(stringa));
}

function vuota(stringa){
    var index = 0;
    while (stringa[index]!=null){
        if ((stringa[index]!=" ") && (stringa[index]!="")){
            return false;
        }
        else{
            index = index + 1;
        }
    }
    return true;
}

function virgola(stringa){
    return (stringa.indexOf(",") != -1);
}

function AlertImporta(){
    var carica = prompt("File da caricare");
    if (carica!=null){
        if ((window.localStorage.getItem(carica)==null) || (carica=="")){
            alert("Cerca un file esistente");
            AlertImporta();
        }
        else {
            importa(carica);
        }
    }
}

var listaChiavi = inizializza_listaChiavi();

function inizializza_listaChiavi() {
    if (window.localStorage.getItem("")==null){
        var lista = [];	//contiene la lista di tutte le chiavi
    }
    else {
        var stringa_listaChiavi = window.localStorage.getItem("");
        var chiave_corrente = "";
        var lista = [];
        for(element of stringa_listaChiavi){
            if(element == ",") {
                lista.push(chiave_corrente);
                chiave_corrente = "";
            }
            else {
                chiave_corrente = chiave_corrente + element;
            }
        }
    }
    return lista;
}

//export ed import
function esporta(nome_chiave){
    if (typeof(Storage) !== "undefined") {
        //var mystring = JSON.stringify(file_export);			//converte il json in una stringa e lo salva
        var mystring = JSON.stringify(esporta_stream);
        console.log(esporta_stream);
        console.log(mystring);
        window.localStorage.setItem(nome_chiave, mystring);
        listaChiavi.push(nome_chiave);
        if(window.localStorage.getItem("") == null){
            window.localStorage.setItem("", nome_chiave + ",");
        }
        else{
            window.localStorage.setItem("", window.localStorage.getItem("") + nome_chiave + ",");
        }
    }
    else {
        document.getElementById("json_ricevuto").innerHTML = "Sorry, your browser does not support web storage...";
      }
}
function importa(nome_chiave){
    pulisci_schermo = true;
    var myobj = JSON.parse(localStorage.getItem(nome_chiave));		//converte in json la stringa salvata prima
    print_tweets(myobj);
}
//per gestire i salvataggi
function VisualizzaSalvataggi() {
    document.getElementById("switch-1").checked = false;
    if(pulisci_schermo){
        pulisci_schermo = false;	//evita di cancellare lo schermo
        var tmp = true;
    }
    else{
        var tmp = false;
    }
    ferma_stream1();
    if (tmp) {
        pulisci_schermo = true;
    }
    $( "#dialog" ).dialog(function() {});
    var lista_salvataggi = document.getElementById("elenco_salvataggi");
    while (lista_salvataggi.hasChildNodes()){
        lista_salvataggi.removeChild(lista_salvataggi.lastChild);
    }
    var numero_salvataggio = 1;
    for (element of listaChiavi){
        var elemento_listasalvataggi = document.createElement("label");
        elemento_listasalvataggi.setAttribute("class", "nome_salvataggio");
        elemento_listasalvataggi.setAttribute("for", "salvataggio" + numero_salvataggio);
        var node_text = document.createTextNode(element);
        elemento_listasalvataggi.appendChild(node_text);
        var check_salvataggi = document.createElement("input");
        check_salvataggi.setAttribute("id", "salvataggio" + numero_salvataggio);
        check_salvataggi.setAttribute("class", "spunta_salvataggi");
        check_salvataggi.setAttribute("type", "radio");
        check_salvataggi.setAttribute("name", "scegli_salvataggio");
        var container_salvataggi = document.createElement("div");
        container_salvataggi.setAttribute("class", "save");
        container_salvataggi.appendChild(check_salvataggi);
        container_salvataggi.appendChild(elemento_listasalvataggi);
        lista_salvataggi.appendChild(container_salvataggi);
        numero_salvataggio=numero_salvataggio+1;
    }
}
function importa_direttamente(){
    var scorri_salvataggio = document.getElementsByClassName("spunta_salvataggi");
    var index = 0;
    while ((scorri_salvataggio[index].checked==false) && (scorri_salvataggio[index]!=null)){
        index = index + 1;
    }
    if (scorri_salvataggio[index].checked){
        var nome_chiave = scorri_salvataggio[index].nextSibling.innerHTML;
        importa(nome_chiave);
        $( "#dialog" ).dialog( "close" );
    }
    else {
        alert("Seleziona un salvataggio");
    }
}
function elimina(){
    var scorri_salvataggio = document.getElementsByClassName("spunta_salvataggi");
    var index = 0;
    while ((scorri_salvataggio[index].checked==false) && (scorri_salvataggio[index]!=null)){
        index = index + 1;
    }
    if (scorri_salvataggio[index].checked){
        var nome_chiave = scorri_salvataggio[index].nextSibling.innerHTML
        window.localStorage.removeItem(nome_chiave);
        var indice_rimozione = listaChiavi.indexOf(nome_chiave);
        listaChiavi.splice(indice_rimozione, 1);
        var locsto = window.localStorage.getItem("");
        var sottostringa = nome_chiave + ",";
        locsto = locsto.replace(sottostringa, "");
        window.localStorage.setItem("",locsto);
        $( "#dialog" ).dialog( "close" );
    }
    else {
        alert("Seleziona un salvataggio");
    }
}
//Per svuotare il local storage
function SvuotaSalvataggi(){
    var conf = confirm("Vuoi eliminare tutti i salvataggi?");
    if(conf) {
        listaChiavi = [];	//svuota la lista delle chiavi salvate
        window.localStorage.clear();	//pulisce il local storage
        $( "#dialog" ).dialog( "close" );	//chiude la finestra di dialogo
    }
}

                                            //VISUALIZZAZIONE COORDINATE GEOGRAFICHE
function visualizza_input(){
    if(document.getElementById("area_geografica_stream").checked){
        document.getElementById("coordinate_geo").style.display = "block";
    }
    else{
        document.getElementById("coordinate_geo").style.display = "none";
    }
}