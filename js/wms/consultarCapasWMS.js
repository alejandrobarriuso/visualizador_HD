//FUNCIÓN ConsultarCapasWMS(urlEntrada)
/*
ENTRADAS:
  urlEntrada: url del servicio WMS del cual se quieren conocer las capas (hasta la ?).
FUNCIONALIDAD:
  Hace una petición GetCapabilities al servicio indicado, para obtener información de las capas que contiene
SALIDA:
	arrayCapasServicioWMS: array de objetos con la información de las capas.
*/
function ConsultarCapasWMS(urlEntrada) {
	//Hacer petición getCapabilities para obtener el extent de la capa a cargar "capaEntrada":
	var parser = new ol.format.WMSCapabilities();
	fetch(urlEntrada + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities').then(function(response) {
		return response.text();
  }).then(function(text) {
		// CASO 1. ÉXITO EN LA RESPUESTA AL GETCAPABILITIES: crea la capa con extent:
    var result = parser.read(text);
		console.log(result);
		arrayCapasServicioWMS = [];
		for (var i=0; i<result.Capability.Layer.Layer.length; i++) {
			var Capai = {};
			Capai.id = result.Capability.Layer.Layer[i].Name;
			Capai.nombre = result.Capability.Layer.Layer[i].Title;
			Capai.servicio = urlEntrada;
			arrayCapasServicioWMS.push(Capai);
		}
		console.log(arrayCapasServicioWMS);
		return arrayCapasServicioWMS;
	})
}
