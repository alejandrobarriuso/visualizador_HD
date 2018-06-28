function CargarTematicas(){

var arrayObjetosTematicas = [
  {
    "id": "arq",
    "nombre": "Arqueología",
    "color_fondo": "green",
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
    "id": "his",
    "nombre": "Historia",
    "color_fondo": "brown",
    "color_letra_borde": "#008A47",
    "capas": [
    ]
  }, {
    "id": "dem",
    "nombre": "Demografía",
    "color_fondo": "yellow",
    "color_letra_borde": "#006DB4",
    "capas": [
    ]
  }, {
    "id": "lin",
    "nombre": "Lingüística",
    "color_fondo": "black",
    "color_letra_borde": "#F3AB00",
    "capas": [
    ]
  }, {
    "id": "eco",
    "nombre": "Economía y Geografía Aplicadas",
    "color_fondo": "blue",
    "color_letra_borde": "#7D3280",
    "capas": [
    ]
  }
];


for (var i=0; i<arrayObjetosTematicas.length; i++){
  var tematicaNumi = document.createElement("div");
    tematicaNumi.innerHTML = '<div class="card-body m-0 p-1" style=""><h4>' + arrayObjetosTematicas[i].nombre.toUpperCase() + '</h4></div>';
    tematicaNumi.setAttribute("class","card m-1 p-0");

    tematicaNumi.setAttribute("style","height:10em;border-radius:0;border-width:0.1em" +
    ";background-color:" + arrayObjetosTematicas[i].color_fondo +
    ";color:" + arrayObjetosTematicas[i].color_letra_borde +
    ";border-color:" + arrayObjetosTematicas[i].color_letra_borde

  );
    document.getElementById("espMenuTematicas").appendChild(tematicaNumi);
};


}
