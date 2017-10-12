/**
 * Created by lihaotian on 2016/12/15.
 */
var _defautBiz =
    _defautBiz || {
        env: 'product',
        _baseUrl: function() {
            return this.env == 'debug' ? '/static/mock' : '/index'
        },
        api: function(name) {
            return this._api(this._baseUrl())[this.env][name];
        },
        _api: function(_base_url) {
            var _v = new Date().getTime();
            return {
                debug: {
                    showHot: _base_url +'/HotPoint.json',
                    groundTaskList:_base_url +'/ground_tasks.json',
                    saveMission:_base_url +'/success.json',
                    view:"http://192.168.130.210:8081/ground/view"

                },
                product: {
                    showHot:'/hotpoint/list',
                    groundTaskList:'/task/groundTaskList',
                    saveMission: '/task/updateTask',
                    view:'/illegal/list'
                }
            }
        }
    };
var totArea=[];
var pending={
    geocoder:null,
    map:null,
    pos_list:[],
    data_storage:[],
    map_massList:[],
    mapMass:null,
    map_lng: null,
    map_lat: null,
    tot_page:0,
    cur_page:1,
    first_load:true,
    areaList: [],
    zoomMass:"",
    geo_type:0,
    gps_flag:true,
    cur_city:"",
    cur_district:"",
    searching_lng:"",
    searching_lat:"",
    zoomPre:null,
    zoomCur:null,
    warn_type:"",
    warn_source:"",
    warn_lvl:"",
    judgmentStr:"",
    areas:"",
    targetMark:"",
    targetList:[],
    lineFlag:false,
    lineList:[],
    inLine:{},
    polygonList:[],
    requestNum:[],
    auto:"",
    massBuild:false,
    taskStatus:2,
    bikeType:"",
    init:function(){
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.componentInit();
    },
    componentInit:function(){
        var _obj=this;
        $(".navbar-header a").on("click",function(){
            $(".navbar-header a").removeClass("active");
            $(this).addClass("active");
            _obj.bikeType=$(this).attr("type");
            _obj.drawMass();
        });
        $("#ctrl_status").on("click",function(){
            if($(this).hasClass("all-stat")){$(this).removeClass("all-stat");$(this).text("不显示已完成任务"); _obj.taskStatus=2;_obj.drawMass();}
            else {$(this).addClass("all-stat");$(this).text("显示已完成任务");_obj.taskStatus=0;_obj.drawMass();}
        })
    },
    drawPolygon:function(){
        var _obj=this;
        _obj.map.remove(_obj.polygonList);
        _obj.polygonList=[];
        totArea=[];
        $.ajax({
            url: _defautBiz.api("view"),
            dataType: "json",
            method: 'get',
            success: function (data) {
                for(var indx in data.data){
                    totArea.push(data.data[indx].region);
                }
                for(var i in totArea){
                    var AreaItem=eval(totArea[i]);
                    for(var j in AreaItem){
                        var polygon = new AMap.Polygon({
                            path: AreaItem[j], //设置多边形边界路径
                            // path: polygonArr,//设置多边形边界路径
                            strokeColor: "#ff9600", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线宽
                            fillOpacity: 0.5 //填充透明度
                        });
                        polygon.setMap(_obj.map);
                        _obj.polygonList.push(polygon);
                    }
                }
            }
        })
    },
    drawMission:function(){
        var _obj=this;
        _obj.map.remove(_obj.targetList);
        _obj.map.remove(_obj.lineList);
        this.areaBuild=true;
        var MarkerList=uniqeByKeys(_obj.areaList,['hotpointId']);
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("showHot"),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                var MarkerList=resp.data;
                for (var i in MarkerList) {
                        if(MarkerList[i].centerPointLng&&MarkerList[i].centerPointLat){
                            var buble_url=(function(type)
                                {
                                    switch(type){
                                        case 1:
                                            return '/static/qbike/img/tide/hot.png'
                                            break;
                                        case 2:
                                            return '/static/qbike/img/tide/loc.png'
                                            break;
                                    }
                                }
                            )(parseInt(MarkerList[i].hotpointType));
                    var targetMark = new AMap.Marker({
                        position:[MarkerList[i].centerPointLng,MarkerList[i].centerPointLat],
                        //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                        content: '<div class="marker-route marker-marker-bus-from" style="background: url('+buble_url+');background-size:cover;width: 78px;height: 78px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 75px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center"><span id="'+MarkerList[i].needNumber+'"style="border:0px solid #fff;width:40px;color:#fff;text-align: center">'+MarkerList[i].needNumber+'</span></div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px"></div></div>',
                        offset: {
                            x: -34,
                            y: -66
                        }
                    });
                    targetMark.display=true;
                    targetMark.requestNum=MarkerList[i].needNumber;
                    targetMark.targetId=MarkerList[i].id;
                    targetMark.setMap(_obj.map);
                    _obj.targetList.push(targetMark);
                }
                    }

            }})
        for (var i in _obj.areaList) {
                if(_obj.areaList[i].targetlnglat){
            var polyline = new AMap.Polyline({
                path: [_obj.areaList[i].lnglat,_obj.areaList[i].targetlnglat],          //设置线覆盖物路径
                strokeColor: "#ff4133", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                zIndex:-1,
                strokeDasharray: [10, 5] //补充线样式
            });
            _obj.lineList.push(polyline);
            polyline.setMap(_obj.map);
        }
            }
    },
    drawMass: function() {
        var _obj=this;
        _obj.areaList = [];
        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
        this.map_massList = [];
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("groundTaskList"),
            dataType: "json",
            data: {
                status: _obj.taskStatus,
                type: _obj.bikeType,
            },
            method: 'get',
            success: function(resp) {
                if(resp.data.length>0){

                for(var i in resp.data){
                    _obj.areaList.push({
                        "lnglat": [resp.data[i].fixedLng, resp.data[i].fixedLat],
                        "targetlnglat": resp.data[i].centerPointLng&&resp.data[i].centerPointLat?[resp.data[i].centerPointLng, resp.data[i].centerPointLat]:"",
                        "hotpointId": resp.data[i].hotpointId,
                        "taskId": resp.data[i].id,
                        "bikeId": resp.data[i].bikeId,
                        "taskSeq":resp.data[i].taskSeq,
                        "status": resp.data[i].bikeType,
                        "lockUploadTime":resp.data[i].lockUploadTime,
                        "fixedTime":resp.data[i].fixedTime,
                        "fixedType":resp.data[i].fixedType,
                        "fixedLocStreet":resp.data[i].fixedLocStreet,
                        "taskStatusStr":resp.data[i].taskStatusStr,
                        "lastPhone":resp.data[i].lastUser,
                        "lastTime":resp.data[i].lastUseStartTime
                    })
                }
                if(_obj.first_load)_obj.map.setZoomAndCenter(16,[resp.data[0].fixedLng, resp.data[0].fixedLat]);
                _obj.first_load=false;
                if(getUrlParam("lng")&&getUrlParam("lat"))_obj.map.setZoomAndCenter(16,[getUrlParam("lng"), getUrlParam("lat")])
                for (var i in _obj.areaList) {
                    var img_url=(function(status,flag)
                        {
                            var url="";
                            if(flag=="进行中")url="_dark";
                            switch(status){
                                case 1:
                                    return '/static/qbike/img/tide/free_marker'+url+'.png'
                                    break;
                                case 2:
                                    return '/static/qbike/img/tide/issue_marker'+url+'.png'
                                    break;
                                case 3:
                                    return '/static/qbike/img/tide/off_marker'+url+'.png'
                                    break;
                            }
                        }
                    )(_obj.areaList[i].status,_obj.areaList[i].taskStatusStr);
                    var pos = _obj.areaList[i].lnglat;
                    var marker = new AMap.Marker({
                        position: pos,
                        //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                        content: '<div class="marker-route marker-marker-bus-from" style="background: url('+img_url+');background-size:cover;width: 55px;height: 61px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 59px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center;color:#fff;">'+_obj.areaList[i].taskSeq+'</div></div>',
                        offset: {
                            x: -30,
                            y: -55
                        }
                    });
                    marker.taskId=_obj.areaList[i].taskId;
                    marker.bikeId=_obj.areaList[i].bikeId;
                    marker.lockUploadTime=_obj.areaList[i].lockUploadTime;
                    marker.fixedTime=_obj.areaList[i].fixedTime;
                    marker.fixedType=_obj.areaList[i].fixedType;
                    marker.fixedLocStreet=_obj.areaList[i].fixedLocStreet;
                    marker.bikeType=_obj.areaList[i].status;
                    marker.lastPhone=_obj.areaList[i].lastPhone;
                    marker.lastTime=_obj.areaList[i].lastTime;
                    marker.loc = pos;
                    marker.setMap(_obj.map);
                    marker.on('click', function (e) {
                        var _mk=this;
                        $(".mission_detail").show();
                        $(".mission_detail").animate({"opacity":1});
                        $("#mission_id").text(_mk.taskId);
                        $("#car_id").text(_mk.bikeId);
                        $("#upload_time").text(_mk.lockUploadTime);
                        $("#fixed_time").text(_mk.fixedTime);
                        $("#fixed_type").text(_mk.fixedType);
                        $("#new_pos").text(_mk.fixedLocStreet);
                        $("#last_phone").text(_mk.lastPhone);
                        $("#last_time").text(_mk.lastTime);
                        $("#add_goBack").off().on("click",function(){
                            $(".mission_detail").animate({"opacity":0});
                            $(".mission_detail").hide();
                        });
                        $("#go_pos").off().on("click",function(){
                            //_obj.map.setZoomAndCenter(16,_mk.loc);
                            var drivingOption = {
                                policy:AMap.DrivingPolicy.LEAST_TIME,
                                map:_obj.map
                            };
                            var driving = new AMap.Driving(drivingOption);
                            driving.searchOnAMAP({
                                origin:_obj.currPos,
                                destination:[_mk.loc[0],_mk.loc[1]]
                            });
                            $(".mission_detail").animate({"opacity":0});
                            $(".mission_detail").hide();
                        })
                        $("#save_Tarea").off().on("click",function(){
                            var params={
                                taskId:_mk.taskId,
                                bikeType:_mk.bikeType,
                                status:$("input[name='state']:checked").val(),
                                remark:$("#area_msg").val()
                            };
                            $.ajax({
                                //lng=121.479711&lat=31.264772
                                url: _defautBiz.api("saveMission"),
                                dataType: "json",
                                data: {
                                    taskId:params.taskId,
                                    taskType:params.bikeType,
                                    status:params.status,
                                    remark:params.remark
                                },
                                method: 'get',
                                success: function(resp) {
                                    _obj.drawMass();
                                    _obj.drawMission();
                                    $(".mission_detail").animate({"opacity":0});
                                    $(".mission_detail").hide();
                                }})
                        });
                    });
                    _obj.map_massList.push(marker);
                }
                _obj.drawMission();
                }
            }});
    },
    drawMap:function() {
        var _obj=this;
            $("#dt_mapDiv").css("height",($(window).height()-43)+"px");
            var map = this.map = new AMap.Map('dt_mapDiv', {
                layers: [new AMap.TileLayer({
                    textIndex: 2
                })],
                zoom: 16,
                zoomEnable:true
            });
            //地址解析
            this.geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
        var zoomListener = AMap.event.addListener(_obj.map, "zoomend", function(e) {
            if(_obj.map.getZoom()<10){
                _obj.map.setZoom(10);
            }
        });

        this.zoomPre=this.zoomCur=3;
            _obj.drawMass();
            _obj.drawPolygon();
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
            //当前位置
            _obj.currPos=[lng,lat];
            //_obj.initList(lng,lat);
            $(".list_ctrl").on("click",function(){
                window.location.href="/tide/operation/pendingMission.html?lng="+lng+"&lat="+lat;
            })
            if(getUrlParam("lng")&&getUrlParam("lat"))_obj.map.setZoomAndCenter(16,[getUrlParam("lng"), getUrlParam("lat")]);
            $(".modal-full").hide();
        }
        //解析定位错误信息
        function onError(data) {
            //document.getElementById('tip').innerHTML = '定位失败';
        }
    }
};
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


//将对象元素转换成字符串以作比较
function obj2key(obj, keys){
    var n = keys.length,
        key = [];
    while(n--){
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
//去重操作
function uniqeByKeys(array,keys){
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr .push(array[i]);
        }
    }
    return arr ;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
$(document).ready(function(){
    pending.init();
});
