//FUNCIÓN CargarTematicas(numMaxTematicas,idioma)
/*
ENTRADAS:
  numMaxTematicas: número máximo de temáticas a mostrar.
  idioma: variable que habrá cogido su valor al clickar sobre los botones de selección de idioma (archivo ponerIdioma.js). Por defecto: 'es'.
FUNCIONALIDAD:
  Crea un cuadrado por cada temática y un submenú asociado, que sólo se mostrará cuando se ejecute la función AparecerSubmenuTematicaNumi(idTematica,colorFondo,colorLetraBorde),
  a la que se llama desde los propios elementos creados aquí.
*/

function CargarTematicas(numMaxTematicas,idioma){
  //Primero elimina todas las temáticas o submenús que pudieran existir (antes de crear las nuevas):
  //Muy importante para evitar duplicados cada vez que se recrea el menú:
  $("[id*=tematica]").remove();
  $("[id*=submenutematica]").remove();

  //Crear un cuadrado por cada temática, y un submenú asociado:
  for (var i=0; i<Math.min(numMaxTematicas,arrayObjetosTematicas.length); i++){
    var tematicaNumi = document.createElement("a");
    if (idioma == 'en'){
      tematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].nombre_en.toUpperCase() + '</h4></div>';
    } else {
      tematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].nombre.toUpperCase() + '</h4></div>';
    }
    var idTematicaNumi = "tematica" + arrayObjetosTematicas[i].id;
    tematicaNumi.setAttribute("id",idTematicaNumi);
    tematicaNumi.setAttribute("class","card m-1 p-0");
    tematicaNumi.setAttribute("style","position:relative;height:10em;width:10em;border-radius:0;border-width:0.1em" +
      ";background-color:" + arrayObjetosTematicas[i].color_fondo +
      ";color:" + arrayObjetosTematicas[i].color_letra_borde +
      ";border-color:" + arrayObjetosTematicas[i].color_letra_borde
    );

    //Crear el submenú que se abrirá en cada temática (con los datos del array anterior):
    var submenuTematicaNumi = document.createElement("div");
    submenuTematicaNumi.setAttribute("class","card-deck m-0 p-0");
    submenuTematicaNumi.setAttribute("id","submenu" + idTematicaNumi);
    submenuTematicaNumi.setAttribute("style","position:fixed;z-index:20200;background-color:#f2f2f2;display:none;");

    document.getElementById("espMenuTematicas").appendChild(submenuTematicaNumi);
    for (var j=0; j<arrayObjetosTematicas[i].capas.length; j++){
      var capaNumjTematicaNumi = document.createElement("a");
      if (idioma == 'en'){
        capaNumjTematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].capas[j].nombre_en.toUpperCase() + '</h4></div>';
      } else {
        capaNumjTematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].capas[j].nombre.toUpperCase() + '</h4></div>';
      }
      capaNumjTematicaNumi.setAttribute("class","card m-1 p-0");
      var idCapaNumj = "capa" + arrayObjetosTematicas[i].capas[j].id;
      capaNumjTematicaNumi.setAttribute("id",idCapaNumj);
      capaNumjTematicaNumi.setAttribute("style","height:10em;width:10em;border-radius:0;border-width:0.1em" +
        ";background-color:" + arrayObjetosTematicas[i].color_fondo +
        ";color:" + arrayObjetosTematicas[i].color_letra_borde +
        ";border-color:" + arrayObjetosTematicas[i].color_letra_borde
      );
      capaNumjTematicaNumi.setAttribute("onmouseover","document.getElementById('" + idCapaNumj + "').style.backgroundColor='" + arrayObjetosTematicas[i].color_letra_borde + "';document.getElementById('" + idCapaNumj + "').style.color='" + arrayObjetosTematicas[i].color_fondo + "';document.getElementById('" + idCapaNumj + "').style.borderColor='" + arrayObjetosTematicas[i].color_fondo + "'");
      capaNumjTematicaNumi.setAttribute("onmouseout","document.getElementById('" + idCapaNumj + "').style.backgroundColor='" + arrayObjetosTematicas[i].color_fondo + "';document.getElementById('" + idCapaNumj + "').style.color='" + arrayObjetosTematicas[i].color_letra_borde + "';document.getElementById('" + idCapaNumj + "').style.borderColor='" + arrayObjetosTematicas[i].color_letra_borde + "'");

      capaNumjTematicaNumi.setAttribute("href","javascript:CargarCapaNumjTematicaNumi('" + arrayObjetosTematicas[i].capas[j].id + "','" + arrayObjetosTematicas[i].capas[j].tipo + "','" + arrayObjetosTematicas[i].capas[j].ruta + "');");

      //Añadir a cada objeto Temática el submenú que saldrá al clickar sobre él:
      document.getElementById("submenu" + idTematicaNumi).appendChild(capaNumjTematicaNumi);

    };
    //Añadir el objeto Temática al menú lateral:
    tematicaNumi.setAttribute("href","javascript:AparecerSubmenuTematicaNumi('" + idTematicaNumi + "','" + arrayObjetosTematicas[i].color_fondo + "','" + arrayObjetosTematicas[i].color_letra_borde + "');");
    document.getElementById("espMenuTematicas").appendChild(tematicaNumi);
  };
}

//FUNCIÓN AparecerSubmenuTematicaNumi(idTematica,colorFondo,colorLetraBorde)
/*
ENTRADAS:
  idTematica: el id de la temática sobre la que se está haciendo click.
  colorFondo: el color de fondo que habrá que asignar a letras y bordes (porque se invierten colores al clickar).
  colorLetraBorde: el color de fondo que habrá que asignar al fondo (porque se invierten colores al clickar).
FUNCIONALIDAD:
  - Hace aparecer el div del submenú ya creado en la función anterior, en el momento en el que se hace click en la temática correspondiente;
  - Crea los eventos onclick (tanto dentro como fuera del submenú) y su comportamiento;
  - Modifica el estilo de todos los cuadros de temáticas.
*/
function AparecerSubmenuTematicaNumi(idTematica,colorFondo,colorLetraBorde){
  console.log(idTematica);
  var idSubmenuTematicaNumi = "submenu" + idTematica;
  //Hago aparecer el div del submenú:
  document.getElementById(idSubmenuTematicaNumi).style.display = "";
  //Calculo la posición del cuadrado correspondiente a la Temática clickada:
  var cuadradoTematicai = document.getElementById(idTematica);
  var posicionTematicai = cuadradoTematicai.getBoundingClientRect();
  console.log(posicionTematicai);
  var topTematicai = posicionTematicai.top - 4;
  var leftTematicai = posicionTematicai.left + posicionTematicai.width  + 4;

  document.getElementById(idSubmenuTematicaNumi).style.top = topTematicai + "px";
  document.getElementById(idSubmenuTematicaNumi).style.left = leftTematicai + "px";

  // Control del evento click una vez se ha abierto el submenú:
  //  - Cualquier click fuera del mismo lo cerrará:
  $("html").click(function() {
    CerrarSubmenus();
  });
  //  - Un click dentro del mismo no lo cerrará (de forma que llevará al href correspondiente a cada capa; definido anteriormente):
  $('#' + idSubmenuTematicaNumi).click(function (e) {
    e.stopPropagation();
  });

  //Oscurecer el resto de temáticas:
  $("[id*=tematica]").css({'background-color': '#d8d8d8', 'color':'#b5b5b5', 'border-color':'#b5b5b5'});

  //Mantener el color de la clickada:
  $("#"+idTematica).css({'background-color': colorLetraBorde, 'color': colorFondo, 'border-color': colorFondo});
}

//FUNCIÓN CargarCapaNumjTematicaNumi(idCapa,tipo,ruta)
/*
ENTRADAS:
  idCapa: el id de la capa sobre la que se ha clickado, y que se tiene que cargar.
  tipo: de recurso que es la capa sobre la que se ha hecho click.
  ruta: del recurso.
FUNCIONALIDAD:
  Detecta el tipo de recurso del que se trata, y en función de eso ejecuta una función de carga u otra.
  Además, después de esto ejecuta la función CerrarSubmenus() para cerrar el que estaba abierto.
*/
function CargarCapaNumjTematicaNumi(idCapa,tipo,ruta){
  //Obtener el conjunto de capas ya cargadas, y crear un array con sus títulos:
  var arrayCapasCargadasYa = map.getLayers().getArray();
  var arrayTitulosCapasCargadasYa = [];
  for (var i=0; i<arrayCapasCargadasYa.length; i++){
    var tituloCapaCargadaYai = arrayCapasCargadasYa[i].get('title');
    arrayTitulosCapasCargadasYa.push(tituloCapaCargadaYai);
  }
  console.log(arrayTitulosCapasCargadasYa);

  //Comprobar que el nombre de la capa que se desea cargar no se encuentra en el array creado anteriormente. Es decir, que esta capa no está ya cargada:
  if (arrayTitulosCapasCargadasYa.indexOf(idCapa) === -1){
    //Caso en el que la capa es nueva: se añade con la función apropiada dependiendo del tipo de servicio que sea:
    if (tipo == "wms") {
      AnadirWMS(ruta,idCapa);
    };
  } else {
    alert("Capa ya cargada");
  }
  CerrarSubmenus();
  variarPosiciones('capas_cargadas');
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
}
