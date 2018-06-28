// --- FUNCIONAMIENTO DE LA PETICIÓN GETRECORDS AL CATÁLOGO --- //

//Variable "cswConfig", que carga todos los esquemas necesarios y se utiliza después para crear la variable "csw".
//REQUERIMIENTOS: disponer de los archivos existentes en las carpetas "src" y "node_modules"
var cswConfig = [
    [
    OWS_1_0_0,
    DC_1_1,
    DCT,
    XLink_1_0,
    SMIL_2_0,
    SMIL_2_0_Language,
    GML_3_1_1,
    Filter_1_1_0,
    CSW_2_0_2,
 // GML_3_2_0,
    GML_3_2_1,
    ISO19139_GCO_20070417,
    ISO19139_GMD_20070417,
    ISO19139_GMX_20070417,
    ISO19139_GSS_20070417,
    ISO19139_GTS_20070417,
    ISO19139_GSR_20070417,
 // ISO19139_2_GMI_1_0
    ],
    {
    namespacePrefixes: {
		"http://www.opengis.net/cat/csw/2.0.2": "csw",
        "http://www.opengis.net/ogc": 'ogc',
   //   "http://www.opengis.net/gml": "gml",
   //   "http://purl.org/dc/elements/1.1/":"dc",
   //   "http://purl.org/dc/terms/":"dct",
   //   "http://www.isotc211.org/2005/gmd" : "gmd",
   //   "http://www.isotc211.org/2005/gco" : "gco",
   //   "http://www.isotc211.org/2005/gmi" : "gmi"
    },
    mappingStyle : 'simplified'
    }
];


//Función para obtener un xml a partir de una url; necesaria después:
function getXML(url){
    return Ows4js.Util.httpGet(url).responseXML;
}

//CREACIÓN DE LA VARIABLE "csw", CON EL CATÁLOGO A CONSULTAR
var csw = new Ows4js.Csw('http://161.111.72.7:8080/geonetwork/srv/spa/csw?SERVICE=CSW&VERSION=2.0.2', cswConfig);

//FUNCIÓN GETRECORDS PARA REALIZAR LA PETICIÓN
/*
REQUERIMIENTOS:
	- Haber cargado anteriormente la variable csw, con la variable cswConfig y todos los archivos necesarios para ello.
ENTRADAS:
	service_or_dataset: es una variable que indica si se quiere buscar un servicio o un dataset, con los valores
		"service" o "dataset" respectivamente.
SALIDAS:
	Dependiendo del valor de la variable "service_or_dataset", la salida será:
		- El resultado de la función obten_campos_dataset, o:
		- El resultado de la función obten_campos_service.
		(ver la descripción de estas dos funciones en sus respectivos archivos).
FUNCIONALIDAD:
	Esta función realiza la operación getrecords sobre el servicio csw indicado anteriormente en la variable csw (el servicio
		completo o algún servicio virtual), filtrando el resultado, ofreciendo servicios o datasets, en función del valor de la variable de entrada.
	Por último, con el número de resultados, el filtro y el esquema de salida, se ejecuta la petición, con una función anidada, a
		partir del método "csw.GetRecords". Esta función tiene como:
			ENTRADAS:
				- La posición del primer recurso a mostrar en el resultado. Lo habitual será 1.
				- El número de resultados que se quiere mostrar.
				- El filtro a aplicar en la consulta (creado anteriormente).
				- El esquema de salida para los datos (creado como variable anteriormente).
			SALIDAS:
				Dependiendo del valor de la variable "service_or_dataset", la salida será:
					- El resultado de la función obten_campos_dataset, o:
					- El resultado de la función obten_campos_service.
					(ver la descripción de estas dos funciones en sus respectivos archivos).
*/

function GetRecords(service_or_dataset) {

	var type = service_or_dataset;
	var filter = new Ows4js.Filter().PropertyName(['ogc:type']).isLike(type);

	//var output_schema = "http://www.opengis.net/cat/csw/2.0.2";
	var output_schema = "http://www.isotc211.org/2005/gmd";

	csw.GetRecords(1,20,filter,output_schema).then(function(result){
		//Convertir a JSON la respuesta en xml, utilizando la función xmlToJSON, albergada en el archivo xmltojson.js
		var result_json = xmlToJSON.parseXML(result);
		console.log(result_json);
		console.log(type);

		//Obtener un objeto JSON con los registros encontrados:
		var elementos = result_json.GetRecordsResponse[0].SearchResults[0].MD_Metadata;
		console.log(elementos);

		//Obtener los campos que interesan para crear el listado:
      function CrearArrayBusquedaCatalogo(result){

      	//OBTENER LA INFORMACIÓN DEL CAMPO A BUSCAR:
      	var elementos = result.GetRecordsResponse[0].SearchResults[0].MD_Metadata; //Creo el array "elementos", que contiene los registros encontrados por la peticion.
      	var numElementos = result.GetRecordsResponse[0].SearchResults[0].MD_Metadata.length; //Creo la variable "num_elementos" obteniendo el numero de registros devueltos por la peticion.

      	var arrayResultadoCatalogo = []; //Creo el array que contendrá los resultados de la búsqueda
      	//Bucle que va añadiendo información al texto de salida:
      	for (var i=0; i<numElementos; i++) { //Este bucle entra en cada registro encontrado i; desde 0 hasta la variable num_elementos.
      		var elementoCatalogoI = {}; //Objeto vacío de cada nuevo elemento a añadir al array.
      		//Añadir el campo "titulo" al elemento:
      		var tituloElementoI = elementos[i].identificationInfo[0].MD_DataIdentification[0].citation[0].CI_Citation[0].title[0].CharacterString[0]._text; //Entra en el array del campo a buscar en cada registro.
      		if (typeof(tituloElementoI) != "undefined") { //Primero comprueba si, dentro del registro i, existe el campo a buscar.
      			elementoCatalogoI.text = tituloElementoI;
      		}
      		//Añadir el identificador único de cada elemento:
      		var idElementoI = elementos[i].fileIdentifier[0].CharacterString[0]._text; //Entra en el array del campo a buscar en cada registro.
      		if (typeof(idElementoI) != "undefined") { //Primero comprueba si, dentro del registro i, existe el campo a buscar.
      			elementoCatalogoI.id = idElementoI;
      		}
          //Añadir el array de keywords de cada elemento:
          var keywordsElementoI = [];
          var numKeywordsElementoI = elementos[i].identificationInfo[0].MD_DataIdentification[0].descriptiveKeywords[0].MD_Keywords[0].keyword.length //Número de keywords del elemento i
            for (var j=0; j<numKeywordsElementoI; j++){
              var keywordJElementoI = elementos[i].identificationInfo[0].MD_DataIdentification[0].descriptiveKeywords[0].MD_Keywords[0].keyword[j].CharacterString[0]._text; //Entra en el array del campo a buscar en cada registro.
      		      if (typeof(keywordJElementoI) != "undefined") { //Primero comprueba si, dentro del registro i, existe el campo a buscar.
      			         keywordsElementoI.push(keywordJElementoI);
      		      }
              }
            elementoCatalogoI.keywords = keywordsElementoI;

          //Añado el objeto creado para el elemento i al array de resultados:
      		arrayResultadoCatalogo.push(elementoCatalogoI);
      	}
      	console.log(arrayResultadoCatalogo);
        return arrayResultadoCatalogo;
      };


      function stripDiacritics (text) {
            // Used 'uni range + named function' from http://jsperf.com/diacritics/18
            function match(a) {
              return DIACRITICS[a] || a;
            }
            return text.replace(/[^\u0000-\u007E]/g, match);
   }


  function FuncionEmparejadora (params, data) {
        // Always return the object if there is nothing to compare
        if ($.trim(params.term) === '') {
          return data;
        }

        // Do a recursive check for options with children
        if (data.children && data.children.length > 0) {
          // Clone the data object if there are children
          // This is required as we modify the object to remove any non-matches
          var match = $.extend(true, {}, data);

          // Check each child of the option
          for (var c = data.children.length - 1; c >= 0; c--) {
            var child = data.children[c];

            var matches = matcher(params, child);

            // If there wasn't a match, remove the object in the array
            if (matches == null) {
              match.children.splice(c, 1);
            }
          }

          // If any children matched, return the new object
          if (match.children.length > 0) {
            return match;
          }

          // If there were no matching children, check just the plain object
          return matcher(params, match);
        }

        var original = stripDiacritics(data.text).toUpperCase();
        var term = stripDiacritics(params.term).toUpperCase();

        // Check if the text contains the term
        if (original.indexOf(term) > -1) {
          return data;
        }
        // PARTE MODIFICADA PARA BUSCAR TAMBIÉN EN LAS PALABRAS CLAVE de cada REGISTRO ----
        var originalPalabrasClave = data.keywords;
        var originalPalabrasClaveLon = originalPalabrasClave.length;

        for (var i=0; i<originalPalabrasClaveLon; i++){
          originalPalabrasClaveI = stripDiacritics(originalPalabrasClave[i]).toUpperCase();
          if (originalPalabrasClaveI.indexOf(term) > -1) {
            return data;
          }
        }
        // -----

        // If it doesn't contain the term, don't return anything
        return null;
      }

  $("select").select2({
    placeholder: 'Selecciona un registro',
    data: CrearArrayBusquedaCatalogo(result_json),
    allowClear: false,
    matcher: FuncionEmparejadora
  })

});
};
