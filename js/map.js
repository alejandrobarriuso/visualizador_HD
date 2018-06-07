/* --- MAPA --- */
/* Capas */
var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

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
//Escala numérica: creada de manera manual. Por eso es necesario que aparezca después de la creación del mapa.


/* Creación del mapa y de la vista */
var map = new ol.Map({
  layers: [layer],
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
    scaleLineControl, mousePositionControl
  ]),
});







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





/*
function mostrar_div_nodos() {
    div = document.getElementById('div_nodos');
    div.style.display = '';
    console.log("hola");
}
*/
