function AnadirGeojson(geojsonEntrada,nombreCapaEntrada) {
        console.log(geojsonEntrada);

        var fuenteVector = new ol.source.Vector({
          features: (new ol.format.GeoJSON({
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857'
          })).readFeatures(geojsonEntrada)
        });

    var capaVectorialEntrada = new ol.layer.Vector({
        title: nombreCapaEntrada,
        displayInLayerSwitcher: true,
  			displayInLayerSwitcher_base: false,
  			extent: fuenteVector.getExtent(),
  			abstract: "Capa cargada por el usuario desde un archivo local.",
        source: fuenteVector,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 3
            })
        })
    });

  console.log(capaVectorialEntrada);
   map.addLayer(capaVectorialEntrada);
   //Hacer zoom al extent de la nueva capa vectorial cargada:
   var anchoSidebar = document.getElementById('sidebar').offsetWidth + 6;
   map.getView().fit(fuenteVector.getExtent(),{size:map.getSize(),padding:[10,10,10,anchoSidebar]});
}
