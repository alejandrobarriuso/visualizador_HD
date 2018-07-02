//FUNCIÓN CargarTematicas(numMaxTematicas)
/*
ENTRADAS:
  numMaxTematicas: número máximo de temáticas a mostrar.
SALIDAS:
	Dependiendo del valor de la variable "service_or_dataset", la salida será:
		- El resultado de la función obten_campos_dataset, o:
		- El resultado de la función obten_campos_service.
		(ver la descripción de estas dos funciones en sus respectivos archivos).
FUNCIONALIDAD:
	Esta función realiza la operación getrecords sobre el servicio csw indicado anteriormente en la variable csw (el servicio
		completo o algún servicio virtual), filtrando el resultado, ofreciendo servicios o datasets, en función del valor de la variable de entrada.
	Por último, con el número de resultados, el filtro y el esquema de salida, se ejecuta la petición, con una función anidada, a
		partir del método "csw.GetRecords". Esta función tiene como:
			ENTRADAS:
				- La posición del primer recurso a mostrar en el resultado. Lo habitual será 1.
				- El número de resultados que se quiere mostrar.
				- El filtro a aplicar en la consulta (creado anteriormente).
				- El esquema de salida para los datos (creado como variable anteriormente).
			SALIDAS:
				Dependiendo del valor de la variable "service_or_dataset", la salida será:
					- El resultado de la función obten_campos_dataset, o:
					- El resultado de la función obten_campos_service.
					(ver la descripción de estas dos funciones en sus respectivos archivos).
*/

var idioma = 'es';

function CargarTematicas(numMaxTematicas,idioma){
  //Primero elimina todas las temáticas o submenús que pudieran existir (antes de crear las nuevas):
  //Parte muy importante para evitar duplicados cada vez que se recrea el menú:
  $("[id*=tematica]").remove();
  $("[id*=submenutematica]").remove();

  //Array de temáticas con sus capas a cargar:
  var arrayObjetosTematicas = [
    {
      "id": "Arq",
      "nombre": "Arqueología",
      "nombre_en": "Archeology",
      "color_fondo": "#FFB299",
      "color_letra_borde": "#DF3A2C",
      "capas": [
        {
          "nombre": "Carbono 14",
          "nombre_en": "Radiocarbon data",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id": "idearq_c14"
        },{
          "nombre": "Arte rupestre levantino",
          "nombre_en": "Levantine cave art sets",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id": "idearq_cprl"
        },{
          "nombre": "Isótopos",
          "nombre_en": "Isotopes",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id": "idearq_dimp"
        }
      ]
    }, {
      "id": "His",
      "nombre": "Historia",
      "nombre_en": "History",
      "color_fondo": "#FFFF99",
      "color_letra_borde": "#F3AB00",
      "capas": [
        {
          "nombre": "Historia 1",
          "nombre_en": "History 1",
          "tipo": "wms",
          "ruta": "",
          "id": "idearq_c14"
        },{
          "nombre": "Historia 2",
          "nombre_en": "History 2",
          "tipo": "wms",
          "ruta": "",
          "id": "idearq_cprl"
        }
      ]
    }, {
      "id": "Dem",
      "nombre": "Demografía",
      "nombre_en": "Demography",
      "color_fondo": "#AAEEC8",
      "color_letra_borde": "#008A47",
      "capas": [
      ]
    }, {
      "id": "Lin",
      "nombre": "Lingüística",
      "nombre_en": "Linguistics",
      "color_fondo": "#E9A5E9",
      "color_letra_borde": "#7D3280",
      "capas": [
        {
          "nombre": "Lingüística 1",
          "nombre_en": "Linguistics 1",
          "tipo": "wms",
          "ruta": "",
          "id": "idearq_c14"
        },{
          "nombre": "Lingüística 2",
          "nombre_en": "Linguistics 2",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id": "idearq_cprl"
        }
      ]
    }, {
      "id": "Eco",
      "nombre": "Economía y Geografía Aplicadas",
      "nombre_en": "Applied Economy and Geography",
      "color_fondo": "#B9DAF7",
      "color_letra_borde": "#006DB4",
      "capas": [
      ]
    }
  ];

  for (var i=0; i<Math.min(numMaxTematicas,arrayObjetosTematicas.length); i++){
    //Crear el menú lateral con todas las temáticas del array anterior:
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
      capaNumjTematicaNumi.setAttribute("style","height:10em;width:10em;border-radius:0;border-width:0.1em" +
        ";background-color:" + arrayObjetosTematicas[i].color_fondo +
        ";color:" + arrayObjetosTematicas[i].color_letra_borde +
        ";border-color:" + arrayObjetosTematicas[i].color_letra_borde
      );

      capaNumjTematicaNumi.setAttribute("href","javascript:CargarCapaNumjTematicaNumi('" + arrayObjetosTematicas[i].capas[j].id + "','" + arrayObjetosTematicas[i].capas[j].tipo + "','" + arrayObjetosTematicas[i].capas[j].ruta + "');");
      console.log(arrayObjetosTematicas[i].capas[j].id);
      //Añadir a cada objeto Temática el submenú que saldrá al clickar sobre él:
      document.getElementById("submenu" + idTematicaNumi).appendChild(capaNumjTematicaNumi);
    };


    //Añadir el objeto Temática al menú lateral:
    tematicaNumi.setAttribute("href","javascript:AparecerSubmenuTematicaNumi('" + idTematicaNumi + "','" + arrayObjetosTematicas[i].color_fondo + "','" + arrayObjetosTematicas[i].color_letra_borde + "');");
    document.getElementById("espMenuTematicas").appendChild(tematicaNumi);
  };
}

function AparecerSubmenuTematicaNumi(idTematica,colorFondo,colorLetraBorde){
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

  // Una vez ha aparecido el submenú:
  //  - Cualquier click fuera del mismo lo cerrará.
  //  - Un click dentro del mismo no lo cerrará (de forma que llevará al href correspondiente a cada capa; definido anteriormente).
  $("html").click(function() {
    CerrarSubmenus();
  });
  $('#' + idSubmenuTematicaNumi).click(function (e) {
    e.stopPropagation();
  });

  //Oscurecer el resto de temáticas:
  $("[id*=tematica]").css({'background-color': '#d8d8d8', 'color':'#b5b5b5', 'border-color':'#b5b5b5'});
  console.log(idTematica);

  $("#"+idTematica).css({'background-color': colorLetraBorde, 'color': colorFondo});
}

function CargarCapaNumjTematicaNumi(idCapa,tipo,ruta){
  if (tipo == "wms") {
    AnadirWMS(ruta,idCapa);
  };
  CerrarSubmenus();
}

function CerrarSubmenus(){
  $("[id*=submenutematica]").hide();
  CargarTematicas(8,idioma);

}
