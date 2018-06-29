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

function CargarTematicas(numMaxTematicas){

  var arrayObjetosTematicas = [
    {
      "id": "Arq",
      "nombre": "Arqueología",
      "color_fondo": "#FFB299",
      "color_letra_borde": "#DF3A2C",
      "capas": [
        {
          "id": "idearq_c14",
          "nombre": "Carbono 14",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_c14"
        },{
          "id": "idearq_cprl",
          "nombre": "Arte rupestre levantino",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_cprl"
        },{
          "id": "idearq_dimp",
          "nombre": "Isótopos",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_dimp"
        }
      ]
    }, {
      "id": "His",
      "nombre": "Historia",
      "color_fondo": "#FFFF99",
      "color_letra_borde": "#F3AB00",
      "capas": [
        {
          "id": "hist1",
          "nombre": "Historia 1",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_c14"
        },{
          "id": "hist2",
          "nombre": "Historia 2",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_cprl"
        }
      ]
    }, {
      "id": "Dem",
      "nombre": "Demografía",
      "color_fondo": "#AAEEC8",
      "color_letra_borde": "#008A47",
      "capas": [
      ]
    }, {
      "id": "Lin",
      "nombre": "Lingüística",
      "color_fondo": "#E9A5E9",
      "color_letra_borde": "#7D3280",
      "capas": [
        {
          "id": "Ling1",
          "nombre": "Lingüística 1",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_c14"
        },{
          "id": "Ling2",
          "nombre": "Lingüística 2",
          "tipo": "wms",
          "ruta": "http://www.idearqueologia.org/idearq/wms?",
          "id_capa": "idearq_cprl"
        }
      ]
    }, {
      "id": "Eco",
      "nombre": "Economía y Geografía Aplicadas",
      "color_fondo": "#B9DAF7",
      "color_letra_borde": "#006DB4",
      "capas": [
      ]
    }
  ];

  for (var i=0; i<Math.min(numMaxTematicas,arrayObjetosTematicas.length); i++){
    //Crear el menú lateral con todas las temáticas del array anterior:
    var tematicaNumi = document.createElement("a");
    tematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].nombre.toUpperCase() + '</h4></div>';
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
      var capaNumjTematicaNumi = document.createElement("div");
      capaNumjTematicaNumi.innerHTML = '<div class="row m-0 p-1" style="height:100%;"><h4 class="col-12 m-0 p-0 align-self-center">' + arrayObjetosTematicas[i].capas[j].nombre.toUpperCase() + '</h4></div>';
      capaNumjTematicaNumi.setAttribute("class","card m-1 p-0");
      capaNumjTematicaNumi.setAttribute("style","height:10em;width:10em;border-radius:0;border-width:0.1em" +
        ";background-color:" + arrayObjetosTematicas[i].color_fondo +
        ";color:" + arrayObjetosTematicas[i].color_letra_borde +
        ";border-color:" + arrayObjetosTematicas[i].color_letra_borde
      );
      //Añadir a cada objeto Temática el submenú que saldrá al clickar sobre él:
      document.getElementById("submenu" + idTematicaNumi).appendChild(capaNumjTematicaNumi);
    };

    //Añadir el objeto Temática al menú lateral:
    tematicaNumi.setAttribute("href","javascript:AparecerSubmenuTematicaNumi('" + idTematicaNumi + "');");
    document.getElementById("espMenuTematicas").appendChild(tematicaNumi);
  };
}

function AparecerSubmenuTematicaNumi(idTematica){
  console.log(idTematica);
  console.log("submenu" + idTematica);
  //Hago aparecer el div del submenú:
  document.getElementById("submenu" + idTematica).style.display = "";
  //Calculo la posición del cuadrado correspondiente a la Temática clickada:
  var cuadradoTematicai = document.getElementById(idTematica);
  var posicionTematicai = cuadradoTematicai.getBoundingClientRect();
  var topTematicai = posicionTematicai.top - 4;
  var leftTematicai = posicionTematicai.left - 4;


  document.getElementById("submenu" + idTematica).style.top = topTematicai + "px";
  document.getElementById("submenu" + idTematica).style.left = leftTematicai + "px";

}
