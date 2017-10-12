/**
 * Created by lihaotian on 2016/12/15.
 */
var _defautBiz =
    _defautBiz || {
        env: 'product',
        _baseUrl: function() {
            return this.env == 'debug' ? '/static/mock' : ''
        },
        api: function(name) {
            return this._api(this._baseUrl())[this.env][name];
        },
        _api: function(_baseUrl) {
            var _v = new Date().getTime();
            return {
                debug: {
                    showHot: _baseUrl +'/HotPoint.json',
                    taskBub: _baseUrl +'/taskBub2.json',
                    taskTypeList: _baseUrl +'/typeList.json',
                    taskStatusList: _baseUrl +'/statusList.json',
                    view:_baseUrl +'/IM_view.json'
                },
                product: {
                    showHot:'/hotpoint/list',
                    taskBub:'/task/taskBub',
                    taskTypeList:'/task/taskTypeList',
                    taskStatusList:'/task/taskStatusList',
                    view:"/illegal/list"
                }
            }
        }
    };

var bMap={
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
    map_markers:[],
    mission_type:"",
    mission_state:"",
    userId:getUrlParam("userId"),
    init:function(){
        $("#userName").text(getUrlParam("userName"))
        $("#userName").attr("href","/tide/ownMission.html?userName="+getUrlParam("userName")+"&userId="+getUrlParam("userId"))
        $("#list_mode").attr("href","/tide/work_list.html?userName="+getUrlParam("userName")+"&userId="+getUrlParam("userId"))
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.componentInit();
        var listObj=document.getElementById('list-type');
        $.ajax({
            url: _defautBiz.api("taskTypeList"),
            dataType: "json",
            method: 'get',
            success: function(data) {
                if(data.success && data.data){
                    var listType = data.data;
                    listObj.options.length = 0;
                    listObj.options.add(new Option("全部",""),"");
                    for(var i = 0; i < listType.length;i++){
                        listObj.options.add(new Option(listType[i].name,listType[i].value),""); //这个兼容IE与firefox
                    }
                }
            }});
        var stateObj=document.getElementById('list-state');
        $.ajax({
            url: _defautBiz.api("taskStatusList"),
            dataType: "json",
            method: 'get',
            success: function(data) {
                if(data.success && data.data){
                    var stateList = data.data;
                    stateObj.options.length = 0;
                    stateObj.options.add(new Option("全部",""),"");
                    for(var i = 0; i < stateList.length;i++){
                        stateObj.options.add(new Option(stateList[i].name,stateList[i].value),""); //这个兼容IE与firefox
                    }
                }
            }});
    },
    componentInit:function(){
        var _obj=this;
        $("#list-searching").on("click",function(){
            _obj.mission_type=$("#list-type").val();
            _obj.mission_state=$("#list-state").val();
            _obj.mapPointsUpdate();
        })
        $("#add_goBack,#know").on("click",function(){
            $(".mission_detail").animate({"opacity":0});
            $(".mission_detail").hide();
        })

    },
    mapPointsUpdate: function() {
        _obj = this;
        var bounds=_obj.map.getBounds();
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("taskBub"),
            data:{
                lng:_obj.map_lng,
                lat:_obj.map_lat,
                mapZoom:_obj.map_zoom,
                taskStatus: _obj.mission_state,
                bikeType: _obj.mission_type,
                userId:_obj.userId,
                topRightLng:bounds.getNorthEast().getLng(),
                topRightLat:bounds.getNorthEast().getLat(),
                bottomLeftLng:bounds.getSouthWest().getLng(),
                bottomLeftLat:bounds.getSouthWest().getLat()
            },
            dataType: "json",
            method: 'get',
            success: function(resp) {
                if (_obj.map_zoom > 13&&resp.data.data.datas) {
                    _obj.map.remove(_obj.map_markers);
                    _obj.areaList = [];
                    for (var i in resp.data.data.datas) {
                        _obj.areaList.push({
                            "lnglat": [resp.data.data.datas[i].fixedLng, resp.data.data.datas[i].fixedLat],
                            "name": resp.data.data.datas[i].bikeId,
                            "status": resp.data.data.datas[i].bikeType,
                            "targetlnglat": resp.data.data.datas[i].centerPointLng&&resp.data.data.datas[i].centerPointLat?[resp.data.data.datas[i].centerPointLng, resp.data.data.datas[i].centerPointLat]:"",
                            "hotpointId": resp.data.data.datas[i].hotpointId,
                            "taskId": resp.data.data.datas[i].id,
                            "bikeId": resp.data.data.datas[i].bikeId,
                            "taskSeq":resp.data.data.datas[i].taskSeq,
                            "lockUploadTime":resp.data.data.datas[i].lockUploadTime,
                            "fixedTime":resp.data.data.datas[i].fixedTime,
                            "fixedType":resp.data.data.datas[i].fixedType,
                            "fixedLocStreet":resp.data.data.datas[i].fixedLocStreet,
                            "fixedLocStreet":resp.data.data.datas[i].fixedLocStreet,
                            "lockUploadTime":resp.data.data.datas[i].lockUploadTime,
                            "taskStatusStr":resp.data.data.datas[i].taskStatusStr,
                            "power":resp.data.data.datas[i].power
                        });
                    }
                    _obj.drawMass();
                    _obj.drawMission();
                    _obj.drawPolygon();
                } else if (_obj.map_zoom <= 13 && _obj.map_zoom >= 10) {
                    scroll_flag=true;
                    _obj.map.remove(_obj.map_markers);
                    _obj.map.remove(_obj.targetList);
                    _obj.map.remove(_obj.polygonList);
                    _obj.map.remove(_obj.lineList);
                    $(".select-panel").hide();
                    _obj.lineFlag=false;
                    if(_obj.targetMark)_obj.map.remove(_obj.targetMark);
                    //移除Mass&Line&Polygon&Area
                    _obj.massBuild = false;
                    _obj.map.remove(_obj.zoomMass);
                    for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                    _obj.map_massList = [];
                    _obj.areaList = [];
                    if(resp.data.length>0)
                    for (var i in resp.data) {
                        _obj.areaList.push({
                            "lnglat": [resp.data[i].lng, resp.data[i].lat],
                            "name": resp.data[i].areaName,
                            "count":   resp.data[i].count?resp.data[i].count:0
                            //"count": "--"
                        });
                    }
                    _obj.drawMarkers();
                    $(".filter-bk").each(function(){
                        $(this).removeClass("darkness");
                    });
                    //$("#map-ctrl-satellite").hide();
                    $(".button_panel").hide();
                }
                else{
                    scroll_flag=true;
                    _obj.map.remove(_obj.map_markers);
                    _obj.massBuild = false;
                    _obj.map.remove(_obj.targetList);
                    _obj.map.remove(_obj.zoomMass);
                    _obj.map.remove(_obj.polygonList);
                    for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                    _obj.map_massList = [];
                    _obj.areaList = [];
                    if(resp.data.length>0)
                    for (var i in resp.data) {
                        _obj.areaList.push({
                            "lnglat": [resp.data[i].lng, resp.data[i].lat],
                            "name": resp.data[i].areaName,
                            "count": resp.data[i].count?resp.data[i].count:0
                            //"count": "--"
                        });
                    }
                    _obj.drawMarkers();
                    $(".button_panel").hide();
                }
            }
        });
        //}
    },
    drawMass: function() {
        var _obj=this;
        this.map_markers = [];
        //if (!this.massBuild) {
        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
        _obj.map_massList = [];
            if(_obj.areaList.length>0){this.massBuild = true;}
            for (var i in _obj.areaList) {
                var pos = _obj.areaList[i].lnglat;
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
                var marker = new AMap.Marker({
                    position: pos,
                    //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                    content: '<div class="marker-route marker-marker-bus-from" style="background: url('+img_url+');background-size:cover;width: 55px;height: 61px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 59px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center;color:#fff;">'+_obj.areaList[i].taskSeq+'</div></div>',
                    offset: {
                        x: -30,
                        y: -55
                    }
                });
                marker.loc = pos;
                marker.taskId =_obj.areaList[i].taskId;
                marker.bikeNum=_obj.areaList[i].bikeId;
                marker.taskStatusStr=_obj.areaList[i].taskStatusStr;
                marker.fixedType=_obj.areaList[i].fixedType;
                marker.power=_obj.areaList[i].power;
                marker.fixedTime=_obj.areaList[i].fixedTime;
                marker.lockUploadTime=_obj.areaList[i].lockUploadTime;
                marker.currentPos=_obj.areaList[i].fixedLocStreet;
                marker.setMap(_obj.map);
                marker.on('click', function (e) {
                    var _mk=this;
                    $(".mission_detail").show();
                    $(".mission_detail").animate({"opacity":1});
                    $("#car_id").text(_mk.bikeNum);
                    $("#task_status").text(_mk.taskStatusStr);
                    $("#loc_type").text(_mk.fixedType);
                    $("#power").text(_mk.power+"%");
                    $("#fixed_time").text(_mk.fixedTime);
                    $("#locked_time").text(_mk.lockUploadTime);
                    $("#new_pos").text(_mk.currentPos);
                });
                this.map_massList.push(marker);
            }
            //_obj.map.setZoomAndCenter(16,_obj.areaList[0].lnglat);
        //}
    },
    //    drawMass: function() {
    //    var _obj=this;
    //    if (!this.massBuild) {
    //        if(_obj.areaList.length>0){this.massBuild = true;}
    //        var mass = this.mapMass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
    //            //return e.status != 5
    //            return e.warnType != 5&&e.warnType!=8;
    //        }), {
    //            url: '/static/qbike/img/enable.png',
    //            anchor: new AMap.Pixel(23, 42),
    //            size: new AMap.Size(48, 51),
    //            opacity: 1,
    //            cursor: 'pointer',
    //            zIndex: 5
    //        });
    //        //离线地图图标初始
    //        this.off1Mass=Genertate(8,1);
    //        this.map_massList.push(this.off1Mass);
    //        this.off1Mass.setMap(this.map);
    //
    //        this.off2Mass=Genertate(8,2);
    //        this.map_massList.push(this.off2Mass);
    //        this.off2Mass.setMap(this.map);
    //
    //        this.off3Mass=Genertate(8,3);
    //        this.map_massList.push(this.off3Mass);
    //        this.off3Mass.setMap(this.map);
    //        //长时未用地图图标初始
    //        this.long1Mass=Genertate(5,1);
    //        this.map_massList.push(this.long1Mass);
    //        this.long1Mass.setMap(this.map);
    //
    //        this.long2Mass=Genertate(5,2);
    //        this.map_massList.push(this.long2Mass);
    //        this.long2Mass.setMap(this.map);
    //
    //        this.long3Mass=Genertate(5,3);
    //        this.map_massList.push(this.long3Mass);
    //        this.long3Mass.setMap(this.map);
    //
    //        this.off4Mass=Genertate(8,4);
    //        this.map_massList.push(this.off4Mass);
    //        this.off4Mass.setMap(this.map);
    //
    //        function Genertate(type,level){
    //            var name=(type==8?"off":"long")+level;
    //            var mass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
    //                return e.warnType == type&&e.level==level;
    //            }), {
    //                url: '/static/qbike/img/'+name+'.png',
    //                anchor: new AMap.Pixel(23, 42),
    //                size: new AMap.Size(48, 51),
    //                opacity: 1,
    //                cursor: 'pointer',
    //                zIndex: 5
    //            });
    //            return mass;
    //        }
    //        this.map_massList.push(this.mapMass);
    //        this.mapMass.setMap(this.map);
    //
    //        for(var i in this.map_massList){
    //            this.map_massList[i].on('click', function(e) {
    //                var warn_list=[];
    //                var resultObj={};
    //                localStorage.bike_id = e.data.name;
    //                _obj.lineFlag=true;
    //                if(_obj.lineFlag){
    //                    _obj.inLine.beginLine=e.data.lnglat;
    //                    _obj.inLine.bikeNum=e.data.name;
    //                    //_obj.inLine.bikeNum=e.data.name;
    //                }
    //            })
    //        };
    //    }
    //    else{
    //        if(this.areaList.length>0){
    //            var normalMass=$.grep(this.areaList, function(e) {
    //                return e.warnType != 5&&e.warnType!=8
    //            });
    //            var off1Mass=checkMass(8,1);
    //            this.off1Mass.show();
    //            this.off1Mass.setData(off1Mass);
    //            if(off1Mass.length==0){this.off1Mass.hide()}
    //
    //            var off2Mass=checkMass(8,2);
    //            this.off2Mass.show();
    //            this.off2Mass.setData(off2Mass);
    //            if(off2Mass.length==0){this.off2Mass.hide()}
    //
    //            var off3Mass=checkMass(8,3);
    //            this.off3Mass.show();
    //            this.off3Mass.setData(off3Mass);
    //            if(off3Mass.length==0){this.off3Mass.hide()}
    //
    //            var off4Mass=checkMass(8,4);
    //            this.off4Mass.show();
    //            this.off4Mass.setData(off4Mass);
    //            if(off4Mass.length==0){this.off4Mass.hide()}
    //
    //            var long1Mass=checkMass(5,1);
    //            this.long1Mass.show();
    //            this.long1Mass.setData(long1Mass);
    //            if(long1Mass.length==0){this.long1Mass.hide()}
    //
    //            var long2Mass=checkMass(5,2);
    //            this.long2Mass.show();
    //            this.long2Mass.setData(long2Mass);
    //            if(long2Mass.length==0){this.long2Mass.hide()}
    //
    //            var long3Mass=checkMass(5,3);
    //            this.long3Mass.show();
    //            this.long3Mass.setData(long3Mass);
    //            if(long3Mass.length==0){this.long3Mass.hide()}
    //
    //            function checkMass(type,level){
    //                var mass=$.grep(_obj.areaList, function(e) {
    //                    return e.warnType == type&&e.level==level;
    //                });
    //                return mass;
    //            }
    //            this.mapMass.show();
    //            this.mapMass.setData(normalMass);
    //            if(normalMass.length==0){this.mapMass.hide()}
    //        }
    //        else {
    //            for(var i in this.map_massList){
    //                this.map_massList[i].hide();
    //            }
    //        }
    //    }
    //
    //},
    drawMarkers: function() {
        _obj = this;
        var lnglat_list = this.areaList.map(function(e, i) {
            return {
                lng: e.lnglat[0],
                lat: e.lnglat[1],
                name: e.name,
                count: e.count > 100000 ? "100,000+" : e.count.toLocaleString()
                //count: "100,000+"
            }
        });
        this.map_markers = [];
        if(lnglat_list.length>0){
            for (var i in lnglat_list) {
                var pos = [lnglat_list[i].lng, lnglat_list[i].lat];
                var marker = new AMap.Marker({
                    position: pos,
                    //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                    content: '<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/tide/circle.png);background-size:cover;width: 85px;height: 95px;color:#666;"><div class="area_name" style="color:#ff9600;padding:0 10px;padding-top:25px;font-size:16px;width: 85px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center">' + lnglat_list[i].name+ '</div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px">' + lnglat_list[i].count + '</div></div>',
                    offset: {
                        x: -42,
                        y: -96
                    }
                });
                marker.loc = pos;
                marker.setMap(_obj.map);
                marker.on('click', function(e) {
                    if (_obj.map.getZoom() < 10) {
                        //console.log(this.loc[0]+":"+this.loc[1]);
                        _obj.searching_lat=this.loc[1];
                        _obj.searching_lng=this.loc[0];
                        _obj.map.setZoomAndCenter(10, this.loc);
                    }

                    else {
                        _obj.searching_lat=this.loc[1];
                        _obj.searching_lng=this.loc[0];
                        _obj.map.setZoomAndCenter(15, this.loc);
                    }
                });
                this.map_markers.push(marker);
            }
        }

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
                        console.log(AreaItem[j]);
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
    drawMap:function() {
        var _obj=this;
        if(this.first_load){
            var map = this.map = new AMap.Map('dt_mapDiv', {
                layers: [new AMap.TileLayer({
                    textIndex: 2
                })],
                zoom: 4,
                center: [102.342785, 35.312316]
            });
            //输入提示
            this.auto = new AMap.Autocomplete({
                input: "tipinput"
            });
            //地址解析
            this.geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            this.zoomPre=this.zoomCur=3;
            AMap.plugin(['AMap.ToolBar'],
                function () {
                    map.addControl(new AMap.ToolBar());
                });

            this.map_zoom = 3;
            this.zoomPre=this.zoomCur=3;
            this.map_lat = 31.847684;
            this.map_lng = 117.317514;
            $.ajax({
                url: _defautBiz.api("taskBub"),
                dataType: "json",
                data:{
                    lng:_obj.map_lng,
                    lat:_obj.map_lat,
                    mapZoom:_obj.map_zoom,
                    userId:_obj.userId
                },
                method: 'get',
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                },
                success: function(resp) {
                    _obj.areaList = [];
                    if (resp.data.length>0) {
                        for (var i in resp.data) {
                            _obj.areaList.push({
                                "lnglat": [resp.data[i].lng, resp.data[i].lat],
                                "name": resp.data[i].areaName,
                                "count":  resp.data[i].count?resp.data[i].count:0
                            });
                        }
                    }
                    //else {
                    //    for (var i in resp.data.bikes) {
                    //        _obj.areaList.push({
                    //            "lnglat": [resp.data.bikes[i].lng, resp.data.bikes[i].lat],
                    //            "name": resp.data.bikes[i].bid
                    //        });
                    //    }
                    //}
                    _obj.drawMarkers();
                    var zoomListener = AMap.event.addListener(_obj.map, "zoomend", function(e) {
                        _obj.gps_flag=false;
                        _obj.zoomPre=_obj.map_zoom;
                        _obj.map_zoom = _obj.map.getZoom();
                        _obj.zoomCur=_obj.map_zoom;
                        _obj.map_lat = _obj.searching_lat==""?_obj.map.getCenter().getLat():_obj.searching_lat;
                        _obj.map_lng = _obj.searching_lng==""?_obj.map.getCenter().getLng():_obj.searching_lng;
                        _obj.searching_lng="";
                        _obj.searching_lat="";
                        _obj.geocoder.getAddress([_obj.map_lng,_obj.map_lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                _obj.cur_city=result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province;
                                _obj.cur_district=result.regeocode.addressComponent.district?result.regeocode.addressComponent.district:"";
                            }
                            else{
                                _obj.cur_city="全国";
                                _obj.cur_district="";
                            }
                        });
                        setTimeout(function(){
                            _obj.mapPointsUpdate();
                        },500)
                        //}
                    });
                    var dragListener = AMap.event.addListener(_obj.map, "dragend", function(e) {
                        _obj.zoomPre=_obj.map_zoom;
                        _obj.map_zoom = _obj.map.getZoom();
                        _obj.zoomCur=_obj.map_zoom;
                        _obj.map_lat = _obj.map.getCenter().getLat();
                        _obj.map_lng = _obj.map.getCenter().getLng();
                        _obj.mapPointsUpdate();
                        _obj.geocoder.getAddress([_obj.map_lng,_obj.map_lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                _obj.cur_city=result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province;
                                _obj.cur_district=result.regeocode.addressComponent.district?result.regeocode.addressComponent.district:"";
                            }
                            else{
                                _obj.cur_city="全国";
                                _obj.cur_district="";
                            }
                        });
                    });
                    var autoOptions = {
                        input: "search-panel"
                    };
                    var auto = new AMap.Autocomplete(autoOptions);
                    var srh_enable = true;
                    var placeSearch = new AMap.PlaceSearch({
                        map: map
                    }); //构造地点查询类
                    AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
                    function select(e) {
                        var dist = e.poi.district == "" || null ? "" : e.poi.district;
                        var name = e.poi.name == "" || null ? "" : e.poi.name;
                        setTimeout(function() {
                            $("#search-panel").val(dist + name);
                        }, 100);
                    }
                }
            });
            if(getUrlParam("lng")&&getUrlParam("lat")){
                _obj.searching_lat=getUrlParam("lat");
                _obj.searching_lng=getUrlParam("lng");
                _obj.map.setZoomAndCenter(20, [_obj.searching_lng,_obj.searching_lat]);
            }
            this.first_load = false;

        }
        else{
            if(_obj.pos_list.length>0){
            }
        }
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

//告警类型解析
function warnType_parser(warnType){
    switch (warnType) {
        case 0:
            return '未知'
            break;
        case 1:
            return '车辆丢失'
            break;
        case 2:
            return '车辆损坏'
            break;
        case 3:
            return '车辆电量低'
            break;
        case 4:
            return '异常移动'
            break;
        case 5:
            return '长时未骑'
            break;
        case 6:
            return '撬锁'
            break;
        case 8:
            return '离线'
            break;
        case 9:
            return '长时未锁'
            break;
    }
}

//预警详情
function go_Alert(num){
    if(!num){
        localStorage.alert_detail_indx=0;
    }
    else{
        localStorage.alert_detail_indx=num;
    }
    window.location.href="/supervise/alert_detail.html";
}
//正负充放电切换
function charegeState(num){
    if(parseInt(num)<0) {
        return "(放)" + Math.abs(num);
    }
    else{
        return "(充)"+Math.abs(num);
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
bMap.init();
