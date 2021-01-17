$(document).ready(function(){
    
    $(".ship-menu").children().on("click", switchShipMenu)
   
    $(".map-type-box").on('click', addBoder)
   
    $(".ruler-btn").click(function(){
        $("#typeMeasure").toggle();
    });
    $('.modal').on('show.bs.modal', function () {
        $(this).draggable({
            handle: ".modal-header", // 只能点击头部拖动
            cursor: 'move' //光标呈现为指示链接的指针（一只手）
        });
        $(this).css("overflow", "hidden");
        // 不拖动透明背景
        
    })
    $(".first-modal .modal-body .row .col").on('click', menuItemToggleActive)
    timerSelect();
    $(".next-time").on('click', moveToNextTime);
    $(".pre-time").on('click', moveToPreTime);
   

    $(".switch-box").on('mouseenter',startAnimation);
    $(".switch-box").on('mouseleave',endAnimation);
    
    $('.ship-signal-tooltip').on('mouseenter',showToolName);
    $('.ruler-tooltip').on('mouseenter',showToolName);
    $('.position-tooltip').on('mouseenter',showToolName);
   
    $(".switcher .switcher-header .switch-header-item").on('click', switcher);
    $(".switcher .switcher-body .switch-body-item:gt(0)").addClass("d-none")

    $(".login-box").on('click', closeToolsBox);
    $(".tools-controls").on('click', closeLoginBox);

    $("#hydrometeorology-box .row .col").on('click', showMeteorologyBox);
    // $(".search-box input").on('focus', showDetailShipBox);  搜索框获得焦点出现船舶详细信息
    // $(".search-box input").on('blur', hideDetailShipBox);  搜索框失去焦点隐藏船舶详细信息
    // $(".search-box input").on('change', searchShip);  
    $(".search-box input").bind('input porpertychange',function(){
        $(".search-result").empty();
        key = $(this).val()
        if(key)
            $(".search-result").show();
        else
            $(".search-result").hide();
        var url ='http://localhost:8888';
        fetch(url).then(function(response) {
            return response.json();
        })
        .then(function(json) {
            buffer = [];
            var count = 0;
            for(i=0; i<10000; i+=1000) {
                var detail=document.createElement("div");
                detail.innerHTML="MMSI:" + json.features[i].properties.MMSI;
                $(".search-result").append(detail)
                // console.log(json.features[i])
                buffer.push(json.features[i]);
                buffer[count].id = count;
                count++;
            }
            // console.log(buffer)
            GeoJSON = {"type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {
                  "name": "EPSG:4326"
                }           
            }
            }
            
            
            container = $(".search-result");
            container.children().click(positionToShip);     //then的作用类似于回调函数？反正想要顺序执行卸载.then里就对了
            // console.log(container.children());
        })
       
    })
   
});
// 顶部菜单栏切换
function switchShipMenu() {
    target = $(this).attr("target");
    $('.modal').modal('hide')
    $(target).modal('show')
    $(this).addClass("ship-menu-active")
    $(this).siblings().removeClass("ship-menu-active");
}


// 弹出框功能按钮点击颜色切换
function menuItemToggleActive() {
    $(this).toggleClass("bg-primary");
    $(this).toggleClass("text-light");
   
}

// 地图选择的边框颜色改变
function addBoder() {
    $(this).addClass("selected-border")
    $(this).siblings().removeClass("selected-border")

}
// 侧边工具栏hover时显示功能名字
function showToolName() {
    $(this).tooltip('show')

}

//气象详情弹出框时间选择器，添加时间
function timerSelect() {
    var now = new Date().getTime();
    for(i=0; i<40 ; i++) {
        var formatedTime = formatTime(new Date(now))
        var option=document.createElement("option");
        option.innerHTML=formatedTime;         
        $(".weather-timer").append(option); 
        now += 2 * 60 * 60 * 1000;
    } 
}
// 格式化时间
function formatTime(time) {
    var yy = time.getFullYear(); //年
    var mm = time.getMonth() + 1; //月
    var dd = time.getDate(); //日
    var hh = time.getHours(); //时
    var formatedTime = yy + "-";
    if (mm < 10) formatedTime += "0";
    formatedTime += mm + "-";
    if (dd < 10) formatedTime += "0";
    formatedTime += dd + " ";
    if (hh < 10) formatedTime += "0";
    formatedTime += hh + ":00:00";
    return formatedTime;
}

// 选择下一时间
function moveToNextTime() {
    var setTime = $(".weather-timer option:selected").next().val()
    if(setTime != undefined) {
        $(".weather-timer").val(setTime)
    }
}
    

// 选择上一时间
function moveToPreTime() {
    var setTime = $(".weather-timer option:selected").prev().val()
    if(setTime != undefined) {
        $(".weather-timer").val(setTime)
    }
    
}

//切换地图开始动画
function startAnimation() {

    $(".earth-map").animate({right:'94px',opacity: 1},"fast");
    $(".satellite-map").animate({right:'178px',opacity: 1},"fast");  
    $(".swtich-box-shadow").animate({width:'263px',opacity: .5,},"fast")
}

//切换地图结束动画
function endAnimation() {

    $(".earth-map").animate({right:'20px',opacity: .5},"fast");
    $(".satellite-map").animate({right:'30px',opacity: .5},"fast");  
    $(".swtich-box-shadow").animate({opacity: 0,width:'120px',},"fast")
}

//船舶信息小框切换
function shipDetailSwitch() {
    target = $(this).attr("target");
   
    $("#ship-detail-box .ship-detail-item").addClass("d-none")
   
    $(target).removeClass("d-none")

    $(this).addClass("ship-detail-list-active")
    $(this).siblings().removeClass("ship-detail-list-active");
}

function switcher() {
    index = $(this).attr("index");
    option = ".switcher .switcher-body .switch-body-item:eq(" + index + ")";
    $(option).siblings().addClass("d-none")
    $(option).removeClass("d-none")
    $(this).addClass("switcher-header-item-active")
    $(this).siblings().removeClass("switcher-header-item-active");
}


// 工具弹窗开启时关闭登录弹窗
function closeLoginBox() {
    $("#collapselogin").collapse('hide')
    $(this).toggleClass("text-primary")
}
// 登录弹窗开启时关闭工具弹窗
function closeToolsBox() {
    $("#collapseExample").collapse('hide')
    $(".tools-controls").removeClass("text-primary")
}
// 显示详细气象信息小框
function showMeteorologyBox() {
    // $('#weather-box').modal('show')
    $(this).siblings().removeClass("bg-primary").removeClass("text-light")
    $(this).parent().siblings().children().removeClass("bg-primary").removeClass("text-light")
    if($(this).hasClass('bg-primary')) {
        $('#weather-box').modal('hide')
    }else {
        $('#weather-box').modal('show')
    }
}

//  点击搜索框显示船舶详细信息
function showDetailShipBox() {
    $("#ship-detail-box").modal('show')
}
//  搜索框失去焦点隐藏船舶详细信息
function hideDetailShipBox() {
    $("#ship-detail-box").modal('hide')
}

// 搜索船舶
// function searchShip() {
//     key = $(this).val()
//     console.log(key)
// }

function positionToShip() {
    var content = this.innerHTML.slice(5);
    var coordinates=[];
    // console.log(content)
        for(f in buffer){
            if(content == buffer[f].properties.MMSI){
                info = filterObj(buffer[f].properties,["MMSI","BaseDateTime","SOG","COG","Heading","VesselName","IMO","CallSign","VesselType",
                    "Status","Length","Width","Draft","Cargo"]);               //过滤js对象
                coordinates = buffer[f].geometry.coordinates;
                GeoJSON.features = buffer[f];
            }
        }
    $('#ship-detail-box').on('show.bs.modal',function(){
        var modal = $(this);
        var MMSI = info["MMSI"];
        var CallSign = info["CallSign"];
        var IMO = info["IMO"];
        var Type = info["VesselType"];
        var Length = info["Length"];
        var Width = info["Width"];
        var Draft = info["Draft"];
        var COG = info["COG"];
        var SOG = info["SOG"];
        var Lon = coordinates[0];
        var Lat = coordinates[1];
        var BaseDateTime = info["BaseDateTime"];

        modal.find("span.1").html(MMSI);
        modal.find("span.2").html(CallSign);
        modal.find("span.3").html(IMO);
        modal.find("span.4").html(Type);
        modal.find("span.5").html(Length);
        modal.find("span.6").html(Width);
        modal.find("span.7").html(Draft);
        modal.find("span.8").html(COG);
        modal.find("span.10").html(SOG);
        modal.find("span.11").html(Lon);
        modal.find("span.12").html(Lat);
        modal.find("span.13").html(BaseDateTime);

        console.log(Lon,Lat);
        var pos = [Lon,Lat];
        view.animate({
            center: pos,
            duration: 1000,
            easing: elastic
          });
      });

      $('#ship-detail-box').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
      });
      
      var searchedSource=new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(GeoJSON, { 
          dataProjection: 'EPSG:4326',
          featureProjection:'EPSG:4326' })
      });

      var searchedLayer=new ol.layer.Vector({
        source: searchedSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 0.5],
              src: './img/ship_stop.png',
              scale: 0.2,
            })
        })
      });
      map.addLayer(searchedLayer);
}





