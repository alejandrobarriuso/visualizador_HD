//FUNCIÓN TamanoSidebar(){
/*
  Asigna el valor del alto de la barra lateral izquierda "sidebar" para que se ajuste a la pantalla:
    - Por encima: al header.
    - Por debajo: al footer.
  Se debe ejecutar con el onload de la página html.
*/
function TamanoSidebar(){
  alturaSidebar = $("body").height() - $("header").height() - $("footer").height();
  document.getElementById("sidebar").style.height = alturaSidebar + 'px';
}

var capasCargadas = false;
var ultimaPosicion = "";

//FUNCIÓN VariarPosiciones(posicion)
/*
ENTRADAS:
  posicion: campo de texto con el que se llama a la función en cada caso, en los diferentes pasos de carga de capas existentes. Puede tomar como valor:
    "no_capas_cargadas": cuando no hay ninguna capa cargada.
    "capas_cargadas_tematicas": cuando se ha cargado una capa desde el menú temáticas.
    "busqueda_abierta": cuando el menú de búsqueda en catálogo / archivo / URL está abierto.
FUNCIONALIDAD:
  Modifica la disposición de la barra lateral izquierda para adaptarla a cada caso anterior, teniendo en cuenta si hay capas cargadas o no.
SALIDA:
	ninguna.
*/

function VariarPosiciones(posicion){
  //Calcular el número de capas cargadas:
  var numeroMapasTotalCargados = map.getLayers().N.length;
  //Variable para guardar si hay capas cargadas o no:
  if (numeroMapasTotalCargados == numeroMapasBaseCargados){
    capasCargadas = false;
  } else {
    capasCargadas = true;
  }

  var alturaSidebar = $("#sidebar").height();


  if (posicion == ""){
    //Espacios:
    $("#espMenuGestionCapas").css({'display':'none'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#espMenuTematicas").css({'display':'flex'});

    //Botones:
    $("#botonTematicas").css({'display':'none'});
    $("#botonMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuTematicas = alturaSidebar - $("#botonMenuBusqueda").outerHeight(true);
    document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
    CargarTematicas(idioma);
    console.log("altura sidebar: " + $("#botonMenuBusqueda").outerHeight(true));
    console.log("alto menu tematicas: " + altoEspMenuTematicas);
    console.log("situacion de inicio");

  } else if (posicion == "temAX_busCV_gesCX"){
    //Espacios:
    $("#espMenuGestionCapas").css({'display':'none'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#espMenuTematicas").css({'display':'flex'});

    //Botones:
    $("#botonTematicas").css({'display':'none'});
    $("#botonMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuTematicas = alturaSidebar - $("#botonMenuBusqueda").outerHeight(true);
    document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
    CargarTematicas(idioma);
    console.log("altura sidebar: " + $("#botonMenuBusqueda").outerHeight(true));
    console.log("alto menu tematicas: " + altoEspMenuTematicas);

  } else if (posicion == "temAX_busCV_gesCV"){
    //Espacios:
    $("#espMenuTematicas").css({'display':'flex'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#espMenuGestionCapas").css({'display':'none'});

    //Botones:
    $("#botonTematicas").css({'display':'none'});
    $("#botonMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'flex'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuTematicas = alturaSidebar - $("#botonMenuBusqueda").outerHeight(true) - $("#botonGestion").outerHeight(true);
    document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
    CargarTematicas(idioma);

  } else if (posicion == "temCV_busCV_gesAX"){
    //Espacios:
    $("#espMenuTematicas").css({'display':'none'});
    $("#espMenuGestionCapas").css({'display':'flex'});
    $("#espMenuBusqueda").css({'display':'none'});

    //Botones:
    $("#botonTematicas").css({'display':'flex'});
    $("#botonMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuGestionCapas = alturaSidebar - $("#botonMenuBusqueda").outerHeight(true) - $("#botonTematicas").outerHeight(true);
    document.getElementById("espMenuGestionCapas").style.height = altoEspMenuGestionCapas + 'px';


  } else if (posicion == "temAX_busAX_gesCX_O_temCV_busAX_gesAX"){
    if (capasCargadas == false){
      //CASO temAX_busAX_gesCX
      //Espacios:
      $("#espMenuGestionCapas").css({'display':'none'});
      $("#espMenuBusqueda").css({'display':'flex'});
      $("#espMenuTematicas").css({'display':'flex'});

      //Botones:
      $("#botonTematicas").css({'display':'none'});
      $("#botonMenuBusqueda").css({'display':'none'});
      $("#botonGestion").css({'display':'none'});

      //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
      altoEspMenuTematicas = alturaSidebar - $("#espMenuBusqueda").outerHeight(true);
      document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
      CargarTematicas(idioma);

      console.log("estoy en el caso temAX_busAX_gesCX");
      //Reiniciar el funcionamiento de los tabs en el Menú de Búsqueda:
      $('#tabMenuBusqueda a').click(function (e) {
         e.preventDefault();
         $(this).tab('show');
      });

    } else if (capasCargadas == true){
      //CASO temCV_busAX_gesAX
      //Espacios:
      $("#espMenuGestionCapas").css({'display':'flex'});
      $("#espMenuBusqueda").css({'display':'flex'});
      $("#espMenuTematicas").css({'display':'none'});

      //Botones:
      $("#botonTematicas").css({'display':'flex'});
      $("#botonMenuBusqueda").css({'display':'none'});
      $("#botonGestion").css({'display':'none'});

      //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
      altoEspMenuGestionCapas = alturaSidebar  - $("#espMenuBusqueda").outerHeight(true) - $("#botonTematicas").outerHeight(true);
      document.getElementById("espMenuGestionCapas").style.height = altoEspMenuGestionCapas + 'px';

      console.log("estoy en el caso temCV_busAX_gesAX");
      //Reiniciar el funcionamiento de los tabs en el Menú de Búsqueda:
      $('#tabMenuBusqueda a').click(function (e) {
         e.preventDefault();
         $(this).tab('show');
      });
    }
  } else if (posicion == "temCV_busAX_gesAX"){
    //Espacios:
    $("#espMenuGestionCapas").css({'display':'flex'});
    $("#espMenuBusqueda").css({'display':'flex'});
    $("#espMenuTematicas").css({'display':'none'});

    //Botones:
    $("#botonTematicas").css({'display':'flex'});
    $("#botonMenuBusqueda").css({'display':'none'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuGestionCapas = alturaSidebar  - $("#espMenuBusqueda").outerHeight(true) - $("#botonTematicas").outerHeight(true);
    document.getElementById("espMenuGestionCapas").style.height = altoEspMenuGestionCapas + 'px';

    //Reiniciar el funcionamiento de los tabs en el Menú de Búsqueda:
    $('#tabMenuBusqueda a').click(function (e) {
       e.preventDefault();
       $(this).tab('show');
    });

  }
  //Variable para guardar la última posición que ha existido:
  ultimaPosicion = posicion;
}
