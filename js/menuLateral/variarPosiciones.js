
function variarPosiciones(posicion){
  if (posicion == "inicial"){
    $("#espMenuTematicas").css({'position':'absolute','top':'0.6em','bottom':'auto'});
    $("#espMenuBusqueda").css({'position':'absolute','bottom':'5em','top':'auto'});
    CargarTematicas(8,idioma);
  } else if (posicion == "capas_cargadas"){
    $("#espMenuTematicas").css({'position':'absolute','bottom':'10em','top':'auto'});
    $("#espMenuBusqueda").css({'position':'absolute','bottom':'5em','top':'auto'});
    CargarTematicas(4,idioma);
  } else if (posicion == "busqueda_abierta"){
    $("#espMenuTematicas").css({'position':'absolute','bottom':'10em','top':'auto'});
    $("#espMenuBusqueda").css({'position':'absolute','bottom':'5em','top':'auto'});
    CargarTematicas(4,idioma);
  }
}
