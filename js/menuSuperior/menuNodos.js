//FUNCIÓN CargarTematicas(numMaxTematicas,idioma)
/*
ENTRADAS:
  numMaxTematicas: número máximo de temáticas a mostrar.
  idioma: variable que habrá cogido su valor al clickar sobre los botones de selección de idioma (archivo ponerIdioma.js). Por defecto: 'es'.
FUNCIONALIDAD:
  Crea un cuadrado por cada temática y un submenú asociado, que sólo se mostrará cuando se ejecute la función AparecerSubmenuTematicaNumi(idTematica,colorFondo,colorLetraBorde),
  a la que se llama desde los propios elementos creados aquí.
*/

function CargarNodos(numMaxNodos){
  console.log(numMaxNodos);
  console.log(arrayNodos.length);
  //Crear un cuadrado por cada nodo:
  for (var i=0; i<Math.min(numMaxNodos,arrayNodos.length); i++){
    var nodoNumi = document.createElement("a");
    nodoNumi.innerHTML = '<h4>' + arrayNodos[i].nombre.toUpperCase() + '</h4>';

    var idNodoNumi = "nodo" + arrayNodos[i].id;
    nodoNumi.setAttribute("id",idNodoNumi);
    nodoNumi.setAttribute("class","card m-0 p-0");
    nodoNumi.setAttribute("style","height:9em;width:10em;border-radius:0;border-width:0;display:flex;justify-content:center;align-items:center;text-decoration:none;" +
      ";background-color:" + arrayNodos[i].color_fondo +
      ";color:#f2f2f2"
    );
    //Añadir el objeto Nodo al menú superior:
    nodoNumi.setAttribute("href",arrayNodos[i].url);
    nodoNumi.setAttribute("target","_blank");
    document.getElementById("espNodos").appendChild(nodoNumi);
  };
}
