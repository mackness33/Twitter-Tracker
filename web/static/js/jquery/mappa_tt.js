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
        zoom: 3,                //zoom level
        center: myCenter,       //center position
        scrollwheel: false,     //zoom when scroll disable
        zoomControl: true,      //show control zoom

        mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }

      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

      //Associate the styled map with the MapTypeId and set it to display.
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');

      //disegnare il rettangolo
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        rectangleOptions: {
          draggable: true,
          editable: true,
        },
      });

      var r_prec;     //per cancellare il vecchio rettangolo

      google.maps.event.addListener(drawingManager,'rectanglecomplete',function(r) {
        map.fitBounds(r.getBounds());
        google.maps.event.addListener(r, "bounds_changed", function() {  //aggiorna i campi lat e long quando viene spostato o ridimensionato
          document.getElementById("latnord").value = (r.getBounds()).toJSON().north;
          document.getElementById("latsud").value = (r.getBounds()).toJSON().south;
          document.getElementById("longest").value = (r.getBounds()).toJSON().east;
          document.getElementById("longovest").value = (r.getBounds()).toJSON().west;
        });
        console.log((r.getBounds()).toJSON());
        if (r_prec){
          r_prec.setMap(null);
        }
        r_prec=r;
        document.getElementById("latnord").value = (r.getBounds()).toJSON().north;
        document.getElementById("latsud").value = (r.getBounds()).toJSON().south;
        document.getElementById("longest").value = (r.getBounds()).toJSON().east;
        document.getElementById("longovest").value = (r.getBounds()).toJSON().west;
      });

      drawingManager.setMap(map);
    
      marker(coordinate, map);
}

//crea il rettangolo date 4 coordinate
function crearettangolo(r, map){
  r = new google.maps.Rectangle({
    draggable: true,
    editable: true,
    map: map,
    bounds: {
      north: Number(document.getElementById("latnord").value),
      south: Number(document.getElementById("latsud").value),
      east: Number(document.getElementById("longest").value),
      west: Number(document.getElementById("longovest").value),
    },

  })
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
        if (typeof element[4]!=="undefined"){
          marker.setIcon('https://i.ibb.co/jWS1SC7/verde1.png');
          var contentString = '<div class= "container_popup" style="scrollbar-width:none;"><h2>' + element[3] + '</h2><hr>' + '<p class = "testo_popup">' + element[2] + '</p><hr>' + '<img class = "immagine_pop_up" src = ' + element[4] + '>' + '</div>';        
        }
        else {
          marker.setIcon('https://i.ibb.co/MPTB2cg/rosso1.png');
          var contentString = '<div class= "container_popup" style="scrollbar-width:none;"><h2>' + element[3] + '</h2><hr>' + '<p class = "testo_popup">' + element[2] + '</p></div>';        
        }
        

        pop_up(contentString, map, marker);

    }

}

function pop_up(contentString, map, marker){
    var infowindow = new google.maps.InfoWindow({

        content: contentString,

        //maxWidth: 150,

        //maxHeight: 200,

    });

    google.maps.event.addListener(marker, 'click', function() {

        infowindow.open(map,marker);

    });

}

google.maps.event.addDomListener(window, 'load', initialize);