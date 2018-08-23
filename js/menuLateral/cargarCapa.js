//FUNCIÓN CargarCapa(idCapa,tipo,ruta)
/*
ENTRADAS:
  idCapa: el id de la capa sobre la que se ha clickado, y que se tiene que cargar.
  tipo: de recurso que es la capa sobre la que se ha hecho click.
  ruta: del recurso.
  origen: desde dónde cargo la capa: menuCarga; menuBusqueda, etc.
FUNCIONALIDAD:
  Detecta el tipo de recurso del que se trata, y en función de eso ejecuta una función de carga u otra.
  Además, después de esto ejecuta la función CerrarSubmenus() para cerrar el que estaba abierto.
*/
function CargarCapa(tipo,idCapa,ruta,origen,data,nombreArchivo){
  //Obtener el conjunto de capas ya cargadas, y crear un array con sus títulos:
  var arrayCapasCargadasYa = map.getLayers().getArray();
  console.log(arrayCapasCargadasYa);
  var arrayTitulosCapasCargadasYa = [];

  for (var i=0; i<arrayCapasCargadasYa.length; i++){
    var tituloCapaCargadaYai = arrayCapasCargadasYa[i].get('title');
    arrayTitulosCapasCargadasYa.push(tituloCapaCargadaYai);
  }
  console.log(arrayTitulosCapasCargadasYa);


  //Detectar que tipo de dato vamos a añadir y comprobar que no se ha cargado anteriormente:
  if ((tipo == "wms") && (arrayTitulosCapasCargadasYa.indexOf(idCapa) === -1)) {
    AnadirWMS(ruta,idCapa);
  } else if ((tipo == "wms") && (arrayTitulosCapasCargadasYa.indexOf(idCapa) != -1)) {
    alert("Capa de servicio wms ya cargada");
  } else if ((tipo == "geojson") && (arrayTitulosCapasCargadasYa.indexOf(nombreArchivo) === -1)) {
    AnadirGeojson(data,nombreArchivo);
  } /* else if ((tipo == "geojson") && (arrayTitulosCapasCargadasYa.indexOf(nombreArchivo) != -1)) {
    console.log(nombreArchivo);
    console.log(arrayTitulosCapasCargadasYa);
    console.log(arrayTitulosCapasCargadasYa.indexOf(nombreArchivo));
    alert("Capa de datos externa ya cargada");
  }*/

  //Modificar la disposición de los elementos en la barra lateral:
  if (origen == "menuCarga"){
    CerrarSubmenus();
    VariarPosiciones('temCV_busCV_gesAX');
  } else if (origen == "menuBusqueda"){
    VariarPosiciones('temCV_busAX_gesAX');
  }

}

//FUNCIÓN CerrarSubmenus()
/*
FUNCIONALIDAD:
  - Cierra cualquier submenú que estuviera abierto.
  - En función del número de capas que estén cargadas (comparando con el número de capas base ya cargadas); llama a la función para construir el menú inferior o superior.
  - Elimina el evento onclick fuera de los submenús para eliminarlos, ya que estos ya se han eliminado.
*/
function CerrarSubmenus(){
  //Cerrar cualquier submenú abierto:
  $("[id*=submenutematica]").hide();

  //Eliminar el control de click fuera del submenú para cerrarlo; porque ya se ha cerrado:
  $("html").unbind('click');
  CargarTematicas(idioma);

}
