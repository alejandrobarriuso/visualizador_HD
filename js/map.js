/* --- MAPA --- */
/* Capa para el mapa en miniatura */
var capaMiniatura = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: '<a href="http://unidadsig.cchs.csic.es/sig/">Unidad SIG </a>' + ol.source.OSM.ATTRIBUTION
      })
    ]
  })
});

/* -- CAPAS BASE -- */









/* -- CREACIÓN DEL MAPA -- */
/* Centro (Lon, Lat) y zoom inicial del mapa */
var LonLat_centro = [-3, 39];
var Zoom_inicial = 6;

/* Controles del mapa 1/2*/
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
  collapsible: true
});

//Escala numérica: creada de manera manual. Por eso es necesario que aparezca después de la creación del mapa.


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
  layers: [capaMiniatura],
  target: 'map',
  view: vistaMapa,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
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
      $("#mapaBaseVisible").attr({'class':'div_activar_cambio_mapa_base card m-0 p-0 mapa_base_mapbox'});
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
      $("#mapaBaseVisible").attr({'class':'div_activar_cambio_mapa_base card m-0 p-0 mapa_base_VTusig'});
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
        $("#mapaBaseVisible").attr({'class':'div_activar_cambio_mapa_base card m-0 p-0 mapa_base_osm'});
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
          $("#mapaBaseVisible").attr({'class':'div_activar_cambio_mapa_base card m-0 p-0 mapa_base_stamen'});
      }


}





/* Buscador de lugares - GeoNames */

function Localiza(callbackData) {
        $.ajax({
            url: 'http://api.geonames.org/searchJSON?',
            data: {
              username: 'visualizador_hd',
              q:localizar.value,
              maxRows: 2,
              country: 'ES'
            },
            dataType: 'json',
            success:function(data){

              callbackData(data);
            }
        });

};

function CentraMapa(resultado){
  var lugares = resultado.geonames;
  var coord = [Number(lugares[0].lng),Number(lugares[0].lat)];
  var coordProj = ol.proj.fromLonLat(coord);
  map.getView().setCenter(coordProj);
  map.getView().setZoom(10);


  for (var i = 0; i < lugares.length; i++) {
  bbox = lugares[i].boundingbox;
  console.log(bbox);
  var texto = document.createTextNode(lugares[i].display_name);
  lugar = document.createElement("DIV");
  lugar.setAttribute("id","resultado");
  lugar.setAttribute("class","divRatonFuera");
  lugar.onmouseover = function (){this.setAttribute("class","divRatonDentro");};
  lugar.onmouseout = function (){this.setAttribute("class","divRatonFuera");};
  lugar.setAttribute("style", "padding:10px 10px 10px 10px");
  lugar.setAttribute("onclick","hacerZoomABbox("+bbox[2]+','+bbox[3]+','+bbox[0]+','+bbox[1]+")");
  lugar.style.cursor="pointer";
  lugar.appendChild(texto);

  document.getElementById("formulario1").appendChild(lugar);

  }
}




function nomenclar (form){//en un futuro hay que crear una pequeÃ±a cache para que no sea necesario hacer una nueva llamada cada vez
		//tambien hay que conseguir que se borre la lista al pinchar en cualquier otro lugar del mapa



	$.get(
    'http://api.geonames.org/search?',
	//'http://open.mapquestapi.com/nominatim/v1/search.php?',
    {username:'visualizador_HD', q:form.localizar.value,format : 'json', polygon : 0,countrycodes:'es,pt,ad',limit:5},
		function(data) {

			if (data.length === 0) {
				var texto = document.createTextNode('No disponemos de datos de '+form.localizar.value);
				lugar = document.createElement("DIV");
				lugar.setAttribute("style","width:100%;background:white;border-bottom: outset 2px;border-bottom-opacity:0;padding:10px 10px 10px 10px");
				lugar.appendChild(texto);
				document.getElementById("formulario1").appendChild(lugar);
			}
			else {
					for (var i=0;i<data.length;i++){
						bbox = data[i].boundingbox;
						var texto = document.createTextNode(data[i].display_name);
						lugar = document.createElement("DIV");
						lugar.setAttribute("id","resultado");
						lugar.setAttribute("class","divRatonFuera");
						lugar.onmouseover = function (){this.setAttribute("class","divRatonDentro");};
						lugar.onmouseout = function (){this.setAttribute("class","divRatonFuera");};
						lugar.setAttribute("style", "padding:10px 10px 10px 10px");
						lugar.setAttribute("onclick","hacerZoomABbox("+bbox[2]+','+bbox[3]+','+bbox[0]+','+bbox[1]+")");
						lugar.style.cursor="pointer";
						lugar.appendChild(texto);

						document.getElementById("formulario1").appendChild(lugar);
					}
				}
			var attrib = document.createElement("DIV");
				attrib.innerHTML = 'Nominatim Search Courtesy <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="./images/mq_logo.png">';
				attrib.setAttribute("class","divRatonFuera");
				attrib.setAttribute("style","border-bottom:0px;padding:5px 10px 5px 10px;font-size:9px;color:#6E6E6E");
			document.getElementById("formulario1").appendChild(attrib);
			}
		,"json"
	);
}


function hacerZoomA (x,y){
	var coordenadas = new OpenLayers.LonLat.fromString(x+','+y);
	markers.clearMarkers();
	markers.addMarker(new OpenLayers.Marker(coordenadas,simb_encontrado));
	map.setCenter(coordenadas,11);
}

function hacerZoomABbox (xmin,xmax,ymin,ymax){
	var coordenadas = [];
	coordenadas.push(xmin);
	coordenadas.push(ymin);
	coordenadas.push(xmax);
	coordenadas.push(ymax);
	map.zoomToExtent(new OpenLayers.Bounds(coordenadas).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913")));
}
