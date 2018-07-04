//CAPAS A CARGAR EN LA PAGINA POR EL USUARIO:

function AnadirWMS(urlEntrada,capaEntrada) {

	//Hacer petición getCapabilities para obtener el extent de la capa a cargar "capaEntrada":
	var parser = new ol.format.WMSCapabilities();
	fetch(urlEntrada + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities').then(function(response) {
    return response.text();
  }).then(function(text) {
    var result = parser.read(text);
		console.log(capaEntrada);
		console.log(result);
    var extent = result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).EX_GeographicBoundingBox;
    var extent3857 = ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');


	//Crear la fuente wms del servicio y de la capa introducidos:
	var fuenteWMSEntrada = new ol.source.TileWMS({
		url: urlEntrada,
		params: {LAYERS: capaEntrada, FORMAT: 'image/png'},
		})

	//Crear la capa:
	var capaWMSEntrada = new ol.layer.Tile({
		title: capaEntrada,
		source: fuenteWMSEntrada,
		displayInLayerSwitcher: true,
	  displayInLayerSwitcher_base: false,
		extent: extent3857
		});
	//Añadir la capa al mapa:
	map.addLayer(capaWMSEntrada);
	console.log(capaWMSEntrada);

	//Añadir la operación GETFEATUREINFO al mapa, en la capa recién cargada:

	map.on('singleclick', function(evt1) {
		document.getElementById('textoGetFeatureInfo').innerHTML = '';
		var viewResolution = vistaMapa.getResolution();
		var url = fuenteWMSEntrada.getGetFeatureInfoUrl(
			evt1.coordinate, viewResolution, 'EPSG:4326',
			{'INFO_FORMAT': 'text/html'});
			if (url) {
				document.getElementById('textoGetFeatureInfo').innerHTML =
				'<iframe seamless src="' + url + '"></iframe>';
				}
		});

		});
	}
