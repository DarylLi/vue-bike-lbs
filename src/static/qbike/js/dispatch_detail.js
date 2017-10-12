/**
 * Created by lihaotian on 2016/12/12.
 */
var MapControl="";
var testing_linedata = [getRDList(), getRDList(), getRDList()];
var testing_xaxis = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
var clickListener="";
var moveListener="";
var Flow_resp={};
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
                    statusstatistic: _base_url + '/statusstatistic.json' + "?" + _v,
                    header: _base_url + '/header.json' + "?" + _v,
                    warnlist: _base_url + '/warnlist.json' + "?" + _v,
                    statistichour: _base_url + '/statistichour.json' + "?" + _v,
                    statisticminute: _base_url + '/statisticminute.json' + "?" + _v,
                    statistic_income_hour: _base_url + '/statistic_income_hour.json' + "?_v=" + _v,
                    statistic_income_minute: _base_url + '/statistic_income_minute.json' + "?_v=" + _v,
                    bikeDetail: _base_url + '/bikeDetail.json' + "?" + _v,
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic.json' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic.json' + "?" + _v,
                    listLatestBikes: _base_url + '/listLatestBikes.json' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo'+_v,
                    warningDigest:'/earlyWarning/warningDigest'+ "?_v="+_v,
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list',
                    saveArea:'/track/list'
                },
                product: {
                    statusstatistic: _base_url + '/statusstatistic' + "?" + _v,
                    header: '/tide/statistics/head',
                    warnlist: _base_url + '/warnlist' + "?" + _v,
                    statistichour: _base_url + '/statistichour' + "?_v=" + _v,
                    statisticminute: _base_url + '/statisticminute' + "?_v=" + _v,
                    statistic_income_hour: _base_url + '/statistic_income_hour' + "?_v=" + _v,
                    statistic_income_minute: _base_url + '/statistic_income_minute' + "?_v=" + _v,
                    bikeDetail: _base_url + '/bikeDetail' + "?" + _v,
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic' + "?" + _v,
                    //listLatestBikes: _base_url + '/listLatestBikes' + "?" + _v,
                    listLatestBikes: '/tide/statistics/detail' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo'+_v,
                    warningDigest:'/earlyWarning/warningDigest'+ "?_v="+_v,
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list',
                    saveArea:'/tide/polygon/save',
                    listArea:'/tide/polygon/list',
                    delArea:'/tide/polygon/del',
                    searchArea:'/tide/polygon/pointsSearch?',
                    AreaId:'/tide/polygon/idSearch?',
                    Street:'/tide/statistics/street?'
                }
            }
        }
    };
var dispatch_obj = {
    map: null,
    mapMass: null,
    iu_Mass: null,
    it_Mass: null,
    ip_Mass: null,
    remove_mass: false,
    city_storage: [],
    geocoder: null,
    TimeInterval: null,
    BikeInterval: null,
    mock_data: null,
    mock_now: null,
    user_flag: "c",
    income_flag: "c",
    map_markers: null,
    prev_map_markers: [],
    map_massList: [],
    map_zoom: null,
    map_lng: null,
    map_lat: null,
    areaList: [],
    massBuild: false,
    zoomPre:null,
    zoomCur:null,
    alert_timeflag:"",
    first_flag:true,
    searching_lng:"",
    searching_lat:"",
    InfoWindow:"",
    AreaInfo:"",
    SaveWindows:[],
    F_circle:[],
    F_line:[],
    F_marker:[],
    draw_line:[],
    save_line:[],
    draw_polygon:"",
    info_marker:"",
    save_area:[],
    areaOnMap:[],
    saveable:false,
    shinningZoom:1,
    shinningControl:"",
    AbikeList:[],
    AuserList:[],
    AdemandList:[],
    bikeMass:[],
    demandMass:[],
    init: function() {
        $("#citySelect").val("全国");
        localStorage.alert_city="全国";
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        _objP = this;
        $("html").on("mouseover", function() {
            _objP.Data_refresh();
        });
        $(top.hangge());

        //city_list
        this.dataInit();
        this.drawMap();
        this.componentInit();
        // 使用刚指定的配置项和数据显示图表。

    },
    update_Mass:function(type){
        _obj=this;
        for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
        _obj.bikeMass=[];
        _obj.AbikeList=[];
        _obj.AuserList=[];
                for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
                _obj.bikeMass=[];
                _obj.AbikeList=[];
                _obj.AuserList=[];
                if(Flow_resp.data.bikeAreas.length>0&&type=="bike"){
                    for(var i in Flow_resp.data.bikeAreas){
                        if(Flow_resp.data.bikeAreas.length>0&&Flow_resp.data.bikeAreas[i].bikes.length>0)for(var j in Flow_resp.data.bikeAreas[i].bikes){
                            _obj.AbikeList.push({
                                "lnglat": [Flow_resp.data.bikeAreas[i].bikes[j].longitude,Flow_resp.data.bikeAreas[i].bikes[j].latitude],
                                "name": Flow_resp.data.bikeAreas[i].bikes[j].type
                            });
                        }
                    }
                }
                if(Flow_resp.data.userAreas.length>0&&type=="demand"){
                    for(var i in Flow_resp.data.userAreas){
                        if(Flow_resp.data.userAreas.length>0&&Flow_resp.data.userAreas[i].users.length>0)for(var j in Flow_resp.data.userAreas[i].users) {
                            _obj.AuserList.push({
                                "lnglat": [Flow_resp.data.userAreas[i].users[j].longitude,Flow_resp.data.userAreas[i].users[j].latitude],
                                "name": Flow_resp.data.userAreas[i].users[j].type
                            });
                        }
                    }
                }
                _obj.drawAreaBike();
    },
    drawLine:function(){
        _obj=this;
        //if(_obj.SaveWindow)_obj.SaveWindow.close();
        _obj.remove();
        var polygon =_obj.draw_polygon= new AMap.Polygon({
            path: _obj.draw_line, //设置多边形边界路径
            strokeColor: "#ff9600",
            strokeOpacity: 1,
            strokeWeight: 3,
            bubble:true,
            fillColor: "#ff9600",
            fillOpacity: 0.35
        });
        polygon.setMap(_obj.map);
        var click_flag=false;
        clickListener = AMap.event.addListener(_obj.map, "click", function(e) {
            _obj.save_line=[];
            click_flag=true;
            var p_stg = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat());
            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: p_stg
            });
            _obj.draw_line.push(p_stg);
            for(var i in _obj.draw_line)_obj.save_line.push(_obj.draw_line[i]);
            polygon.setPath(_obj.save_line);
            // markerList.push(marker);
            // marker.setMap(map);
            //console.log(_obj.draw_line+"bfr");
        });
        moveListener = AMap.event.addListener(_obj.map, "mousemove", function(e) {
            // C_polygon.pop();
            if (polygon) {
                var p_stg = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat());
                //var pre_line=[];
                //for(var i in _obj.draw_line){
                //    pre_line.push(_obj.draw_line);
                //}
                //var pre_line=_obj.draw_line;
                if (_obj.draw_line.length != 0)
                    _obj.draw_line[_obj.draw_line.length - 1] = p_stg;
                else _obj.draw_line[_obj.draw_line.length] = p_stg;
                //if (pre_line.length != 0)
                //    pre_line[pre_line.length - 1] = p_stg;
                //else pre_line[pre_line.length] = p_stg;
                polygon.setPath(_obj.draw_line);
            }
        });
    },
    remove:function(){
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        }
    },
    componentInit: function() {
        localStorage.c_city_name="全国";
        var click_flag = true;
        _obj = this;
        $(".navbar-nav a").on("click",function(){
            _obj.InfoWindow.close();
            _obj.AreaInfo.close();
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
            if(_obj.draw_line.length>0){
                _obj.draw_line = [];
                _obj.save_line = [];
            }
            if($(this).attr("id")!="draw_line"&&$(this).attr("id")!="show_list"){$(".navbar-nav a").removeClass("active");$(this).addClass("active")}
        });
        $("#area_sp,#flow_sel").on("click",function(){
            if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
            _obj.areaOnMap=[];
            for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
            _obj.bikeMass=[];
            _obj.AbikeList=[];
            _obj.AuserList=[];
            if(_obj.SaveWindows.length>0)
                for(var i in _obj.SaveWindows){
                    _obj.map.remove(_obj.SaveWindows[i]);
                }
            if($("#flow_sel").is(':checked'))_obj.drawFlow();
            else _obj.drawArea();
        });
        $("#demand_sp").on("click",function(){
            //for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
            //_obj.bikeMass=[];
            //_obj.AbikeList=[];
            //_obj.AuserList=[];
            _obj.update_Mass("demand");
            if(_obj.SaveWindows.length>0)
                for(var i in _obj.SaveWindows){
                    _obj.map.remove(_obj.SaveWindows[i]);
                }
            if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
            _obj.areaOnMap=[];
            if(_obj.draw_line.length>0){
                _obj.draw_line = [];
                _obj.save_line = [];
            }
            _obj.clearAreaFlow();
        });
        $("#bike_sp").on("click",function(){
            //for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
            //_obj.bikeMass=[];
            //_obj.AbikeList=[];
            //_obj.AuserList=[];
            _obj.update_Mass("bike");
            if(_obj.SaveWindows.length>0)
                for(var i in _obj.SaveWindows){
                    _obj.map.remove(_obj.SaveWindows[i]);
                }
            if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
            _obj.areaOnMap=[];
            if(_obj.draw_line.length>0){
                _obj.draw_line = [];
                _obj.save_line = [];
            }
            _obj.clearAreaFlow();
        });
        $("#draw_line").on("click",function(){
            _obj.drawLine();
        });
        $("#area_input").off().on("input",function(){
            $("#save_info").text("");
                $.ajax({
                    url: _defautBiz.api("listArea"),
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    },
                    success: function(resp) {
                        if($.grep(resp.data,function(e,i){return e.name==$("#area_input").val()}).length>0){
                            $("#save_info").text("区域名重复");
                            _obj.saveable=false;
                        }
                        else _obj.saveable=true;
                    }});
        });
        $("#show_list").on("click",function(){
            if(_obj.draw_line.length>0){
                _obj.draw_line = [];
                _obj.save_line = [];
            }
                $.ajax({
                    url: _defautBiz.api("listArea"),
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        $("#area_list tbody").html("");
                        $("#area_list tbody").append('<tr><th>序号</th><th>区域名称</th><th>创建人</th><th>创建时间</th><th>操作</th></tr>');
                        for(var i in resp.data){
                            $("#area_list tbody").append('<tr a_num='+resp.data[i].id+'><td>'+(parseInt(i)+1)+'</td><td>'+resp.data[i].name+'</td><td><span>'+resp.data[i].userName+'</span></td><td><div>'+new Date(resp.data[i].createTime).format("hh:mm")+'</div></td><td><span class=""><a add_num="'+resp.data[i].id+'" create_time="'+resp.data[i].createTime+'" area_name="'+resp.data[i].name+'" user_id="'+resp.data[i].userId+'" add_points="'+resp.data[i].points+'" id="add_'+resp.data[i].id+'" style="margin-right:10px">打开</a><a del_num="'+resp.data[i].id+'" id="del_'+resp.data[i].id+'">删除</a></span></td></tr>');
                            //href="javascript:del('+_v+')"
                            $("#del_"+resp.data[i].id).on("click",function(){
                                that=this;
                                $("#m_info").text("操作后所保存的区域将被清除");
                                $("#f_info").text("确认删除?");
                                $("#judge_alert").modal('show');
                                $("#save_judge").off("click");
                                $("#save_judge").on("click", function() {
                                $('#judge_alert').modal('hide')
                                $.ajax({
                                    url: _defautBiz.api("delArea")+"?id="+$(that).attr("del_num"),
                                    dataType: "json",
                                    method: 'get',
                                    beforeSend: function(xhr) {
                                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                        //xhr.setRequestHeader("User-Agent", "headertest");
                                    },
                                    success: function(resp) {
                                        $("tr[a_num="+$(that).attr("del_num")+"]").remove();

                                    }
                                });
                                for(var i in _obj.SaveWindows){
                                    if(_obj.SaveWindows[i]._v==$(that).attr("del_num")){
                                        _obj.map.remove(_obj.SaveWindows[i]);
                                    }
                                }
                                for(var i in _obj.areaOnMap){
                                    if(_obj.areaOnMap[i]._v==$(that).attr("del_num")){
                                        _obj.map.remove(_obj.areaOnMap[i]);
                                    }}
                                });

                            });
                            $("#add_"+resp.data[i].id).off().on("click",function(){
                                that=this;
                                clearTimeout(_obj.shinningControl);
                                _obj.shinningControl=null;
                                _obj.clearAreaFlow();
                                if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
                                _obj.areaOnMap=[];
                                for(var i in _obj.SaveWindows){
                                    _obj.map.remove(_obj.SaveWindows[i]);
                                }
                                for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
                                _obj.bikeMass=[];
                                _obj.AbikeList=[];
                                _obj.AuserList=[];
                                $.ajax({
                                    url: _defautBiz.api("AreaId")+"id="+$(that).attr("add_num"),
                                    dataType: "json",
                                    method: 'get',
                                    beforeSend: function(xhr) {
                                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                        //xhr.setRequestHeader("User-Agent", "headertest");
                                    },
                                    success: function(resp) {
                                        if($.grep(_obj.areaOnMap,function(e,i){
                                                return e._v==$(that).attr("add_num");
                                            }).length<1){
                                            var polygon =_obj.draw_polygon= new AMap.Polygon({
                                                path: eval(resp.data.points), //设置多边形边界路径
                                                strokeColor: "#ff9600",
                                                strokeOpacity: 1,
                                                strokeWeight: 3,
                                                bubble:true,
                                                fillColor: "#ff9600",
                                                fillOpacity: 0.35
                                            });
                                            polygon.setMap(_obj.map);
                                            polygon._v=$(that).attr("add_num");
                                            _obj.areaOnMap.push(polygon);
                                            var marker= _obj.info_marker= new AMap.Marker({ //添加自定义点标记
                                                map: _obj.map,
                                                //position: polygon.getPath()[0], //基点位置
                                                position: getEastest(polygon.getPath()), //基点位置
                                                offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
                                                content: "<div class='area_detail'><div>区域名称:<span class='save_area_name'>"+$(that).attr('area_name')+"</span> "+"</div><div>车辆数辆:"+resp.data.bikeTotal+"</div><div>需求总次数:"+resp.data.userDemand+"</div><div>供需比:"+resp.data.ratio+"</div><div>创建人:"+resp.data.userPolygon.userName+"</div><div>"+"创建时间:"+new Date(resp.data.userPolygon.createTime).format('hh:mm')+"</div></div></div>"
                                            });
                                            marker._v=$(that).attr("add_num");
                                            _obj.SaveWindows.push(marker);
                                            //_obj.map.setCenter(polygon.getPath()[0]);
                                            _obj.map.setZoomAndCenter(18,polygon.getPath()[0]);
                                            if(resp.data.bikes.length>0){
                                                for(var i in resp.data.bikes)
                                                    _obj.AbikeList.push({
                                                        "lnglat": resp.data.bikes[i].pos,
                                                        "name": resp.data.bikes[i].bid
                                                    });
                                            }
                                            if(resp.data.users.length>0){
                                                for(var i in resp.data.users)
                                                    _obj.AuserList.push({
                                                        "lnglat": resp.data.users[i].pos,
                                                        "name": resp.data.users[i].bid
                                                    });
                                            }
                                            _obj.drawAreaBike();
                                        }
                                    }
                                });
                                //that=this;


                            });
                        }
                    }});
            $("#area_list").modal('show');
        });
        $("#save_confirm").on("click",function(){
            if($("#area_input").val()==""){_obj.saveable=false;$("#save_info").text("请输入区域名!");}
            if(_obj.saveable){
            var _v=$(this).attr("save_indx");
            $("#"+_v+" .save_area_name").text($("#area_input").val());
                //var points= $.grep(_obj.areaOnMap,function(e,i){
                //    return e._v==_v;
                //})[0].getPath();
                var points=_obj.draw_polygon.getPath();
                var str="";
                for(var i in points){
                    str+="["+points[i].toString()+"]"+(i==(points.length-1)?"":",");
                }
                req_str="["+str+"]";
                $.ajax({
                    url: _defautBiz.api("saveArea") + "?name=" + $("#area_input").val() + "&points=" +req_str,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        _obj.draw_polygon._v=resp.data;
                        _obj.info_marker._v=resp.data;
                        _obj.areaOnMap.push(_obj.draw_polygon);
                        _obj.SaveWindows.push(_obj.info_marker);
                        $("#"+_v+" a").hide();
                        $("#area_input").val("");
                        $('#save_area').modal('hide')
                    }});
            }
        });
        document.onkeydown=function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 27) {
                endLine();
            }
        };
        //区域绘制
        function endLine() {
            //var SaveWindow = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(0, 0)});
            clearTimeout(_obj.shinningControl);
            _obj.shinningControl=null;
            _obj.clearAreaFlow();
            _obj.draw_polygon.setPath(_obj.save_line);
            //_obj.draw_polygon.setPath(_obj.draw_line);
            if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
            _obj.areaOnMap=[];
            for(var i in _obj.SaveWindows){
                _obj.map.remove(_obj.SaveWindows[i]);
            }
            for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
            _obj.bikeMass=[];
            _obj.AbikeList=[];
            _obj.AuserList=[];
            var str="";
            for(var i in _obj.save_line){
                str+="["+_obj.save_line[i].toString()+"]"+(i==(_obj.save_line.length-1)?"":",");
            }
            req_str="["+str+"]";
            var _v = new Date().getTime();
            //_obj.draw_polygon._v=_v;
            $.ajax({
                    url: _defautBiz.api("searchArea") + "points=" +req_str,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(resp.data.bikes.length>0){
                            for(var i in resp.data.bikes)
                            _obj.AbikeList.push({
                                "lnglat": resp.data.bikes[i].pos,
                                "name": resp.data.bikes[i].bid
                            });
                        }
                        if(resp.data.users.length>0){
                            for(var i in resp.data.users)
                                _obj.AuserList.push({
                                    "lnglat": resp.data.users[i].pos,
                                    "name": resp.data.users[i].bid
                                });
                        }
                        var marker =_obj.info_marker= new AMap.Marker({ //添加自定义点标记
                            map: _obj.map,
                            //position: _obj.draw_polygon.getPath()[0], //基点位置
                            position: getEastest(_obj.draw_polygon.getPath()),
                            offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
                            content: "<div class='area_detail' id="+_v+"><div>区域名称:<span class='save_area_name'>无</span> "+"<a href='javascript:saveArea("+_v+")' id='save'>保存</a></div><div>车辆数辆:"+resp.data.bikeTotal+"</div><div>需求总次数:"+resp.data.userDemand+"</div><div>供需比:"+resp.data.ratio+"</div></div></div>"
                        });
                        marker._v=_v;
                        _obj.SaveWindows.push(_obj.info_marker);
                        _obj.drawAreaBike();
                    }});
            //console.log(_obj.draw_polygon.getPath()[0]);
            _obj.areaOnMap.push(_obj.draw_polygon);
            //SaveWindow.setContent(createInfoWindow(title, content.join("<br/>")));
            //SaveWindow.open(_obj.map, _obj.draw_polygon.getPath()[0]);
            _obj.save_area.push(_obj.save_line);
            _obj.draw_line = [];
            _obj.save_line = [];
            if (clickListener) {
                AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
            }
            if (moveListener) {
                AMap.event.removeListener(moveListener); //移除事件，以绑定时返回的对象作为参数
            }
        }
        //is(':checked'):
    },
    drawMap: function() {
        _obj = this;
        var map = _obj.map = new AMap.Map('mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 4,
            center: [102.342785, 35.312316]
        });
        MapControl=_obj;
        _obj.InfoWindow = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(110, -40)});
        _obj.AreaInfo = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(0, -10)});
        AMap.plugin(['AMap.ToolBar'],
            function() {
                map.addControl(new AMap.ToolBar());
                map.setZoom(3);
            });
        map.setMapStyle('normal');
        this.map_zoom = 3;
        this.zoomPre=this.zoomCur=3;
        this.map_lat = 31.847684;
        this.map_lng = 117.317514;
        $.ajax({
            //url: _defautBiz.api("listLatestBikes") + "&lng=" + "117.317514" + "&lat=" + "31.847684" + "&mapZoom=" + "3",
            url: _defautBiz.api("listLatestBikes") +"&mapZoom=" + "5",
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                _obj.areaList = [];
                if (resp.data.bikes == undefined) {
                    for (var i in resp.data) {
                        _obj.areaList.push({
                            "lnglat": [resp.data[i].lng, resp.data[i].lat],
                            "name": resp.data[i].areaName,
                            "count": resp.data[i].bikeTotal,
                            "bikeTotal":resp.data[i].bikeTotal,
                            "userDemand":resp.data[i].userDemand,
                            "userDemandDay":resp.data[i].userDemandDay,
                            "userDemandMonth":resp.data[i].userDemandMonth,
                            "ratio":resp.data[i].ratio
                        });
                    }
                } else {
                    for (var i in resp.data.bikes) {
                        _obj.areaList.push({
                            "lnglat": [resp.data.bikes[i].lng, resp.data.bikes[i].lat],
                            "name": resp.data.bikes[i].bid
                        });
                    }
                }
                _obj.drawMarkers();
                var zoomListener = AMap.event.addListener(map, "zoomend", function(e) {
                    var bounds=_obj.map.getBounds();
                    _obj.zoomPre=_obj.map_zoom;
                    _obj.map_zoom = _obj.map.getZoom();
                    _obj.zoomCur=_obj.map_zoom;
                    _obj.map_lat = _obj.searching_lat==""?_obj.map.getCenter().getLat():_obj.searching_lat;
                    _obj.map_lng = _obj.searching_lng==""?_obj.map.getCenter().getLng():_obj.searching_lng;
                    _obj.searching_lng="";
                    _obj.searching_lat="";
                    _obj.InfoWindow.close();
                    _obj.AreaInfo.close();
                    AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
                    if(_obj.draw_line.length>0){
                        _obj.draw_line = [];
                        _obj.save_line = [];
                    }
                    _obj.mapPointsUpdate();
                    //}
                });
                var dragListener = AMap.event.addListener(map, "dragend", function(e) {
                    if(_obj.map.getZoom()>13){
                        var bounds=_obj.map.getBounds();
                        _obj.mapPointsUpdate();
                    }
                });
                var autoOptions = {
                    input: "search-panel"
                };
                var auto = new AMap.Autocomplete(autoOptions);
                var city_storage = _obj.city_storage = citys;
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
                    //placeSearch.setCity(e.poi.adcode);
                    //placeSearch.search(e.poi.name,function(){
                    //});  //关键字查询查询
                }
                var geocoder = _obj.geocoder = new AMap.Geocoder({
                    radius: 1000 //范围，默认：500
                });
                var click_able = true;;
                $("#searching").on("click", function() {
                    if (click_able) {
                        $("#bike_result").hide();
                        click_able = false;
                        setTimeout(function() {
                            click_able = true
                        }, 2000);
                        geocoder.getLocation($("#search-panel").val().replace(/[~'!<>@#$%^&*()-+_=:]/g,""), function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                var geocode = result.geocodes;
                                //addMarker(0, geocode[0]);
                                var marker = new AMap.Marker({
                                    map: null,
                                    position: [geocode[0].location.getLng(), geocode[0].location.getLat()]
                                });
                                //console.log(geocode[0].location.getLng()+","+geocode[0].location.getLat());
                                //map.setFitView();
                                var level = 18;
                                //$("#citySelect").val(geocode[0].addressComponent.city.split("市")[0].substring(0,2));
                                localStorage.c_city_name=geocode[0].addressComponent.city.split("市")[0];
                                //console.log(localStorage.c_city_name)
                                switch (geocode[0].level) {
                                    case '省':
                                        level = 10;
                                        break;
                                    case '市':
                                        level = 12;
                                        break;
                                    case '区县':
                                        level = 14;
                                        break;

                                }
                                //dispatch_obj.refreshData();
                                map.setZoomAndCenter(level, [geocode[0].location.getLng(), geocode[0].location.getLat()]);
                            } else {
                                $("#s_info").text("无搜索结果噢");
                                $("#search_rslt").modal('show');
                            }                        });
                    }
                });
                //}});
            }
        });
    },
    drawMarkers: function() {
        _obj = this;
        var lnglat_list = this.areaList.map(function(e, i) {
            return {
                lng: e.lnglat[0],
                lat: e.lnglat[1],
                name: e.name,
                count: e.count > 100000 ? "100,000+" : e.count.toLocaleString(),
                bikeTotal:e.bikeTotal,
                userDemand:e.userDemand,
                userDemandDay:e.userDemandDay,
                userDemandMonth:e.userDemandMonth,
                ratio:e.ratio
            }
        });
        this.map_markers = [];
        for (var i in lnglat_list) {
            var pos = [lnglat_list[i].lng, lnglat_list[i].lat];
            var buble_src=lnglat_list[i].ratio=="-"||lnglat_list[i].ratio<0.5?"/static/qbike/img/low.png":"/static/qbike/img/high.png";
            var marker = new AMap.Marker({
                position: pos,
                //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                content: '<div class="marker-route marker-marker-bus-from" style="background: url('+buble_src+');width: 85px;height: 95px;color:#666;"><div class="area_name" style="color:#fff;padding-top:25px;font-size:16px;width: 100%;text-align: center">' + lnglat_list[i].name.split("市")[0] + '</div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #fff;font-size: 14px">' + lnglat_list[i].ratio + '</div></div>',
                offset: {
                    x: -42,
                    y: -96
                }
            });
            marker.loc = pos;
            marker.city=lnglat_list[i].name;
            marker.bikeTotal=lnglat_list[i].bikeTotal;
            marker.userDemand=lnglat_list[i].userDemand;
            marker.userDemandDay=lnglat_list[i].userDemandDay;
            marker.userDemandMonth=lnglat_list[i].userDemandMonth;
            marker.ratio=lnglat_list[i].ratio;
            //if(this.prev_map_markers.length>0)for(var i in this.prev_map_markers){
            //    console.log(this.prev_map_markers[i].getContent()!=marker.getContent());
            //}
            marker.setMap(this.map);
            marker.on('click', function(e) {
                if (_obj.map.getZoom() < 10) {
                    _obj.searching_lat=this.loc[1];
                    _obj.searching_lng=this.loc[0];
                    _obj.map.setZoomAndCenter(10, this.loc);
                }
                //else if (_obj.map.getZoom() >= 10 && _obj.map.getZoom() < 11) {
                //    _obj.map.setZoomAndCenter(11, this.loc);
                //}
                else {
                    _obj.searching_lat=this.loc[1];
                    _obj.searching_lng=this.loc[0];
                    _obj.map.setZoomAndCenter(15, this.loc);
                }
            });
            marker.on('mouseover', function(e) {
                var title = '';
                var content = [];
                content.push("区域名称:"+this.city);
                content.push("车辆数:"+this.bikeTotal);
                content.push("需求总次数:"+this.userDemand);
                content.push("本月需求次数:"+this.userDemandMonth);
                content.push("当天需求次数:"+this.userDemandDay);
                content.push("当前供需比:"+this.ratio);
                _obj.InfoWindow.setContent(createInfoWindow(title, content.join("<br/>")));
                _obj.InfoWindow.open(_obj.map, e.target.getPosition());
            });
            this.map_markers.push(marker);
            this.prev_map_markers=this.map_markers;
        }
    },
    drawAreaBike: function() {
        for(var i in this.bikeMass)this.map.remove(this.bikeMass[i]);
        this.bikeMass=[];
        var mass = new AMap.MassMarks(this.AbikeList, {
            url: '/static/qbike/img/total.png',
            anchor: new AMap.Pixel(23, 42),
            size: new AMap.Size(48, 51),
            opacity: 1,
            cursor: 'pointer',
            zIndex: 1
        });
        var massD = new AMap.MassMarks(this.AuserList, {
            url: '/static/qbike/img/demand.png',
            anchor: new AMap.Pixel(23, 42),
            size: new AMap.Size(48, 51),
            opacity: 1,
            cursor: 'pointer',
            zIndex: 1
        });
        if(this.AbikeList.length==0)mass.hide();
        if(this.AuserList.length==0)massD.hide();
        this.bikeMass.push(mass);
        this.bikeMass.push(massD);
        mass.setMap(this.map);
        massD.setMap(this.map);
    },
    drawAreaDemand: function() {
        for(var i in this.demandMass)this.map.remove(this.demandMass[i]);
        var mass = new AMap.MassMarks(this.AdemandList, {
            url: '/static/qbike/img/total.png',
            anchor: new AMap.Pixel(23, 42),
            size: new AMap.Size(48, 51),
            opacity: 1,
            cursor: 'pointer',
            zIndex: 1
        });
        this.demandMass.push(mass);
        mass.setMap(this.map);
    },
    clearAreaFlow:function(){
        if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
        if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
        if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
        _obj.F_circle=[];
        _obj.F_marker=[];
        _obj.F_line=[];
    },
    drawArea:function(){
        _obj=this;
        clearTimeout(_obj.shinningControl);
        _obj.shinningControl=null;
        _obj.clearAreaFlow();
        //if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
        //if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
        //if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
        //_obj.F_circle=[];
        //_obj.F_marker=[];
        //_obj.F_line=[];
        var pt_list=[];
        for(var i in Flow_resp.data.bikeAreas){
            pt_list.push(Flow_resp.data.bikeAreas[i].center);
        }
        //var pt_list=[
        //    [121.462036, 31.021029],[121.466036, 31.026029],[121.462536, 31.024029],[121.452036, 31.031029],[121.482036, 31.011029]
        //];
        for(var i in pt_list) {
            if(Flow_resp.data.bikeAreas[i].userDemand<10){
                var radius=20;
            }
            else if(Flow_resp.data.bikeAreas[i].userDemand>=10&&Flow_resp.data.bikeAreas[i].userDemand<=50){
                var radius=50;
            }
            var circle = new AMap.Circle({
                center: pt_list[i], // 圆心位置
                radius: radius,//半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 0.2, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                zIndex:30,
                fillOpacity: 0.35 //填充透明度
            });
            circle.clusterId=Flow_resp.data.bikeAreas[i].clusterId;
            circle.randomZoom=parseInt(Math.random()*5);
            circle.r_index=radius;
            _obj.F_circle.push(circle);
            circle.setMap(_obj.map);
            circle.pointsList=Flow_resp.data.bikeAreas[i].points;
            circle.num=i;
            circle.on('mouseover', function(e) {
                var title = '';
                var content = [];
                //content.push("区域名称:"+this.city);
                content.push("车辆数:"+Flow_resp.data.bikeAreas[this.num].bikeTotal);
                content.push("需求总次数:"+Flow_resp.data.bikeAreas[this.num].userDemand);
                //content.push("本月需求次数:"+this.userDemandMonth);
                //content.push("当天需求次数:"+this.userDemandDay);
                content.push("供需比:"+Flow_resp.data.bikeAreas[this.num].ratio);
                _obj.AreaInfo.setContent(createAreaInfo(title, content.join("<br/>")));
                _obj.AreaInfo.open(_obj.map,this.getCenter());
            });

            circle.on('click', function(e) {
                _obj.AreaInfo.close();
                _obj.clearAreaFlow();
                //Flow_resp.data.bikeAreas[i].clusterId;
                var polygon =_obj.draw_polygon= new AMap.Polygon({
                    path: this.pointsList, //设置多边形边界路径
                    strokeColor: "#ff9600",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    bubble:true,
                    fillColor: "#ff9600",
                    fillOpacity: 0.35
                });
                polygon.setMap(_obj.map);
                polygon._v=null;
                _obj.areaOnMap.push(polygon);
                var marker= _obj.info_marker= new AMap.Marker({ //添加自定义点标记
                    map: _obj.map,
                    position: getEastest(polygon.getPath()), //基点位置
                    offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
                    content: "<div class='area_detail'><div>车辆数辆:"+Flow_resp.data.bikeAreas[this.num].bikeTotal+"</div><div>需求总次数:"+Flow_resp.data.bikeAreas[this.num].userDemand+"</div><div>供需比:"+Flow_resp.data.bikeAreas[this.num].ratio+"</div></div></div>"
                });
                marker._v=null;
                _obj.SaveWindows.push(marker);
                //_obj.map.setCenter(polygon.getPath()[0]);
                _obj.map.setZoomAndCenter(18,getEastest(polygon.getPath()));
                if(Flow_resp.data.bikeAreas.length>0&&Flow_resp.data.bikeAreas[this.num].bikes.length>0)for(var j in Flow_resp.data.bikeAreas[this.num].bikes) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.bikeAreas[this.num].bikes[j].longitude,Flow_resp.data.bikeAreas[this.num].bikes[j].latitude],
                        "name": Flow_resp.data.bikeAreas[this.num].bikes[j].type
                    });
                }
                if(Flow_resp.data.userAreas.length>0&&Flow_resp.data.userAreas[this.num].bikes.length>0)for(var j in Flow_resp.data.userAreas[this.num].bikes) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.userAreas[this.num].bikes[j].longitude,Flow_resp.data.userAreas[this.num].bikes[j].latitude],
                        "name": Flow_resp.data.userAreas[this.num].bikes[j].type
                    });
                }
                if(Flow_resp.data.bikeAreas.length>0&&Flow_resp.data.bikeAreas[this.num].users.length>0)for(var j in Flow_resp.data.bikeAreas[this.num].users) {
                _obj.AuserList.push({
                    "lnglat": [Flow_resp.data.bikeAreas[this.num].users[j].longitude,Flow_resp.data.bikeAreas[this.num].users[j].latitude],
                    "name": Flow_resp.data.bikeAreas[this.num].users[j].type
                });
                    }
                if(Flow_resp.data.userAreas.length>0&&Flow_resp.data.userAreas[this.num].users.length>0)for(var j in Flow_resp.data.userAreas[this.num].users) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.userAreas[this.num].users[j].longitude,Flow_resp.data.userAreas[this.num].users[j].latitude],
                        "name": Flow_resp.data.userAreas[this.num].users[j].type
                    });
                }
                _obj.drawAreaBike();
            });
        }
        this.Shinning();
    },
    drawFlow:function(){
        _obj=this;
        clearTimeout(_obj.shinningControl);
        _obj.shinningControl=null;
        _obj.clearAreaFlow();
        //if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
        //if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
        //if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
        //_obj.F_circle=[];
        //_obj.F_marker=[];
        //_obj.F_line=[];
        var pt_list=[];
        for(var i in Flow_resp.data.bikeAreas){
            pt_list.push(Flow_resp.data.bikeAreas[i].center);
        }
        var pt_param_list=[];
        for(var i in Flow_resp.data.bikeAreas){
            var pt_param={}
            pt_param.lnglat=Flow_resp.data.bikeAreas[i].center;
            pt_param.clusterId =Flow_resp.data.bikeAreas[i].clusterId;
            pt_param_list.push(pt_param);
        }
        //var pt_list=[
        //    [121.462036, 31.021029],[121.466036, 31.026029],[121.462536, 31.024029],[121.452036, 31.031029],[121.482036, 31.011029]
        //];
        for(var i in pt_list){
            if(Flow_resp.data.bikeAreas[i].userDemand<10){
                var radius=20;
            }
            else if(Flow_resp.data.bikeAreas[i].userDemand>=10&&Flow_resp.data.bikeAreas[i].userDemand<=50){
                var radius=50;
            }
            var circle = new AMap.Circle({
                center: pt_list[i], // 圆心位置
                radius: radius, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 0.2, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                zIndex:30,
                fillOpacity: 0.35 //填充透明度
            });
            circle.clusterId=Flow_resp.data.bikeAreas[i].clusterId;
            circle.randomZoom=parseInt(Math.random()*5);
            circle.r_index=radius;
            _obj.F_circle.push(circle);
            circle.setMap(_obj.map);
            circle.pointsList=Flow_resp.data.bikeAreas[i].points;
            circle.num=i;
            circle.on('mouseover', function(e) {
                var title = '';
                var content = [];
                //content.push("区域名称:"+this.city);
                content.push("车辆数:"+Flow_resp.data.bikeAreas[this.num].bikeTotal);
                content.push("需求总次数:"+Flow_resp.data.bikeAreas[this.num].userDemand);
                //content.push("本月需求次数:"+this.userDemandMonth);
                //content.push("当天需求次数:"+this.userDemandDay);
                content.push("供需比:"+Flow_resp.data.bikeAreas[this.num].ratio);
                _obj.AreaInfo.setContent(createAreaInfo(title, content.join("<br/>")));
                _obj.AreaInfo.open(_obj.map,this.getCenter());
            });
            circle.on('click', function(e) {
                _obj.AreaInfo.close();
                _obj.clearAreaFlow();
                //Flow_resp.data.bikeAreas[i].clusterId;
                var polygon =_obj.draw_polygon= new AMap.Polygon({
                    path: this.pointsList, //设置多边形边界路径
                    strokeColor: "#ff9600",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    bubble:true,
                    fillColor: "#ff9600",
                    fillOpacity: 0.35
                });
                polygon.setMap(_obj.map);
                polygon._v=null;
                _obj.areaOnMap.push(polygon);
                var marker= _obj.info_marker= new AMap.Marker({ //添加自定义点标记
                    map: _obj.map,
                    //position: polygon.getPath()[0], //基点位置
                    position: getEastest(polygon.getPath()),
                    offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
                    content: "<div class='area_detail'><div>车辆数辆:"+Flow_resp.data.bikeAreas[i].bikeTotal+"</div><div>需求总次数:"+Flow_resp.data.bikeAreas[i].userDemand+"</div><div>供需比:"+Flow_resp.data.bikeAreas[i].ratio+"</div></div></div>"
                });
                marker._v=null;
                _obj.SaveWindows.push(marker);
                //_obj.map.setCenter(polygon.getPath()[0]);
                _obj.map.setZoomAndCenter(18,polygon.getPath()[0]);
                if(Flow_resp.data.bikeAreas.length>0&&Flow_resp.data.bikeAreas[this.num].bikes.length>0)for(var j in Flow_resp.data.bikeAreas[this.num].bikes) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.bikeAreas[this.num].bikes[j].longitude,Flow_resp.data.bikeAreas[this.num].bikes[j].latitude],
                        "name": Flow_resp.data.bikeAreas[this.num].bikes[j].type
                    });
                }
                if(Flow_resp.data.userAreas.length>0&&Flow_resp.data.userAreas[this.num].bikes.length>0)for(var j in Flow_resp.data.userAreas[this.num].bikes) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.userAreas[this.num].bikes[j].longitude,Flow_resp.data.userAreas[this.num].bikes[j].latitude],
                        "name": Flow_resp.data.userAreas[this.num].bikes[j].type
                    });
                }
                if(Flow_resp.data.bikeAreas.length>0&&Flow_resp.data.bikeAreas[this.num].users.length>0)for(var j in Flow_resp.data.bikeAreas[this.num].users) {
                    _obj.AuserList.push({
                        "lnglat": [Flow_resp.data.bikeAreas[this.num].users[j].longitude, Flow_resp.data.bikeAreas[this.num].users[j].latitude],
                        "name": Flow_resp.data.bikeAreas[this.num].users[j].type
                    });
                }
                if(Flow_resp.data.userAreas.length>0&&Flow_resp.data.userAreas[this.num].users.length>0)for(var j in Flow_resp.data.userAreas[this.num].users) {
                    _obj.AbikeList.push({
                        "lnglat": [Flow_resp.data.userAreas[this.num].users[j].longitude,Flow_resp.data.userAreas[this.num].users[j].latitude],
                        "name": Flow_resp.data.userAreas[this.num].users[j].type
                    });
                }
                _obj.drawAreaBike();
            })
        }
        for(var j in Flow_resp.data.bikeFlows){
        //for(var j in pt_list){
                var f_pt=$.grep(pt_param_list,function(e,i){return e.clusterId==Flow_resp.data.bikeFlows[j].fromClusterId})[0].lnglat;
                var t_pt=$.grep(pt_param_list,function(e,i){return e.clusterId==Flow_resp.data.bikeFlows[j].toClusterId})[0].lnglat;
                var flowcounts=Flow_resp.data.bikeFlows[j].flowCounts;
                if(flowcounts<50){
                    var strokeWeight=3;
                }
                else if(flowcounts>=50&&flowcounts<=100){
                    var strokeWeight=5;
                }
                else{
                    var strokeWeight=8;
                }
                var l_arr=[f_pt,t_pt];
                var polyline = new AMap.Polyline({
                    zIndex:0,
                    path: l_arr,            // 设置线覆盖物路径
                    strokeColor: '#3366FF',   // 线颜色
                    strokeOpacity: 0.6,         // 线透明度
                    strokeWeight: strokeWeight,          // 线宽
                    strokeStyle: 'dashed',     // 线样式
                    strokeDasharray: [15, 5], // 补充线样式
                    geodesic: true,            // 绘制大地线
                    // showDir:true
                });
                _obj.F_line.push(polyline);
                polyline.setMap(_obj.map);
                var marker = new AMap.Marker({
                    map: _obj.map,
                    position: pt_list[i],
                    zIndex:1,
                    icon: "/static/images/arrow.png",
                    offset: new AMap.Pixel(-26, -11),
                    autoRotation: true
                });
                _obj.F_marker.push(marker);
                marker.moveAlong(l_arr, 500,function(k){return k},true);
        }
        this.Shinning();
    },
    dataInit: function() {
        $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
        _obj=this;
        //$(".city-mk").on("click",function(){
        //    var e = jQuery.Event("click")
        //});
        var name=($("#citySelect").val()=="全国"?$("#citySelect").val():$("#citySelect").val()+"市");
        $.ajax({
            url: _defautBiz.api("header"),
            dataType: "json",
            method: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if(resp.success){
                    $("#user_num").text(parseInt(resp.data.totalUserNumbers).toLocaleString());
                    $("#bike_num").text(parseInt(resp.data.totalBikes).toLocaleString());
                    $("#request_num").text(resp.data.userDemand?parseInt(resp.data.userDemand).toLocaleString():"--");
                    $("#proportion").text(resp.data.ratio?resp.data.ratio:"--");
                }
                else{
                    $("#user_num").text("--");
                    $("#bike_num").text("--");
                    $("#request_num").text("--");
                    $("#proportion").text("--");
                }
            }
        });
    },
    refreshData: function() {
        //this.drawcharts_I();
        //this.drawcharts_II();
        //this.drawcharts_III();
        //this.mapPointsUpdate();
        this.dataInit();
        //this.map.setMapStyle('normal');
        //this.map.setMapStyle('normal');
        //this.mulLineChart.setOption(option);
    },
    mapPointsUpdate: function() {
        _obj = this;
        if(_obj.zoomCur<10&&_obj.zoomPre<10){
            return;
        }
        else{
            if(_obj.map_zoom<10){
                _obj.map_zoom=5;
            }
            else if(_obj.map_zoom>=10&&_obj.map_zoom<15){_obj.map_zoom=10}
            if (_obj.map_zoom > 13) {
                //updated Area
                var bounds=this.map.getBounds();
                $.ajax({
                    //url: _defautBiz.api("listLatestBikes") + "&lng=" + "117.317514" + "&lat=" + "31.847684" + "&mapZoom=" + "3",
                    url: _defautBiz.api("Street") +"&topright=["+bounds.getNorthEast()+"]&bottomleft=["+bounds.getSouthWest()+"]",
                    //url: _defautBiz.api("Street") +"topright=[174.500988,57.465261]&bottomleft=[34.579113,-43.521177]",
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    },
                    success: function(resp) {
                        Flow_resp=resp;
                        _obj.map.remove(_obj.map_markers);
                        _obj.areaList = [];
                        _obj.clearAreaFlow();
                        if(_obj.areaOnMap.length==0){
                            if($("#area_sp").hasClass("active")||$("#area_rev").hasClass("active")){
                                $("#area_rev").removeClass("active");
                                $("#area_sp").addClass("active")
                                if($("#flow_sel").is(':checked'))_obj.drawFlow();
                                else _obj.drawArea();
                            }
                            else if($("#bike_sp").hasClass("active")){_obj.update_Mass("bike");}
                            else {_obj.update_Mass("demand")}
                        }
                        $(".button_panel").show();
                    }
                });
            }
            else
            $.ajax({
                url: _defautBiz.api("listLatestBikes") + "&lng=" + _obj.map_lng + "&lat=" + _obj.map_lat + "&mapZoom=" + _obj.map_zoom,
                dataType: "json",
                method: 'get',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                },
                success: function(resp) {
                    //if (_obj.map_zoom > 13&&resp.data.bikes) {
                    if (_obj.map_zoom > 13) {
                        _obj.map.remove(_obj.map_markers);
                        _obj.areaList = [];
                        for (var i in resp.data.bikes) {
                            //选中图表更新
                            _obj.areaList.push({
                                "lnglat": [resp.data.bikes[i].lng, resp.data.bikes[i].lat],
                                "name": resp.data.bikes[i].bid,
                                "status": resp.data.bikes[i].bikeStatus,
                                //"count": resp.data.bikes[i].count
                            });
                        }
                        //_obj.map.setCenter([resp.data.bikes[0].lng,resp.data.bikes[0].lat]);
                        _obj.clearAreaFlow();
                        //if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
                        //if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
                        //if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
                        //_obj.F_circle=[];
                        //_obj.F_marker=[];
                        //_obj.F_line=[];
                        if(_obj.areaOnMap.length==0){
                        if($("#area_sp").hasClass("active")||$("#area_rev").hasClass("active")){
                            if($("#flow_sel").is(':checked'))_obj.drawFlow();
                            else _obj.drawArea();
                        }
                            else if($("#bike_sp").hasClass("active")){_obj.update_Mass("bike");}
                            else {_obj.update_Mass("demand")}
                        }
                        $(".button_panel").show();
                    }
                        else if (_obj.map_zoom <= 13 && _obj.map_zoom >= 10) {
                        $("#bike_result").hide();
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        _obj.clearAreaFlow();
                        //if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
                        //if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
                        //if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
                        //_obj.F_circle=[];
                        //_obj.F_marker=[];
                        //_obj.F_line=[];
                        _obj.areaList = [];
                        if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
                        _obj.areaOnMap=[];
                        for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
                        _obj.bikeMass=[];
                        _obj.AbikeList=[];
                        _obj.AuserList=[];
                        if(_obj.SaveWindows.length>0)
                        for(var i in _obj.SaveWindows){
                            _obj.map.remove(_obj.SaveWindows[i]);
                        }

                        for (var i in resp.data) {
                            _obj.areaList.push({
                                "lnglat": [resp.data[i].lng, resp.data[i].lat],
                                "name": resp.data[i].areaName,
                                "count": resp.data[i].bikeTotal,
                                "bikeTotal":resp.data[i].bikeTotal,
                                "userDemand":resp.data[i].userDemand,
                                "userDemandDay":resp.data[i].userDemandDay,
                                "userDemandMonth":resp.data[i].userDemandMonth,
                                "ratio":resp.data[i].ratio
                            });
                        }
                        _obj.drawMarkers();
                        $(".filter-bk").each(function(){
                            $(this).removeClass("darkness");
                        });
                        $(".button_panel").hide();
                    }
                    else{
                        $("#bike_result").hide();
                        for(var i in _obj.bikeMass)_obj.map.remove(_obj.bikeMass[i]);
                        _obj.bikeMass=[];
                        if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
                        _obj.areaOnMap=[];
                        if(_obj.SaveWindows.length>0)
                            for(var i in _obj.SaveWindows){
                                _obj.map.remove(_obj.SaveWindows[i]);
                            }
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        _obj.clearAreaFlow();
                        //if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
                        //if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
                        //if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
                        //_obj.F_circle=[];
                        //_obj.F_marker=[];
                        //_obj.F_line=[];
                        _obj.areaList = [];
                        for (var i in resp.data) {
                            _obj.areaList.push({
                                "lnglat": [resp.data[i].lng, resp.data[i].lat],
                                "name": resp.data[i].areaName,
                                "count": resp.data[i].bikeTotal,
                                "bikeTotal":resp.data[i].bikeTotal,
                                "userDemand":resp.data[i].userDemand,
                                "userDemandDay":resp.data[i].userDemandDay,
                                "userDemandMonth":resp.data[i].userDemandMonth,
                                "ratio":resp.data[i].ratio
                            });
                        }
                        _obj.drawMarkers();
                        $(".button_panel").hide();
                    }
                }
            });
        }
    },
    Data_refresh: function() {
        _obj = this;
        if (this.TimeInterval == null) {
            this.TimeInterval = setInterval(function() {
                _obj.refreshData();
            }, 600000);
        }
        if (this.BikeInterval == null) {
            this.BikeInterval = setInterval(function() {
                //console.log(localStorage.c_city_name)
                $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
                _obj.mapPointsUpdate();
            }, 600000);
        }
    },
    Shinning:function() {
        _obj = this;
        //_obj.shinning_flag++;
        if (_obj.F_circle.length > 0)for (var i in _obj.F_circle) {
            _obj.F_circle[i].randomZoom = _obj.F_circle[i].randomZoom < 5 ? (_obj.F_circle[i].randomZoom + 1) : 1;
            _obj.F_circle[i].setRadius(_obj.F_circle[i].randomZoom*0.5 * _obj.F_circle[i].r_index);
            //if(_obj.F_circle[i].randomZoom%2==0)_obj.F_circle[i].setOptions({fillColor: "#ee2200",strokeColor: '#F33'});
            //else _obj.F_circle[i].setOptions({fillColor: "rgba(17,0,255,255)",strokeColor:"rgba(17,0,255,255)"});
        }
        _obj.shinningControl = setTimeout(function () {
            _obj.Shinning()
        }, 250);
    //    if(parseInt(_obj.shinning_flag)%2==0){
    //        _obj.shinning_switch = !_obj.shinning_switch;
    //        if (_obj.F_line.length > 0)for (var i in _obj.F_line) {
    //        if (_obj.shinning_switch)
    //            _obj.F_line[i].setOptions({
    //                strokeColor: '#3366FF',   // 线颜色
    //                strokeDasharray: [10, 10], // 补充线样式
    //            });
    //        else
    //            _obj.F_line[i].setOptions({
    //                strokeColor: '#3366FF',   // 线颜色
    //                strokeDasharray: [15, 5], // 补充线样式
    //            });
    //        //}
    //        //else{
    //        //    _obj.F_line[i].setOptions({
    //        //        strokeColor: '#3366FF',   // 线颜色
    //        //        strokeDasharray: [15, 5], // 补充线样式
    //        //    });
    //        //}
    //    }
    //}
    },
    KillInterval: function() {
        _obj = this;
        setInterval(function() {
            //console.log(_obj.TimeInterval);
            clearInterval(_obj.TimeInterval)
            _obj.TimeInterval = null;
            _obj.BikeInterval = null;
        }, 1800000);
    }
}

function getRDList() {
    var list = [];
    for (var i = 0; i < 7; i++) {
        list.push(parseInt(Math.random() * 100))
    }
    return list;
}
var list_ctrl = false;

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
dispatch_obj.init();
//var refresh_data=setInterval(function(){
//    dispatch_obj.refreshData();
dispatch_obj.map.setMapStyle('normal');
//},10000);
//function Data_refresh(){
//    dispatch_obj.refreshData();
//    setTimeout(function(){Data_refresh()},10000)
//}
dispatch_obj.Data_refresh();
dispatch_obj.KillInterval();
var test = new Vcity.CitySelector({
    input: 'citySelect'
});

//获取位置最东经纬度
function getEastest(list){
    var pos=list[0];
    var eastest=list[0].getLng()
    for(var i in list){
        if((eastest-list[i].getLng())<0){
            eastest=list[i].getLng();
            pos=list[i];
        }
    }
    return pos;
}


//构建自定义信息窗体
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    //var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    //closeX.src = "http://webapi.amap.com/images/close2.gif";
    //closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    //top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    //bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}
//
function createAreaInfo(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    //var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    //closeX.src = "http://webapi.amap.com/images/close2.gif";
    //closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    //top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    //bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

    function saveArea(_v){
    $("#save_confirm").attr("save_indx",_v);
    $("#save_area").modal('show');
}