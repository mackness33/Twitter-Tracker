//alert export ed import
function AlertEsporta(){
    document.getElementById("switch-1").checked = false;
    if(pulisci_schermo){
        pulisci_schermo = false;    //evita di cancellare lo schermo
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
        var lista = []; //contiene la lista di tutte le chiavi
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
        if (isStream) {
            var mystring = JSON.stringify(esporta_stream);
        } else {
            var mystring = JSON.stringify(file_export);         //converte il json in una stringa e lo salva
        }
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
    var myobj = JSON.parse(localStorage.getItem(nome_chiave));      //converte in json la stringa salvata prima
    console.log(myobj);
    print_tweets(myobj);
}
//per gestire i salvataggi
function VisualizzaSalvataggi() {
    document.getElementById("switch-1").checked = false;
    if(pulisci_schermo){
        pulisci_schermo = false;    //evita di cancellare lo schermo
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
        listaChiavi = [];   //svuota la lista delle chiavi salvate
        window.localStorage.clear();    //pulisce il local storage
        $( "#dialog" ).dialog( "close" );   //chiude la finestra di dialogo
    }
}