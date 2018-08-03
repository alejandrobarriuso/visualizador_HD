

//FUNCIÓN cargarURLServicio(urlEntrada)
/*
ENTRADAS:
  urlEntrada: url del servicio WMS del cual se quieren conocer las capas (hasta la ?).
FUNCIONALIDAD:
  Hace una petición GetCapabilities al servicio indicado, para obtener información de las capas que contiene
SALIDA:
	arrayCapasServicioWMS: array de objetos con la información de las capas.
*/
function cargarURLServicio(urlEntrada) {

	//Hacer petición getCapabilities para obtener el extent de la capa a cargar "capaEntrada":
	// IMPORTANTE: se requiere el proxy corsproxy funcionando, en el puerto 1337; para saltar la restricción CORS.
	var parser = new ol.format.WMSCapabilities();
	//Si se ha introducido la dirección más larga de lo necesario (hasta la ?); entonces se recorta:
  if (urlEntrada.indexOf('?') != -1){
		urlDefinitiva = urlEntrada.substring(0,urlEntrada.indexOf('?')) + '?';
		console.log(urlEntrada);
		// La url de entrada se debe recortar a partir del caracter 7º, para quitar "http://":
		var urlEntradaParaCapabilities = urlEntrada.slice(7);
		console.log(urlEntradaParaCapabilities);
		var url_capabilities = 'http://localhost:1337/' + urlEntradaParaCapabilities + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
		$.ajax({
				url: url_capabilities
		}).done(function(text) {
  		// CASO 1. ÉXITO EN LA RESPUESTA AL GETCAPABILITIES: crea la capa con extent:
      var result = parser.read(text);
  		console.log(result);
  		arrayCapasServicioWMS = [];
  		for (var i=0; i<result.Capability.Layer.Layer.length; i++) {
  			var Capai = {};
  			Capai.id = result.Capability.Layer.Layer[i].Name;
  			Capai.nombre = result.Capability.Layer.Layer[i].Title;
  			Capai.servicio = urlDefinitiva;
  			arrayCapasServicioWMS.push(Capai);
  		}
  		$("[id*=lista_capas_a_cargar_URL_externa]").remove();
      $("[id*=textoEjemploServicio]").remove();
      var listaCapasACargar = $("<ul>").addClass("list-group m-0 p-0").attr("id","lista_capas_a_cargar_URL_externa").css({'position':'relative','z-index':'20000','width':'100%'}).appendTo("#espBusquedaURLExterna");

      for (var i=0; i<arrayCapasServicioWMS.length; i++){

        var capaServicioWMSi = document.createElement("a");
        capaServicioWMSi.innerHTML = '<li>' + arrayCapasServicioWMS[i].nombre + '</li>';
        capaServicioWMSi.setAttribute("href","javascript:CargarCapa('" + arrayCapasServicioWMS[i].id + "','wms','" + arrayCapasServicioWMS[i].servicio + "','menuBusqueda');");
        capaServicioWMSi.setAttribute("class","list-group-item lista_capas_catalogo m-0 p-2");
        capaServicioWMSi.setAttribute("style","list-style:none;");

        document.getElementById("lista_capas_a_cargar_URL_externa").appendChild(capaServicioWMSi);
      }
  	})
  } else {
    alert("No es una url correcta");
  }
}
//Al iniciar una nueva búsqueda, se borra el resultado de la anterior o los ejemplos mostrados al inicio:
function vaciarListaCapas() {
	$("[id*=lista_capas_a_cargar_URL_externa]").remove();
  document.getElementById("txtEjemploServicio").style.display = "none";
}
