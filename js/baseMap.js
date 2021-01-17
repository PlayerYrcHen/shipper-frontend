// OSM街景图
var OSMMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
});

// 高德地图
var gaodeMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
    })
});


// 雅虎地图
var yahooMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        tileSize: 512,
        url:'https://{0-3}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?lg=ENG&ppi=250&token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B'
    })
});

// google地图层
var googleMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
    })
});

//经纬网图层
var graticule =  new ol.layer.Graticule({
  // the style to use for the lines, optional.
  strokeStyle: new ol.style.Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2,
    lineDash: [0.5, 4]
  }),
  showLabels: true,
  wrapX: true,
  visible: true,
})


//Measure code start here
var source2 = new ol.source.Vector();
var vectorMeasure = new ol.layer.Vector({
  source: source2,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});
//Measure code end here


// 创建地图

var view = new ol.View({
  // 设置成都为地图中心
  // 若要使用ol_echarts渲染风场图层，则必须使用4326坐标系
  center: [-173, 36],
  projection: 'EPSG:4326',
  zoom: 4
  //以下为默认的3857坐标系
    // center: ol.proj.fromLonLat([-173, 36]),
    // zoom: 4
  })

  // 鼠标获取经纬度
  const mousePositionControl1=
      new ol.control.MousePosition({
        coordinateFormat: function(coordinate){
          var lnglat=ol.coordinate.toStringHDMS(coordinate);
          var splited=lnglat.split(/([A-Z]\s)/);
          var lat=splited[0]+splited[1];
          return lat;
        },  //将经纬度对象转字符串，分割，并转换为度分秒格式
        projection: 'EPSG:4326',
        undefinedHTML: '',   //鼠标移到无效区域时，经纬度停留在最后值
        target: document.getElementById('lat')
      });

  const mousePositionControl2=
      new ol.control.MousePosition({
        coordinateFormat: function(coordinate){
          var lnglat=ol.coordinate.toStringHDMS(coordinate);
          var splited=lnglat.split(/([A-Z]\s)/);
          var lng=splited[2];
          return lng;
        },  //将经纬度对象转字符串，分割，并转换为度分秒格式
        projection: 'EPSG:4326',
        undefinedHTML: '',   //鼠标移到无效区域时，经纬度停留在最后值
        target: document.getElementById('lng')
      });

 var map = new ol.Map({
    controls: ol.control.defaults().extend(
      [ mousePositionControl1,
        mousePositionControl2,
        new ol.control.ScaleLine(),
        new ol.control.FullScreen()]
      
      ),
    layers:[
      OSMMapLayer,  //底图层
      vectorMeasure,     //测距层
      // graticule          //经纬网层
    ],
    // overlays: [overlay],
    view: view,
    target: 'map'
});
// export default map;