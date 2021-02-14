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