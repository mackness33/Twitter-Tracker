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

//VISUALIZZAZIONE COORDINATE GEOGRAFICHE
function visualizza_input(){
    if(document.getElementById("area_geografica_stream").checked){
        document.getElementById("coordinate_geo").style.display = "block";
    }
    else{
        document.getElementById("coordinate_geo").style.display = "none";
    }
}

//Pulisce mappa e wordcloud ad ogni ricerca sullo stream e imposta su attivo 
function aggiustamenti_stream(){
    word_cloud_text = "";
    coordinate = [];
    initialize(coordinate);
    word_cloud(word_cloud_text);
    document.getElementById("switch-1").checked = true;
}