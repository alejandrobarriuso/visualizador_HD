//FUNCIÓN AnadirWMS(urlEntrada,capaEntrada)
/*
ENTRADAS:
  urlEntrada: url del servicio WMS que se quiere cargar (hasta la ?).
  capaEntrada: capa perteneciente al servicio anterior que se quiere cargar (tal y como está en el campo Name).
FUNCIONALIDAD:
  Hace una petición GetCapabilities al servicio indicado, para extraer el extent de la capa. Aquí se distinguen dos casos:
		- Éxito en la respuesta del getCapabilities: entonces se calcula el extent y se asigna el abstract.
		- Error en la respuesta del getCapabilities: entonces se asigna como extent todo el mundo y como abstract un texto genérico.
	Después, con esta información, se crea la vista y el mapa.
	Al final se añade la funcionalidad getFeatureInfo para mostrar información.
*/
function AnadirWMS(urlEntrada,capaEntrada) {
	var extent3857 = [];
	var abstract = '';
	//Hacer petición getCapabilities para obtener el extent de la capa a cargar "capaEntrada":
	var parser = new ol.format.WMSCapabilities();
	console.log(urlEntrada);
	console.log(capaEntrada);
	fetch(urlEntrada + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities').then(function(response) {
		return response.text();
  }).then(function(text) {
		// CASO 1. ÉXITO EN LA RESPUESTA AL GETCAPABILITIES: crea la capa con extent:
    var result = parser.read(text);
		console.log(result);

		//ALGORITMO PARA BUSCAR LA INFORMACIÓN PARA EXTENT Y ABSTRACT dentro del resultado del GetCapabilities (cuando este sí se ha obtenido):
			//Teniendo en cuenta que puede haber muchos casos de n capas dentro de diferentes niveles: 1, 2, 3...
			//Aquí se entra hasta el segundo nivel de capas, y si no... se asignan los parámetros generales del GetCapabilities.
		if (result.Capability.Layer.Layer.find(l => l.Name === capaEntrada)) {
			//Caso 11: las capas se encuentran en un primer nivel.
			console.log("capa encontrada en el primer nivel de capas");
			extent3857 = ol.proj.transformExtent(result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
			abstract = result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).Abstract;
		} else {
			//Caso 12: Las capas no se encuentran en un primer nivel: habrá que buscar en el segundo nivel:
			console.log(result.Capability.Layer.Layer.length);
			for (var i=0; i<result.Capability.Layer.Layer.length; i++) {
				if (result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada)) {
					//Caso 121: Las capas se encuentran en un segundo nivel, dentro de la capa i del primer nivel:
					console.log("capa encontrada en el segundo nivel; dentro de la capa principal en posición " + i);
					extent3857 = ol.proj.transformExtent(result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
					abstract = result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).Abstract;
					break;
				} else {
					//Caso 122: Las capas tampoco se encuentran en un segundo nivel.
					console.log("capa no encontrada");
					if (result.Capability.Layer.EX_GeographicBoundingBox && result.Capability.Layer.Abstract){
						//Caso 1221: El servicio (sin entrar en ninguna capa ni subcapa) tiene definidos un extent y un abstract: se asigna este:
						extent3857 = ol.proj.transformExtent(result.Capability.Layer.EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
						abstract = result.Capability.Layer.Abstract;
					} else {
						//Caso 1222: El servicio (sin entrar en ninguna capa ni subcapa) no tiene definidos un extent y un abstract: se asigna el extent de todo el mapa, y un abstract vacío:
						extent3857 = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
						abstract = "Sin descripción";
					}
				}
			}
		}

		//Se crea la fuente y la capa:
		CrearFuenteYCapa(extent3857,abstract);

	}).catch(function(error) {
		// CASO DE ERROR EN LA RESPUESTA AL GETCAPABILITIES: crear la capa sin extent:
    CrearFuenteYCapa([-20026376.39, -20048966.10, 20026376.39, 20048966.10],"Sin descripción");
		alert("Capa sin extent definido");
	});

	function CrearFuenteYCapa(extentEntrada,abstractEntrada){
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
			extent: extentEntrada,
			abstract: abstractEntrada
		});
		//Añadir la capa al mapa:
		map.addLayer(capaWMSEntrada);
		//Hacer zoom a la capa cargada:
		var anchoSidebar = document.getElementById('sidebar').offsetWidth + 6;
		map.getView().fit(extentEntrada,{size:map.getSize(),padding:[10,10,10,anchoSidebar]});
		console.log(capaWMSEntrada);

		//Añadir la operación GETFEATUREINFO al mapa, en la capa recién cargada:
		map.on('singleclick', function(evt1) {
			document.getElementById('textoGetFeatureInfo').innerHTML = '';
			var viewResolution = vistaMapa.getResolution();
			var url = fuenteWMSEntrada.getGetFeatureInfoUrl(
				evt1.coordinate, viewResolution, 'EPSG:3857',
				{'INFO_FORMAT': 'text/html'});
				if (url) {
					document.getElementById('textoGetFeatureInfo').innerHTML =
					'<iframe seamless src="' + url + '"></iframe>';
				}
		});
	}
}
