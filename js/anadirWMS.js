//CAPAS A CARGAR EN LA PAGINA POR EL USUARIO:

function AnadirWMS(urlEntrada,capaEntrada) {

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
	  displayInLayerSwitcher_base: false
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
	}
