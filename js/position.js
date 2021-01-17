// A bounce easing method (from https://github.com/DmitryBaranovskiy/raphael).
function bounce(t) {
    var s = 7.5625;
    var p = 2.75;
    var l;
    if (t < (1 / p)) {
      l = s * t * t;
    } else {
      if (t < (2 / p)) {
        t -= (1.5 / p);
        l = s * t * t + 0.75;
      } else {
        if (t < (2.5 / p)) {
          t -= (2.25 / p);
          l = s * t * t + 0.9375;
        } else {
          t -= (2.625 / p);
          l = s * t * t + 0.984375;
        }
      }
    }
    return l;
  }
  // An elastic easing method (from https://github.com/DmitryBaranovskiy/raphael).
  function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
  }
  
  function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
  }
  onClick('pan-to-pos', function() {
    var lat_deg = Number($("#pos1").val());
    var lat_min = Number($("#pos2").val());
    var lon_deg = Number($("#pos3").val());
    var lon_min = Number($("#pos4").val());
    var lat = lat_deg + lat_min / 60;
    var lon = lon_deg + lon_min / 60;
  
    console.log(lon,lat);
    var pos = [lon,lat];
    view.animate({
      center: pos,
      duration: 1000,
      // easing: elastic
    });
  });