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
var placeholderAbrirBusqueda = '';
var placeholderCargarURL = '';
var seleccionarArchivo = '';
//var placeholderSelCatalogo = '';

function PonerIdioma(lang){
	idioma = lang;
	if(idioma == 'en'){
		visualizador = '<big>I</big>MAGO <big>O</big>RBIS';
		botonAnadir = "Add";
		botonGestion = "Manage";
		escalaNum = "Scale";
		ejemploServicio = "Valid example link: http://www.idearqueologia.org/idearq/wms?";
		tabCatalogo = 'Catalogue';
		tabFichero = 'File';
		tabURLServicio = 'URL of the service';
		placeholderLocalizar = 'Zoom in to...';
		placeholderAbrirBusqueda = 'Add data';
		placeholderCargarURL = 'Url of the service';
		seleccionarArchivo = 'Select a file...';
	//	placeholderSelCatalogo = 'Select a record';

	} else {
		visualizador = '<big>I</big>MAGO <big>O</big>RBIS';
		botonAnadir = "Añadir";
		botonGestion = "Gestionar";
		escalaNum = "Escala";
		ejemploServicio = "Enlace de ejemplo válido: http://www.idearqueologia.org/idearq/wms?";
		tabCatalogo = 'Catálogo';
		tabFichero = 'Fichero';
		tabURLServicio = 'URL del servicio';
		placeholderLocalizar = 'Centrar mapa en...';
		placeholderAbrirBusqueda = 'Añadir datos';
		placeholderCargarURL = 'Dirección url del servicio';
		seleccionarArchivo = 'Seleccionar archivo...';
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
	$('#abrirBusqueda').attr("placeholder",placeholderAbrirBusqueda);
	$('#cargarURL').attr("placeholder",placeholderCargarURL);
	$('#txtSeleccionarArchivo').html(seleccionarArchivo);

//	$('#selCatalogo').attr("data-placeholder",placeholderSelCatalogo);


	//$("#selCatalogo").select2();
}
