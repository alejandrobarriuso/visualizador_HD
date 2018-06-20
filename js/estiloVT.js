// Styles for the mapbox-streets-v6 vector tile data set. Loosely based on
// http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6.json
// Referencia: https://www.mapbox.com/vector-tiles/mapbox-streets-v7/#layer-reference

function estilo_mapa_base_mvt(Style, Fill, Stroke, Icon, Text) {
  var fill = new Fill({color: ''});
  var stroke = new Stroke({color: '', width: 1});
  var polygon = new Style({fill: fill});
  var strokedPolygon = new Style({fill: fill, stroke: stroke});
  var line = new Style({stroke: stroke});
  var circle = new Style({fill: fill, stroke: stroke});
  var text = new Style({text: new Text({
    text: '', fill: fill, stroke: stroke
  })});
  var iconCache = {};
  function getIcon(iconName) {
    var icon = iconCache[iconName];
    if (!icon) {
      icon = new Style({image: new Icon({
        src: 'https://cdn.rawgit.com/mapbox/maki/master/icons/' + iconName + '-15.svg',
        imgSize: [15, 15]
      })});
      iconCache[iconName] = icon;
    }
    return icon;
  }

  var styles = [];
  return function(feature, resolution) {
    var length = 0;
    var layer = feature.get('layer');
    var cls = feature.get('class');
    var type = feature.get('type');
    var scalerank = feature.get('scalerank');
    var labelrank = feature.get('labelrank');
    var adminLevel = feature.get('admin_level');
    var maritime = feature.get('maritime');
    var disputed = feature.get('disputed');
    var maki = feature.get('maki');
    var geom = feature.getGeometry().getType();
    if (layer == 'landcover' && cls == 'grass') {
      fill.setColor('#abbaac');
      styles[length++] = polygon;
  } else if (layer == 'landcover' && cls == 'sand') {
      fill.setColor('#f7e3b9');
      styles[length++] = polygon;
    } else if (layer == 'landcover' && cls == 'wood') {
      fill.setColor('#859687');
      styles[length++] = polygon;
    } else if (layer == 'landcover' && cls == 'scrub') {
      fill.setColor('#acb7ad');
      styles[length++] = polygon;
    } else if (layer == 'waterway' && cls == 'river' || cls == 'stream') {
      stroke.setColor('#bbc2cc');
      stroke.setWidth(2);
      styles[length++] = line;
    } else if (layer == 'water') {
      fill.setColor('#bbc2cc');
      stroke.setColor('#bbc2cc');
      stroke.setWidth(0);
      styles[length++] = strokedPolygon;
    } else if (layer == 'landcover_overlay' && cls == 'wetland') {
      fill.setColor('#bbc2cc');
    stroke.setColor('#8fa7c9');
      stroke.setWidth(1);
      styles[length++] = strokedPolygon;
    } else if (layer == 'building') {
      fill.setColor('#ffc023');
      styles[length++] = polygon;
  } else if (layer == 'landcover' && cls == 'park') {
      fill.setColor('#abbaac');
      styles[length++] = polygon;
  } else if (layer == 'water_name' && cls == 'ocean') {
      text.getText().setText(feature.get('name'));
      text.getText().setFont(
          'bold 18px "Constantia", "Cambria"');
      fill.setColor('#0d284f');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'water_name' && cls == 'sea'  &&
   resolution < 4891.96981025128) {
      text.getText().setText(feature.get('name'));
      text.getText().setFont(
          'bold 16px "Constantia", "Cambria"');
      fill.setColor('#0d284f');
      stroke.setColor('rgba(255,255, 255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'water_name' && labelrank === 3 &&
        geom == 'Point') {
      text.getText().setText(feature.get('name'));
      text.getText().setFont(
          'bold 14px "Constantia", "Cambria"');
      fill.setColor('#0d284f');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'water_name' && labelrank === 4 &&
        geom == 'Point') {
      text.getText().setText(feature.get('name'));
      text.getText().setFont(
          'bold 12px "Constantia", "Cambria"');
      fill.setColor('#0d284f');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && (cls == 'island' ||
        cls == 'archipelago' || cls == 'islet')) {
      text.getText().setText(feature.get('name'));
      text.getText().setFont('bold 14px "Constantia", "Cambria"');
      fill.setColor('#033a08');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
  }
  else if (layer == 'boundary' && adminLevel == '2') {
      stroke.setColor('#454545');
      stroke.setWidth(1);
      styles[length++] = line;
    }
  //CIUDADES MAYORES DE 100.000 HAB
  else if (layer == 'place' && cls == 'city' &&
   resolution >= 4891.96981025128) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('14px "Constantia", "Cambria"');
      fill.setColor('#454545');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'city' &&
   resolution < 4891.96981025128 && resolution >= 1222.99245256282) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('18px "Constantia", "Cambria"');
      fill.setColor('#454545');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'city' &&
   resolution < 1222.99245256282 && resolution >= 152.8740565703525) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('20px "Constantia", "Cambria"');
      fill.setColor('#454545');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'city' &&
   resolution < 152.8740565703525 && resolution >= 9.554628535647032) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('22px "Constantia", "Cambria"');
      fill.setColor('#CCC');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'city' &&
   resolution < 9.554628535647032) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('26px "Constantia", "Cambria"');
      fill.setColor('#CCC');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    }
    //VIALES
    else if (layer == 'transportation' && (cls != 'ferry')) {
      stroke.setColor('#CCC');
      stroke.setWidth(1);
      styles[length++] = line;
    }

  //CIUDADES ENTRE 10.000 Y 100.000 HAB
  else if (layer == 'place' && cls == 'town' &&
   resolution >= 4891.96981025128) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('8px "Constantia", "Cambria"');
      fill.setColor('#CCC');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'town' &&
   resolution < 4891.96981025128 && resolution >= 1222.99245256282) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('10px "Constantia", "Cambria"');
      fill.setColor('#CCC');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'town' &&
   resolution < 1222.99245256282 && resolution >= 152.8740565703525) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('12px "Constantia", "Cambria"');
      fill.setColor('#CCC');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'town' &&
   resolution < 152.8740565703525 && resolution >= 9.554628535647032) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('14px "Constantia", "Cambria"');
      fill.setColor('#454545');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer == 'place' && cls == 'town' &&
   resolution < 9.554628535647032) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('18px "Constantia", "Cambria"');
      fill.setColor('#454545');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    }

  // else if (layer == 'waterway' ) {
  //     text.getText().setText(feature.get('name:es'));
  //     text.getText().setFont('bold 18px "Constantia", "Cambria"');
  //     fill.setColor('#0d284f');
  //     stroke.setColor('rgba(255,255,255,0.8)');
  //     stroke.setWidth(1);
  //     styles[length++] = text;
  //   }
    styles.length = length;
    return styles;
  };
}
