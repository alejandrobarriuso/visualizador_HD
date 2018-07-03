/* LayerSwitcher - Control de capas en la barra lateral */
/* Se crea directamente, ya que aparece o desaparece automáticamente en el momento en el que se crean capas con el atributo:
    - displayInLayerSwitcher: true,
 Además, deberán tener el atributo: displayInLayerSwitcher_base: false, para no añadirse en el selector de mapas base del mapa.
 */
var switcher = new ol.control.LayerSwitcher(
	{	target:$("#espMenuGestionCapas").get(0),
		// displayInLayerSwitcher: function (l) { return false; },
		show_progress:true,
		extent: true,
		trash: true,
		oninfo: function (l) { console.log(l); }
	});


map.addControl(switcher);
