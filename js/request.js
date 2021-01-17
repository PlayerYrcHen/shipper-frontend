var image = new ol.style.Circle({
    radius: 2.5,
    fill: new ol.style.Fill({
      color: 'rgb(124,252,0)'
    }),
    stroke: new ol.style.Stroke({color: 'green', width: 0.1})
  });
var styles= {
  'Point': new ol.style.Style({
    image: image
  })
};
function Request(){
    var url ='http://localhost:8080/json';
    fetch(url).then(function(response) {
      return response.json();
    })
    .then(function(json){
        var GeoJSON=
        {
            "type": "FeatureCollection",
            "crs": 
            {
                "type": "name",
                "properties": {
                  "name": "EPSG:4326"
                }
            }
        };
    var coordinates=[];
    var coordinate=[];
    var properties=[];
    var features=[];
    var i;
    for(i in json){
        properties.push(filterObj(json[i],["vesselid","timeformat","basedatetime","sog","cog","airtemperature","humidity","pressure","visibility","windspeed",
        "winddirection","watertemperature","salinity","voltage","tcase"]));
        coordinate=[json[i].lon,json[i].lat];
        coordinates.push(coordinate);
    }
    for(i in properties){
        var geometry={"type": "Point"};
        geometry.coordinates=coordinates[i];
        var trans={"type": "Feature"};
        trans.properties=properties[i];
        trans.geometry=geometry;
        features.push(trans);
    }
    GeoJSON.features=features;
    return GeoJSON;
    })
    .then(function(GeoJSON) {
      styleFunction = function(feature) {
          console.log(feature);
        return styles[feature.getGeometry().getType()];
      };
        var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(GeoJSON, { 
          dataProjection: 'EPSG:4326',
          featureProjection:'EPSG:4326' })
      });
    
      //聚合标注数据源
      var clusterSource = new ol.source.Cluster({
        distance: 10,     //聚合的距离参数，即当标注间距离小于此值时进行聚合，单位是像素
        source: vectorSource    //聚合的数据源，即矢量要素数据源对象
      });
    
      vectorLayer = new ol.layer.Vector({
        source: clusterSource,
        style: styleFunction
      });
      map.addLayer(vectorLayer);
    })
}

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