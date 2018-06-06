/* MAPA */
var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

/* Centro (Lon, Lat) y zoom inicial del mapa */
var LonLat_centro = [-3, 39];
var Zoom_inicial = 6;

/* Controles del mapa */
var scaleLineControl = new ol.control.ScaleLine();

var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

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




function mostrar_div_nodos() {
    div = document.getElementById('div_nodos');
    div.style.display = '';
    console.log("hola");
}
