/**
 * Created by lihaotian on 2017/07/03.
 */

var transfer={
    currPos:"",
    endPos:"",
    init:function(){
        this.endPos=eval(getUrlParam("pos"));
        console.log(this.endPos);
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.componentInit();
    },
    componentInit:function(){
        var _obj=this;
        $(".detail_panel a").on("click",function(){
            if(_obj.currPos){
                $(".detail_panel a").removeClass("active");
                $(this).addClass("active");
                switch($(this).attr("type")){
                    case 'driving':
                        _obj.drivingLine();
                        return ;
                    case 'riding':
                        _obj.ridingLine();
                        return ;
                    case 'walking':
                        _obj.walkingLine();
                        return ;
                    case 'bus':
                        _obj.busLine();
                        return ;
                }
            }
;
        })
    },
    drawMap:function() {
        var _obj=this;
            var map = this.map = new AMap.Map('dt_mapDiv', {
                layers: [new AMap.TileLayer({
                    textIndex: 2
                })],
                resizeEnable: true,
                zoom: 13,
                center: [116.291035,39.907899]
            });

        var geolocation;
        map.plugin('AMap.Geolocation', function() {
             geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition:'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        function onComplete(data) {
            var lng=data.position.getLng();
            var lat=data.position.getLat();
            _obj.currPos=[lng,lat];
            _obj.drivingLine();
            //根据起、终点坐标查询公交换乘路线


        }
        //解析定位错误信息
        function onError(data) {
            //document.getElementById('tip').innerHTML = '定位失败';
        }
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);
    },
    drivingLine:function(){
        $("#tran-panel").html("");
        console.log(this.currPos);
        this.map.clearMap();
        var drivingOption = {
            policy:AMap.DrivingPolicy.LEAST_TIME,
            map: this.map,
            panel:'tran-panel'
        };
        var driving = new AMap.Driving(drivingOption)
        driving.search(this.currPos, this.endPos,function(status, result){
            if(status === 'complete'){
                return;
            }
            else{
                $("#tran-panel").html("不推荐此出行方式");
            }
        });
    },
    walkingLine:function(){
        $("#tran-panel").html("");
        this.map.clearMap();
        var _obj=this;
        var walking = new AMap.Walking(); //构造路线导航类
        walking.search(this.currPos, this.endPos, function(status, result){
            if(status === 'complete'){
                (new Lib.AMap.WalkingRender()).autoRender({
                    data: result,
                    map: _obj.map,
                    panel:'tran-panel'
                });
            }
            else{
                $("#tran-panel").html("不推荐此出行方式");
            }
        });
    },
    busLine:function(){
        $("#tran-panel").html("");
        this.map.clearMap();
        var _obj=this;
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        var cur_city;
            geocoder.getAddress(this.endPos, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                cur_city=result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province;
                console.log(cur_city);
                var transferOptions = {
                    city:cur_city,//跨城进行公交路径规划时，目的地所在城市
                    policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                };
                var transfer = new AMap.Transfer (transferOptions);
                transfer.search(_obj.currPos, _obj.endPos, function(status, result){
                    if(status == 'complete'){
                        (new Lib.AMap.TransferRender()).autoRender({
                            data:result,
                            map:_obj.map,
                            panel:'tran-panel'
                        });
                    }else{
                        $("#tran-panel").html("不推荐此出行方式");
                    }
                });
            }
        });
    },
    ridingLine:function(){
        $("#tran-panel").html("");
        this.map.clearMap();
        var riding = new AMap.Riding({
            map: this.map,
            panel:'tran-panel'
        }); //构造路线导航类
        riding.search(this.currPos, this.endPos,function(status,result){
            if(status == 'complete'){
                return;
            }
            else{
                $("#tran-panel").html("不推荐此出行方式");
            }

        });
    }
};
function handle_alert(){
    $("#m_info").text("处理故障后，单车将变为可用状态，该预警信息将被清空。");
    $("#f_info").text("确认单车故障已处理完毕?");
    $("#judge_alert").modal('show');
    $("#save_judge").off("click");
    $("#save_judge").on("click",function(){
        $('#judge_alert').modal('hide')
    });
}
var list_flag=true;
//日期格式
Date.prototype.format = function(fmt) {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var date = this.getDate();
    var hour = this.getHours();
    var minute = this.getMinutes();
    var second = this.getSeconds();

    fmt = fmt.replace("yyyy", year);
    fmt = fmt.replace("yy", year % 100);
    fmt = fmt.replace("MM", fix(month));
    fmt = fmt.replace("dd", fix(this.getDate()));
    fmt = fmt.replace("hh", fix(this.getHours()));
    fmt = fmt.replace("mm", fix(this.getMinutes()));
    fmt = fmt.replace("ss", fix(this.getSeconds()));
    return fmt;

    function fix(n) {
        return n < 10 ?
        "0" + n :
            n;
    }
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$(document).ready(function(){
    transfer.init();
})
