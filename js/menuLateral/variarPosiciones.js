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

function variarPosiciones(posicion){
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


  if (posicion == "no_capas_cargadas"){
    if (ultimaPosicion == "busqueda_abierta"){
      CargarTematicas(6,idioma);
      $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
      $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'65%'});
      $('#tabMenuBusqueda a').click(function (e) {
         e.preventDefault();
         $(this).tab('show');
      });
      $("#barraMenuBusqueda").css({'display':'none'});
      $("#espMenuGestionCapas").css({'max-height':'54%'});
    } else {
      CargarTematicas(8,idioma);
      $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
      $("#espMenuBusqueda").css({'display':'none'});
      $("#barraMenuBusqueda").css({'display':'flex','position':'absolute','bottom':'4em'});
      $("#espMenuGestionCapas").css({'max-height':'54%'});
    }
  } else if (posicion == "capas_cargadas_tematicas"){
    CargarTematicas(4,idioma);
    $("#espMenuTematicas").css({'position':'absolute','top':'55%'});
    $("#espMenuBusqueda").css({'display':'none'});
    $("#barraMenuBusqueda").css({'display':'flex','position':'absolute','bottom':'4em'});
    /*
    console.log(document.getElementById("barraMenuBusqueda").style.bottom);
    console.log(($("#espMenuTematicas").height()+$("#barraMenuBusqueda").height())/$("#sidebar").height());
*/
    $("#espMenuGestionCapas").css({'max-height':'54%'});
  } else if (posicion == "busqueda_abierta"){
      if (capasCargadas == false){
        console.log("no hay capas cargadas");
        CargarTematicas(6,idioma);
        $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
        $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'65%'});
        $('#tabMenuBusqueda a').click(function (e) {
        	 e.preventDefault();
        	 $(this).tab('show');
        });
        $("#barraMenuBusqueda").css({'display':'none'});
        $("#espMenuGestionCapas").css({'max-height':'54%'});
      } else if (capasCargadas == true){
        console.log("sí hay capas cargadas");
        CargarTematicas(2,idioma);
        $("#espMenuTematicas").css({'position':'absolute','top':'48%'});
        $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'65%'});
        $('#tabMenuBusqueda a').click(function (e) {
        	 e.preventDefault();
        	 $(this).tab('show');
        });
        $("#barraMenuBusqueda").css({'display':'none'});
        $("#espMenuGestionCapas").css({'max-height':'47%'});
      }
  }
  //Variable para guardar la última posición que ha existido:
  ultimaPosicion = posicion;

}
