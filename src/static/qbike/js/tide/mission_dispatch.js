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
                    taskBub: _base_url +'/taskBub2.json',
                    addPoint:_base_url +'/Mission_add.json',
                    delPoint:_base_url +'/Mission_del.json',
                    updatePoint:_base_url +'/Mission_update.json',
                    view:_base_url +'/IM_view.json',
                    showHeat:_base_url +'/heatMap.json'
                },
                product: {
                    showHot:'/hotpoint/list',
                    taskBub: '/task/taskBub',
                    addPoint:'/hotpoint/add',
                    delPoint:'/hotpoint/del',
                    updatePoint:'/task/updateTaskHotPoint',
                    view:"/illegal/list",		    
                    showHeat:"/task/searchHotModel"
                }
            }
        }
    };
//热力图
var heatmapData=[];
var dispatch_obj={
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
    drawLine:[],
    lineList:[],
    inLine:{},
    requestNum:[],
    polygonList:[],
    auto:"",
    heatmap:"",
    map_markers:[],
    readMission:true,
    displayFlag:true,
    init:function(){
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.componentInit();
    },
    componentInit:function(){
        var _obj=this;
        $("#map-ctrl-heat").on("click",function(){
            if($("#map-ctrl-heat span").text()=="热力模式"){
                _obj.showHeatMap();
            }
            else{
                $("#map-ctrl-heat span").text("热力模式");
                _obj.heatmap.hide();
            }
        });
        $("#map-ctrl-mission").on("click",function(){
            if($("#map-ctrl-mission span").text()=="显示任务"){
                _obj.displayFlag=true;
                _obj.drawMissionTarget();
                _obj.showTarget();
                _obj.showLine();
                _obj.drawMass();
                $("#map-ctrl-mission span").text("隐藏任务");
            }
            else{
                $("#map-ctrl-mission span").text("显示任务");
                for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                _obj.map.remove(_obj.map_markers);
                _obj.map.remove(_obj.targetList);
                _obj.map.remove(_obj.lineList);
                _obj.displayFlag=false;
            }
        });
        $("#close_addr").on("click",function(){
            $(".select-panel").hide();
        });
        $("#add_goBack,#know").on("click",function(){
            $("#mission_detail").animate({"opacity":0});
            $("#mission_detail").hide();
        })
    },
    mapPointsUpdate: function() {
        _obj = this;
        var bounds=_obj.map.getBounds();
            $.ajax({
                //lng=121.479711&lat=31.264772
                url: _defautBiz.api("taskBub"),
                dataType: "json",
                method: 'get',
                data:{
                    lng:_obj.map_lng,
                    lat:_obj.map_lat,
                    mapZoom:_obj.map_zoom,
                    topRightLng:bounds.getNorthEast().getLng(),
                    topRightLat:bounds.getNorthEast().getLat(),
                    bottomLeftLng:bounds.getSouthWest().getLng(),
                    bottomLeftLat:bounds.getSouthWest().getLat()
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    //xhr.setRequestHeader("User-Agent", "headertest");
                },
                success: function(resp) {
                    if (_obj.map_zoom > 13&&resp.data.data.datas) {
                        _obj.map.remove(_obj.map_markers);
                        $("#map-ctrl-heat").show();
                        $("#map-ctrl-mission").show();
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
                                "lockUploadTime":resp.data.data.datas[i].lockUploadTime,
                                "power":resp.data.data.datas[i].power,
                                "taskStatusStr":resp.data.data.datas[i].taskStatusStr
                            });
                        }
                        //if(_obj.readMission)_obj.drawMission();
                            if(_obj.displayFlag){
                                _obj.drawMassLine();
                                _obj.drawMissionTarget();
                                _obj.showTarget();
                                _obj.showLine();
                            }
                        //}
                        _obj.drawMass();
                        _obj.drawPolygon();

                    } else if (_obj.map_zoom <= 13 && _obj.map_zoom >= 10) {
                        if(_obj.heatmap)_obj.heatmap.hide();
                        $("#map-ctrl-heat span").text("热力模式");
                        $("#map-ctrl-heat").hide();
                        $("#map-ctrl-mission span").text("隐藏任务");
                        $("#map-ctrl-mission").hide();
                        _obj.displayFlag=true;
                        scroll_flag=true;
                        _obj.map.remove(_obj.map_markers);
                        _obj.map.remove(_obj.targetList);
                        _obj.map.remove(_obj.lineList);
                        _obj.map.remove(_obj.polygonList);
                        $(".select-panel").hide();
                        _obj.lineFlag=false;
                        if(_obj.targetMark)_obj.map.remove(_obj.targetMark);

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
                                "count": resp.data[i].count
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
                        $("#map-ctrl-heat").hide();
                        $("#map-ctrl-heat span").text("热力模式");
                        $("#map-ctrl-mission").hide();
                        $("#map-ctrl-mission span").text("隐藏任务");
                        if(_obj.heatmap)_obj.heatmap.hide();
                        scroll_flag=true;
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        _obj.map.remove(_obj.zoomMass);
                        _obj.map.remove(_obj.targetList);
                        _obj.map.remove(_obj.lineList);
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
                            });
                        }
                        _obj.drawMarkers();
                        $(".button_panel").hide();
                    }
                }
            });
        //}
    },
    dataUpdate:function(type,curpage){
        var curpage=curpage?curpage:1;
        $.ajax({
            url:_defautBiz.api("countBarInfo"),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                $("#ride_times").text(resp.data.countAll+"条");
                $("#ride_dis").text(resp.data.countBikes+"辆");
                $("#cur_all").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>当前全部:</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countAll+"条'>"+resp.data.countAll+"条</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden'  data-toggle='tooltip' data-original-title='"+resp.data.countBikes+"辆'>"+resp.data.countBikes+"辆</div>");
                $("#countUserUpload").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>用户上报:</div><div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countUserUpload+"条'>"+resp.data.countUserUpload+"条</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden'  data-toggle='tooltip' data-original-title='"+resp.data.countBikeUserUpload+"辆'>"+resp.data.countBikeUserUpload+"辆</div>");
                $("#countLongTimeNoUse").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>长时未骑:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countLongTimeNoUse+"辆'>"+resp.data.countLongTimeNoUse+"辆</div>");
                $("#countAbnormalMoving").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>异常移动:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countAbnormalMoving+"辆'>"+resp.data.countAbnormalMoving+"辆</div>");
                $("#countUnLocked").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>长时未锁:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countUnLocked+"辆'>"+resp.data.countUnLocked+"辆</div>");
                $("#countLowBattery").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>低电量:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countLowBattery+"辆'>"+resp.data.countLowBattery+"辆</div>");
                $("#countOffLine").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>离线:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countOffline+"辆'>"+resp.data.countOffline+"辆</div>");
                $("[data-toggle='tooltip']").tooltip();
            }})
//$("#alert_body").html("");
        var _obj=this;
        //if(_obj.zoomMass!=null)_obj.map.remove(_obj.zoomMass);
        //$("#bike_result").hide();
        $("#alert_body a").removeClass("active");
        switch (type) {
            ///listLatestWarningBikes 添加了新参数
            //    warnType：预警类型(0: 未知, 1:车辆丢失, 2:车辆损坏, 3:车辆电量低, 4:异常移动, 5:长时未用, 6:撬锁，7:撞击上传,8:离线,9:长时间未锁)
            //    warnSource: 0 （系统上报） 1：用户上报
            case 'cur_all':
                _obj.warn_type="";
                _obj.warn_source=0;
                $("#exportList").show();
                var url="?currentPage="+curpage;
                _obj.judgmentStr="";
                break;
            case 'countUserUpload':
                _obj.warn_type="";
                _obj.warn_source=1;
                $("#exportList").show();
                var url="?source=1&currentPage="+curpage;
                _obj.judgmentStr="&warnSource=1";
                break;
            case 'countLongTimeNoUse':
                _obj.warn_type=5;
                _obj.warn_source=0;
                $("#bg_item").fadeIn();
                $(".select-content-container.NoUse").fadeIn();
                $("#exportList").show();
                var url="?type=5&currentPage="+curpage;
                _obj.judgmentStr="&warnType=5";
                break;
            case 'countAbnormalMoving':
                _obj.warn_type=4;
                _obj.warn_source=0;
                $("#exportList").show();
                var url="?type=4&currentPage="+curpage;
                _obj.judgmentStr="&warnType=4";
                break;
            case 'countUnLocked':
                _obj.warn_type=9;
                _obj.warn_source=0;
                $("#exportList").show();
                var url="?type=9&currentPage="+curpage;
                _obj.judgmentStr="&warnType=9";
                break;
            case 'countLowBattery':
                _obj.warn_type=3;
                _obj.warn_source=0;
                $("#exportList").show();
                var url="?type=3&currentPage="+curpage;
                _obj.judgmentStr="&warnType=3";
                break;
            case 'countOffLine':
                _obj.warn_type=8;
                _obj.warn_source=0;
                $("#bg_item").fadeIn();
                $(".select-content-container.OffLine").fadeIn();
                $("#exportList").show();
                var url="?type=8&currentPage="+curpage;
                _obj.judgmentStr="&warnType=8";
                break;
            case'NoUse1':
                _obj.warn_type=5;
                _obj.warn_lvl=1;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.NoUse").show();
                $("#exportList").show();

                var url="?type=5&currentPage="+curpage+"&level=1";
                _obj.judgmentStr="&warnType=5&level=1";
                break;
            case'NoUse2':
                _obj.warn_type=5;
                _obj.warn_lvl=2;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.NoUse").show();
                $("#exportList").show();
                var url="?type=5&currentPage="+curpage+"&level=2";
                _obj.judgmentStr="&warnType=5&level=2";
                break;
            case'NoUse3':
                _obj.warn_type=5;
                _obj.warn_lvl=3;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.NoUse").show();
                $("#exportList").show();
                var url="?type=5&currentPage="+curpage+"&level=3";
                _obj.judgmentStr="&warnType=5&level=3";
                break;
            case'NoUse4':
                _obj.warn_type=5;
                _obj.warn_lvl=4;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.NoUse").show();
                $("#exportList").show();
                var url="?type=5&currentPage="+curpage+"&level=4";
                _obj.judgmentStr="&warnType=5&level=4";
                break;
            case'OffLine1':
                _obj.warn_type=8;
                _obj.warn_lvl=1;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.OffLine").show();
                $("#exportList").show();
                var url="?type=8&currentPage="+curpage+"&level=1";
                _obj.judgmentStr="&warnType=8&level=1";
                break;
            case'OffLine2':
                _obj.warn_type=8;
                _obj.warn_lvl=2;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.OffLine").show();
                $("#exportList").show();
                var url="?type=8&currentPage="+curpage+"&level=2";
                _obj.judgmentStr="&warnType=8&level=2";
                break;
            case'OffLine3':
                _obj.warn_type=8;
                _obj.warn_lvl=3;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.OffLine").show();
                $("#exportList").show();
                var url="?type=8&currentPage="+curpage+"&level=3";
                _obj.judgmentStr="&warnType=8&level=3";
                break;
            case'OffLine4':
                _obj.warn_type=8;
                _obj.warn_lvl=4;
                _obj.warn_source=0;
                $("#bg_item").show();
                $(".select-content-container.OffLine").show();
                $("#exportList").show();
                var url="?type=8&currentPage="+curpage+"&level=4";
                _obj.judgmentStr="&warnType=8&level=4";
                break;
        }
        _obj.mapPointsUpdate();
        $.ajax({
            //url:_defautBiz.api("warningDigestPage")+(url==""?"?":url)+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            url:_defautBiz.api("warningDigestPage")+(url==""?"?":url),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var Alertlist="";
                _obj.tot_page=resp.data.page.totalPage;
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                $("#detail_previous a").attr("data-dt-idx",0);
                $("#detail_next a").attr("data-dt-idx",2);
                if($("#detail_previous a").attr("data-dt-idx")==0)
                    $("#detail_previous").addClass("disabled");
                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");
                _obj.pos_list=[];
                $("#alert_body").html("");
                var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
                $("#alert_time").html(c_date);
                _obj.data_storage=resp.data.data;
                //$("#alert_body").html("");
                for (var i in resp.data.data) {
                    if(resp.data.data[i].lng!=undefined&&resp.data.data[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)
                        _obj.pos_list.push({
                            "lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
                            //"lnglat": [121.4628360, 31.0328570],
                            "name": resp.data.data[i].bike_number
                        });
                    var type_class = resp.data.data[i].warn_source== 0 ? 'system' : 'user';
                    var type_name = resp.data.data[i].warn_source == 0 ? '系统' : '用户';
                    //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                    var new_stat = '<img src="/static/qbike/img/new.png">';
                    Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg)+"("+resp.data.data[i].bike_number+" "+(resp.data.data[i].warn_area?resp.data.data[i].warn_area:"")+")"+ '</span></a></td></tr>';
                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                }
                $("#alert_body").prepend(Alertlist);
                $("[data-toggle='tooltip']").tooltip();
                $("#alert_body a").off().on("click",function(){
                    _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                });

            }
        })
    },
    toDetail:function(bid,lng,lat){
        var _obj=this;
        localStorage.alert_detail_indx=0;
        if(this.zoomMass!=null)this.map.remove(this.zoomMass);
        if(lng!="undefined"&&lat!="undefined"){
            //this.map.setCenter();
            this.map.setZoomAndCenter(16,[lng,lat]);
            }
        $(".alert_msg").html("");
        $.ajax({
            url: _defautBiz.api("bikeDetail")+"&bikeNumber="+bid ,
            dataType: "json",
            method: 'get',
            success: function(resp) {
                localStorage.bike_id=bid;
                if(lng!="undefined"&&lat!="undefined"){
                _obj.geocoder.getAddress([lng,lat], function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var img_url=(function(status,level){
                            var name=(status!=5&&status!=8?"enable":status+"-"+level)
                            switch(name){
                                case 'enable':
                                    return  '/static/qbike/img/enable_Max.png';
                                    break;
                                case '8-1':
                                    return  '/static/qbike/img/off1_Max.png';
                                    break;
                                case '8-2':
                                    return  '/static/qbike/img/off2_Max.png';
                                    break;
                                case '8-3':
                                    return  '/static/qbike/img/off3_Max.png';
                                    break;
                                case '8-4':
                                    return  '/static/qbike/img/off4_Max.png';
                                    break;
                                case '5-1':
                                    return  '/static/qbike/img/long1_Max.png';
                                    break;
                                case '5-2':
                                    return  '/static/qbike/img/long2_Max.png';
                                    break;
                                case '5-3':
                                    return  '/static/qbike/img/long3_Max.png';
                                    break;
                                default:
                                    return  '/static/qbike/img/enable_Max.png';
                            }
                        })(resp.data.warn.warnType,resp.data.warn.level?resp.data.warn.level:1)
                        _obj.zoomMass = new AMap.MassMarks([
                            {
                                "lnglat": [lng,lat],
                                "name":bid
                            }
                        ],{
                            url: img_url,
                            anchor: new AMap.Pixel(31, 55),
                            size: new AMap.Size(62, 65),
                            opacity: 1,
                            cursor: 'pointer',
                            zIndex: 10
                        });
                        _obj.zoomMass.setMap(_obj.map);
                        localStorage.bike_loc = result.regeocode.formattedAddress
                        localStorage.bike_time=resp.data.BikeBasicDetail.times;
                        localStorage.bike_duration=resp.data.BikeBasicDetail.duration;
                        localStorage.bike_distance=resp.data.BikeBasicDetail.distance;
                        localStorage.bike_useDate=resp.data.BikeBasicDetail.useDate;
                        localStorage.bike_useLoc=resp.data.BikeBasicDetail.location;
                        localStorage.bike_lastMaintainDate=resp.data.BikeBasicDetail.lastMaintainDate;
                        localStorage.bike_status=resp.data.BikeBasicDetail.status;
                        localStorage.bike_faultType=resp.data.BikeBasicDetail.faultType;
                        localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                        localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                        if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                        $("#bike_power").removeClass("red");
                        $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                        if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                        $("#bike_loc").text(localStorage.bike_loc+"附近");
                        $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                        if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                        $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                        $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                        $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                        $("#bike_time").text(resp.data.BikeBasicDetail.times);
                        $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
                        $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
                    }
                    else{
                        localStorage.bike_loc = "未知"
                        localStorage.bike_time=resp.data.BikeBasicDetail.times;
                        localStorage.bike_duration=resp.data.BikeBasicDetail.duration;
                        localStorage.bike_distance=resp.data.BikeBasicDetail.distance;
                        localStorage.bike_useDate=resp.data.BikeBasicDetail.useDate;
                        localStorage.bike_useLoc=resp.data.BikeBasicDetail.location;
                        localStorage.bike_lastMaintainDate=resp.data.BikeBasicDetail.lastMaintainDate;
                        localStorage.bike_status=resp.data.BikeBasicDetail.status;
                        localStorage.bike_faultType=resp.data.BikeBasicDetail.faultType;
                        localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                        localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                        if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                        $("#bike_power").removeClass("red");
                        $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                        if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                        $("#bike_loc").text(localStorage.bike_loc);
                        $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                        if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                        $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                        $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                        $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                        $("#bike_time").text(resp.data.BikeBasicDetail.times);
                        $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
                        $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
                    }
                });
                }
                else{
                    localStorage.bike_loc = "未知"
                    localStorage.bike_time=resp.data.BikeBasicDetail.times;
                    localStorage.bike_duration=resp.data.BikeBasicDetail.duration;
                    localStorage.bike_distance=resp.data.BikeBasicDetail.distance;
                    localStorage.bike_useDate=resp.data.BikeBasicDetail.useDate;
                    localStorage.bike_useLoc=resp.data.BikeBasicDetail.location;
                    localStorage.bike_lastMaintainDate=resp.data.BikeBasicDetail.lastMaintainDate;
                    localStorage.bike_status=resp.data.BikeBasicDetail.status;
                    localStorage.bike_faultType=resp.data.BikeBasicDetail.faultType;
                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                    $("#bike_power").removeClass("red");
                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                    $("#bike_loc").text(localStorage.bike_loc);
                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                    $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                    $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
                    $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
                    $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
                }
            }
        })
        var warn_list=$.grep(_obj.data_storage,function(el){return el.bike_number==bid});
        for(var i in warn_list){
            $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间'+new Date(warn_list[i].update_time).format("yyyy.MM.dd hh:mm")+'</div><div class="al_type">故障类型:'+(warn_list[i].warn_source == 0 ? '系统上报' : '用户上报')+'/'+warnType_parser(warn_list[i].warn_type)+'</div><div class="al_msg">故障描述:'+warn_list[i].warn_msg+'</div></div>');
        }
        $("#bike_result").show();
        //M_marker.setPosition(e.data.lnglat);
        $("#bike_id").text(bid);
    } ,
        searchDetail:function(bid){
            var _obj=this;
            if(bid!="") {
                //var warn_list
                //var searchResult = $.grep(this.data_storage, function (el) {
                //    return el.bike_number == bid
                //})
                var searchResult=[];
                var resultObj={};
                $.ajax({
                    url: _defautBiz.api("getBikeById")+"?bid="+ bid,
                    dataType: "json",
                    method: 'get',
                    success: function(resp) {
                    if (resp.success) {
                        if(resp.data.BikeBasicDetailRight!=undefined){
                            $("#s_info").text("车辆被隐藏,如需查询,请设置为显示");
                            $("#search_rslt").modal('show');
                            return;
                        }
                        resultObj.bike_number=resp.data.bid;
                    resultObj.lng=resp.data.posCurr[0];
                    resultObj.lat=resp.data.posCurr[1];
                    resultObj.update_time=resp.data.warn_time;
                    resultObj.warn_source=resp.data.warn_source;
                    resultObj.warn_type=resp.data.warn_type;
                    resultObj.warn_msg=resp.data.warn_msg;
                    searchResult.push(resultObj);
                    if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
                    if (searchResult[0].lng != undefined && searchResult[0].lat != undefined) {
                    }
                    $(".alert_msg").html("");
                    $.ajax({
                        url: _defautBiz.api("bikeDetail") + "&bikeNumber=" + bid,
                        dataType: "json",
                        method: 'get',
                        success: function (resp) {
                            _obj.geocoder.getAddress([searchResult[0].lng, searchResult[0].lat], function(status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    var img_url=(function(status,level){
                                        var name=(status!=5&&status!=8?"enable":status+"-"+level)
                                        switch(name){
                                            case 'enable':
                                                return  '/static/qbike/img/enable_Max.png';
                                                break;
                                            case '8-1':
                                                return  '/static/qbike/img/off1_Max.png';
                                                break;
                                            case '8-2':
                                                return  '/static/qbike/img/off2_Max.png';
                                                break;
                                            case '8-3':
                                                return  '/static/qbike/img/off3_Max.png';
                                                break;
                                            case '8-4':
                                                return  '/static/qbike/img/off4_Max.png';
                                                break;
                                            case '5-1':
                                                return  '/static/qbike/img/long1_Max.png';
                                                break;
                                            case '5-2':
                                                return  '/static/qbike/img/long2_Max.png';
                                                break;
                                            case '5-3':
                                                return  '/static/qbike/img/long3_Max.png';
                                                break;
                                            default:
                                                return  '/static/qbike/img/enable_Max.png';
                                        }
                                    })(resp.data.warn.warnType,resp.data.warn.level?resp.data.warn.level:1)
                                    _obj.zoomMass = new AMap.MassMarks([
                                        {
                                            "lnglat": [searchResult[0].lng, searchResult[0].lat],
                                            "name": bid
                                        }
                                    ], {
                                        url: img_url,
                                        anchor: new AMap.Pixel(31, 55),
                                        size: new AMap.Size(62, 65),
                                        opacity: 1,
                                        cursor: 'pointer',
                                        zIndex: 10
                                    });
                                    setTimeout(function () {
                                        _obj.map.setZoomAndCenter(16,[searchResult[0].lng, searchResult[0].lat]);
                                        _obj.searching_lat=searchResult[0].lat;
                                        _obj.searching_lng=searchResult[0].lng;
                                        _obj.zoomMass.setMap(_obj.map);
                                    }, 500)

                                    localStorage.bike_loc = result.regeocode.formattedAddress
                                    localStorage.bike_id = bid;
                                    localStorage.bike_time = resp.data.BikeBasicDetail.times;
                                    localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
                                    localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
                                    localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
                                    localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
                                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                    localStorage.bike_status = resp.data.BikeBasicDetail.status;
                                    localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
                                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                                    $("#bike_power").removeClass("red");
                                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                                    $("#bike_loc").text(localStorage.bike_loc+"附近");
                                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                                    $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                    $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
                                    $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
                                }
                                else{
                                    localStorage.bike_loc = "未知"
                                    localStorage.bike_id = bid;
                                    localStorage.bike_time = resp.data.BikeBasicDetail.times;
                                    localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
                                    localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
                                    localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
                                    localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
                                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                    localStorage.bike_status = resp.data.BikeBasicDetail.status;
                                    localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
                                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                                    $("#bike_power").removeClass("red");
                                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                                    $("#bike_loc").text(localStorage.bike_loc);
                                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                                    $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                    $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
                                    $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
                                }
                            });

                        }
                    })
                    for (var i in searchResult) {
                        $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间' + new Date(searchResult[i].update_time).format("yyyy.MM.dd hh:mm") + '</div><div class="al_type">故障类型:' + (searchResult[i].warn_source == 0 ? '系统上报' : '用户上报') + '/' + warnType_parser(searchResult[i].warn_type) + '</div><div class="al_msg">故障描述:' + searchResult[i].warn_msg + '</div></div>');
                    }
                    $("#bike_result").show();
                    //M_marker.setPosition(e.data.lnglat);
                    $("#bike_id").text(bid);
                }
                else {
                    $("#s_info").text("无搜索结果噢");
                    $("#search_rslt").modal('show');
                }
                    }});
            }
            else{
                $("#s_info").text("请输入关键字");
                $("#search_rslt").modal('show');
            }

            localStorage.alert_detail_indx=0;
        },
        showHeatMap:function(){
            var _obj=this;
            var bounds=_obj.map.getBounds();
            $.ajax({
                //lng=121.479711&lat=31.264772
                url: _defautBiz.api("showHeat"),
                dataType: "json",
                data: {
                    topRightLng:bounds.getNorthEast().getLng(),
                    topRightLat:bounds.getNorthEast().getLat(),
                    bottomLeftLng:bounds.getSouthWest().getLng(),
                    bottomLeftLat:bounds.getSouthWest().getLat()
                },
                method: 'get',
                success: function(resp) {
                    heatmapData=[];
                    $("#map-ctrl-heat span").text("普通模式");
                    for(var i in resp.data.data){
                        var heat=resp.data.data[i];
                        heatmapData.push({
                            "lng":heat.lng,
                            "lat":heat.lat,
                            "count":heat.count
                        });
                    }
                    if(!_obj.heatmap){
                        _obj.map.plugin(["AMap.Heatmap"], function() {
                            //初始化heatmap对象
                            _obj.heatmap= new AMap.Heatmap(_obj.map, {
                                radius: 25, //给定半径
                                opacity: [0, 0.8]
                            });
                            //设置数据集：该数据为北京部分“公园”数据
                            _obj.heatmap.setDataSet({
                                data: heatmapData,
                                max: 1
                            });
                        });
                    }
                    else{
                        _obj.heatmap.setDataSet({
                            data: heatmapData,
                            max: 1
                        });
                        _obj.heatmap.show();
                    }
                    //_obj.map.setZoomAndCenter(16,[heatmapData[0].lng,heatmapData[0].lat]);
                }})
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
                            bubble:true,
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
    drawMassLine:function(){
        for (var i in _obj.areaList) {
            if(_obj.areaList[i].targetlnglat){
                var listContain=$.grep(_obj.lineList,function(e){
                    return e.bikeNum==_obj.areaList[i].taskId&& e.display;
                });
                console.log(listContain);
                if(listContain.length==0){
                    var polyline = new AMap.Polyline({
                        path: [_obj.areaList[i].lnglat,_obj.areaList[i].targetlnglat],          //设置线覆盖物路径
                        strokeColor: "#ff4133", //线颜色
                        strokeOpacity: 1,       //线透明度
                        strokeWeight: 5,        //线宽
                        strokeStyle: "solid",   //线样式
                        zIndex:-1,
                        strokeDasharray: [10, 5] //补充线样式
                    });
                    polyline.setMap(_obj.map);
                    polyline.bikeNum=_obj.areaList[i].taskId;
                    polyline.display=true;
                    polyline.targetId=_obj.areaList[i].hotpointId;
                    _obj.lineList.push(polyline);
                }
            }
        }
    },
    drawMissionTarget:function(){
            var _obj=this;
            _obj.map.remove(_obj.targetList);
            _obj.targetList=[];
            _obj.map.remove(_obj.lineList);
            this.readMission=false;
            $.ajax({
                //lng=121.479711&lat=31.264772
                url: _defautBiz.api("showHot"),
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    var MarkerList=resp.data;
                    for (var i in MarkerList) {
                        if(MarkerList[i].centerPointLng&&MarkerList[i].centerPointLat) {
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
                                position: [MarkerList[i].centerPointLng, MarkerList[i].centerPointLat],
                                //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                                content: '<div class="marker-route marker-marker-bus-from" style="background: url('+buble_url+');background-size:cover;width: 78px;height: 78px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 75px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center"><span id="' + MarkerList[i].needNumber + '"style="border:0px solid #fff;width:40px;color:#fff;text-align: center">' + MarkerList[i].needNumber + '</span></div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px"></div></div>',
                                offset: {
                                    x: -34,
                                    y: -66
                                }
                            });
                            targetMark.display = true;
                            targetMark.requestNum = MarkerList[i].needNumber;
                            targetMark.targetId = MarkerList[i].id;
                            targetMark.setMap(_obj.map);
                            targetMark.on('click', function (e) {
                                var _marker = this;
                                if (_obj.lineFlag && _obj.inLine.beginLine) {
                                    $.ajax({
                                        url: _defautBiz.api("updatePoint"),
                                        data: {
                                            hotpointId: _marker.targetId,
                                            taskId: _obj.inLine.bikeNum
                                        },
                                        dataType: "json",
                                        method: 'get',
                                        success: function (resp) {
                                            _obj.inLine.endLine = _marker.getPosition();
                                            _obj.inLine.targetId = _marker.targetId;
                                            _obj.inLine.display = true;
                                            _obj.drawMissionLine();
                                            _obj.requestNum.push({
                                                "target": _marker.targetId,
                                                "request": $("#" + _obj.targetMark.targetId).val()
                                            });
                                            _obj.lineFlag = false;
                                            _obj.targetMark = "";
                                            _obj.showTarget();
                                        }
                                    });
                                }
                            })
                            targetMark.on('rightclick', function (e) {
                                    var _marker = this;
                                    setTimeout(function(){
                                $("#alert_panel").show();
                                $("#alert_panel").animate({"opacity":1});
                                $("#del_goBack").off().on("click",function(){
                                    $("#alert_panel").hide();
                                    $("#alert_panel").animate({"opacity":0});
                                })
                                $("#del_cof").off().on("click",function(){
                                    $("#alert_panel").hide();
                                    $("#alert_panel").animate({"opacity":0});
                                    $.ajax({
                                        url: _defautBiz.api("delPoint"),
                                        data: {
                                            id: _marker.targetId
                                        },
                                        dataType: "json",
                                        method: 'get',
                                        success: function (resp) {
                                            _marker.hide();
                                            var removerTarget = $.grep(_obj.targetList, function (e) {
                                                return e.targetId == _marker.targetId;
                                            })[0];
                                            if (removerTarget && removerTarget.length > 0) {
                                                removerTarget.display = false;
                                            }
                                            var removelineList = $.grep(_obj.lineList, function (e) {
                                                return e.targetId == _marker.targetId;
                                            });

                                            //console.log(removelineList);
                                            if (removelineList && removelineList.length > 0) {
                                                for (var i in removelineList) {
                                                    removelineList[i].display = false;
                                                    removelineList[i].targetId = "";
                                                }
                                            }
                                            _obj.showLine();
                                            _obj.mapPointsUpdate();
                                        }
                                    })
                                })
                                },500)
                            }
                            )
                            _obj.targetList.push(targetMark);
                        }
                    }

                }})
            //for (var i in _obj.areaList) {
            //    if(_obj.areaList[i].targetlnglat){
            //    var polyline = new AMap.Polyline({
            //        path: [_obj.areaList[i].lnglat,_obj.areaList[i].targetlnglat],          //设置线覆盖物路径
            //        strokeColor: "#ff4133", //线颜色
            //        strokeOpacity: 1,       //线透明度
            //        strokeWeight: 5,        //线宽
            //        strokeStyle: "solid",   //线样式
            //        zIndex:-1,
            //        strokeDasharray: [10, 5] //补充线样式
            //    });
            //    polyline.setMap(_obj.map);
            //    polyline.bikeNum=_obj.areaList[i].taskId;
            //    polyline.display=true;
            //    polyline.targetId=_obj.areaList[i].hotpointId;
            //    _obj.lineList.push(polyline);
            //    }
            //}
        },
        drawMissionLine:function(){
            var _obj=this;
            this.drawLine=[
                this.inLine.beginLine,this.inLine.endLine
            ];
            var polyline = new AMap.Polyline({
                path: this.drawLine,          //设置线覆盖物路径
                strokeColor: "#ff4133", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                zIndex:-1,
                strokeDasharray: [10, 5] //补充线样式
            });
            polyline.bikeNum=this.inLine.bikeNum;
            polyline.targetId=this.inLine.targetId;
            polyline.display=this.inLine.display;
            var replace=$.grep(this.lineList,function(e){
                return e.bikeNum==polyline.bikeNum&& e.display;
            })[0];
            if(replace){
                replace.targetId=this.inLine.targetId;
                replace.setPath(this.drawLine);
            }
            else{
                this.lineList.push(polyline);
                polyline.setMap(this.map);
            }
            this.inLine={};
            this.mapPointsUpdate();
        },
        drawMass: function() {
            var _obj=this;
            //if (!this.massBuild) {
            if(_obj.displayFlag){
                for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                _obj.map_massList = [];
                if(_obj.areaList.length>0){this.massBuild = true;}
                for (var i in _obj.areaList) {
                    var pos = _obj.areaList[i].lnglat;
                    var img_url=(function(status,flag)
                    {
                        var url="";
                        if(!flag)url="_dark"
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
                )(_obj.areaList[i].status,_obj.areaList[i].targetlnglat);
                    var marker = new AMap.Marker({
                        position: pos,
                        //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                        content: '<div class="marker-route marker-marker-bus-from" style="background: url('+img_url+');background-size:cover;width: 55px;height: 61px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 59px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center;color:#fff;">'+_obj.areaList[i].taskSeq+'</div></div>',
                        offset: {
                            x: -30,
                            y: -55
                        }
                    });

                    marker.taskId =_obj.areaList[i].taskId;
                    marker.loc = pos;
                    marker.bikeNum=_obj.areaList[i].bikeId;
                    marker.taskStatusStr=_obj.areaList[i].taskStatusStr;
                    marker.fixedType=_obj.areaList[i].fixedType;
                    marker.power=_obj.areaList[i].power;
                    marker.fixedTime=_obj.areaList[i].fixedTime;
                    marker.lockUploadTime=_obj.areaList[i].lockUploadTime;
                    marker.currentPos=_obj.areaList[i].fixedLocStreet;
                    marker.setMap(_obj.map);
                    marker.on('click', function (e) {
                        _obj.lineFlag=true;
                        if(_obj.lineFlag){
                            _obj.inLine.beginLine=this.loc;
                            _obj.inLine.bikeNum=this.taskId;
                            //_obj.inLine.bikeNum=e.data.name;
                        }
                    });
                    marker.on('rightclick', function (e) {
                        var _mk=this;
                        setTimeout(function(){
                            $("#mission_detail").show();
                            $("#mission_detail").animate({"opacity":1});
                            $("#car_id").text(_mk.bikeNum);
                            $("#task_status").text(_mk.taskStatusStr);
                            $("#loc_type").text(_mk.fixedType);
                            $("#power").text(_mk.power+"%");
                            $("#fixed_time").text(_mk.fixedTime);
                            $("#locked_time").text(_mk.lockUploadTime);
                            $("#new_pos").text(_mk.currentPos);
                        },500)
                    })
                    this.map_massList.push(marker);
                }
                //_obj.map.setZoomAndCenter(16,_obj.areaList[0].lnglat);
        //}
            }
            if($("#map-ctrl-heat span").text()=="普通模式")this.showHeatMap();
    },
    drawMarkers: function() {
        _obj = this;
        var lnglat_list = this.areaList.map(function(e, i) {
            return {
                lng: e.lnglat[0],
                lat: e.lnglat[1],
                name: e.name,
                count: e.count > 100000 ? "100,000+" : e.count.toLocaleString()
            }
        });
        this.map_markers = [];
        if(lnglat_list.length>0){
        for (var i in lnglat_list) {
            var pos = [lnglat_list[i].lng, lnglat_list[i].lat];
            var marker = new AMap.Marker({
                position: pos,
                //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                content: '<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/tide/circle.png);background-size:cover;width: 85px;height: 95px;color:#666;"><div class="area_name" style="color:#ff9600;padding:0 10px;padding-top:25px;font-size:16px;width: 85px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center">' + (lnglat_list[i].name.split("市").length>2?lnglat_list[i].name:lnglat_list[i].name.split("市")[0]) + '</div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px">' + lnglat_list[i].count + '</div></div>',
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
        showTarget:function(){
            var _obj=this;
            _obj.map.remove(_obj.targetList)
            for(var i in _obj.targetList){
                if(_obj.targetList[i].display){
                    _obj.targetList[i].setMap(_obj.map);
                }
            }
        },
        showLine:function(){
            var _obj=this;
            _obj.map.remove(_obj.lineList)
            for(var i in _obj.lineList)
                if(_obj.lineList[i].display)_obj.lineList[i].setMap(_obj.map);
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
                    method: 'get',
                    data:{
                        lng:_obj.map_lng,
                        lat:_obj.map_lat,
                        mapZoom:_obj.map_zoom,
                    },
                    beforeSend: function(xhr) {
                        //xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    },
                    success: function(resp) {
                        _obj.areaList = [];
                        if (resp.data.bikes == undefined&&resp.data.length>0) {
                            for (var i in resp.data) {
                                _obj.areaList.push({
                                    "lnglat": [resp.data[i].lng, resp.data[i].lat],
                                    "name": resp.data[i].areaName,
                                    "count": resp.data[i].count
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
                        var zoomListener = AMap.event.addListener(map, "zoomend", function(e) {
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
                        var clickListener=AMap.event.addListener(map, "rightclick", function(e) {
                                if(_obj.map_zoom>13) {
                                    var cpoint = e.lnglat; //中心点坐标
                                    _obj.geocoder.getAddress(cpoint, function (status, result) {
                                        if (status === 'complete' && result.info === 'OK') {
                                            var address = result.regeocode.formattedAddress;
                                            var poi = result.regeocode.pois;
                                            $(".requestNum input").val("10");
                                            $(".select-panel").show();
                                            $(".poiList .poiContainer").html("");
                                            for (var i in poi){
                                                if(i==9)break;
                                                $(".poiList .poiContainer").append("<div class='list-item'><a href='javascript:void(0)' lng='"+poi[i].location.lng+"' lat='"+poi[i].location.lat+"'>"+poi[i].name+"<font style='font-size: 10px;color:#999;margin-left:10px;'>"+address.split("区")[0]+"区</font>"+"</div></a>");
                                            }
                                            $(".list-item a").off().on("click",function(){
                                                    $(".select-panel").hide();
                                                    //if(_obj.targetMark)_obj.map.remove(_obj.targetMark);
                                                    _obj.targetMark= new AMap.Marker({
                                                        //position: [_obj.map.getCenter().getLng(),_obj.map.getCenter().getLat()],
                                                        position:[$(this).attr("lng"),$(this).attr("lat")],
                                                        //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                                                        offset: {
                                                            x: -34,
                                                            y: -66
                                                        }
                                                    });
                                                    //if(_obj.map_zoom>=13) {
                                                $.ajax({
                                                    url: _defautBiz.api("addPoint"),
                                                    data:{
                                                        centerPointLng:$(this).attr("lng"),
                                                        centerPointLat:$(this).attr("lat"),
                                                        needNumber:$(".requestNum input").val()
                                                    },
                                                    dataType: "json",
                                                    method: 'get',
                                                    success: function(resp) {
                                                        var cpoint = [$(this).attr("lng"),$(this).attr("lat")]; //中心点坐标
                                                        //_obj.targetMark.targetId= new Date().getTime();
                                                        _obj.targetMark.targetId= resp.data.id;
                                                        _obj.targetMark.requestNum=$(".requestNum input").val();
                                                        _obj.targetMark.setContent('<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/tide/loc.png);background-size:cover;width: 78px;height: 78px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 75px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center"><span id="'+_obj.targetMark.targetId+'"style="color:#fff;border:0px solid #fff;width:40px;color:#fff;text-align: center">'+$(".requestNum input").val()+'</span></div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px"></div></div>');
                                                        _obj.targetMark.setMap(_obj.map);
                                                        _obj.targetMark.display=true;
                                                        _obj.targetList.push(_obj.targetMark);
                                                        _obj.targetMark.on('click', function(e) {
                                                            var _marker=this;
                                                            if(_obj.lineFlag&&_obj.inLine.beginLine){
                                                                $.ajax({
                                                                    url: _defautBiz.api("updatePoint"),
                                                                    data:{
                                                                        hotpointId:_marker.targetId,
                                                                        taskId:_obj.inLine.bikeNum
                                                                    },
                                                                    dataType: "json",
                                                                    method: 'get',
                                                                    success: function(resp) {
                                                                    _obj.inLine.endLine=_marker.getPosition();
                                                                    _obj.inLine.targetId=_marker.targetId;
                                                                    _obj.inLine.display=true;
                                                                    _obj.drawMissionLine();
                                                                    _obj.requestNum.push({"target":_marker.targetId,"request":$("#"+_obj.targetMark.targetId).val()});
                                                                    _obj.lineFlag=false;
                                                                    _obj.targetMark="";
                                                                    _obj.showTarget();
                                                                    }});
                                                            }
                                                        })
                                                        _obj.targetMark.on('rightclick', function(e) {
                                                            var _marker=this;
                                                            setTimeout(function() {
                                                                $("#alert_panel").show();
                                                                $("#alert_panel").animate({"opacity": 1});
                                                                $("#del_goBack").off().on("click", function () {
                                                                    $("#alert_panel").hide();
                                                                    $("#alert_panel").animate({"opacity": 0});
                                                                })
                                                                $("#del_cof").off().on("click", function () {
                                                                    $("#alert_panel").hide();
                                                                    $("#alert_panel").animate({"opacity": 0});
                                                                    $.ajax({
                                                                        url: _defautBiz.api("delPoint"),
                                                                        data: {
                                                                            id: _marker.targetId
                                                                        },
                                                                        dataType: "json",
                                                                        method: 'get',
                                                                        success: function (resp) {
                                                                            _marker.hide();
                                                                            var removerTarget = $.grep(_obj.targetList, function (e) {
                                                                                return e.targetId == _marker.targetId;
                                                                            })[0];
                                                                            if (removerTarget && removerTarget.length > 0) {
                                                                                removerTarget.display = false;
                                                                            }
                                                                            var removelineList = $.grep(_obj.lineList, function (e) {
                                                                                return e.targetId == _marker.targetId;
                                                                            });
                                                                            //console.log(removelineList);
                                                                            if (removelineList && removelineList.length > 0) {
                                                                                for (var i in removelineList) {
                                                                                    removelineList[i].display = false;
                                                                                    removelineList[i].targetId = "";
                                                                                }
                                                                            }
                                                                            _obj.showLine();
                                                                            _obj.mapPointsUpdate();
                                                                        }
                                                                    })
                                                                });
                                                            },500);
                                                        })
                                                        _obj.mapPointsUpdate();
                                                        _obj.lineFlag=true;
                                                    //}
                                                    }
                                                });
                                            });
                                        }
                                    })
                                }
                        });

                        //var clickListener=AMap.event.addListener(map, "rightclick", function(e) {
                        //    if(_obj.targetMark)_obj.map.remove(_obj.targetMark);
                        //    _obj.targetMark= new AMap.Marker({
                        //        //position: [_obj.map.getCenter().getLng(),_obj.map.getCenter().getLat()],
                        //        position:e.lnglat,
                        //        //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                        //        offset: {
                        //            x: -42,
                        //            y: -76
                        //        }
                        //    });
                        //    if(_obj.map_zoom>=13) {;
                        //        var cpoint = e.lnglat; //中心点坐标
                        //        _obj.geocoder.getAddress(cpoint, function(status, result) {
                        //            if (status === 'complete' && result.info === 'OK') {
                        //                var address = result.regeocode.formattedAddress;
                        //                var poi = result.regeocode.pois;
                        //                for(var i in poi)
                        //                console.log(poi[i].name)
                        //            }
                        //        })
                        //        _obj.targetMark.targetId= new Date().getTime();
                        //        _obj.targetMark.setContent('<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/num-bubble.png);width: 85px;height: 95px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 85px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center"><input class="requestNum" id="'+_obj.targetMark.targetId+'" type="number" value="10" maxlength="4" style="border:0px solid #fff;width:40px;text-align: center"></div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px"></div></div>');
                        //        _obj.targetMark.setMap(_obj.map);
                        //        _obj.targetMark.on('click', function(e) {
                        //            if(_obj.lineFlag&&_obj.inLine.beginLine){
                        //                console.log($("#"+_obj.targetMark.targetId).val())
                        //                _obj.targetMark.display=true;
                        //                _obj.inLine.endLine=this.getPosition();
                        //                _obj.inLine.targetId=this.targetId;
                        //                _obj.inLine.display=true;
                        //                _obj.drawMissionLine();
                        //                _obj.requestNum.push({"target":this.targetId,"request":$("#"+_obj.targetMark.targetId).val()});
                        //                _obj.targetList.push(_obj.targetMark);
                        //                _obj.lineFlag=false;
                        //                _obj.targetMark="";
                        //                _obj.showTarget();
                        //            }
                        //        })
                        //        _obj.targetMark.on('rightclick', function(e) {
                        //            var _marker=this;
                        //            this.hide();
                        //            var removerTarget=$.grep(_obj.targetList,function(e){
                        //                return e.targetId==_marker.targetId;
                        //            })[0];
                        //            if(removerTarget&&removerTarget.length>0){
                        //                removerTarget.display=false;
                        //            }
                        //            var removelineList=$.grep(_obj.lineList,function(e){
                        //                return e.targetId==_marker.targetId;
                        //            });
                        //            console.log(_obj.lineList);
                        //            console.log(_marker.targetId);
                        //            //console.log(removelineList);
                        //            if(removelineList&&removelineList.length>0){
                        //                for(var i in removelineList){
                        //                    removelineList[i].display=false;
                        //                    removelineList[i].targetId="";
                        //                }
                        //            }
                        //            _obj.showLine();
                        //        })
                        //
                        //        _obj.lineFlag=true;
                        //    }
                        //    ;
                        //})

                        var dragListener = AMap.event.addListener(map, "dragend", function(e) {
                            _obj.zoomPre=_obj.map_zoom;
                            _obj.map_zoom = _obj.map.getZoom();
                            _obj.zoomCur=_obj.map_zoom;
                            _obj.map_lat = _obj.map.getCenter().getLat();
                            _obj.map_lng = _obj.map.getCenter().getLng();
                            _obj.mapPointsUpdate();
                            //$("#bike_result").hide();
                            //alert("fck");
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
                        //    var autoOptions = {
                        //    city: "" //城市，默认全国
                        //};
                        var autoOptions = {
                            input: "search-panel"
                        };
                        var auto = new AMap.Autocomplete(autoOptions);
                        //$("#search-panel").on("input",function(){
                        //    console.log("chg");
                        //    auto.search($("#search-panel").val(), function(status, result){
                        //        $("#GDpanel").addClass("open");
                        //        console.log(result.tips);
                        //        for(var i in result.tips)
                        //        $(".dropdown-menu").html()
                        //
                        //    });
                        //});
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
                        //}});
                    }
                });

                if(getUrlParam("lng")&&getUrlParam("lat")){
                    _obj.searching_lat=getUrlParam("lat");
                    _obj.searching_lng=getUrlParam("lng");
                    _obj.map.setZoomAndCenter(20, [_obj.searching_lng,_obj.searching_lat]);
                }

            this.first_load = false;
            //map.setMapStyle('blue_night');
            //map.setFeatures(['bg','road']);
            //var mass = this.mapMass = new AMap.MassMarks(_obj.pos_list, {
            //    url: '/static/qbike/img/in_trouble.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 9
            //});
            var M_marker = new AMap.Marker({
                content: '<ul class="dropdown-menu" role="menu" id="bike_result"><a href="/supervise/bike_detail.html"><li><img src="/static/qbike/img/bike_detail.png" alt=""></li><li>车辆编号:<span id="bike_id">8975777</span></li><li class="riding_msg"><div>投放时间:<span>2016.12.24</span></div><div>当前状态:<span>骑行中</span></div></li><li>当前地址:<span>上海市闵行区虹梅南路隧道</span></li><li class="riding_info"><div class="ride_status"><div>骑行次数<p>(/次)</p><p>123</p></div><div>骑行时长<p>(/分钟)</p><p>5131</p></div><div>骑行距离<p>(/公里)</p><p>441</p></div></div></li></a></ul>',
                map: map
            })
            ////单车单一预警详情跳转
            //if (localStorage.alert_detail_indx != 0) {
            //    //$(".map-ctrl-zoomIn").show();
            //    this.searchDetail(localStorage.alert_detail_indx)
            //}
            //mass.on('mouseover', function (e) {
            //    //M_marker.setPosition(e.data.lnglat);
            //    //M_marker.setLabel({content:e.data.name+",id:"+e.data.B_id})
            //})
            //mass.on('click', function (e) {
            //    if (_obj.zoomMass != null)map.remove(_obj.zoomMass);
            //    $("#alert_body a").removeClass("active");
            //    //map.setCenter(e.data.lnglat);
            //    map.setZoomAndCenter(16, e.data.lnglat);
            //    _obj.zoomMass = new AMap.MassMarks([
            //        {
            //            "lnglat": e.data.lnglat,
            //            "name": e.data.name
            //        }
            //    ], {
            //        url: '/static/qbike/img/in_trouble_Max.png',
            //        anchor: new AMap.Pixel(31, 55),
            //        size: new AMap.Size(62, 65),
            //        opacity: 1,
            //        cursor: 'pointer',
            //        zIndex: 10
            //    });
            //    _obj.zoomMass.setMap(map);
            //    $(".alert_msg").html("");
            //    localStorage.bike_id = e.data.name;
            //    $.ajax({
            //        url: _defautBiz.api("bikeDetail") + "&bikeNumber=" + e.data.name,
            //        dataType: "json",
            //        method: 'get',
            //        success: function (resp) {
            //            _obj.geocoder.getAddress(e.data.lnglat, function (status, result) {
            //                if (status === 'complete' && result.info === 'OK') {
            //                    localStorage.bike_loc = result.regeocode.formattedAddress
            //                    localStorage.bike_time = resp.data.BikeBasicDetail.times;
            //                    localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
            //                    localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
            //                    localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
            //                    localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
            //                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
            //                    localStorage.bike_status = resp.data.BikeBasicDetail.status;
            //                    localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
            //                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
            //                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
            //                    $("#bike_power").removeClass("red");
            //                    $("#bike_power").text(charegeState(localStorage.bike_power) + "%");
            //                    if (Math.abs(parseInt(localStorage.bike_power)) < 20)$("#bike_power").addClass("red");
            //                    $("#bike_loc").text(localStorage.bike_loc+"附近");
            //                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
            //                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
            //                    resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss")):$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss"));
            //                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
            //                    $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
            //                    $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
            //                }
            //                else {
            //                    localStorage.bike_loc = "未知";
            //                    localStorage.bike_time = resp.data.BikeBasicDetail.times;
            //                    localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
            //                    localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
            //                    localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
            //                    localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
            //                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
            //                    localStorage.bike_status = resp.data.BikeBasicDetail.status;
            //                    localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
            //                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
            //                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
            //                    $("#bike_power").removeClass("red");
            //                    $("#bike_power").text(charegeState(localStorage.bike_power) + "%");
            //                    if (Math.abs(parseInt(localStorage.bike_power)) < 20)$("#bike_power").addClass("red");
            //                    $("#bike_loc").text(localStorage.bike_loc);
            //                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
            //                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
            //                    resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss")):$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss"));
            //                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
            //                    $("#bike_duration").text(resp.data.BikeBasicDetail.duration);
            //                    $("#bike_distance").text(parseInt(resp.data.BikeBasicDetail.distance).toLocaleString());
            //                }
            //            });
            //        }
            //    })
            //    var warn_list = $.grep(_obj.data_storage, function (el) {
            //        return el.bike_number == e.data.name
            //    });
            //    for (var i in warn_list) {
            //        $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间' + new Date(warn_list[i].update_time).format("yyyy.MM.dd hh:mm") + '</div><div class="al_type">故障类型:' + (warn_list[i].warn_source == 0 ? '系统上报' : '用户上报') + '/' + warnType_parser(warn_list[i].warn_type) + '</div><div class="al_msg">故障描述:' + warn_list[i].warn_msg + '</div></div>');
            //    }
            //    $("#bike_result").show();
            //    //M_marker.setPosition(e.data.lnglat);
            //    $("#bike_id").text(e.data.name);
            //})
            //mass.setMap(map);
            var dragListener = AMap.event.addListener(map, "dragend", function (e) {
                //$("#bike_result").hide();
            });
            var autoOptions = {
                input: "search-panel"
            };
            var auto = new AMap.Autocomplete(autoOptions);
//$("#search-panel").on("input",function(){
//    console.log("chg");
//    auto.search($("#search-panel").val(), function(status, result){
//        $("#GDpanel").addClass("open");
//        console.log(result.tips);
//        for(var i in result.tips)
//        $(".dropdown-menu").html()
//
//    });
//});
            var srh_enable = true;
            var placeSearch = new AMap.PlaceSearch({
                map: map
            });  //构造地点查询类
            AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
            function select(e) {
                var dist = e.poi.district == "" || null ? "" : e.poi.district;
                var name = e.poi.name == "" || null ? "" : e.poi.name;
                setTimeout(function () {
                    $("#search-panel").val(dist + name);
                }, 100);
                //placeSearch.setCity(e.poi.adcode);
                //placeSearch.search(e.poi.name,function(){
                //});  //关键字查询查询
            }
            var click_able = true;
        }
            else{
                //_obj.map.remove(_obj.zoomMass);
                //if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
                if(_obj.pos_list.length>0){
                    //_obj.mapMass.show();
                    //_obj.mapMass.setData(_obj.pos_list);
                }
                //else _obj.mapMass.hide()
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

dispatch_obj.init();
