//Variable para llevar una cuenta del número de capas Geojson cargadas, y poder asignarlas un color diferente:
var numeroCapaGeojsonCargada = 0;

//Array de colores a asignar a los Geojson que se vayan cargando:
var arrayColoresBorde = ['#740040','#005B1A','#A60002','#004184','#BC4400'];
var arrayColoresRelleno = ['#94346E','#0F8554','#CC503E','#1D6996','#ED7500'];
function AnadirGeojson(geojsonEntrada,nombreCapaEntrada) {
  console.log(geojsonEntrada);
  //Se crea la fuente:
        var fuenteVector = new ol.source.Vector({
          features: (new ol.format.GeoJSON({
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857'
          })).readFeatures(geojsonEntrada)
        });

  //Se crean los estilos para cada tipo de geometría:
  colorBordeI = arrayColoresBorde[numeroCapaGeojsonCargada];
  colorRellenoI = arrayColoresRelleno[numeroCapaGeojsonCargada];
  var image = new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: colorRellenoI
      }),
      stroke: new ol.style.Stroke({color: colorBordeI, width: 1})
    });
        var styles = {
            'Point': new ol.style.Style({
              image: image
            }),
            'LineString': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              })
            }),
            'MultiLineString': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              })
            }),
            'MultiPoint': new ol.style.Style({
              image: image
            }),
            'MultiPolygon': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              }),
              fill: new ol.style.Fill({
                color: colorRellenoI
              })
            }),
            'Polygon': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              }),
              fill: new ol.style.Fill({
                color: colorRellenoI
              })
            }),
            'GeometryCollection': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              }),
              fill: new ol.style.Fill({
                color: colorRellenoI
              }),
              image: new ol.style.Circle({
                radius: 6,
                fill: null,
                stroke: new ol.style.Stroke({
                  color: colorBordeI
                })
              })
            }),
            'Circle': new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: colorBordeI,
                width: 1
              }),
              fill: new ol.style.Fill({
                color: colorRellenoI
              })
            })
          };

          var styleFunction = function(feature) {
            return styles[feature.getGeometry().getType()];
          };



    var capaVectorialEntrada = new ol.layer.Vector({
        title: nombreCapaEntrada,
        titulo_es: nombreCapaEntrada,
        displayInLayerSwitcher: true,
  			extent: fuenteVector.getExtent(),
  			abstract: "Capa cargada por el usuario desde un archivo local.",
        source: fuenteVector,
        style: styleFunction
    });
    console.log(capaVectorialEntrada);
   map.addLayer(capaVectorialEntrada);
   AñadirALeyenda(capaVectorialEntrada,'geojson');
   //Hacer zoom al extent de la nueva capa vectorial cargada:
   var anchoSidebar = document.getElementById('sidebar').offsetWidth + 15;
   map.getView().fit(fuenteVector.getExtent(),{size:map.getSize(),padding:[15,15,15,anchoSidebar]});

   if (numeroCapaGeojsonCargada < arrayColoresBorde.length - 1){
     numeroCapaGeojsonCargada = numeroCapaGeojsonCargada + 1;
   } else {
     numeroCapaGeojsonCargada = 0;
   }
}
