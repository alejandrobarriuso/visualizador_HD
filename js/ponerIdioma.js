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
//var placeholderSelCatalogo = '';

function PonerIdioma(lang){
	idioma = lang;
	if(idioma == 'en'){
		visualizador = '<big>V</big>ISUALIZER <big>T</big>ITLE';
		botonAnadir = "Add";
		botonGestion = "Manage";
		escalaNum = "Scale";
		ejemploServicio = "Valid example links: http://www.idearqueologia.org/idearq/wms? or http://www.idearqueologia.org/idearq/wms?service=wms&request=getcapabilities"
		tabCatalogo = 'Catalogue';
		tabFichero = 'File';
		tabURLServicio = 'URL of the service';
		placeholderLocalizar = 'Zoom in to...';
		placeholderAbrirBusqueda = 'Add data';
		placeholderCargarURL = 'Url of the service';
	//	placeholderSelCatalogo = 'Select a record';

	} else {
		visualizador = '<big>T</big>ÍTULO DEL <big>V</big>ISUALIZADOR';
		botonAnadir = "Añadir";
		botonGestion = "Gestionar";
		escalaNum = "Escala";
		ejemploServicio = "Enlaces de ejemplo válidos: http://www.idearqueologia.org/idearq/wms? o http://www.idearqueologia.org/idearq/wms?service=wms&request=getcapabilities"
		tabCatalogo = 'Catálogo';
		tabFichero = 'Fichero';
		tabURLServicio = 'URL del servicio';
		placeholderLocalizar = 'Centrar mapa en...';
		placeholderAbrirBusqueda = 'Añadir datos';
		placeholderCargarURL = 'Dirección url del servicio';
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
//	$('#selCatalogo').attr("data-placeholder",placeholderSelCatalogo);


	//$("#selCatalogo").select2();
}
