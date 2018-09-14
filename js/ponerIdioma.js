//Variable que guarda el idioma seleccionado:
var idioma = 'es';

// CONTROL DE LOS TEXTOS MOSTRADOS SÓLO EN LA PÁGINA EN FUNCIÓN DEL IDIOMA
//Variables y función para cambiar los textos.

var visualizador = '';
var botonAnadir = '';
var botonGestion = '';
var escalaNum = '';
var ejemploServicio = '';
var tabCatalogo = '';
var tabFichero = '';
var tabURLServicio = '';
var placeholderLocalizar = '';
var placeholderCargarURL = '';
var seleccionarArchivo = '';
var seleccionarTematica = '';
var gestionarCapasCargadas = '';
var menuBusqueda = '';
var tituloBusqueda = '';
var tituloLeyenda = '';

//Alertas:
var alertFormatoNoValido = '';
var alertArchivoDemasiadoPesado = '';
var alertNumCapasCargadasMax = '';
var alertCapaWMSYaCargada = '';
//var placeholderSelCatalogo = '';

function PonerIdioma(lang){
	idioma = lang;
	if(idioma == 'en'){
		visualizador = '<big>I</big>MAGO <big>O</big>RBIS';
		botonAnadir = "Add";
		botonGestion = "Manage";
		escalaNum = "Scale";
		ejemploServicio = "Valid example link: http://www.idearqueologia.org/idearq/wms?";
		tabCatalogo = 'Search in catalogue';
		tabFichero = 'File';
		tabURLServicio = 'WMS';
		placeholderLocalizar = 'Zoom in to...';
		placeholderCargarURL = 'Url of the service';
		seleccionarArchivo = 'Select a file...';
		seleccionarTematica = 'Select by topic';
		gestionarCapasCargadas = 'Manage loaded layers';
		menuBusqueda = 'Add other maps';
		tituloBusqueda = 'Add other maps';
		tituloLeyenda = 'Legend';

		alertFormatoNoValido = 'It is not a valid file format (admitted file formats: geojson, shapefile in zip).';
		alertArchivoDemasiadoPesado = 'File is too large (maximum size: ' + Math.round(tamanoMaximoArchivo/1000) + ' kb).';
		alertNumCapasCargadasMax = 'Maximum number of layers loaded reached. Remove any to be able to upload new ones.';
		alertCapaWMSYaCargada = 'WMS layer already loaded.';
	//	placeholderSelCatalogo = 'Select a record';

	} else {
		visualizador = '<big>I</big>MAGO <big>O</big>RBIS';
		botonAnadir = "Añadir";
		botonGestion = "Gestionar";
		escalaNum = "Escala";
		ejemploServicio = "Enlace de ejemplo válido: http://www.idearqueologia.org/idearq/wms?";
		tabCatalogo = 'Búsqueda en catálogo';
		tabFichero = 'Archivo';
		tabURLServicio = 'WMS';
		placeholderLocalizar = 'Centrar mapa en...';
		placeholderCargarURL = 'Dirección url del servicio';
		seleccionarArchivo = 'Seleccionar archivo...';
		seleccionarTematica = 'Seleccionar por temática';
		gestionarCapasCargadas = 'Gestionar capas cargadas';
		menuBusqueda = 'Añadir otros mapas';
		tituloBusqueda = 'Añadir otros mapas';
		tituloLeyenda = 'Leyenda';

		alertFormatoNoValido = 'No es un formato de archivo válido (formatos admitidos: geojson, shapefile en zip).';
		alertArchivoDemasiadoPesado = 'Archivo demasiado grande (tamaño máximo permitido: ' + Math.round(tamanoMaximoArchivo/1000) + ' kb).';
		alertNumCapasCargadasMax = 'Número máximo de capas cargadas alcanzado. Elimine alguna para poder cargar nuevas.';
		alertCapaWMSYaCargada = 'Capa WMS ya cargada.';
	//	placeholderSelCatalogo = 'Seleccione un registro';
	}

	//Aquí se cambia el contenido de los diferentes textos:
	$('#txtVisualizador').html(visualizador);
	$('#txtBotonAnadir').html(botonAnadir);
	$('#txtBotonGestion').html(botonGestion);
	$('#txtEscalaNum').html(escalaNum);
	$('#txtEjemploServicio').html(ejemploServicio);
	$('#txtTabCatalogo').html(tabCatalogo);
	$('#txtTabFichero').html(tabFichero);
	$('#txtTabURLServicio').html(tabURLServicio);
	$('#localizar').attr("placeholder",placeholderLocalizar);
	$('#cargarURL').attr("placeholder",placeholderCargarURL);
	$('#txtSeleccionarArchivo').html(seleccionarArchivo);
	$('#txtSeleccionarTematica').html(seleccionarTematica);
	$('#txtGestionarCapasCargadas').html(gestionarCapasCargadas);
	$('#txtMenuBusqueda').html(menuBusqueda);
	$('#txtTituloBusqueda').html(tituloBusqueda);
	$('#txtTituloLeyenda').html(tituloLeyenda);



//	$('#selCatalogo').attr("data-placeholder",placeholderSelCatalogo);


	//$("#selCatalogo").select2();
}
