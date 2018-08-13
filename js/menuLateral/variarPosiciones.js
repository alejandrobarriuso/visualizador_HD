var capasCargadas = false;
var ultimaPosicion = "";

//FUNCIÓN variarPosiciones(posicion)
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
  console.log(alturaSidebar);
  console.log(posicion);

  if (posicion == "temAX_busCV_gesCX"){
    //Espacios:
    $("#espMenuGestionCapas").css({'display':'none'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#espMenuTematicas").css({'display':'flex'});

    //Botones:
    $("#botonTematicas").css({'display':'none'});
    $("#barraMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuTematicas = alturaSidebar - $("#barraMenuBusqueda").outerHeight(true);
    document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
    CargarTematicas(idioma);

  } else if (posicion == "temAX_busCV_gesCV"){
    //Espacios:
    $("#espMenuTematicas").css({'display':'flex'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#espMenuGestionCapas").css({'display':'none'});

    //Botones:
    $("#botonTematicas").css({'display':'none'});
    $("#barraMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'flex'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuTematicas = alturaSidebar - $("#barraMenuBusqueda").outerHeight(true) - $("#botonGestion").outerHeight(true);
    document.getElementById("espMenuTematicas").style.height = altoEspMenuTematicas + 'px';
    CargarTematicas(idioma);

  } else if (posicion == "temCV_busCV_gesAX"){
    //Espacios:
    $("#espMenuTematicas").css({'display':'none'});
    $("#espMenuGestionCapas").css({'display':'flex'});
    $("#espMenuBusqueda").css({'display':'none'});

    //Botones:
    $("#botonTematicas").css({'display':'flex'});
    $("#barraMenuBusqueda").css({'display':'flex'});
    $("#botonGestion").css({'display':'none'});

    //Tamaño del espacio(s) abierto(s) en función del botón(es) presente(s):
    altoEspMenuGestionCapas = alturaSidebar - $("#barraMenuBusqueda").outerHeight(true) - $("#botonTematicas").outerHeight(true);
    document.getElementById("espMenuGestionCapas").style.height = altoEspMenuGestionCapas + 'px';


  } else if (posicion == "capas_cargadas_catalogo"){
      console.log("sí hay capas cargadas, desde el catálogo");
      //Reubicación de los elementos:
      $("#espMenuTematicas").css({'position':'absolute','top':'42%'});
      $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'60%'});
      $('#tabMenuBusqueda a').click(function (e) {
         e.preventDefault();
         $(this).tab('show');
      });
      $("#barraMenuBusqueda").css({'display':'none'});
      $("#espMenuGestionCapas").css({'height':'40%'});

      CargarTematicas(idioma);

  } else if (posicion == "busqueda_abierta"){
      if (capasCargadas == false){
        //Reubicación de los elementos:
        $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
        $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'60%'});
        $('#tabMenuBusqueda a').click(function (e) {
        	 e.preventDefault();
        	 $(this).tab('show');
        });
        $("#barraMenuBusqueda").css({'display':'none'});
        $("#espMenuGestionCapas").css({'height':'40%'});
        CargarTematicas(idioma);
      } else if (capasCargadas == true){
        console.log("sí hay capas cargadas");
        //Reubicación de los elementos:
        $("#espMenuTematicas").css({'position':'absolute','top':'42%'});
        $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'60%'});
        $('#tabMenuBusqueda a').click(function (e) {
        	 e.preventDefault();
        	 $(this).tab('show');
        });
        $("#barraMenuBusqueda").css({'display':'none'});
        $("#espMenuGestionCapas").css({'height':'40%'});
        CargarTematicas(idioma);

      }
  }
  //Variable para guardar la última posición que ha existido:
  ultimaPosicion = posicion;

}
