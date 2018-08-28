var divLeyenda = $("#leyendaCapas");
var tablaLeyenda = $("<table>").addClass("tabla_leyenda table").attr("id","tabla_leyenda").appendTo(divLeyenda);
var tituloLeyenda = $("<thead>").html("Leyenda").appendTo(tablaLeyenda);
var cuerpoLeyenda = $("<tbody>").appendTo(tablaLeyenda);

function AñadirALeyenda(capaCargada,tipoOrigen){
  $("#leyendaCapas").css({'display':'flex'});
  console.log(capaCargada);
  console.log(capaCargada.N.source);

  var leyendaCapai = $("<tr>").addClass("m-0 mt-1 p-1")
    .attr("id","leyenda_" + capaCargada.N.title)
    .html(capaCargada.N.titulo_es);
  $("<br>").appendTo(leyendaCapai);
  var imagenLeyenda = $("<img>").attr("src",capaCargada.N.leyenda).appendTo(leyendaCapai);
  leyendaCapai.appendTo(cuerpoLeyenda);
};
