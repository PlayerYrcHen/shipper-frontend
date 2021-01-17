
view.on("change:resolution",function(e){
  var zoomLevel = map.getView().getZoom();

//点击显示
  var key;
  var selectSingleClick = new ol.interaction.Select({
  layers: [vectorLayer],
  style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        src: './img/ship_stop.png',
        scale: 0.2,
      })
  })
});

var unselectSingleClick = new ol.interaction.Select({
  layers: [vectorLayer],
  style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        src: './img/ship_stop.png',
        scale: 0.2,
        rotation: -Math.PI/8
      })
  })
});

  map.on('pointermove', function(evt) {
  map.getTargetElement().style.cursor =
      map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

  });

  key = selectSingleClick.on('select', function(evt) {
    var features = evt.target.getFeatures().getArray();
    
    if(features.length > 0){
      var feature = features[0];
      var info = feature.getProperties();
      console.log(feature.getProperties());
      info = info.features[0].values_;                 //在js对象数组里选择想要的
      info = filterObj(info,["vesselID","timeFormat","baseDateTime","cog","sog","airTemperature","humidity",
      "pressure","visibility","windSpeed","windDirection","salinity","voltage","tcase"]);               //过滤js对象
      var coordinate = ol.extent.getCenter(feature.getGeometry().getExtent());    //获取选中点坐标
      //   var property = feature.getProperties();      //获取js对象的另一种方法
      
      $('#ship-detail-box').on('show.bs.modal',function(){
        var modal = $(this);
        var vesselID = info["vesselID"];
        var timeFormat = info["timeFormat"];
        var baseDateTime = info["baseDateTime"];
        var cog = info["cog"];
        var sog = info["sog"];
        var airTemperature = info["airTemperature"];
        var humidity = info["humidity"];
        var pressure = info["pressure"];
        var visibility = info["visibility"];
        var Lon = coordinate[0];
        var Lat = coordinate[1];
        var windSpeed = info["windSpeed"];
        var windDirection = info["windDirection"];
        var waterTemperature = info["waterTemperature"];
        var salinity = info["salinity"];
        var voltage = info["voltage"];
        var tcase = info["tcase"];

        modal.find("span.1").html(vesselID);
        modal.find("span.2").html(timeFormat);
        modal.find("span.3").html(baseDateTime);
        modal.find("span.4").html(cog);
        modal.find("span.5").html(sog);
        modal.find("span.6").html(Lon);
        modal.find("span.7").html(Lat);
        modal.find("span.8").html(airTemperature);
        modal.find("span.9").html(humidity);
        modal.find("span.10").html(pressure);
        modal.find("span.11").html(visibility);
        modal.find("span.12").html(windSpeed);
        modal.find("span.13").html(windDirection);
        modal.find("span.14").html(waterTemperature);
        modal.find("span.15").html(salinity);
        modal.find("span.16").html(voltage);
        modal.find("span.17").html(tcase);
      });

      $('#ship-detail-box').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
      });
      
      var image_alter = new ol.style.Icon({
        anchor: [0.5, 0.5],
        src: './img/ship_big.png',
        scale: 0.2,
        rotation: -Math.PI/4
      });
// 关闭模态框后
      $('#ship-detail-box').on('hidden.bs.modal',function(){

      });

      }
    });
    map.addInteraction(selectSingleClick);
  
});



/**

	 * [过滤对象]

	 * @param  obj [过滤前数据]

	 * @param  arr [过滤条件，要求为数组]

	 */

	function filterObj(obj, arr) {

		if (typeof (obj) !== "object" || !Array.isArray(arr)) {
			throw new Error("参数格式不正确")
		}

		const result = {}

		Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
			result[key] = obj[key]
		})
		return result
	}

/** 
 
 * [格式转换]
 
 * @param jsObj

 *@returns json字符串

*/

function syntaxHighlight(json) {
  if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}
