
function remove_marker(marker_list) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].setMap(null)
    }
}

function set_marker(marker_list) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].setMap(map)
    }
}


// 마커표시 체크박스
function fn_chbx(obj) {
    if (obj.classList.contains('active')) {
        if (obj.name == 'store') {
            set_marker(store_list)
        } else if (obj.name == 'accident') {
            set_marker(accident_list)
        } else if (obj.name == 'parking_space') {
            set_marker(parking_space_list)
        } else if (obj.name == 'foot_traffic') {
            set_marker(foot_trafic_list)
        } else if (obj.name == 'traffic_info') {
            set_marker(traffic_info_list)
        }
    } else {
        if (obj.name == 'store') {
            remove_marker(store_list)
        } else if (obj.name == 'accident') {
            remove_marker(accident_list)
        } else if (obj.name == 'parking_space') {
            remove_marker(parking_space_list)
        } else if (obj.name == 'foot_traffic') {
            remove_marker(foot_trafic_list)
        } else if (obj.name == 'traffic_info') {
            remove_marker(traffic_info_list)
        }
    }
}

//상가 마커
var store_list = []

function store_marker(x, y) {
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(x, y),
        map: map,
        icon: {
            content: '<div style="width:10px; height:10px;margin: 0px; padding: 0px; border: 0px; border-radius:50%; background-color:#0033FFAA;" ></div>',
            size: new naver.maps.Size(22, 35),
        }
    });
    store_list.push(marker)
}

//교통정보 마커
var foot_trafic_list = []
function site_point(xy, text, min, max) {
    var xy_dot = [];
    var site_color;
    var rnd_size;
    xy_dot = xy.split('_');
    if (text == '여유') {
        site_color = '#90EE90';
    } else if (text == '보통') {
        site_color = '#e5d34d';
    } else if (text == '약간 붐빔') {
        site_color = '#ff7f00';
    } else if (text == '붐빔') {
        site_color = '#ff0000';
    } else {
        site_color = '#000000';
    }
    if ((min + max) > 130000) {
        rnd_size = 600;
    } else if ((min + max) > 110000) {
        rnd_size = 500;
    } else if ((min + max) > 90000) {
        rnd_size = 400;
    } else if ((min + max) > 70000) {
        rnd_size = 300;
    } else if ((min + max) > 50000) {
        rnd_size = 200;
    } else if ((min + max) > 30000) {
        rnd_size = 100;
    } else {
        rnd_size = 80;
    }
    var circle = new naver.maps.Circle({
        map: map,
        center: new naver.maps.LatLng(xy_dot[1], xy_dot[0]),
        fillOpacity: 0.4,
        radius: rnd_size,
        clickable: true,
        fillColor: site_color,
        strokeColor: site_color
    });
    var sitepop = new naver.maps.InfoWindow({
        content: '<div style="padding:10px;">최소 인구 : ' + min + '</div><div style="padding:10px;">최대 인구 : ' + max + '</div>'
    });
    naver.maps.Event.addListener(circle, 'click', (function (circle, sitepop) {
        return function () {
            sitepop.open(map, new naver.maps.LatLng(xy_dot[1], xy_dot[0]))
        };
    })(circle, sitepop));
    foot_trafic_list.push(circle);
}

function clear_marker(marker_list) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].setMap(null);
    }//다른 구 불러올때 초기화용 기능
    marker_list.length = 0;
}

var traffic_info_list = [];
function road_site(middle, idx, speed) {
    var dots = [];
    var road_color;
    dots = middle.split('|');
    if (idx == '원활') {
        road_color = '#90EE90';
    } else if (idx == '서행') {
        road_color = '#ff7f00';
    } else if (idx == '정체') {
        road_color = '#ff0000';
    } else {
        road_color = '#000000';
    }
    var path = [];
    for (var i = 0; i < dots.length; i++) {
        var middle_m = []
        middle_m = dots[i].split('_');
        path.push(new naver.maps.LatLng(middle_m[1], middle_m[0]));
    }
    var polyline = new naver.maps.Polyline({
        map: map,
        strokeColor: road_color, // 선 색
        strokeOpacity: 0.6, // 투명도
        strokeWeight: 4,
        zIndex: 1,
        clickable: true,
        path: path
    });
    traffic_info_list.push(polyline);
}

var parking_space_list = []
function park_site(x, y, prkfull, prkcnt) {
    if (prkcnt == null) {

    }
    else {

        var parkIcon = "../../../static/data/parking.png";
        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(x, y),
            map: map,
            icon: {
                url: parkIcon,
                size: new naver.maps.Size(50, 50),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(25, 25)
            }
        });
        var prkref = '주차된 차량 : ' + (prkfull - prkcnt);
        var prkInf = new naver.maps.InfoWindow({
            content: '<div style="padding:10px;">주차장 수용량 : ' + prkfull + '</div><div style="padding:10px;">' + prkref + '</div>'
        });
        naver.maps.Event.addListener(marker, 'click', (function (marker, prkInf) {
            return function () {
                var latlng = new naver.maps.LatLng(37.3595704, 127.105399);
                prkInf.open(map, marker);
            };
        })(marker, prkInf));
        parking_space_list.push(marker);
    }
}

var accident_list = [];
var csvFile = '../../../static/data/AlcoholAccident.csv';

Papa.parse(csvFile, {
    download: true,
    complete: function (results) {
        var data = results.data;

        for (var i = 1; i < data.length; i++) {
            var row = data[i];
            var name = row[0];
            // name: 주소
            var latitude = parseFloat(row[1]);
            // latitude: 경도
            var longitude = parseFloat(row[2]);
            // longitude: 위도
            var count = parseInt(row[3]);
            // count: 발생건수


            if (name.includes(cur_gu)) {
                var location = new naver.maps.LatLng(latitude, longitude);

                var iconUrl;
                if (count === 3) {
                    iconUrl = '../../../static/data/accident3.jpg';
                } else if (count === 4) {
                    iconUrl = '../../../static/data/accident4.jpg';
                } else if (count === 5) {
                    iconUrl = '../../../static/data/accident5.jpg';
                } else if (count === 6) {
                    iconUrl = '../../../static/data/accident6.jpg';
                }

                var marker = new naver.maps.Marker({
                    position: location,
                    map: map,
                    icon: {
                        url: iconUrl,
                        size: new naver.maps.Size(50, 27),
                        origin: new naver.maps.Point(0, 0),
                        anchor: new naver.maps.Point(25, 26)
                    }
                });

                var infowindow = new naver.maps.InfoWindow({
                    content: '<div style="padding:10px;">' + name + '</div>'
                });

                naver.maps.Event.addListener(marker, 'click', (function (marker, infowindow) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                })(marker, infowindow));
                accident_list.push(marker);
            }
        }
    }
});


// document.querySelector("#getguName").addEventListener("click", function () {
//     var guSelectValue = document.getElementById('guSelect').value;
//     fetch("/getGu/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": "{{ csrf_token }}"
//         },
//         body: JSON.stringify({ guSelectValue: guSelectValue })
//     })
//         .then(response => response.json())
//         .then(data => {
//             clear_marker(foot_trafic_list);
//             clear_marker(traffic_info_list);
//             clear_marker(parking_space_list);
//             for (var i = 0; i < data.pops.length; i++) {
//                 site_point(data.pops[i].AREA_XY, data.pops[i].AREA_CONGEST_LVL, data.pops[i].AREA_PPLTN_MIN, data.pops[i].AREA_PPLTN_MAX);
//             }
//             for (var i = 0; i < data.roads.length; i++) {
//                 road_site(data.roads[i].XYLIST, data.roads[i].IDX, data.roads[i].SPD);
//             }
//             for (var i = 0; i < data.parks.length; i++) {
//                 park_site(data.parks[i].LAT, data.parks[i].LNG, data.parks[i].CPCTY, data.parks[i].CUR_PRK_CNT);
//             }
//         });
// });