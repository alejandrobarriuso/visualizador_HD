/* --- MAPA --- */
/* Capa para el mapa en miniatura */
var layer = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: '<a href="http://unidadsig.cchs.csic.es/sig/">Unidad SIG </a>' + ol.source.OSM.ATTRIBUTION
      })
    ]
  })
});

/* Grupo de capas base */
var grupo_capas_base = new ol.layer.Group({
  'title': 'Mapa base',
  openInLayerSwitcher: true,
  layers: [

    new ol.layer.Tile({
      title: 'Water color',
      baseLayer: true,
      visible: false,
      source: new ol.source.Stamen({
        layer: 'watercolor'
      })
    }),
    new ol.layer.Tile({
      title: 'OSM',
      baseLayer: true,
      visible: false,
      source: new ol.source.OSM({
        attributions: [
          new ol.Attribution({
            html: '<a href="http://unidadsig.cchs.csic.es/sig/">Unidad SIG </a>' + ol.source.OSM.ATTRIBUTION
          })
        ]
      })
    }),
    new ol.layer.VectorTile({
      title: 'Nuestro VT',
      baseLayer: true,
      visible: true,
      declutter: true,
      source: new ol.source.VectorTile({
        attributions: '© Tania</a>',
        format: new ol.format.MVT(),
        url: 'http://161.111.72.12:8080/data/v3/{z}/{x}/{y}.pbf'
      }),
      style: estilo_mapa_base_mvt(ol.style.Style, ol.style.Fill, ol.style.Stroke, ol.style.Icon, ol.style.Text)
    })
  ]
});

/* Grupo de capas cargadas */
var grupo_capas_contenido = new ol.layer.Group({
  title: 'Capas cargadas',
  openInLayerSwitcher: true,
  layers: [
    new ol.layer.Image({
      title: 'Countries',
      source: new ol.source.ImageArcGISRest({
        ratio: 1,
        params: {'LAYERS': 'show:0'},
        url: "https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Countries_December_2016_Boundaries/MapServer"
      })
    })
  ]
});



//var cambio_capa = new ol.control.LayerSwitcher();


/* Centro (Lon, Lat) y zoom inicial del mapa */
var LonLat_centro = [-3, 39];
var Zoom_inicial = 6;

/* Controles del mapa 1/2*/
// Escala lineal:
var scaleLineControl = new ol.control.ScaleLine();

// Longitud y latitud de la posición del puntero:
var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

// Mapa overview:
var overviewMapControl = new ol.control.OverviewMap({
        // see in overviewmap-custom.html to see the custom CSS used
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [layer],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: true
      });

// Atribución:
var attribution = new ol.control.Attribution({
  collapsible: false
});

//Escala numérica: creada de manera manual. Por eso es necesario que aparezca después de la creación del mapa.


/* Creación del mapa y de la vista */
var map = new ol.Map({
  layers: [grupo_capas_base, grupo_capas_contenido],
  //layers: [layer],
  target: 'map',
  view: new ol.View({
    projection: 'EPSG:3857',
    center: ol.proj.fromLonLat(LonLat_centro),
    zoom: Zoom_inicial,
    minZoom: 2,
    maxZoom: 28,
    extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
  }),
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    scaleLineControl, mousePositionControl, overviewMapControl, attribution
  ]),
});


/* LayerSwitcher - Control de capas en la barra lateral */
var switcher = new ol.control.LayerSwitcher(
	{	target:$(".layerSwitcher").get(0),
		// displayInLayerSwitcher: function (l) { return false; },
		show_progress:true,
		extent: true,
		trash: true,
		oninfo: function (l) { alert(l.get("title")); }
	});
// Add a button to show/hide the layers
var button = $('<div class="toggleVisibility" title="show/hide">')
	.text("Show/hide all")
	.click(function()
	{	var a = map.getLayers().getArray();
		var b = !a[0].getVisible();
		if (b) button.removeClass("show");
		else button.addClass("show");
		for (var i=0; i<a.length; i++)
		{	a[i].setVisible(b);
		}
	});
switcher.setHeader($('<div>').append(button))

map.addControl(switcher);
	// Insert mapbox layer in layer switcher
function displayInLayerSwitcher(b)
{	mapbox.set('displayInLayerSwitcher', b);
}



/* Controles del mapa 2/2: escala numérica */
var DPI_usuario = 0;
function getDPI() {
  // 1º: función para obtener el DPI de la pantalla del usuario (número de puntos dibujados por pulgada):
    // EJECUCIÓN: Se ejecuta en la carga inicial del body.
    // FUNCIONAMIENTO: Crea un elemento div en la pantalla completa que le sirve para calcular el DPI, y después lo elimina.
    // ENTRADA: nada.
    // SALIDA: DPI_usuario.
    var div = document.createElement( "div");
    div.style.height = "1in";
    div.style.width = "1in";
    div.style.top = "-100%";
    div.style.left = "-100%";
    div.style.position = "absolute";

    document.body.appendChild(div);
    DPI_usuario =  div.offsetHeight;
    document.body.removeChild( div );

    // Se ejecuta por primera vez el cálculo de la escala numérica:
    escala_numerica();
    return DPI_usuario;
}

var escala_num = 0;
function escala_numerica () {
  // 2º: función para obtener el valor x de la escala numérica: 1:x en cada momento.
    // EJECUCIÓN: Se ejecuta cada vez que se cambie de zoom o de pan:
    // FUNCIONAMIENTO: La escala numérica se obtiene a partir de la multiplicación de los siguientes términos:
    //  - Resolución (ud/pixel)
    //  - Metros por unidad (m/ud)
    //  - Pulgadas por metro (pulgada/m)
    //  - DPI de la pantalla del usuario en cada caso (puntos/pulgada)
    // Los tres primeros valores se obtienen dentro de la función. El cuarto se ha obtenido con la función getPDI anteriormente (una vez por usuario)
    // ENTRADA: nada.
    // SALIDA: escala_numerica.
    var unit = map.getView().getProjection().getUnits();
    var resolution = map.getView().getResolution();
    var inchesPerMetre = 39.3701;
  //  console.log('Unidad: '+ unit);
  //  console.log('Resolución: '+ resolution);
  //  console.log('Metros por unidad: ' + ol.proj.METERS_PER_UNIT[unit]);

    escala_num = resolution * ol.proj.METERS_PER_UNIT[unit] * inchesPerMetre * DPI_usuario;
  //  console.log('Escala numérica: '+ escala_num);
    document.getElementById("escala_numerica").innerHTML = '1:' + Intl.NumberFormat("de-DE").format(Math.round(escala_num));
    return escala_num;
}
//3º: que la función escala_numerica() se ejecute cada vez que se cambie de zoom o de pan:
map.on('moveend', escala_numerica);

// --- MENÚ LATERAL IZQUIERDA - CAPAS --- //
// Overlay:
var menu = new ol.control.Overlay ({ closeBox : true, className: "slide-left menu", content: $("#menu") });
map.addControl(menu);

// A toggle control to show/hide the menu
var t = new ol.control.Toggle(
    {	html: '<i class="fa fa-bars" ></i>',
      className: "menu",
      title: "Menu",
      onToggle: function() { menu.toggle(); }
    });
map.addControl(t);






/*
function mostrar_div_nodos() {
    div = document.getElementById('div_nodos');
    div.style.display = '';
    console.log("hola");
}
*/
