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
function CargarCapa(idCapa,tipo,ruta,origen){
  //Obtener el conjunto de capas ya cargadas, y crear un array con sus títulos:
  var arrayCapasCargadasYa = map.getLayers().getArray();
  var arrayTitulosCapasCargadasYa = [];
  for (var i=0; i<arrayCapasCargadasYa.length; i++){
    var tituloCapaCargadaYai = arrayCapasCargadasYa[i].get('title');
    arrayTitulosCapasCargadasYa.push(tituloCapaCargadaYai);
  }

  //Comprobar que el nombre de la capa que se desea cargar no se encuentra en el array creado anteriormente. Es decir, que esta capa no está ya cargada:
  if (arrayTitulosCapasCargadasYa.indexOf(idCapa) === -1){
    //Caso en el que la capa es nueva: se añade con la función apropiada dependiendo del tipo de servicio que sea:
    if (tipo == "wms") {
      AnadirWMS(ruta,idCapa);
    };
  } else {
    alert("Capa ya cargada");
  }

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
