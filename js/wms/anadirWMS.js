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
	var tituloEs = '';
	var peticionLeyenda = '';

	//Hacer petición getCapabilities para obtener el extent de la capa a cargar "capaEntrada":
	// IMPORTANTE: se requiere el proxy corsproxy funcionando, en el puerto 1337; para saltar la restricción CORS.
	var parser = new ol.format.WMSCapabilities();
	// La url de entrada se debe recortar a partir del caracter 7º, para quitar "http://":
	var urlEntradaParaCapabilities = urlEntrada.slice(7);
	var url_capabilities = 'http://localhost:1337/' + urlEntradaParaCapabilities + 'SERVICE=WMS&REQUEST=GetCapabilities';

	$.ajax({
      url: url_capabilities
  }).done(function(text) {
		// CASO 1. ÉXITO EN LA RESPUESTA AL GETCAPABILITIES: crea la capa con extent:
    var result = parser.read(text);
		console.log(result);

		//ALGORITMO PARA BUSCAR LA INFORMACIÓN PARA EXTENT Y ABSTRACT dentro del resultado del GetCapabilities (cuando este sí se ha obtenido):
			//Teniendo en cuenta que puede haber muchos casos de n capas dentro de diferentes niveles: 1, 2, 3...
			//Aquí se entra hasta el segundo nivel de capas, y si no... se asignan los parámetros generales del GetCapabilities.
		if (result.Capability.Layer.Layer.find(l => l.Name === capaEntrada)) {
			//Caso 11: las capas se encuentran en un primer nivel.
			//console.log("capa encontrada en el primer nivel de capas");
			extent3857 = ol.proj.transformExtent(result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
			abstract = result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).Abstract;
			tituloEs = result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).Title;
			peticionLeyenda = result.Capability.Layer.Layer.find(l => l.Name === capaEntrada).Style[0].LegendURL[0].OnlineResource;
			console.log(peticionLeyenda);
		} else {
			//Caso 12: Las capas no se encuentran en un primer nivel: habrá que buscar en el segundo nivel:
		//	console.log(result.Capability.Layer.Layer.length);
			for (var i=0; i<result.Capability.Layer.Layer.length; i++) {
				if (result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada)) {
					//Caso 121: Las capas se encuentran en un segundo nivel, dentro de la capa i del primer nivel:
			//		console.log("capa encontrada en el segundo nivel; dentro de la capa principal en posición " + i);
					extent3857 = ol.proj.transformExtent(result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
					abstract = result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).Abstract;
					tituloEs = result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).Title;
					peticionLeyenda = result.Capability.Layer.Layer[i].Layer.find(l => l.Name === capaEntrada).Style[0].LegendURL[0].OnlineResource;
					break;
				} else {
					//Caso 122: Las capas tampoco se encuentran en un segundo nivel.
			//		console.log("capa no encontrada");
					if (result.Capability.Layer.EX_GeographicBoundingBox && result.Capability.Layer.Abstract){
						//Caso 1221: El servicio (sin entrar en ninguna capa ni subcapa) tiene definidos un extent y un abstract: se asigna este:
						extent3857 = ol.proj.transformExtent(result.Capability.Layer.EX_GeographicBoundingBox, 'EPSG:4326', 'EPSG:3857');
						abstract = result.Capability.Layer.Abstract;
						tituloEs = result.Capability.Layer.Title;
						peticionLeyenda = "Sin leyenda";
					} else {
						//Caso 1222: El servicio (sin entrar en ninguna capa ni subcapa) no tiene definidos un extent y un abstract: se asigna el extent de todo el mapa, y un abstract vacío:
						extent3857 = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
						abstract = "Sin descripción";
						tituloEs = "Sin título";
						peticionLeyenda = "Sin leyenda";
					}
				}
			}
		}

		//Corrección de la petición url para obtener la imagen de la leyenda:
		//Para aquellos casos en los que no está bien escrito el nombre de la capa.
		if (peticionLeyenda.indexOf('layer=') != -1){
			var peticionLeyendaRecortada = peticionLeyenda.slice(0, peticionLeyenda.indexOf('layer='));
			var peticionLeyenda = peticionLeyenda.slice(0, peticionLeyenda.indexOf('layer=')) + 'layer=' + capaEntrada;
		}
		console.log(peticionLeyenda);

		//Se crea la fuente y la capa:
		CrearFuenteYCapa(extent3857,abstract,tituloEs,peticionLeyenda);

	}).catch(function(error) {
		// CASO DE ERROR EN LA RESPUESTA AL GETCAPABILITIES: crear la capa sin extent:
    CrearFuenteYCapa([-20026376.39, -20048966.10, 20026376.39, 20048966.10],"Sin descripción","Sin título","Sin leyenda");
		alert("Capa sin extent definido");
	});

	function CrearFuenteYCapa(extentEntrada,abstractEntrada,tituloEsEntrada,peticionLeyendaEntrada){
		//Crear la fuente wms del servicio y de la capa introducidos:
		var fuenteWMSEntrada = new ol.source.TileWMS({
			url: urlEntrada,
			params: {LAYERS: capaEntrada, FORMAT: 'image/png'}
		})

		//Comprueba si existe un punto (".") en el nombre de la capa a cargar, y si es así, lo elimina:
		// Nota: sólo elimina uno. Si hubiera más de uno, la capa no dispondría de toda su funcionalidad en el visor.
		nombreCapaFinal = capaEntrada;
		if (capaEntrada.indexOf('.') != -1){
			var nombreCapaAntesdePunto = capaEntrada.slice(0, capaEntrada.indexOf('.'));
			var nombreCapaDespuesdePunto = capaEntrada.slice(capaEntrada.indexOf('.')+1);
			var nombreCapaFinal = nombreCapaAntesdePunto + nombreCapaDespuesdePunto;
		}

		//Crear la capa:
		var capaWMSEntrada = new ol.layer.Tile({
			title: nombreCapaFinal,
			titulo_es: tituloEsEntrada,
			source: fuenteWMSEntrada,
			displayInLayerSwitcher: true,
			extent: extentEntrada,
			abstract: abstractEntrada,
			leyenda: peticionLeyendaEntrada
		});

		//Añadir la capa al mapa:
		map.addLayer(capaWMSEntrada);
		AñadirALeyenda(capaWMSEntrada,'wms');
		//Hacer zoom a la capa cargada:
		var anchoSidebar = document.getElementById('sidebar').offsetWidth + 15;
		map.getView().fit(extentEntrada,{size:map.getSize(),padding:[15,15,15,anchoSidebar]});

		//Añadir la operación GETFEATUREINFO al mapa, en la capa recién cargada:
		map.on('dblclick', function(evt) {
			document.getElementById('textoGetFeatureInfo').innerHTML = "Aquí no hay datos para mostrar.";
			var viewResolution = vistaMapa.getResolution();
			//Calcular la posición en la que hay que dibujar el div:
			var coordenadasClickWebMercator = evt.coordinate;
			var centroEnPixeles = map.getPixelFromCoordinate(coordenadasClickWebMercator);
			var x = centroEnPixeles[0] + 10;
			var y = centroEnPixeles[1] + 10;


			var url = fuenteWMSEntrada.getGetFeatureInfoUrl(
				evt.coordinate, viewResolution, 'EPSG:3857',
				{'INFO_FORMAT': 'text/html'});
				//application/json
				if (url) {
				//	console.log(url);
				//	console.log(url.text);
					document.getElementById('textoGetFeatureInfo').innerHTML =
					'<iframe id="iframenueva" seamless src="' + url + '"></iframe>';
					$('#textoGetFeatureInfo').css({'top':y,'left':x});


				//	console.log(document.getElementById('textoGetFeatureInfo').innerHTML);
			//		console.log($("#iframenueva"));
			//		console.log($("#iframenueva").contents().find(".text-info").html);

				}
				if (document.getElementById('textoGetFeatureInfo').innerHTML == ""){
				//	$('#textoGetFeatureInfo').css({'display':'none'});
				}
		});
	}
}
