var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

var pos = ol.proj.fromLonLat([16.3725, 48.208889]);
