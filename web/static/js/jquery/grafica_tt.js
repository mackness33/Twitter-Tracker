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

//Pulisce mappa, wordcloud e grafico temporale ad ogni ricerca sullo stream e imposta su attivo 
function aggiustamenti_stream(){
    word_cloud_text = "";
    coordinate = [];
    initialize(coordinate);
    word_cloud(word_cloud_text);
    ripristinatempo();
    temporal(giornitweet);
    document.getElementById("switch-1").checked = true;
}

//reinizializza tempo
function ripristinatempo(){
    for (element of giornitweet){
        element.numeroTweet = 0;
    }
}

//vedi opzioni ricerca o stream
function vedi(){
    var visibileusersearch = document.getElementById("persona");
    var visibilekeysearch = document.getElementById("parola_chiave");
    var visibileuserstream = document.getElementById("persona_stream");
    var visibilekeystream = document.getElementById("parola_chiave_stream");
    var visibilelocstream = document.getElementById("luogo_stream");
    if (visibilekeysearch.checked){
        document.getElementById("input").style.display = "block";
    }
    else{
        document.getElementById("input").style.display = "none";
    }
    if (visibileusersearch.checked){
        document.getElementById("input2").style.display = "block";
    }
    else{
        document.getElementById("input2").style.display = "none";
    }
    if (visibilekeystream.checked){
        document.getElementById("input_stream").style.display = "block";
    }
    else{
        document.getElementById("input_stream").style.display = "none";
    }
    if (visibileuserstream.checked){
        document.getElementById("input_stream2").style.display = "block";
    }
    else{
        document.getElementById("input_stream2").style.display = "none";
    }
    if (visibilelocstream.checked){
        document.getElementById("input_stream3").style.display = "block";        
    }
    else{
        document.getElementById("input_stream3").style.display = "none"; 
    }
    ridimensiona_input();
}

function ridimensiona_input(){
    var ricerca = document.getElementById("search");
    if (ricerca.checked){
        var visibileusersearch = document.getElementById("persona");
        var visibilekeysearch = document.getElementById("parola_chiave");
        if ((visibilekeysearch.checked)&&(visibileusersearch.checked)){
            document.getElementById("input").style.width = "40%";
            document.getElementById("input2").style.width = "40%";
        }
        else{
            document.getElementById("input").style.width = "80%";
            document.getElementById("input2").style.width = "80%";
        }
    }
    else{
        var visibileuserstream = document.getElementById("persona_stream");
        var visibilekeystream = document.getElementById("parola_chiave_stream");
        var visibilelocstream = document.getElementById("luogo_stream");
        if ((visibilekeystream.checked)&&(visibileuserstream.checked)&&(visibilelocstream.checked)){
            document.getElementById("input_stream").style.width = "25%";
            document.getElementById("input_stream2").style.width = "25%";
            document.getElementById("input_stream3").style.width = "25%";
        }
        else if ((visibilekeystream.checked && visibileuserstream.checked) || (visibilekeystream.checked && visibilelocstream.checked) || (visibilelocstream.checked && visibileuserstream.checked)){
            document.getElementById("input_stream").style.width = "37.5%";
            document.getElementById("input_stream2").style.width = "37.5%";
            document.getElementById("input_stream3").style.width = "37.5%";
        }
        else {
            document.getElementById("input_stream").style.width = "75%";
            document.getElementById("input_stream2").style.width = "75%";
            document.getElementById("input_stream3").style.width = "75%";
        }
    }
}