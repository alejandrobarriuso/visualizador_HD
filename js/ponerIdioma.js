//Variable que guarda el idioma seleccionado:
var idioma = 'es';

// CONTROL DE LOS TEXTOS MOSTRADOS SÓLO EN LA PÁGINA EN FUNCIÓN DEL IDIOMA
//Variables y función para cambiar los textos.

var visualizador = '';
var botonAnadir = '';
var botonGestion = '';
var escalaNum = '';

function PonerIdioma(lang){
	idioma = lang;
	if(idioma == 'en'){
		visualizador = '<big>V</big>ISUALIZER <big>T</big>ITLE';
		botonAnadir = "Add";
		botonGestion = "Manage";
		escalaNum = "Scale";

	} else {
		visualizador = '<big>T</big>ÍTULO DEL <big>V</big>ISUALIZADOR';
		botonAnadir = "Añadir";
		botonGestion = "Gestionar";
		escalaNum = "Escala";

	}

	//Aquí se cambia el contenido de los diferentes textos:
	$('#txtVisualizador').html(visualizador);
	$('#txtBotonAnadir').html(botonAnadir);
	$('#txtBotonGestion').html(botonGestion);
	$('#txtEscalaNum').html(escalaNum);


}
