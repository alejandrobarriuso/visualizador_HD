 /* ------------------------- CONTROL DE CAPAS CARGADAS ---------------------------------- /*
/* LayerSwitcher - Control de capas en la barra lateral */
/* Se crea directamente, ya que aparece o desaparece automáticamente en el momento en el que se crean capas con el atributo:
    - displayInLayerSwitcher: true,

 	 Se mostrarán las capas con displayInLayerSwitcher: true,
*/

 //BASADO EN LA SIGUIENTE FUENTE (BASED ON THE FOLLOWING):

 /**
  * ol-ext - A set of cool extensions for OpenLayers (ol) in node modules structure
  * @description ol3,openlayers,popup,menu,symbol,renderer,filter,canvas,interaction,split,statistic,charts,pie,LayerSwitcher,toolbar,animation
  * @version v2.0.4
  * @author Jean-Marc Viglino
  * @see https://github.com/Viglino/ol-ext#,
  * @license BSD-3-Clause
  */

 /*	Copyright (c) 2015 Jean-Marc VIGLINO,
 	released under the CeCILL-B license (French BSD license)
 	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
 */
 /**
  * @classdesc OpenLayers 3 Layer Switcher Control.
  * @require jQuery
  *
  * @constructor
  * @extends {ol.control.Control}
  * @param {Object=} options
  *	@param {function} displayInLayerSwitcher function that takes a layer and return a boolean if the layer is displayed in the switcher, default test the displayInLayerSwitcher layer attribute
  *	@param {boolean} options.show_progress show a progress bar on tile layers, default false
  *	@param {boolean} mouseover show the panel on mouseover, default false
  *	@param {boolean} reordering allow layer reordering, default true
  *	@param {boolean} trash add a trash button to delete the layer, default false
  *	@param {function} oninfo callback on click on info button, if none no info button is shown
  *	@param {boolean} extent add an extent button to zoom to the extent of the layer
  *	@param {function} onextent callback when click on extent, default fits view to extent
  *
  * Layers attributes that control the switcher
  *	- allwaysOnTop {boolean} true to force layer stay on top of the others while reordering, default false
  *	- displayInLayerSwitcher {boolean} display in switcher, default true
  *	- noSwitcherDelete {boolean} to prevent layer deletion (w. trash option = true), default false
  */

//FUNCIONAMIENTO GLOBAL
 ol.control.LayerSwitcher = function(options)
 {	options = options || {};
 	var self = this;
 	this.dcount = 0;
 	this.show_progress = options.show_progress;
 	this.oninfo = (typeof (options.oninfo) == "function" ? options.oninfo: null);
 	this.onextent = (typeof (options.onextent) == "function" ? options.onextent: null);
 	this.hasextent = options.extent || options.onextent;
 	this.hastrash = options.trash;
 	this.reordering = (options.reordering!==false);
 	// displayInLayerSwitcher
 	if (typeof(options.displayInLayerSwitcher) === 'function') {
 		this.displayInLayerSwitcher = options.displayInLayerSwitcher;
 	}
 	var element;
 	if (options.target)
 	{	element = $("<div>").addClass(options.switcherClass || "ol-layerswitcher");
 	}
 	else
 	{	element = $("<div>").addClass((options.switcherClass || 'ol-layerswitcher') +' ol-unselectable ol-control ol-collapsed');
 		this.button = $("<button>")
 					.attr('type','button')
 					.on("touchstart", function(e)
 					{	element.toggleClass("ol-collapsed");
 						e.preventDefault();
 						self.overflow();
 					})
 					.click (function()
 					{	element.toggleClass("ol-forceopen").addClass("ol-collapsed");
 						self.overflow();
 					})
 					.appendTo(element);
 		if (options.mouseover)
 		{	$(element).mouseleave (function(){ element.addClass("ol-collapsed"); })
 				.mouseover(function(){ element.removeClass("ol-collapsed"); });
 		}
 		this.topv = $("<div>").addClass("ol-switchertopdiv")
 			.click(function(){ self.overflow("+50%"); })
 			.appendTo(element);
 		this.botv = $("<div>").addClass("ol-switcherbottomdiv")
 			.click(function(){ self.overflow("-50%"); })
 			.appendTo(element);
 	}
 	this.panel_ = $("<ul>").addClass("panel")
 				.appendTo(element);
 	this.panel_.on ('mousewheel DOMMouseScroll onmousewheel', function(e)
 		{	if (self.overflow(Math.max(-1, Math.min(1, (e.originalEvent.wheelDelta || -e.originalEvent.detail)))))
 			{	e.stopPropagation();
 				e.preventDefault();
 			}
 		});
 	this.header_ = $("<li>").addClass("ol-header").appendTo(this.panel_);
 	ol.control.Control.call(this,
 	{	element: element.get(0),
 		target: options.target
 	});
 	// Enable jQuery dataTransfert
 	// $.event.props.push('dataTransfer');
 	this.target = options.target;
 };
 ol.inherits(ol.control.LayerSwitcher, ol.control.Control);
 /** List of tips for internationalization purposes
 */
 ol.control.LayerSwitcher.prototype.tip =
 {	up: "up/down",
 	down: "down",
 	info: "informations...",
 	extent: "zoom to extent",
 	trash: "Eliminar capa",
 	plus: "expand/shrink"
 };
 /** Test if a layer should be displayed in the switcher
  * @param {ol.layer} layer
  * @return {boolean} true if the layer is displayed
  */
 ol.control.LayerSwitcher.prototype.displayInLayerSwitcher = function(layer) {
 	return (layer.get("displayInLayerSwitcher")!==false);
 };
 /**
  * Set the map instance the control is associated with.
  * @param {_ol_Map_} map The map instance.
  */
 ol.control.LayerSwitcher.prototype.setMap = function(map)
 {   ol.control.Control.prototype.setMap.call(this, map);
 	this.drawPanel();
 	if (this.map_)
 	{	this.map_.getLayerGroup().un('change', this.drawPanel, this);
 		this.map_.un('moveend', this.viewChange, this);
 		this.map_.un('change:size', this.overflow, this);
 	}
 	this.map_ = map;
 	// Get change (new layer added or removed)
 	if (map)
 	{	map.getLayerGroup().on('change', this.drawPanel, this);
 		map.on('moveend', this.viewChange, this);
 		map.on('change:size', this.overflow, this);
 	}
 };
 /** Add a custom header
 */
 ol.control.LayerSwitcher.prototype.setHeader = function(html)
 {	this.header_.html(html);
 };
 /** Calculate overflow and add scrolls
 *	@param {Number} dir scroll direction -1|0|1|'+50%'|'-50%'
 */
 ol.control.LayerSwitcher.prototype.overflow = function(dir)
 {
 	if (this.button)
 	{	// Nothing to show
 		if (this.panel_.css('display')=='none')
 		{	$(this.element).css("height", "auto");
 			return;
 		}
 		// Calculate offset
 		var h = $(this.element).outerHeight();
 		var hp = this.panel_.outerHeight();
 		var dh = this.button.position().top + this.button.outerHeight(true);
 		var top = this.panel_.position().top-dh;
 		if (hp > h-dh)
 		{	// Bug IE: need to have an height defined
 			$(this.element).css("height", "100%");
 			switch (dir)
 			{	case 1: top += 2*$("li.visible .li-content",this.panel_).height(); break;
 				case -1: top -= 2*$("li.visible .li-content",this.panel_).height(); break;
 				case "+50%": top += Math.round(h/2); break;
 				case "-50%": top -= Math.round(h/2); break;
 				default: break;
 			}
 			// Scroll div
 			if (top+hp <= h-3*dh/2)
 			{	top = h-3*dh/2-hp;
 				this.botv.hide();
 			}
 			else
 			{	this.botv.css("display","");//show();
 			}
 			if (top >= 0)
 			{	top = 0;
 				this.topv.hide();
 			}
 			else
 			{	this.topv.css("display","");
 			}
 			// Scroll ?
 			this.panel_.css('top', top+"px");
 			return true;
 		}
 		else
 		{	$(this.element).css("height", "auto");
 			this.panel_.css('top', "0px");
 			this.botv.hide();
 			this.topv.hide();
 			return false;
 		}
 	}
 	else return false;
 };
 /**
  * On view change hide layer depending on resolution / extent
  * @param {ol.event} map The map instance.
  * @private
  */
 ol.control.LayerSwitcher.prototype.viewChange = function(e)
 {
 	var map = this.map_;
 	var res = this.map_.getView().getResolution();
 	$("li", this.panel_).each(function()
 	{	var l = $(this).data('layer');
 		if (l)
 		{	if (l.getMaxResolution()<=res || l.getMinResolution()>=res) $(this).addClass("ol-layer-hidden");
 			else
 			{	var ex0 = l.getExtent();
 				if (ex0)
 				{	var ex = map.getView().calculateExtent(map.getSize());
 					if (!ol.extent.intersects(ex, ex0))
 					{	$(this).addClass("ol-layer-hidden");
 					}
 					else $(this).removeClass("ol-layer-hidden");
 				}
 				else $(this).removeClass("ol-layer-hidden");
 			}
 		}
 	});
 };
 /**
  *	Draw the panel control (prevent multiple draw due to layers manipulation on the map with a delay function)
  */
 ol.control.LayerSwitcher.prototype.drawPanel = function(e)
 {
 	if (!this.getMap()) return;
 	var self = this;
 	// Multiple event simultaneously / draw once => put drawing in the event queue
 	this.dcount++;
 	setTimeout (function(){ self.drawPanel_(); }, 0);
 };
 /** Delayed draw panel control
  * @private
  */
 ol.control.LayerSwitcher.prototype.drawPanel_ = function(e)
 {	if (--this.dcount || this.dragging_) return;
 	$("li", this.panel_).not(".ol-header").remove();
 	this.drawList (this.panel_, this.getMap().getLayers());
 };
 /** Change layer visibility according to the baselayer option
  * @param {ol.layer}
  * @param {Array<ol.layer>} related layers
  */
 ol.control.LayerSwitcher.prototype.switchLayerVisibility = function(l, layers)
 {
   console.log(l);
 	if (!l.get('baseLayer')) l.setVisible(!l.getVisible());
 	else
 	{	if (!l.getVisible()) l.setVisible(true);
 		layers.forEach(function(li)
 		{	if (l!==li && li.get('baseLayer') && li.getVisible()) li.setVisible(false);
 		});
 	}
 };
 /** Check if layer is on the map (depending on zoom and extent)
  * @param {ol.layer}
  * @return {boolean}
  */
 ol.control.LayerSwitcher.prototype.testLayerVisibility = function(layer)
 {
 	if (this.map_)
 	{	var res = this.map_.getView().getResolution();
 		if (layer.getMaxResolution()<=res || layer.getMinResolution()>=res) return false;
 		else
 		{	var ex0 = layer.getExtent();
 			if (ex0)
 			{	var ex = this.map_.getView().calculateExtent(this.map_.getSize());
 				return ol.extent.intersects(ex, ex0);
 			}
 			return true;
 		}
 	}
 	return true;
 };
 /** Start ordering the list
 *	@param {event} e drag event
 *	@private
 */
 ol.control.LayerSwitcher.prototype.dragOrdering_ = function(e)
 {	var drag = e.data;
 	switch (e.type)
 	{	// Start ordering
 		case 'mousedown':
 		case 'touchstart':
 		{	e.stopPropagation();
 			e.preventDefault();
 			var pageY = e.pageY
 					|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageY)
 					|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageY);
 			drag =
 				{	self: drag.self,
 					elt: $(e.currentTarget).closest("li"),
 					start: true,
 					element: drag.self.element,
 					panel: drag.self.panel_,
 					pageY: pageY
 				};
 			drag.elt.parent().addClass('drag');
 			$(document).on("mouseup mousemove touchend touchcancel touchmove", drag, drag.self.dragOrdering_);
 			break;
 		}
 		// Stop ordering
 		case 'touchcancel':
 		case 'touchend':
 		case 'mouseup':
 		{	if (drag.target)
 			{	// Get drag on parent
 				var drop = drag.layer;
 				var target = drag.target;
 				if (drop && target)
 				{	var collection ;
 					if (drag.group) collection = drag.group.getLayers();
 					else collection = drag.self.getMap().getLayers();
 					var layers = collection.getArray();
 					// Switch layers
 					for (var i=0; i<layers.length; i++)
 					{	if (layers[i]==drop)
 						{	collection.removeAt (i);
 							break;
 						}
 					}
 					for (var j=0; j<layers.length; j++)
 					{	if (layers[j]==target)
 						{	if (i>j) collection.insertAt (j,drop);
 							else collection.insertAt (j+1,drop);
 							break;
 						}
 					}
 				}
 			}
 			$("li",drag.elt.parent()).removeClass("dropover dropover-after dropover-before");
 			drag.elt.removeClass("drag");
 			drag.elt.parent().removeClass("drag");
 			$(drag.element).removeClass('drag');
 			if (drag.div) drag.div.remove();
 			$(document).off("mouseup mousemove touchend touchcancel touchmove", drag.self.dragOrdering_);
 			break;
 		}
 		// Ordering
 		case 'mousemove':
 		case 'touchmove':
 		{	// First drag (more than 2 px) => show drag element (ghost)
 			var pageY = e.pageY
 					|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageY)
 					|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageY);
 			if (drag.start && Math.abs(drag.pageY - pageY) > 2)
 			{	drag.start = false;
 				drag.elt.addClass("drag");
 				drag.layer = drag.elt.data('layer');
 				drag.target = false;
 				drag.group = drag.elt.parent().parent().data('layer');
 				// Ghost div
 				drag.div = $("<li>").appendTo(drag.panel);
 				drag.div.css ({ position: "absolute", "z-index":10000, left:drag.elt.position().left, opacity:0.5 })
 						.html($(drag.elt).html())
 						.addClass("ol-dragover")
 						.width(drag.elt.outerWidth())
 						.height(drag.elt.height());
 				$(drag.element).addClass('drag');
 			}
 			if (!drag.start)
 			{	e.preventDefault();
 				e.stopPropagation();
 				// Ghost div
 				drag.div.css ({ top:pageY - drag.panel.offset().top + drag.panel.scrollTop() +5 });
 				var li;
 				if (!e.originalEvent.touches) li = $(e.target);
 				else li = $(document.elementFromPoint(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY));
 				if (li.hasClass("ol-switcherbottomdiv"))
 				{	drag.self.overflow(-1);
 				}
 				else if (li.hasClass("ol-switchertopdiv"))
 				{	drag.self.overflow(1);
 				}
 				if (!li.is("li")) li = li.closest("li");
 				if (!li.hasClass('dropover')) $("li", drag.elt.parent()).removeClass("dropover dropover-after dropover-before");
 				if (li.parent().hasClass('drag') && li.get(0) !== drag.elt.get(0))
 				{	var target = li.data("layer");
 					// Don't mix layer level
 					if (target && !target.get("allwaysOnTop") == !drag.layer.get("allwaysOnTop"))
 					{	li.addClass("dropover");
 						li.addClass((drag.elt.position().top < li.position().top)?"dropover-after":"dropover-before");
 						drag.target = target;
 					}
 					else
 					{	drag.target = false;
 					}
 					drag.div.show();
 				}
 				else
 				{	drag.target = false;
 					if (li.get(0) === drag.elt.get(0)) drag.div.hide();
 					else drag.div.show();
 				}
 				if (!drag.target) drag.div.addClass("forbidden");
 				else drag.div.removeClass("forbidden");
 			}
 			break;
 		}
 		default: break;
 	}
 };
 /** Change opacity on drag
 *	@param {event} e drag event
 *	@private
 */
 ol.control.LayerSwitcher.prototype.dragOpacity_ = function(e)
 {	var drag = e.data;
 	switch (e.type)
 	{	// Start opacity
 		case 'mousedown':
 		case 'touchstart':
 		{	e.stopPropagation();
 			e.preventDefault();
 			drag.start = e.pageX
 					|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX)
 					|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
 			drag.elt = $(e.target);
 			drag.layer = drag.elt.closest("ul").closest("li").data('layer')
 			drag.self.dragging_ = true;
 			$(document).on("mouseup touchend mousemove touchmove touchcancel", drag, drag.self.dragOpacity_);
 			break;
 		}
 		// Stop opacity
 		case 'touchcancel':
 		case 'touchend':
 		case 'mouseup':
 		{	$(document).off("mouseup touchend mousemove touchmove touchcancel", drag.self.dragOpacity_);
 			drag.layer.setOpacity(drag.opacity);
 			drag.elt.parent().next().text(Math.round(drag.opacity*100));
 			drag.self.dragging_ = false;
 			drag = false;
 			break;
 		}
 		// Move opcaity
 		default:
 		{	var x = e.pageX
 				|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX)
 				|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
 			var dx = Math.max ( 0, Math.min( 1, (x - drag.elt.parent().offset().left) / drag.elt.parent().width() ));
 			drag.elt.css("left", (dx*100)+"%");
 			drag.elt.parent().next().text(Math.round(drag.opacity*100));
 			drag.opacity = dx;
 			drag.layer.setOpacity(dx);
 			break;
 		}
 	}
 }
 /** Render a list of layer
  * @param {elt} element to render
  * @layers {Array{ol.layer}} list of layer to show
  * @api stable
  */
 ol.control.LayerSwitcher.prototype.drawList = function(ul, collection)
 {	var self = this;
 	var layers = collection.getArray();
 	var setVisibility = function(e)
 	{	e.stopPropagation();
 		e.preventDefault();
 		var l = $(this).parent().parent().data("layer");
 		self.switchLayerVisibility(l,collection);
 	};
 	function moveLayer (l, layers, inc)
 	{
 		for (var i=0; i<layers.getLength(); i++)
 		{	if (layers.item(i) === l)
 			{	layers.remove(l);
 				layers.insertAt(i+inc, l);
 				return true;
 			}
 			if (layers.item(i).getLayers && moveLayer (l, layers.item(i).getLayers(), inc)) return true;
 		}
 		return false;
 	};
 	function moveLayerUp(e)
 	{	e.stopPropagation();
 		e.preventDefault();
 		moveLayer($(this).closest('li').data("layer"), self.map_.getLayers(), +1);
 	};
 	function moveLayerDown(e)
 	{	e.stopPropagation();
 		e.preventDefault();
 		moveLayer($(this).closest('li').data("layer"), self.map_.getLayers(), -1);
 	};
 	function onInfo(e)
 	{	e.stopPropagation();
 		e.preventDefault();
		//Modificado para aparecer el div con info:
		$(this).closest('ul').closest('li').children('.div_info_capa').css({'display': 'block'});
 	};
 	function zoomExtent(e)
 	{	e.stopPropagation();
 		e.preventDefault();
 		if (self.onextent) self.onextent($(this).closest('ul').closest('li').data("layer"));
 		//Modificado para que tenga en cuenta el ancho de la barra lateral izquierda:
 		else self.map_.getView().fit ($(this).closest('ul').closest('li').data("layer").getExtent(), {size:self.map_.getSize(),padding:[10,10,10,anchoSidebar]});
 	};
 	function removeLayer(e)
 	{	e.stopPropagation();
 		e.preventDefault();
 		var li = $(this).closest("ul").parent();
 		if (li.data("layer"))
 		{	li.data("layer").getLayers().remove($(this).closest('li').data("layer"));
 			if (li.data("layer").getLayers().getLength()==0 && !li.data("layer").get('noSwitcherDelete'))
 			{	removeLayer.call($(".layerTrash", li), e);

 			}
 		}
 		else self.map_.removeLayer($(this).closest('li').data("layer"));

    //CONTROL PARA QUITAR DE LA LEYENDA LA FILA CORRESPONDIENTE A LA CAPA QUE SE ESTÁ ELIMINANDO:
    var nombreFilaLeyendaABorrar = "#leyenda_" + $(this).closest('li').data("layer").N.title;
    $(nombreFilaLeyendaABorrar).remove();

    //CONTROL PARA EL CASO DE QUE LA CAPA QUE SE ELIMINA ERA LA ÚLTIMA Y ÚNICA VISIBLE:
    //Calcular el número de capas cargadas:
    var numeroMapasTotalCargados = map.getLayers().N.length;
    //Si hay alguna cargada (a parte de los mapa base): 1º se reconfigura la disposición de la barra lateral; 2º se oculta la leyenda vacía.
    if (numeroMapasTotalCargados == numeroMapasBaseCargados){
      VariarPosiciones("temAX_busCV_gesCX");
      $("#leyendaCapas").css({'display':'none'});
    }
 	};
 	// Add the layer list
 	for (var i=layers.length-1; i>=0; i--)
 	{	var layer = layers[i];
 		if (!self.displayInLayerSwitcher(layer)) continue;
 		var id_li = 'control_' + layer.N.title;
 		var li = $("<li>").addClass((layer.getVisible()?"visible ":" ")+(layer.get('baseLayer')?"baselayer":""))
 						.data("layer",layer).on("mousedown touchstart",{self:this},this.dragOrdering_)
 						.attr('id',id_li)
 						.appendTo(ul);


 /* ----------------------------------------------------------------------------- */
 		/* BARRA DE CONTROLES DE CAPA */
 		var anchoSidebar = document.getElementById('sidebar').offsetWidth + 6;
 		var tablaControles = $("<ul>").addClass("tabla_controles list-group").attr("id","tabla_control_" + layer.N.title).css({'position':'fixed','z-index':'20200','left':anchoSidebar + 'px','display':'none'}).appendTo(li);

 		//Funciones para controlar la aparición de la tabla de controles:
 		$('#' + id_li).click(function(e){
      console.log(id_li);
 			e.stopPropagation();
 			$("[id*=control_]").children('.tabla_controles').css({'display': 'none'});
 			$("[id*=div_info_capa]").css({'display': 'none'});
 			$(this).children('.tabla_controles').css({'display': 'block'});
 		});

		//PRIMER ELEMENTO: CONTROL DE OPACIDAD:
 		var controlOpacidad = $("<li>").addClass("list-group-item").html('Opacidad').appendTo(tablaControles);

 		var opacity = $("<div>").addClass("layerswitcher-opacity")
 				.on("click", function(e)
 				{	e.stopPropagation();
 					e.preventDefault();
 					var x = e.pageX
 						|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX)
 						|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
 					var dx = Math.max ( 0, Math.min( 1, (x - $(this).offset().left) / $(this).width() ));
 					$(this).closest("ul").closest("li").data('layer').setOpacity(dx);
 				})
 				.appendTo(controlOpacidad);
 		$("<div>").addClass("layerswitcher-opacity-cursor")
 				.on("mousedown touchstart", { self: this }, self.dragOpacity_ )
 				.css ('left', (layer.getOpacity()*100)+"%")
 				.appendTo(opacity);

		//SEGUNDO ELEMENTO: CONTROL DE ZOOM A LA CAPA:
 		var controlZoom = $("<li>").addClass("list-group-item accion").html('Zoom a la capa').on('click',zoomExtent).appendTo(tablaControles);
			// zoomExtent() está definida y modificada arriba.

		//TERCER ELEMENTO: INFORMACIÓN DE LA CAPA:
 		//Variables y funciones para controlar la aparición y desaparición del div INFORMACIÓN DE LA CAPA:
 		var idInfoCapa = layer.N.title;
 		var controlInfoCapa = 	$("<li>").addClass("list-group-item accion").html('Info de la capa').attr('id','lista_info_capa' + idInfoCapa).appendTo(tablaControles);
 		var divInfoCapa = $("<div>").addClass("div_info_capa").attr("id",'div_info_capa' + idInfoCapa).html(layer.N.abstract)
 		.css({'position':'fixed','z-index':'20300','left':anchoSidebar + 'px','display':'none'}).appendTo(li);

 		$(this).closest('ul').closest('li').children('.div_info_capa').css({'display': 'block'});
 		$('#lista_info_capa' + idInfoCapa).click(function(e){
 			e.stopPropagation();
 			$('.tabla_controles').css({'display': 'none'});
 			$(this).closest('ul').closest('li').children('.div_info_capa').css({'display': 'block'});
 		});

		//CUARTO ELEMENTO: TABLA DE DATOS DE LA CAPA:
 		var controlTabla = $("<li>").addClass("list-group-item").html('Ver la tabla').appendTo(tablaControles);

		//QUINTO ELEMENTO: DESCARGAR DATOS DE LA CAPA:
 		var controlDescargar = $("<li>").addClass("list-group-item").html('Descargar').appendTo(tablaControles);

		//FUNCIÓN DE COMPORTAMIENTO GLOBAL:
		//Función para cerrar todos los elementos cuando se haga click fuera de ellos:
		$("html").click(function(e) {
			e.stopPropagation();
			$("[id*=div_info_capa]").css({'display': 'none'});
			$("[id*=control_]").children('.tabla_controles').css({'display': 'none'});
		});

		//MÁS CONTROL DE FUNCIONAMIENTO
 		var d = $("<div>").addClass('li-content').appendTo(li);
 		if (!this.testLayerVisibility(layer)) d.addClass("ol-layer-hidden");

    var rowContenidoLayer = $("<div>").addClass("row w-100").attr('title', 'Desplegar menú de opciones');
    var colContenidoLayer = $("<div>").addClass("col-12 ml-3 p-0");

		// Layer remove
 		if (this.hastrash && !layer.get("noSwitcherDelete"))
 		{
      divTrash = $("<div>").addClass("row justify-content-end mr-1")
 			  .appendTo(colContenidoLayer);

      $("<i>").addClass("fas fa-times")
        .attr("title", this.tip.trash)
        .on ('click', removeLayer)
        .appendTo(divTrash);
 		}

    //Barra para botón y label:
    var barraBotonLabel = $("<div>").addClass("row justify-content-start");
    // Botón de acceso al menú:
    $("<div>").addClass("ml-3 mr-2")
      .html('<i class="fas fa-align-justify"></i>')
 			.appendTo(barraBotonLabel);

 		// Label
    console.log(layer.get("titulo_es"));
    console.log(layer.get("title"));
    console.log(layer.get("name"));
 		$("<label>").text(layer.get("titulo_es") || layer.get("title") || layer.get("name"))
 			.attr('unselectable', 'on')
 			.css('user-select', 'none')
 			.on('selectstart', false)
 			.appendTo(barraBotonLabel);

    barraBotonLabel.appendTo(colContenidoLayer);

      // Progress
   		if (this.show_progress)
   		{	var p = $("<div>")
   				.addClass("row justify-content-center layerswitcher-progress")
   				.appendTo(colContenidoLayer);
   			this.setprogress_(layer);
   			layer.layerswitcher_progress = $("<div>").appendTo(p);
   		}

    colContenidoLayer.appendTo(rowContenidoLayer);
    rowContenidoLayer.appendTo(li);

 		// Layer group
 		if (layer.getLayers)
 		{	li.addClass('ol-layer-group');
 			if (layer.get("openInLayerSwitcher")===true)
 			{
        this.drawList ($("<ul>").appendTo(li), layer.getLayers());
 			}
 		}

 		else if (layer instanceof ol.layer.Vector) li.addClass('ol-layer-vector');
 		else if (layer instanceof ol.layer.VectorTile) li.addClass('ol-layer-vector');
 		else if (layer instanceof ol.layer.Tile) li.addClass('ol-layer-tile');
 		else if (layer instanceof ol.layer.Image) li.addClass('ol-layer-image');
 		else if (layer instanceof ol.layer.Heatmap) li.addClass('ol-layer-heatmap');
 	}
 	if (ul==this.panel_) this.overflow();
 };
 /** Handle progress bar for a layer
 *	@private
 */
 ol.control.LayerSwitcher.prototype.setprogress_ = function(layer)
 {
 	if (!layer.layerswitcher_progress)
 	{	var loaded = 0;
 		var loading = 0;
 		function draw()
 		{	if (loading === loaded)
 			{	loading = loaded = 0;
 				layer.layerswitcher_progress.width(0);
 			}
 			else
 			{	layer.layerswitcher_progress.css('width', (loaded / loading * 100).toFixed(1) + '%');
 			}
 		}
 		layer.getSource().on('tileloadstart', function()
 		{	loading++;
 			draw();
 		});
 		layer.getSource().on('tileloadend', function()
 		{	loaded++;
 			draw();
 		});
 		layer.getSource().on('tileloaderror', function()
 		{	loaded++;
 			draw();
 		});
 	}
 };

// CREAR EL CONTROL DE CAPAS Y AÑADIRLO AL MENÚ LATERAL IZQUIERDO:
var switcher = new ol.control.LayerSwitcher(
	{	target:$("#espMenuGestionCapas").get(0),
		// displayInLayerSwitcher: function (l) { return false; },
		show_progress: true,
		extent: true,
		trash: true
	});

map.addControl(switcher);
