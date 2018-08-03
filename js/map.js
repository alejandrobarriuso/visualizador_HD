/* --- MAPA --- */
/* Capa base a cargar al inicio */
var capaBaseVTusig = new ol.layer.VectorTile({
  title: 'Nuestro VT',
  baseLayer: true,
  visible: true,
  displayInLayerSwitcher: false,
  displayInLayerSwitcher_base: true,
  declutter: true,
  source: new ol.source.VectorTile({
    attributions: '© Tania</a>',
    format: new ol.format.MVT(),
    url: 'http://161.111.72.12:8080/data/v3/{z}/{x}/{y}.pbf'
  }),
  style: estilo_mapa_base_mvt(ol.style.Style, ol.style.Fill, ol.style.Stroke, ol.style.Icon, ol.style.Text)
});

/* -- CREACIÓN DEL MAPA -- */
/* Centro (Lon, Lat) y zoom inicial del mapa */
var LonLat_centro = [-3, 39];
var Zoom_inicial = 6;

/* Controles del mapa */
// Escala lineal:
var scaleLineControl = new ol.control.ScaleLine({
  target: 'escalaLineal'
});

// Longitud y latitud de la posición del puntero:
var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: function(coord){ return ol.coordinate.format(coord, '{x}, {y}', 4)+' (lon, lat) WGS84';},
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('posicionMouse'),
  undefinedHTML: '&nbsp;'
});

// Mapa overview:
var overviewMapControl = new ol.control.OverviewMap({
  // Si no se añade capa, coge por defecto la que sea base en cada momento.
  className: 'ol-overviewmap ol-custom-overviewmap',
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: true
});

// Atribución:
var attribution = new ol.control.Attribution({
  target: document.getElementById('info_mapa_base')
});

/* Creación de la vista */
var vistaMapa = new ol.View({
  projection: 'EPSG:3857',
  center: ol.proj.fromLonLat(LonLat_centro),
  zoom: Zoom_inicial,
  minZoom: 2,
  maxZoom: 28,
  extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
});

/* Creación del mapa */
var map = new ol.Map({
  layers: [capaBaseVTusig],
  target: 'map',
  view: vistaMapa,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: true
    }
  }).extend([
    scaleLineControl, mousePositionControl, overviewMapControl, attribution
  ]),
});

/* Número de mapas base cargados*/
  // Importante para controlar el número de capas cargadas después:
var numeroMapasBaseCargados = map.getLayers().N.length;
console.log(numeroMapasBaseCargados);

/* Control de mapa base */
function AbrirMenuMapaBase(){
  $("#menuMapaBase").css({'display':'flex'});
  $("#menuMapaBase").on('mouseleave',CerrarMenuMapaBase);
  $("#mapaBaseVisible").css({'display':'none'});
}
function CerrarMenuMapaBase(){
  $("#menuMapaBase").css({'display':'none'});
  $("#mapaBaseVisible").css({'display':'flex'});
}

function CambioMapaBase(capa){
	if (capa == 'mapbox') {
		var capaBaseMapbox = new ol.layer.Tile({
	     source: new ol.source.XYZ({
	      	attributions: ['Basemap by <a href="https://www.mapbox.com/about/maps/">Â© Mapbox</a> | <a href="http://www.openstreetmap.org/copyright">Â© OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>'],
	        url: 'https://api.mapbox.com/styles/v1/abm-cchs-csic/cjcvso1ct0rwr2srz1weyqdey/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJtLWNjaHMtY3NpYyIsImEiOiJjamN2bjg0ODEwa3VjMnlzNnczNzZiMGQ4In0.xzpPwkaNK0qN5Y9XRTp37Q'
	      }),
        displayInLayerSwitcher: false,
        displayInLayerSwitcher_base: true
	    });
	    capaBaseMapbox.set('name','mapabase');
	    map.getLayers().removeAt(0);
	    map.getLayers().insertAt(0,capaBaseMapbox);
  } else if (capa == 'VTusig') {
      var capaBaseVTusig = new ol.layer.VectorTile({
        title: 'Nuestro VT',
        baseLayer: true,
        visible: true,
        displayInLayerSwitcher: false,
        displayInLayerSwitcher_base: true,
        declutter: true,
        source: new ol.source.VectorTile({
          attributions: '© Tania</a>',
          format: new ol.format.MVT(),
          url: 'http://161.111.72.12:8080/data/v3/{z}/{x}/{y}.pbf'
        }),
        style: estilo_mapa_base_mvt(ol.style.Style, ol.style.Fill, ol.style.Stroke, ol.style.Icon, ol.style.Text)
      });
      capaBaseVTusig.set('name','mapabase');
      capaBaseVTusig.setOpacity(0.8);
      map.getLayers().removeAt(0);
      map.getLayers().insertAt(0,capaBaseVTusig);
    } else if (capa == 'osm') {
        var capaBaseOSM = new ol.layer.Tile({
          displayInLayerSwitcher: false,
          displayInLayerSwitcher_base: true,
          source: new ol.source.OSM({
            attributions: [
              new ol.Attribution({
                html: '<a href="http://unidadsig.cchs.csic.es/sig/">Unidad SIG </a>' + ol.source.OSM.ATTRIBUTION
              })
            ]
          })
        });
        capaBaseOSM.set('name','mapabase');
        capaBaseOSM.setOpacity(0.8);
        map.getLayers().removeAt(0);
        map.getLayers().insertAt(0,capaBaseOSM);
      } else if (capa == 'stamen') {
          var capaBaseStamen = new ol.layer.Tile({
            title: 'Water color',
            baseLayer: true,
            displayInLayerSwitcher: false,
            displayInLayerSwitcher_base: true,
            visible: true,
            source: new ol.source.Stamen({
              layer: 'watercolor'
            })
          });
          capaBaseStamen.set('name','mapabase');
          capaBaseStamen.setOpacity(0.8);
          map.getLayers().removeAt(0);
          map.getLayers().insertAt(0,capaBaseStamen);
      }
}

/* Buscador de lugares - GeoNames */
//Función para utilizar Geonames:
function Localiza(callbackData) {
  $.ajax({
    url: 'http://api.geonames.org/searchJSON?',
    data: {
      username: 'visualizador_hd',
      q:localizar.value,
      maxRows: 5,
      country: 'ES'
    },
    dataType: 'json',
    success:function(data){
      callbackData(data);
    }
  });
};

function CentraMapa(resultado){
  document.getElementById("tablaLugares").innerHTML = "";
  var lugares = resultado.geonames;
  //Crear las diferentes filas a añadir al resultado:
  for (var i = 0; i < lugares.length; i++) {
    var filaLugari = document.createElement("a");
    filaLugari.innerHTML = lugares[i].toponymName + ', ' + lugares[i].adminName1;
    filaLugari.setAttribute("class","fila_lugar_i");
    filaLugari.setAttribute("id","filaLugar" + lugares[i].toponymName);
    filaLugari.setAttribute("href","javascript:centrarMapaEni('" + lugares[i].lng + "','" + lugares[i].lat + "');");
    //Añadir las filas a la lista:
    document.getElementById("tablaLugares").appendChild(filaLugari);
  }
  //Al hacer click fuera: que se elimine la lista creada:
  $("html").click(function() {
    document.getElementById("tablaLugares").innerHTML = "";
    document.getElementById("localizar").value = "";
    $("html").unbind('click');
  });
}
//Función para centrar el mapa en las coordenadas de la línea en la que se haya hecho click:
function centrarMapaEni(lng,lat){
  map.getView().setCenter(ol.proj.fromLonLat([Number(lng),Number(lat)]));
  console.log(ol.proj.fromLonLat([Number(lng),Number(lat)]));
  map.getView().setZoom(10);
  document.getElementById("tablaLugares").innerHTML = "";
  document.getElementById("localizar").value = "";
}
