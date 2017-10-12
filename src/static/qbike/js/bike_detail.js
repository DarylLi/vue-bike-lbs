/**
 * Created by lihaotian on 2016/12/13.
 */
var _bike_obj={
    init:function(){
    $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
    this.drawMap();
    this.drawChartI();
    this.drawChartII();
    this.componentInit();
    },
    componentInit:function(){
        $(".map-ctrl-goBack").on("click",function(){
            window.history.go(-1);
        });;
    },
    drawMap:function(){
        var map = new AMap.Map('mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 4,
            center: [102.342785, 35.312316]
        });
        map.setMapStyle('blue_night');
        map.setFeatures(['bg','road']);
        var lineArr = [
            [116.368904, 39.913423],
            [116.382122, 39.901176],
            [116.387271, 39.912501],
            [116.398258, 39.904600]
        ];
        var polyline = new AMap.Polyline({
            path: lineArr,          //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(map);
        new AMap.Marker({
            map: map,
            position:lineArr[0],
            icon: new AMap.Icon({
                size: new AMap.Size(64, 64),  //图标大小
                image: "http://www.haotu.net/up/3772/64/280-biking-bicycle.png",
                //imageOffset: new AMap.Pixel(11, 26)
                //size: new AMap.Size(40, 50),  //图标大小
                //image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                imageOffset: new AMap.Pixel(0, 0)
            })
        });
        map.setZoomAndCenter(14,lineArr[0]);
    },
    drawChartI:function(){
        var myChart = echarts.init(document.getElementById('main'));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['骑行次数']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '骑行次数',
                    min: 0,
                    max: 2500,
                    interval: 500,
                    axisLabel: {
                        formatter: '{value} 次'
                    }
                }
            ],
            series: [
                {
                    name:'骑行次数',
                    type:'bar',
                    data:[20, 49, 70, 232, 256, 767, 1356, 162, 326, 200, 64, 33]
                }
            ]
        };
        myChart.setOption(option);
    },
    drawChartII:function(){
        var myChart = echarts.init(document.getElementById('main1'));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['里程','时长']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '里程',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value} km'
                    }
                },
                {
                    type: 'value',
                    name: '时长',
                    min: 0,
                    max: 25,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value} h'
                    }
                }
            ],
            series: [
                {
                    name:'里程',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name:'时长',
                    type:'line',
                    yAxisIndex: 1,
                    data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        myChart.setOption(option);
    }}
_bike_obj.init();