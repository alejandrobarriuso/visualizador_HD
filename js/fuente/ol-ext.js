//Basado en la siguiente fuente:

/**
 * ol-ext - A set of cool extensions for OpenLayers (ol) in node modules structure
 * @description ol3,openlayers,popup,menu,symbol,renderer,filter,canvas,interaction,split,statistic,charts,pie,LayerSwitcher,toolbar,animation
 * @version v2.0.4
 * @author Jean-Marc Viglino
 * @see https://github.com/Viglino/ol-ext#,
 * @license BSD-3-Clause
 */

//En primero lugar se tiene el CONTROL DE CAPAS CARGADAS para las capas añadidas en el MENÚ lateral
	// Se mostrarán las capas con:
		// - displayInLayerSwitcher: true,
	  // - displayInLayerSwitcher_base: false,
//En segundo lugar se tiene el CONTROL DE CAPAS BASE para mostrar en el selector del MAPA
	// Se mostrarán las capas con:
		// - displayInLayerSwitcher: false,
		// - displayInLayerSwitcher_base: true,

/* ------------------------- CONTROL DE CAPAS CARGADAS ---------------------------------- /*

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
	trash: "remove layer",
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
		// console.log("remove");
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
					console.log('bottom')
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
			drag.layer = drag.elt.closest("li").data('layer')
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
		self.oninfo($(this).closest('li').data("layer"));
	};
	function zoomExtent(e)
	{	e.stopPropagation();
		e.preventDefault();
		if (self.onextent) self.onextent($(this).closest('li').data("layer"));
		else self.map_.getView().fit ($(this).closest('li').data("layer").getExtent(), self.map_.getSize());
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
	};
	// Add the layer list
	for (var i=layers.length-1; i>=0; i--)
	{	var layer = layers[i];
		if (!self.displayInLayerSwitcher(layer)) continue;
		var li = $("<li>").addClass((layer.getVisible()?"visible ":" ")+(layer.get('baseLayer')?"baselayer":""))
						.data("layer",layer).on("mousedown touchstart",{self:this},this.dragOrdering_)
						.on("click", aparecerTablaControles)
						.appendTo(ul);
		var layer_buttons = $("<div>").addClass("ol-layerswitcher-buttons").appendTo(li);

/* ----------------------------------------------------------------------------- */
		// Barra de controles de capa:
		var anchoSidebar = document.getElementById('sidebar').offsetWidth - 16;
		var tablaControles = $("<ul>").addClass("list-group").css({'position':'fixed','z-index':'20200','left':anchoSidebar + 'px','display':'none'}).appendTo(li);


		// Opacity
		var opacity = $("<div>").addClass("layerswitcher-opacity")
				.on("click", function(e)
				{	e.stopPropagation();
					e.preventDefault();
					var x = e.pageX
						|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX)
						|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
					var dx = Math.max ( 0, Math.min( 1, (x - $(this).offset().left) / $(this).width() ));
					$(this).closest("li").data('layer').setOpacity(dx);
				})
				.appendTo(tablaControles);
		$("<div>").addClass("layerswitcher-opacity-cursor")
				.on("mousedown touchstart", { self: this }, self.dragOpacity_ )
				.css ('left', (layer.getOpacity()*100)+"%")
				.appendTo(opacity);




		var controlOpacidad = $("<li>").addClass("list-group-item").html('Opacidad').appendTo(tablaControles);
		var controlZoom = $("<li>").addClass("list-group-item").html('Zoom a la capa').appendTo(tablaControles);

		var controlTabla = $("<li>").addClass("list-group-item").html('Ver la tabla').appendTo(tablaControles);
		var controlDescargar = $("<li>").addClass("list-group-item").html('Descargar').appendTo(tablaControles);

		function aparecerTablaControles(){
			$(this).children(".list-group").css("display", "block" );
			console.log("apareciendo");
		}


		var d = $("<div>").addClass('li-content').appendTo(li);
		if (!this.testLayerVisibility(layer)) d.addClass("ol-layer-hidden");

		// Label
		$("<label>").text(layer.get("title") || layer.get("name"))
			.attr('title', layer.get("title") || layer.get("name"))
			.on ('click', setVisibility)
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false)
			.appendTo(li);
		// Show/hide sub layers
		if (layer.getLayers)
		{	var nb = 0;
			layer.getLayers().forEach(function(l)
			{	if (self.displayInLayerSwitcher(l)) nb++;
			});
			if (nb)
			{	$("<div>").addClass(layer.get("openInLayerSwitcher") ? "collapse-layers" : "expend-layers" )
					.click(function()
					{	var l = $(this).closest('li').data("layer");
						l.set("openInLayerSwitcher", !l.get("openInLayerSwitcher") )
					})
					.attr("title", this.tip.plus)
					.appendTo(layer_buttons);
			}
		}
		// $("<div>").addClass("ol-separator").appendTo(layer_buttons);
		// Info button


		if (this.oninfo)
		{	$("<li>").addClass("list-group-item")
					.html('Info de la capa')
					.on ('click', onInfo)
					.attr("title", this.tip.info)
					.appendTo(tablaControles);
		}
		// Layer remove
		if (this.hastrash && !layer.get("noSwitcherDelete"))
		{	$("<div>").addClass("layerTrash")
					.on ('click', removeLayer)
					.attr("title", this.tip.trash)
					.appendTo(li);
		}
		// Layer extent
		if (this.hasextent && layers[i].getExtent())
		{	var ex = layers[i].getExtent();
			if (ex.length==4 && ex[0]<ex[2] && ex[1]<ex[3])
			{	$("<div>").addClass("layerExtent")
					.on ('click', zoomExtent)
					.attr("title", this.tip.extent)
					.appendTo(tablaControles);
			}
		}
		// Progress
		if (this.show_progress && layer instanceof ol.layer.Tile)
		{	var p = $("<div>")
				.addClass("layerswitcher-progress")
				.appendTo(li);
			this.setprogress_(layer);
			layer.layerswitcher_progress = $("<div>").appendTo(p);
		}

		// Percent
		$("<div>").addClass("layerswitcher-opacity-label")
			.text(Math.round(layer.getOpacity()*100))
			.appendTo(li);
		// Layer group
		if (layer.getLayers)
		{	li.addClass('ol-layer-group');
			if (layer.get("openInLayerSwitcher")===true)
			{	this.drawList ($("<ul>").appendTo(li), layer.getLayers());
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











/* CONTROL DE CAPAS BASE CARGADAS (EN EL MAPA) */

ol.control.LayerSwitcher_base = function(options)
{	options = options || {};
	var self = this;
	this.dcount = 0;
	this.show_progress = options.show_progress;
	this.oninfo = (typeof (options.oninfo) == "function" ? options.oninfo: null);
	this.onextent = (typeof (options.onextent) == "function" ? options.onextent: null);
	this.hasextent = options.extent || options.onextent;
	this.hastrash = options.trash;
	this.reordering = (options.reordering!==false);
	// displayInLayerSwitcher_base
	if (typeof(options.displayInLayerSwitcher_base) === 'function') {
		this.displayInLayerSwitcher_base = options.displayInLayerSwitcher_base;
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
ol.inherits(ol.control.LayerSwitcher_base, ol.control.Control);
/** List of tips for internationalization purposes
*/
ol.control.LayerSwitcher_base.prototype.tip =
{	up: "up/down",
	down: "down",
	info: "informations...",
	extent: "zoom to extent",
	trash: "remove layer",
	plus: "expand/shrink"
};
/** Test if a layer should be displayed in the switcher
 * @param {ol.layer} layer
 * @return {boolean} true if the layer is displayed
 */
ol.control.LayerSwitcher_base.prototype.displayInLayerSwitcher_base = function(layer) {
	return (layer.get("displayInLayerSwitcher_base")!==false);
};
/**
 * Set the map instance the control is associated with.
 * @param {_ol_Map_} map The map instance.
 */
ol.control.LayerSwitcher_base.prototype.setMap = function(map)
{   ol.control.Control.prototype.setMap.call(this, map);
	this.drawPanel();
	if (this.map_)
	{	this.map_.getLayerGroup().un('change', this.drawPanel, this);
		this.map_.un('moveend', this.viewChange, this);
		this.map_.un('change:size', this.overflow, this);
		// console.log("remove");
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
ol.control.LayerSwitcher_base.prototype.setHeader = function(html)
{	this.header_.html(html);
};
/** Calculate overflow and add scrolls
*	@param {Number} dir scroll direction -1|0|1|'+50%'|'-50%'
*/
ol.control.LayerSwitcher_base.prototype.overflow = function(dir)
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
ol.control.LayerSwitcher_base.prototype.viewChange = function(e)
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
ol.control.LayerSwitcher_base.prototype.drawPanel = function(e)
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
ol.control.LayerSwitcher_base.prototype.drawPanel_ = function(e)
{	if (--this.dcount || this.dragging_) return;
	$("li", this.panel_).not(".ol-header").remove();
	this.drawList (this.panel_, this.getMap().getLayers());
};
/** Change layer visibility according to the baselayer option
 * @param {ol.layer}
 * @param {Array<ol.layer>} related layers
 */
ol.control.LayerSwitcher_base.prototype.switchLayerVisibility = function(l, layers)
{
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
ol.control.LayerSwitcher_base.prototype.testLayerVisibility = function(layer)
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
ol.control.LayerSwitcher_base.prototype.dragOrdering_ = function(e)
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
					console.log('bottom')
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
ol.control.LayerSwitcher_base.prototype.dragOpacity_ = function(e)
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
			drag.layer = drag.elt.closest("li").data('layer')
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
ol.control.LayerSwitcher_base.prototype.drawList = function(ul, collection)
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
		self.oninfo($(this).closest('li').data("layer"));
	};
	function zoomExtent(e)
	{	e.stopPropagation();
		e.preventDefault();
		if (self.onextent) self.onextent($(this).closest('li').data("layer"));
		else self.map_.getView().fit ($(this).closest('li').data("layer").getExtent(), self.map_.getSize());
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
	};
	// Add the layer list
	for (var i=layers.length-1; i>=0; i--)
	{	var layer = layers[i];
		if (!self.displayInLayerSwitcher_base(layer)) continue;
		var li = $("<li>").addClass((layer.getVisible()?"visible ":" ")+(layer.get('baseLayer')?"baselayer":""))
						.data("layer",layer).appendTo(ul);
		var layer_buttons = $("<div>").addClass("ol-layerswitcher-buttons").appendTo(li);
		var d = $("<div>").addClass('li-content').appendTo(li);
		if (!this.testLayerVisibility(layer)) d.addClass("ol-layer-hidden");
		// Visibility
		$("<input>")
			.attr('type', layer.get('baseLayer') ? 'radio' : 'checkbox')
			.attr("checked",layer.getVisible())
			.on ('click', setVisibility)
			.appendTo(d);
		// Label
		$("<label>").text(layer.get("title") || layer.get("name"))
			.attr('title', layer.get("title") || layer.get("name"))
			.on ('click', setVisibility)
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false)
			.appendTo(d);
		//  up/down
		if (this.reordering)
		{	if ( (i<layers.length-1 && (layer.get("allwaysOnTop") || !layers[i+1].get("allwaysOnTop")) )
				|| (i>0 && (!layer.get("allwaysOnTop") || layers[i-1].get("allwaysOnTop")) ) )
			{	$("<div>").addClass("layerup")
					.on ("mousedown touchstart", {self:this}, this.dragOrdering_ )
					.attr("title", this.tip.up)
					.appendTo(layer_buttons);
			}
		}
		// Show/hide sub layers
		if (layer.getLayers)
		{	var nb = 0;
			layer.getLayers().forEach(function(l)
			{	if (self.displayInLayerSwitcher_base(l)) nb++;
			});
			if (nb)
			{	$("<div>").addClass(layer.get("openInLayerSwitcher") ? "collapse-layers" : "expend-layers" )
					.click(function()
					{	var l = $(this).closest('li').data("layer");
						l.set("openInLayerSwitcher", !l.get("openInLayerSwitcher") )
					})
					.attr("title", this.tip.plus)
					.appendTo(layer_buttons);
			}
		}
		// $("<div>").addClass("ol-separator").appendTo(layer_buttons);
		// Info button
		if (this.oninfo)
		{	$("<div>").addClass("layerInfo")
					.on ('click', onInfo)
					.attr("title", this.tip.info)
					.appendTo(layer_buttons);
		}
		// Layer remove
		if (this.hastrash && !layer.get("noSwitcherDelete"))
		{	$("<div>").addClass("layerTrash")
					.on ('click', removeLayer)
					.attr("title", this.tip.trash)
					.appendTo(layer_buttons);
		}
		// Layer extent
		if (this.hasextent && layers[i].getExtent())
		{	var ex = layers[i].getExtent();
			if (ex.length==4 && ex[0]<ex[2] && ex[1]<ex[3])
			{	$("<div>").addClass("layerExtent")
					.on ('click', zoomExtent)
					.attr("title", this.tip.extent)
					.appendTo(layer_buttons);
			}
		}
		// Progress
		if (this.show_progress && layer instanceof ol.layer.Tile)
		{	var p = $("<div>")
				.addClass("layerswitcher-progress")
				.appendTo(d);
			this.setprogress_(layer);
			layer.layerswitcher_progress = $("<div>").appendTo(p);
		}
		// Opacity
		var opacity = $("<div>").addClass("layerswitcher-opacity")
				.on("click", function(e)
				{	e.stopPropagation();
					e.preventDefault();
					var x = e.pageX
						|| (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX)
						|| (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
					var dx = Math.max ( 0, Math.min( 1, (x - $(this).offset().left) / $(this).width() ));
					$(this).closest("li").data('layer').setOpacity(dx);
				})
				.appendTo(d);
		$("<div>").addClass("layerswitcher-opacity-cursor")
				.on("mousedown touchstart", { self: this }, self.dragOpacity_ )
				.css ('left', (layer.getOpacity()*100)+"%")
				.appendTo(opacity);
		// Percent
		$("<div>").addClass("layerswitcher-opacity-label")
			.text(Math.round(layer.getOpacity()*100))
			.appendTo(d);
		// Layer group
		if (layer.getLayers)
		{	li.addClass('ol-layer-group');
			if (layer.get("openInLayerSwitcher")===true)
			{	this.drawList ($("<ul>").appendTo(li), layer.getLayers());
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
ol.control.LayerSwitcher_base.prototype.setprogress_ = function(layer)
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


/* ------------- CONTROL DE CAPA BASE ------------------------ /*
/*	Copyright (c) 2016 Jean-Marc VIGLINO,
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * @classdesc OpenLayers 3 Layer Switcher Control.
 * @require layer.getPreview
 * @require jQuery
 *
 * @constructor
 * @extends {ol.control.LayerSwitcher_base}
 * @param {Object=} options Control options.
 */
ol.control.LayerSwitcherImage = function(options)
{	options = options || {};
	options.switcherClass="ol-layerswitcher-image";
	if (options.mouseover!==false) options.mouseover=true;
	ol.control.LayerSwitcher_base.call(this, options);
};
ol.inherits(ol.control.LayerSwitcherImage, ol.control.LayerSwitcher_base);
/** Render a list of layer
 * @param {elt} element to render
 * @layers {Array{ol.layer}} list of layer to show
 * @api stable
 */
ol.control.LayerSwitcherImage.prototype.drawList = function(ul, layers)
{	var self = this;
	var setVisibility = function(e)
	{	e.preventDefault();
		var l = $(this).data("layer");
		self.switchLayerVisibility(l,layers);
		if (e.type=="touchstart") $(self.element).addClass("ol-collapsed");
	};
	ul.css("height","auto");
	layers.forEach(function(layer)
	{	if (self.displayInLayerSwitcher_base(layer))
		{	var prev = layer.getPreview ? layer.getPreview() : ["none"];
			var d = $("<li>").addClass("ol-imgcontainer")
						.data ('layer', layer)
						.click (setVisibility)
						.on ("touchstart", setVisibility);
			if (layer.getVisible()) d.addClass("select");
			for (var k=0; k<prev.length; k++)
			{	$("<img>").attr('src', prev[k])
						.appendTo(d);
			}
			$("<p>").text(layer.get("title") || layer.get("name")).appendTo(d);
			if (self.testLayerVisibility(layer)) d.addClass("ol-layer-hidden");
			d.appendTo(ul);
		}
	});
};
/** Disable overflow
*/
ol.control.LayerSwitcherImage.prototype.overflow = function(){};

/*	Copyright (c) 2015 Jean-Marc VIGLINO,
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * Return a preview image of the source.
 * @param {ol.Coordinate|undefined} lonlat The center of the preview.
 * @param {number} resolution of the preview.
 * @return {String} the preview url
 * @api
 */
ol.source.Source.prototype.getPreview = function(lonlat, resolution)
{	return "img/img1.jpg";
};
/**
 * Return the tile image of the source.
 * @param {ol.Coordinate|undefined} lonlat The center of the preview.
 * @param {number} resolution of the preview.
 * @return {String} the preview url
 * @api
 */
ol.source.Tile.prototype.getPreview = function(lonlat, resolution)
{	if (!lonlat) lonlat = [21020, 6355964];
	if (!resolution) resolution = 1;
	var coord = this.getTileGrid().getTileCoordForCoordAndResolution(lonlat, resolution);
	var fn = this.getTileUrlFunction();
	return fn.call(this, coord, this.getProjection());
};
/**
 * Return the tile image of the source.
 * @param {ol.Coordinate|undefined} lonlat The center of the preview.
 * @param {number} resolution of the preview.
 * @return {String} the preview url
 * @api
 */
ol.source.TileWMS.prototype.getPreview = function(lonlat, resolution)
{	if (!lonlat) lonlat = [21020, 6355964];
	if (!resolution) resolution = 10;
/*	No way to acces tileUrlFunction...
	var fn = this.getTileUrlFunction();
	return fn.call(this, lonlat, this.getProjection());
*/
	// Use getfeature info instead
	var url = this.getGetFeatureInfoUrl(lonlat, resolution, this.getProjection() || 'EPSG:3857', {});
	url = url.replace(/getfeatureinfo/i,"GetMap");
	return url;
};
/**
 * Return a preview for the layer.
 * @param {ol.Coordinate|undefined} lonlat The center of the preview.
 * @param {number} resolution of the preview.
 * @return {Array<String>} list of preview url
 * @api
 */
ol.layer.Layer.prototype.getPreview = function(lonlat, resolution)
{	if (this.get("preview")) return [ this.get("preview") ];
	if (!resolution) resolution = 10;
	// Get middle resolution
	if (resolution < this.getMinResolution() || resolution > this.getMaxResolution())
	{	var rmin = this.getMinResolution(),
			rmax = this.getMaxResolution();
		if (rmax>100000) rmax = 156543;	// min zoom : world
		if (rmin<0.15) rmin = 0.15;	// max zoom
		resolution = rmax;
		while (rmax>rmin)
		{	rmin *= 2;
			rmax /= 2;
			resolution = rmin;
		}
	}
	var e = this.getExtent();
	if (!lonlat) lonlat = [4453000, -13315];	// Default lonlat
	if (e && !ol.extent.containsCoordinate(e,lonlat)) lonlat = [ (e[0]+e[2])/2, (e[1]+e[3])/2 ];
	if (this.getSource) return [ this.getSource().getPreview(lonlat, resolution) ];
	return [];
};
/**
 * Return a preview for the layer.
 * @param {_ol_coordinate_|undefined} lonlat The center of the preview.
 * @param {number} resolution of the preview.
 * @return {Array<String>} list of preview url
 * @api
 */
ol.layer.Group.prototype.getPreview = function(lonlat, resolution)
{	if (this.get("preview")) return [ this.get("preview") ];
	var t = [];
	if (this.getLayers)
	{	var l = this.getLayers().getArray();
		for (var i=0; i<l.length; i++)
		{	t = t.concat(l[i].getPreview(lonlat, resolution));
		}
	}
	return t;
};
//NB: (Not confirmed)To use this module, you just have to :
				//   import('ol-ext/layer/getpreview')

/** ol.layer.Vector.prototype.setRender3D
 * @extends {ol.layer.Vector}
 * @param {ol.render3D}
 */
ol.layer.Vector.prototype.setRender3D = function (r)
{	r.setLayer(this);
}
/**
 *	@classdesc
 *	ol.render3D 3D vector layer rendering
 *	@constructor
 *	@param {olx.render3DOption}
 *		- masResolution {number} max resolution to render 3D
 *		- defaultHeight {number} default height if none is return by a propertie
 *		- height {function|string|Number} a height function (return height giving a feature) or a popertie name for the height or a fixed value
 */
ol.render3D = function (options)
{	var options = options || {};
	this.maxResolution_ = options.maxResolution || 100
	this.defaultHeight_ = options.defaultHeight || 0;
	this.height_ = this.getHfn (options.height);
}
/** Calculate 3D at potcompose
*/
ol.render3D.prototype.onPostcompose_ = function(e)
{	var res = e.frameState.viewState.resolution;
	if (res > this.maxResolution_) return;
	this.res_ = res*400;
	if (this.animate_)
	{	var elapsed = e.frameState.time - this.animate_;
		if (elapsed < this.animateDuration_)
		{	this.elapsedRatio_ = this.easing_(elapsed / this.animateDuration_);
			// tell OL3 to continue postcompose animation
			e.frameState.animate = true;
		}
		else
		{	this.animate_ = false;
			this.height_ = this.toHeight_
		}
	}
	var ratio = e.frameState.pixelRatio;
	var ctx = e.context;
	var m = this.matrix_ = e.frameState.coordinateToPixelTransform;
	// Old version (matrix)
	if (!m)
	{	m = e.frameState.coordinateToPixelMatrix,
		m[2] = m[4];
		m[3] = m[5];
		m[4] = m[12];
		m[5] = m[13];
	}
	this.center_ = [ctx.canvas.width/2/ratio, ctx.canvas.height/ratio];
	var f = this.layer_.getSource().getFeaturesInExtent(e.frameState.extent);
	ctx.save();
	ctx.scale(ratio,ratio);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "rgba(0,0,255,0.5)";
	var builds = [];
	for (var i=0; i<f.length; i++)
	{	builds.push (this.getFeature3D_ (f[i], this.getFeatureHeight(f[i])));
	}
	this.drawFeature3D_ (ctx, builds);
	ctx.restore();
}
/** Set layer to render 3D
*/
ol.render3D.prototype.setLayer = function(l)
{	if (this.layer_) this.layer_.un ('postcompose', this.onPostcompose_, this);
	this.layer_ = l;
	l.on ('postcompose', this.onPostcompose_, this);
}
/** Create a function that return height of a feature
*	@param {function|string|number} a height function or a popertie name or a fixed value
*	@return {function} function(f) return height of the feature f
*/
ol.render3D.prototype.getHfn= function(h)
{	switch (typeof(h))
	{	case 'function': return h;
		case 'string':
			{	var dh = this.defaultHeight_;
				return (function(f)
				{	return (Number(f.get(h)) || dh);
				});
			}
		case 'number': return (function(f) { return h; });
		default: return (function(f) { return 10; });
	}
}
/** Animate rendering
*	@param {olx.render3D.animateOptions}
*		- height {string|function|number} an attribute name or a function returning height of a feature or a fixed value
*		- durtion {number} the duration of the animatioin ms, default 1000
*		- easing {ol.easing} an ol easing function
*	@api
*/
ol.render3D.prototype.animate = function(options)
{	options = options || {};
	this.toHeight_ = this.getHfn(options.height);
	this.animate_ = new Date().getTime();
	this.animateDuration_ = options.duration ||1000;
	this.easing_ = options.easing || ol.easing.easeOut;
	// Force redraw
	this.layer_.changed();
}
/** Check if animation is on
*	@return {bool}
*/
ol.render3D.prototype.animating = function()
{	if (this.animate_ && new Date().getTime() - this.animate_ > this.animateDuration_)
	{	this.animate_ = false;
	}
	return !!this.animate_;
}
/**
*/
ol.render3D.prototype.getFeatureHeight = function (f)
{	if (this.animate_)
	{	var h1 = this.height_(f);
		var h2 = this.toHeight_(f);
		return (h1*(1-this.elapsedRatio_)+this.elapsedRatio_*h2);
	}
	else return this.height_(f);
}
/**
*/
ol.render3D.prototype.hvector_ = function (pt, h)
{	p0 = [	pt[0]*this.matrix_[0] + pt[1]*this.matrix_[1] + this.matrix_[4],
			pt[0]*this.matrix_[2] + pt[1]*this.matrix_[3] + this.matrix_[5]
		];
	p1 = [	p0[0] + h/this.res_*(p0[0]-this.center_[0]),
			p0[1] + h/this.res_*(p0[1]-this.center_[1])
		];
	return {p0:p0, p1:p1};
}
/**
*/
ol.render3D.prototype.getFeature3D_ = function (f, h)
{	var c = f.getGeometry().getCoordinates();
	switch (f.getGeometry().getType())
	{	case "Polygon":
			c = [c];
		case "MultiPolygon":
			var build = [];
			for (var i=0; i<c.length; i++)
			{	var p0, p1;
				for (var j=0; j<c[i].length; j++)
				{	var b = [];
					for (var k=0; k<c[i][j].length; k++)
					{	b.push( this.hvector_(c[i][j][k], h) );
					}
					build.push(b);
				}
			}
			return { type:"MultiPolygon", feature:f, geom:build };
		case "Point":
			return { type:"Point", feature:f, geom:this.hvector_(c,h) };
		default: return {};
	}
}
/**
*/
ol.render3D.prototype.drawFeature3D_ = function(ctx, build)
{	// Construct
	for (var i=0; i<build.length; i++)
	{
		switch (build[i].type)
		{	case "MultiPolygon":
				for (var j=0; j<build[i].geom.length; j++)
				{	var b = build[i].geom[j];
					for (var k=0; k < b.length; k++)
					{	ctx.beginPath();
						ctx.moveTo(b[k].p0[0], b[k].p0[1]);
						ctx.lineTo(b[k].p1[0], b[k].p1[1]);
						ctx.stroke();
					}
				}
				break;
			case "Point":
				{	var g = build[i].geom;
					ctx.beginPath();
					ctx.moveTo(g.p0[0], g.p0[1]);
					ctx.lineTo(g.p1[0], g.p1[1]);
					ctx.stroke();
					break;
				}
			default: break;
		}
	}
	// Roof
	for (var i=0; i<build.length; i++)
	{	switch (build[i].type)
		{	case "MultiPolygon":
			{	ctx.beginPath();
				for (var j=0; j<build[i].geom.length; j++)
				{	var b = build[i].geom[j];
					if (j==0)
					{	ctx.moveTo(b[0].p1[0], b[0].p1[1]);
						for (var k=1; k < b.length; k++)
						{	ctx.lineTo(b[k].p1[0], b[k].p1[1]);
						}
					}
					else
					{	ctx.moveTo(b[0].p1[0], b[0].p1[1]);
						for (var k=b.length-2; k>=0; k--)
						{	ctx.lineTo(b[k].p1[0], b[k].p1[1]);
						}
					}
					ctx.closePath();
				}
				ctx.fill("evenodd");
				ctx.stroke();
				break;
			}
			case "Point":
			{	var b = build[i];
				var t = b.feature.get('label');
				var p = b.geom.p1;
				var f = ctx.fillStyle;
				ctx.fillStyle = ctx.strokeStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.fillText ( t, p[0], p[1] );
				var m = ctx.measureText(t);
				var h = Number (ctx.font.match(/\d+(\.\d+)?/g).join([]));
				ctx.fillStyle = "rgba(255,255,255,0.5)";
				ctx.fillRect (p[0]-m.width/2 -5, p[1]-h -5, m.width +10, h +10)
				ctx.strokeRect (p[0]-m.width/2 -5, p[1]-h -5, m.width +10, h +10)
				ctx.fillStyle = f;
				//console.log(build[i].feature.getProperties())
			}
			default: break;
		}
	}
}
