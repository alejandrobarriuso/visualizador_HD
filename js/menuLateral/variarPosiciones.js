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
  console.log("altura sidebar: " + alturaSidebar);
  console.log(posicion);


  if (posicion == "no_capas_cargadas"){
    if (ultimaPosicion == "busqueda_abierta"){
      //Reubicación de los elementos:
      $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
      $("#espMenuBusqueda").css({'display':'inline','position':'absolute','top':'60%'});
      $('#tabMenuBusqueda a').click(function (e) {
         e.preventDefault();
         $(this).tab('show');
      });
      $("#barraMenuBusqueda").css({'display':'none'});
      $("#espMenuGestionCapas").css({'height':'40%'});
      //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
      var numeroFilasCuadros = Math.floor(($("#espMenuBusqueda").position().top)/168);
      CargarTematicas(numeroFilasCuadros*2,idioma);
    } else {
      //Reubicación de los elementos:
      $("#espMenuTematicas").css({'position':'absolute','top':'1%'});
      $("#espMenuBusqueda").css({'display':'none'});
    //  $("[id*=lista_capas_a_cargar]").remove();
      $("#barraMenuBusqueda").css({'display':'flex','position':'absolute','bottom':'6.5em'});
      $("#espMenuGestionCapas").css({'max-height':'40%'});
      //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
      var numeroFilasCuadros = Math.floor(($("#barraMenuBusqueda").position().top-$("#barraMenuBusqueda").height()-20)/168);
      CargarTematicas(numeroFilasCuadros*2,idioma);
      console.log(numeroFilasCuadros);
      console.log("lo conseguí por cuarta vez");
    }
  } else if (posicion == "capas_cargadas_tematicas"){
    //Reubicación de los elementos:
    $("#espMenuTematicas").css({'position':'absolute','top':'48%'});
    $("#espMenuBusqueda").css({'display':'none'});
  //  $("[id*=lista_capas_a_cargar]").remove();
    $("#barraMenuBusqueda").css({'display':'flex','position':'absolute','bottom':'6.5em'});
    $("#espMenuGestionCapas").css({'height':'46%'});
    //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
    var numeroFilasCuadros = Math.floor(($("#barraMenuBusqueda").position().top-$("#espMenuGestionCapas").height()-$("#barraMenuBusqueda").height()-20)/168);
    CargarTematicas(numeroFilasCuadros*2,idioma);
    /*
    console.log(document.getElementById("barraMenuBusqueda").style.bottom);
    console.log(($("#espMenuTematicas").height()+$("#barraMenuBusqueda").height())/$("#sidebar").height());
*/

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
      //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
      var numeroFilasCuadros = Math.floor(($("#espMenuBusqueda").position().top-$("#espMenuGestionCapas").height())/168);
      CargarTematicas(numeroFilasCuadros*2,idioma);
      console.log(numeroFilasCuadros);
      console.log("lo conseguí por segunda vez");
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
        //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
        var numeroFilasCuadros = Math.floor(($("#espMenuBusqueda").position().top)/168);
        CargarTematicas(numeroFilasCuadros*2,idioma);
        console.log(numeroFilasCuadros);
        console.log("lo conseguí");
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
        //Calculo del número de cuadrados a disponer, en función de la altura de los diferentes elementos:
        var numeroFilasCuadros = Math.floor(($("#espMenuBusqueda").position().top-$("#espMenuGestionCapas").height())/168);
        CargarTematicas(numeroFilasCuadros*2,idioma);
        console.log(numeroFilasCuadros);
        console.log("lo conseguí por tercera vez");
      }
  }
  //Variable para guardar la última posición que ha existido:
  ultimaPosicion = posicion;

}
