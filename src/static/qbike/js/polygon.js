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
                    statusstatistic: _base_url + '/statusstatistic.json' + "?" + _v,
                    header: _base_url + '/header.json' + "?" + _v,
                    warnlist: _base_url + '/warnlist.json' + "?" + _v,
                    statistichour: _base_url + '/statistichour.json' + "?" + _v,
                    statisticminute: _base_url + '/statisticminute.json' + "?" + _v,
                    statistic_income_hour: _base_url + '/statistic_income_hour.json' + "?" + _v,
                    statistic_income_minute: _base_url + '/statistic_income_minute.json' + "?" + _v,
                    bikeDetail: _base_url + '/bikeDetail.json' + "?" + _v,
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic.json' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic.json' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo?'+_v,
                    warningDigestPage:'/earlyWarning/warningDigestPage',
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list'
                },
                product: {
                    statusstatistic: _base_url + '/statusstatistic' + "?" + _v,
                    header: _base_url + '/header' + "?" + _v,
                    warnlist: _base_url + '/warnlist' + "?" + _v,
                    statistichour: _base_url + '/statistichour' + "?" + _v,
                    statisticminute: _base_url + '/statisticminute' + "?" + _v,
                    statistic_income_hour: _base_url + '/statistic_income_hour' + "?" + _v,
                    statistic_income_minute: _base_url + '/statistic_income_minute' + "?" + _v,
                    bikeDetail: _base_url + '/bikeDetail' + "?" + _v,
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo?'+_v,
                    warningDigestPage:'/earlyWarning/warningDigestPage',
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list',
                    //listLatestBikes: _base_url + '/listLatestBikes' + "?" + _v,
                    listLatestBikes: _base_url + '/listLatestBikes' + "?" + _v,
                    showPaginate:'/bike/list/get',
                    //indexPoly:'/static/mock/polygon.json'
                    indexPoly:'/cityHexagon?sideLength=1500&city=',
                    listBikes:'/cityAreaLocks?sideLength=1500',
                    extendsMsg:'/warnAndOrderInfo?bikeId=',
                    exportExcel:'/exportExcel?sideLength=1500',
                    getLocation:'/getLocation'
                }
            }
        }
    };

var poly_obj={
    geocoder:null,
    map:null,
    pos_list:[],
    data_storage:[],
    map_massList:[],
    arrayStorage:[],
    mapMass: null,
    iu_Mass: null,
    it_Mass: null,
    ip_Mass: null,
    out_Mass: null,
    out_iu_Mass: null,
    out_it_Mass: null,
    out_ip_Mass: null,
    outMassList:[],
    outInfo:{},
    map_lng: null,
    map_lat: null,
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
    polyList:[],
    InfoWindow:"",
    massBuild:false,
    tot_page:0,
    pageStorage:[],
    centrerPosition:[],
    city_shrt:'wx',
    area_marker:[],
    export_url:"",
    init:function(){
        localStorage.alert_city="无锡";
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.refreshOutMass();
        this.componentInit();
        //$(".map-ctrl-zoomIn").on("click",function(){
        //    $("#map_panel").addClass("fullpage");
        //    $("#mapDiv").addClass("fullpage");
        //    $(".map-ctrl-zoomIn").hide();
        //    $(".map-ctrl-zoomOut").show();
        //    $(".amap-sug-result").addClass("totop");
        //});
        //$(".map-ctrl-zoomOut").on("click",function(){
        //    $("#bike_result").hide();
        //    $("#map_panel").removeClass("fullpage");
        //    $("#mapDiv").removeClass("fullpage");
        //    $(".map-ctrl-zoomIn").show();
        //    $(".map-ctrl-zoomOut").hide();
        //    $(".amap-sug-result").removeClass("totop");
        //});
    },
    refreshOutMass:function(){
        var _obj=this;
        for(var i in _obj.outMassList){
            _obj.map.remove(_obj.outMassList[i]);
        }
        $.ajax({
            url:_defautBiz.api("listBikes")+"&geoCode=&city="+_obj.city_shrt,
            dataType: "json",
            method: 'get',
            success: function(resp) {
                _obj.export_url="&geoCode=&city="+_obj.city_shrt;
                _obj.outInfo.areaName="网格外";
                _obj.outInfo.allcount=resp.data.allcount;
                _obj.outInfo.kxcount=resp.data.kxcount;
                _obj.outInfo.qxcount=resp.data.qxcount;
                _obj.outInfo.lxcount=resp.data.lxcount;
                _obj.outInfo.yycount=resp.data.yycount;
                _obj.outInfo.qtcount=resp.data.qtcount;
                var outList=[];
                for (var i in resp.data.data) {
                    outList.push({
                        "lnglat": [resp.data.data[i].lngRaw,resp.data.data[i].latRaw],
                        "name": resp.data.data[i].bid,
                        "status": resp.data.data[i].status,
                        "addressGps":resp.data.data[i].addressGps,
                        "address":resp.data.data[i].address,
                        "pos":resp.data.data[i].pos,
                        "posCurr":resp.data.data[i].posCurr,
                        "timeCurrStr":resp.data.data[i].timeCurrStr,
                        "timeGpsStr":resp.data.data[i].timeGpsStr,
                        "lockNumber":resp.data.data[i].lockNumber,
                        "power":resp.data.data[i].power

                        //"count": resp.data.bikes[i].count
                    })
                    //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                    //if(i<10){
                    //    Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].lockNumber+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+resp.data.data[i].lockNumber+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+resp.data.data[i].lockNumber+'">' +'['+resp.data.data[i].status+']'+resp.data.data[i].lockNumber+ '</span></a></td></tr>';
                    //}
                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                }
                    var mass = _obj.out_Mass = new AMap.MassMarks($.grep(outList, function(e) {
                        return e.status == "空闲"
                    }), {
                        url: '/static/qbike/img/enable.png',
                        anchor: new AMap.Pixel(23, 42),
                        size: new AMap.Size(48, 51),
                        opacity: 1,
                        cursor: 'pointer',
                        zIndex: 5000
                    });
                    //this.map_massList.push(this.mapMass);
                    var mass_inuse = _obj.out_iu_Mass = new AMap.MassMarks($.grep(outList, function(e) {
                        return e.status == "骑行"
                    }), {
                        url: '/static/qbike/img/in_use.png',
                        anchor: new AMap.Pixel(23, 42),
                        size: new AMap.Size(48, 51),
                        opacity: 1,
                        cursor: 'pointer',
                        zIndex: 5000
                    });
                    //this.map_massList.push(this.iu_Mass);
                    var mass_intouble = _obj.out_it_Mass = new AMap.MassMarks($.grep(outList, function(e) {
                        return e.status == "离线";
                    }), {
                        url: '/static/qbike/img/in_trouble.png',
                        anchor: new AMap.Pixel(23, 42),
                        size: new AMap.Size(48, 51),
                        opacity: 1,
                        cursor: 'pointer',
                        zIndex: 5000
                    });
                    _obj.outMassList.push(_obj.out_it_Mass);
                    _obj.out_it_Mass.setMap(_obj.map);
                    _obj.outMassList.push(_obj.out_iu_Mass);
                    _obj.out_iu_Mass.setMap(_obj.map);
                    _obj.outMassList.push(_obj.out_Mass);
                    _obj.out_Mass.setMap(_obj.map);

            }})
    },
    componentInit:function(){
        _obj=this;
        localStorage.ac_city_name="无锡";
        $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
        //for(var i=0;i<60;i++){
        //    $("#alert_body").append('<tr><td>1.</td><td>Update software</td><td>wallllaaa</td><td>2016-11-12</td></tr>');
        //}
        $("#export").on("click",function(){
            window.open(_defautBiz.api("exportExcel")+_obj.export_url)
        });
        $("#bike_result .fixed").on("mouseover",function(){
            $(".tb_panel").show();
        });
        $("#bike_result .fixed").on("mouseout",function(){
            $(".tb_panel").hide();
        });
        $("#detail_previous a").on("click",function(){
            if(!$("#detail_previous").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                var Alertlist="";
                $("#cur_page").text($(this).attr("data-dt-idx"));
                $("#detail_next a").attr("data-dt-idx",(parseInt($("#detail_next a").attr("data-dt-idx"))-1));
                $("#detail_previous a").attr("data-dt-idx",(parseInt($("#detail_previous a").attr("data-dt-idx"))-1));
                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");
                _obj.pos_list=[];
                $("#alert_body").html("");
                //for(var i =parseInt($("#cur_page").text())-1;i<parseInt($("#cur_page").text())+9;i++){
                for(var i =(parseInt($("#cur_page").text())-1)*10;i<parseInt($("#cur_page").text())*10;i++){
                    Alertlist+=_obj.pageStorage[i]?'<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+_obj.pageStorage[i].bid+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+_obj.pageStorage[i].bid+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+_obj.pageStorage[i].bid+'">' +'['+_obj.pageStorage[i].status+']'+_obj.pageStorage[i].bid+ '</span></a></td></tr>':'';
                }
                //for(var i in _obj.pageStorage){
                //    if(i>parseInt($(this).attr("data-dt-idx")-1)&&i<parseInt($(this).attr("data-dt-idx"))+1){
                //        Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+_obj.pageStorage[i].bid+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+_obj.pageStorage[i].bid+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+_obj.pageStorage[i].bid+'">' +'['+_obj.pageStorage[i].status+']'+_obj.pageStorage[i].bid+ '</span></a></td></tr>';
                //    }
                //}
                $("#alert_body").prepend(Alertlist);
                $("[data-toggle='tooltip']").tooltip();
                $("#alert_body a").off().on("click",function(){
                    _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                });
                //_obj.drawMap();
                if($("#detail_previous a").attr("data-dt-idx")==0)
                    $("#detail_previous").addClass("disabled");
                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");;
            }
        });
        $("#detail_next a").on("click",function(){
            if(!$("#detail_next").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                        var Alertlist="";
                $("#cur_page").text($(this).attr("data-dt-idx"));
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))+1));
                $("#detail_previous a").attr("data-dt-idx",(parseInt($("#detail_previous a").attr("data-dt-idx"))+1));
                        if($("#detail_previous a").attr("data-dt-idx")==0)
                            $("#detail_previous").addClass("disabled");
                        if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                            $("#detail_next").addClass("disabled");
                        _obj.pos_list=[];
                        $("#alert_body").html("");
                        //for(var i =parseInt($("#cur_page").text())-1;i<parseInt($("#cur_page").text())+9;i++){
                        for(var i =(parseInt($("#cur_page").text())-1)*10;i<parseInt($("#cur_page").text())*10;i++){
                            console.log(i);
                            Alertlist+=_obj.pageStorage[i]?'<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+_obj.pageStorage[i].bid+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+_obj.pageStorage[i].bid+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+_obj.pageStorage[i].bid+'">' +'['+_obj.pageStorage[i].status+']'+_obj.pageStorage[i].bid+ '</span></a></td></tr>':'';
                        }
                        //for(var i in _obj.pageStorage){
                        //    if(i>(parseInt($(this).attr("data-dt-idx"))-3)&&i<parseInt($(this).attr("data-dt-idx")-1)){
                        //        Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+_obj.pageStorage[i].bid+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+_obj.pageStorage[i].bid+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+_obj.pageStorage[i].bid+'">' +'['+_obj.pageStorage[i].status+']'+_obj.pageStorage[i].bid+ '</span></a></td></tr>';
                        //    }
                        //}
                        $("#alert_body").prepend(Alertlist);
                        $("[data-toggle='tooltip']").tooltip();
                        $("#alert_body a").off().on("click",function(){
                            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                        });
                        //_obj.drawMap();

                if($(this).attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");;
            }
        });
        //$.ajax({
        //    url:_defautBiz.api("countBarInfo"),
        //    dataType: "json",
        //    method: 'get',
        //    beforeSend: function(xhr) {
        //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //        //xhr.setRequestHeader("User-Agent", "headertest");
        //    },
        //    success: function(resp) {
        //        $("#ride_times").text(resp.data.countAll+"条");
        //        $("#ride_dis").text(resp.data.countBikes+"辆");
        //        $("#cur_all").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>当前全部:</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countAll+"条'>"+resp.data.countAll+"条</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden'  data-toggle='tooltip' data-original-title='"+resp.data.countBikes+"辆'>"+resp.data.countBikes+"辆</div>");
        //        $("#countUserUpload").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>用户上报:</div><div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countUserUpload+"条'>"+resp.data.countUserUpload+"条</div>"+"<div style='float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden'  data-toggle='tooltip' data-original-title='"+resp.data.countBikeUserUpload+"辆'>"+resp.data.countBikeUserUpload+"辆</div>");
        //        $("#countLongTimeNoUse").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>长时未骑:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countLongTimeNoUse+"辆'>"+resp.data.countLongTimeNoUse+"辆</div>");
        //        $("#countAbnormalMoving").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>异常移动:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countAbnormalMoving+"辆'>"+resp.data.countAbnormalMoving+"辆</div>");
        //        $("#countUnLocked").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>长时未锁:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countUnLocked+"辆'>"+resp.data.countUnLocked+"辆</div>");
        //        $("#countLowBattery").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>低电量:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countLowBattery+"辆'>"+resp.data.countLowBattery+"辆</div>");
        //        $("#countOffLine").html("<div style='float: left;width: 70px;line-height: 38px;font-size: 16px;'>离线:</div><div style='line-height: 40px;float: right;width:48px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden' data-toggle='tooltip' data-original-title='"+resp.data.countOffline+"辆'>"+resp.data.countOffline+"辆</div>");
        //        $("[data-toggle='tooltip']").tooltip();
        //    }})
        var Alertlist="";
        $(".close_ctrl").on("click",function(){
            if(_obj.zoomMass!=null)_obj.map.remove(_obj.zoomMass);
            $("#bike_result").hide();
            $("#alert_body a").removeClass("active");
        })
        $("#map-ctrl-goBack").on("click",function(){
            //localStorage.alert_detail_indx = 0;
            window.history.go(-1);
            //window.location.href="/main/index";
        });
        //$("#alert_filter button").on("click",function(){
        //    if($(this).hasClass("btn-default")){
        //        $(this).removeClass("btn-default");
        //        $(this).addClass("btn-info");
        //    }
        //    else{
        //        $(this).removeClass("btn-info");
        //        $(this).addClass("btn-default");
        //    }
        //})
        $("#alert_filter a").on("click",function(){
            localStorage.alert_detail_indx=0;
            $("#cur_page").text(1);
            $(".select-panel").removeClass("active");
            $(this).closest(".select-panel").addClass("active");
        })
    },
    mapPointsUpdate: function() {
        _obj = this;
        //_obj.zoomMass.setData([
        //{
        //    "lnglat": lnglat,
        //    "name": resp.data.bid
        //}
        //]);
        //if(_obj.zoomCur>=11&&_obj.zoomCur<=13&&_obj.zoomPre>=11&&_obj.zoomPre<=13||_obj.zoomCur<11&&_obj.zoomPre<11){
        //    return;
        //}
        if(_obj.map_zoom<=13){
            $(".polyContent").show();
            if(_obj.map_zoom<11){
                $(".polyContent").hide();
            }
            for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
            _obj.map_massList = []
            _obj.map.remove(_obj.zoomMass);
            _obj.InfoWindow.close();
            this.massBuild=false;
            for(var j in _obj.polyList){
                _obj.polyList[j].setOptions({
                    strokeColor: "#ff9600", //线颜色
                    fillOpacity: 0.5 //填充透明度
                });
            }
            $(".extends_control").hide();
            $(".pull-sign").removeClass("fa-angle-left");
            $(".pull-sign").addClass("fa-angle-right");
            $(".pull-sign").animate({"left":"-12px"});
            $(".alert_list_panel").animate({"left":"-440px"})
            $(".amap-maps").animate({"left":"0px"});
            list_flag=true;
            $("#fir_lvl").show();
            $("#tot_area").show();
            $("#scd_lvl").hide();
            return;
        }
        else{
            $(".polyContent").show();
            $("#export").show();
            //$.ajax({
            //    //lng=121.479711&lat=31.264772
            //    url: _defautBiz.api("listLatestBikes") + "&lng=" + _obj.map_lng + "&lat=" + _obj.map_lat + "&mapZoom=" + _obj.map_zoom+"&locType=0",
            //    //url: _defautBiz.api("listLatestBikes")+"&lng="+"121.479711"+"&lat="+"31.264772"+"&mapZoom="+_obj.map_zoom,
            //    dataType: "json",
            //    method: 'get',
            //    beforeSend: function(xhr) {
            //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            //    },
            //    success: function(resp) {
                    _obj.map.remove(_obj.zoomMass);
                    _obj.InfoWindow.close();
                        if(list_flag)$(".extends_control").show();
                        _obj.areaList = [];
                        $("#alert_body").html("");
                        $(".box-title").text("区域名称:");
                        for(var j in _obj.polyList){
                            _obj.polyList[j].setOptions({
                                strokeColor: "#ff9600", //线颜色
                                fillOpacity: 0.5 //填充透明度
                            });
                        }
                        var focusCenter=_obj.centrerPosition.length>0?_obj.centrerPosition:_obj.map.getCenter();
                        console.log(focusCenter);
                        var Focuspoly=$.grep(_obj.polyList,function(e,i){return e.contains(focusCenter)}).length>0?$.grep(_obj.polyList,function(e,i){return e.contains(focusCenter)}):null;
                        _obj.centrerPosition=[];
                        $(".box-title").text("区域名称:"+(Focuspoly?Focuspoly[0].areaName:""));
                        $("#areaName").text("");
                        $("#areaBike").text(0);
                        $("#freeBike").text(0);
                        $("#rideBike").text(0);
                        $("#offBike").text(0);
                        $("#praBike").text(0);
                        $("#prbBike").text(0);
                        if(Focuspoly){
                            var opList=$.grep($(".polyContent"),function(e,i){
                                return $(e).attr("name")==Focuspoly[0].areaName;
                            });
                            for(var i in opList)$(opList[i]).hide();
                            for(var i in Focuspoly){
                                _obj.arrayStorage = Focuspoly[0].getPath();
                                Focuspoly[0].setOptions({strokeColor: "#ff9600",fillOpacity: 0})
                            }
                        var Alertlist="";
                        _obj.pos_list=[];
                        $.ajax({
                            url:_defautBiz.api("listBikes")+"&geoCode="+Focuspoly[0].areaName+"&city="+_obj.city_shrt,
                            dataType: "json",
                            method: 'get',
                            success: function(resp) {
                                if(resp.data.allcount)$("#export").show();
                                else $("#export").hide();
                                _obj.export_url="&geoCode="+Focuspoly[0].areaName+"&city="+_obj.city_shrt;
                                _obj.pageStorage=resp.data.data;
                                $("#areaName").text(Focuspoly[0].areaName);
                                $("#areaBike").text(resp.data.allcount);
                                $("#freeBike").text(resp.data.kxcount);
                                $("#rideBike").text(resp.data.qxcount);
                                $("#offBike").text(resp.data.lxcount);
                                $("#praBike").text(resp.data.yycount);
                                $("#prbBike").text(resp.data.qtcount);
                                _obj.tot_page=resp.data.data.length==0?1:parseInt(resp.data.data.length/10)+(resp.data.data.length%10==0?0:1);
                                for (var i in resp.data.data) {
                                    _obj.areaList.push({
                                        "lnglat": [resp.data.data[i].lngRaw,resp.data.data[i].latRaw],
                                        "name": resp.data.data[i].bid,
                                        "status": resp.data.data[i].status,
                                        "addressGps":resp.data.data[i].addressGps,
                                        "address":resp.data.data[i].address,
                                        "pos":resp.data.data[i].pos,
                                        "posCurr":resp.data.data[i].posCurr,
                                        "timeCurrStr":resp.data.data[i].timeCurrStr,
                                        "timeGpsStr":resp.data.data[i].timeGpsStr,
                                        "lockNumber":resp.data.data[i].lockNumber,
                                        "power":resp.data.data[i].power,
                                        "warnInfo":resp.data.warnInfo

                                        //"count": resp.data.bikes[i].count
                                    })
                                    //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                                    //if(i<10){
                                    //    Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].lockNumber+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+resp.data.data[i].lockNumber+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+resp.data.data[i].lockNumber+'">' +'['+resp.data.data[i].status+']'+resp.data.data[i].lockNumber+ '</span></a></td></tr>';
                                    //}
                                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                                }
                                $("#cur_page").text(_obj.tot_page>parseInt($("#cur_page").text())?parseInt($("#cur_page").text()):_obj.tot_page);
                                for(var i =(parseInt($("#cur_page").text())-1)*10;i<parseInt($("#cur_page").text())*10;i++){
                                    console.log(i);
                                    Alertlist+=_obj.pageStorage[i]?'<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+_obj.pageStorage[i].bid+'"></a></td><td><a href="javascript:void(0)" style="padding-left:5px;margin-left:0px;"  bid="'+_obj.pageStorage[i].bid+'"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+_obj.pageStorage[i].bid+'">' +'['+_obj.pageStorage[i].status+']'+_obj.pageStorage[i].bid+ '</span></a></td></tr>':'';
                                }
                                $("#alert_body").prepend(Alertlist);
                                $("#detail_next a").attr("data-dt-idx",parseInt($("#cur_page").text())+1);
                                $("#detail_previous a").attr("data-dt-idx",parseInt($("#cur_page").text())-1);
                                $("#detail_next").removeClass("disabled");
                                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                                    $("#detail_next").addClass("disabled");
                                if($("#detail_previous a").attr("data-dt-idx")==0)
                                    $("#detail_previous").addClass("disabled");
                                $("[data-toggle='tooltip']").tooltip();
                                $("#alert_body a").off().on("click",function(){
                                    _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                                });
                                _obj.drawMass();
                            }});
                        }
                        else{
                            if(_obj.outInfo.allcount)$("#export").show();
                            else $("#export").hide();
                            _obj.export_url="&geoCode=&city="+_obj.city_shrt;
                            for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                            _obj.map_massList = []
                            _obj.map.remove(_obj.zoomMass);
                            _obj.InfoWindow.close();
                            this.massBuild=false;
                            $("#detail_previous").addClass("disabled");
                            $("#detail_next").addClass("disabled");
                            $("#detail_next a").attr("data-dt-idx",2);
                            $("#detail_previous a").attr("data-dt-idx",0);
                            $("#cur_page").text("1");
                            $("#areaName").text(_obj.outInfo.areaName);
                            $("#areaBike").text(_obj.outInfo.allcount);
                            $("#freeBike").text(_obj.outInfo.kxcount);
                            $("#rideBike").text(_obj.outInfo.qxcount);
                            $("#offBike").text(_obj.outInfo.lxcount);
                            $("#praBike").text(_obj.outInfo.yycount);
                            $("#prbBike").text(_obj.outInfo.qtcount);
                        }
                        $("#fir_lvl").hide();
                        $("#tot_area").hide();
                        $("#scd_lvl").show();
                        $("#map-ctrl-satellite").show();
                        $(".button_panel").show();
        }
    },
    drawPolygon:function(){
        var _obj=this;
        p_aList = [];
        pos_list = [];
        if(_obj.polyList.length>0){for(var i in _obj.polyList)_obj.map.remove(_obj.polyList[i]);for(var i in _obj.area_marker)_obj.map.remove(_obj.area_marker[i]);}
        $.ajax({
            url: _defautBiz.api("indexPoly")+_obj.city_shrt,
            dataType: "json",
            method: 'get',
            success: function (resp) {
                var fstCount= 0,scdCount= 0,trdCount= 0,fthCount=0;
                _obj.polyList=[];
                _obj.area_marker=[];
                for (var i in resp.data) {
                    // for(var i=0;i<1;i++){
                    var polygonArr1 = new Array();
                    var marker1 = new AMap.Marker({
                        position: [resp.data[i].centerPointEntity.longitude, resp.data[i].centerPointEntity.latitude],
                        content: '<div class="marker-route marker-marker-bus-from polyContent" name="'+resp.data[i].serialNumber+'">' + resp.data[i].serialNumber + '</div><div class="marker-route marker-marker-bus-from polyContent" name="'+resp.data[i].serialNumber+'">' + resp.data[i].totals + '</div>'
                    });
                    marker1.setMap(_obj.map);
                    _obj.area_marker.push(marker1);
                    for (var j in resp.data[i].vertexes) {
                        //if(resp.data[i].level==4){
                        //    fstCount+=resp.data[i].totals;
                        //}
                         polygonArr1.push([parseFloat(resp.data[i].vertexes[j].longitude), parseFloat(resp.data[i].vertexes[j].latitude)]);
                    }
                    switch(resp.data[i].level){
                        case 1:
                            fstCount+=parseInt(resp.data[i].totals);
                            break;
                        case 2:
                            scdCount+=parseInt(resp.data[i].totals);
                            break;
                        case 3:
                            trdCount+=parseInt(resp.data[i].totals);
                            break;
                        case 4:
                            fthCount+=parseInt(resp.data[i].totals);
                            break;
                    }
                    function getRandomColor() {
                        //return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                        return "#ff9600";
                    }

                    var colr = getRandomColor();
                    var polygon = new AMap.Polygon({
                        path: polygonArr1, //设置多边形边界路径
                        // path: polygonArr,//设置多边形边界路径
                        strokeColor: "#ff9600", //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 3, //线宽
                        fillColor: colr, //填充色
                        fillOpacity: 0.5 //填充透明度
                    });
                     polygon.setMap(_obj.map);
                    polygon.centerPos=[resp.data[i].centerPointEntity.longitude, resp.data[i].centerPointEntity.latitude];
                    polygon.areaName = resp.data[i].serialNumber;
                    // polygon2.setMap(map);
                    polygon.on("click", function (e) {
                        $("#alert_body").html("");
                        for (var i in _obj.polyList) {
                            _obj.polyList[i].setOptions({
                                strokeColor: "#ff9600", //线颜色
                                fillOpacity: 0.5 //填充透明度
                            });
                        }

                        $(".box-title").text("区域名称:" + this.areaName);
                        this.setOptions({
                            strokeColor: "#ff9600", //线颜色
                            fillOpacity: 0 //填充透明度
                        });
                        //_obj.arrayStorage = this.getPath();
                        //_obj.map.setZoomAndCenter(15, [e.lnglat.getLng(), e.lnglat.getLat()]);
                        _obj.centrerPosition=this.centerPos;
                        _obj.map.setZoomAndCenter(15,this.centerPos);
                        _obj.mapPointsUpdate();
                    });
                    _obj.polyList.push(polygon);
                }
                $("#bike_fst").text(fstCount);
                $("#bike_scd").text(scdCount);
                $("#bike_trd").text(trdCount);
                $("#bike_fth").text(fthCount);
                $("#tot_center").text($.grep(resp.data,function(e,i){return e.level==0})[0].totals);
                console.log(resp.data)
                $("#tot_num").text(resp.data[0].cityCountAll);
                $("#tot_outside").text(parseInt(resp.data[0].cityCountAll)-(fstCount+scdCount+trdCount+fthCount+$.grep(resp.data,function(e,i){return e.level==0})[0].totals));
            }
        });
    },
    toDetail:function(bid,lng,lat){
        var _obj=this;
        var fucusPos=$.grep(this.areaList,function(e,i){
            return e.name==bid;
        })[0];
        _obj.map.remove(_obj.zoomMass);
        var img_url=(function(status){
            switch(status){
                //case 1:
                //    return  '/static/qbike/img/in_date_Max.png';
                //    break;
                case "空闲":
                    return  '/static/qbike/img/enable_Max.png';
                    break;
                case "骑行":
                    return  '/static/qbike/img/in_use_Max.png';
                    break;
                case "离线":
                    return  '/static/qbike/img/in_trouble_Max.png';
                    break;
                //case 5:
                //    return  '/static/qbike/img/in_trouble_Max.png';
                //    break;
                //default:
                //    return  '/static/qbike/img/enable_Max.png';
            }
        })(fucusPos.status)
        //console.log(img_url);
        _obj.zoomMass = new AMap.MassMarks([
            {
                "lnglat": fucusPos.lnglat,
                "name": fucusPos.name
            }
        ],{
            url: img_url,
            anchor: new AMap.Pixel(31, 55),
            size: new AMap.Size(62, 65),
            opacity: 1,
            cursor: 'pointer',
            zIndex: 6000
        });
        _obj.zoomMass.Bikestatus=localStorage.bike_status;
        //console.log(_obj.zoomMass.Bikestatus+"alpha");
        _obj.zoomMass.setMap(_obj.map);
        var title = '';
        var content = [];
        //content.push("车辆编号:"+fucusPos.name);
        //content.push("车辆状态:"+fucusPos.status);
        $.ajax({
            url: _defautBiz.api("extendsMsg")+fucusPos.name,
            dataType: "json",
            method: 'get',
            success: function(resp) {
                content.push("车辆编号:"+fucusPos.name);
                content.push("锁编号:"+fucusPos.lockNumber);
                content.push("车辆状态:"+fucusPos.status);
                content.push("电量:"+fucusPos.power);
                content.push("预警类型:"+resp.data.warnInfo);
                //content.push("当前地址:"+fucusPos.address);
                content.push("上报时间:"+fucusPos.timeCurrStr);
                //content.push("GPS地址:"+fucusPos.addressGps);
                content.push("GPS上报时间:"+fucusPos.timeGpsStr);
                content.push("最后骑行开始时间:"+resp.data.lastStartTime);
                content.push("最后骑行用户:"+resp.data.lastRideUid);
                $.ajax({
                    url: _defautBiz.api("getLocation"),
                    data: {
                        lng: fucusPos.pos[0],
                        lat: fucusPos.pos[1]
                    },
                    dataType: "json",
                    method: 'get',
                    success: function(resp) {
                        content.push("当前地址:"+resp.data.detail);
                        $.ajax({
                            url: _defautBiz.api("getLocation"),
                            data: {
                                lng: fucusPos.posCurr[0],
                                lat: fucusPos.posCurr[1]
                            },
                            dataType: "json",
                            method: 'get',
                            success: function(resp) {
                                content.push("GPS地址:"+resp.data.detail);
                                _obj.InfoWindow.setContent(createInfoWindow(title, content.join("<br/>")));
                                _obj.InfoWindow.open(_obj.map, fucusPos.lnglat);
                            }});
                    }});
                //content.push("车辆状态:"+e.data.status);
                //content.push("车辆状态:"+e.data.status);
            }})
        //_obj.InfoWindow.setContent(createInfoWindow(title, content.join("<br/>")));
        //_obj.InfoWindow.open(_obj.map, fucusPos.lnglat);
        _obj.zoomMass.on("mouseout",function(){
            _obj.map.remove(_obj.zoomMass);
            _obj.InfoWindow.close();
        })
    } ,
        searchDetail:function(bid){
            if(bid!="") {
                //var warn_list
                var searchResult = $.grep(this.data_storage, function (el) {
                    return el.bike_number == bid
                })
                if (searchResult.length > 0) {
                    if (this.zoomMass != null)this.map.remove(this.zoomMass);
                    if (searchResult[0].lng != undefined && searchResult[0].lat != undefined) {
                        //this.map.setCenter([searchResult[0].lng, searchResult[0].lat]);
                        this.map.setZoomAndCenter(16,[searchResult[0].lng, searchResult[0].lat]);
                        _obj.zoomMass = new AMap.MassMarks([
                            {
                                "lnglat": [searchResult[0].lng, searchResult[0].lat],
                                "name": bid
                            }
                        ], {
                            url: '/static/qbike/img/in_trouble_Max.png',
                            anchor: new AMap.Pixel(31, 55),
                            size: new AMap.Size(62, 65),
                            opacity: 1,
                            cursor: 'pointer',
                            zIndex: 10
                        });
                        this.zoomMass.setMap(this.map);
                    }
                    $(".alert_msg").html("");
                    $.ajax({
                        url: _defautBiz.api("bikeDetail") + "&bikeNumber=" + bid,
                        dataType: "json",
                        method: 'get',
                        success: function (resp) {
                            _obj.geocoder.getAddress([searchResult[0].lng, searchResult[0].lat], function(status, result) {
                                if (status === 'complete' && result.info === 'OK') {
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
                                    $("#bike_power").removeClass("red");
                                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                                    $("#bike_loc").text(localStorage.bike_loc+"附近");
                                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss")):$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss"));
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
                                    $("#bike_power").removeClass("red");
                                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                                    $("#bike_loc").text(localStorage.bike_loc);
                                    $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss")):$("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss"));
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
            }
            else{
                $("#s_info").text("请输入关键字");
                $("#search_rslt").modal('show');
            }
            localStorage.alert_detail_indx=0;
        },
    drawMass: function() {
        _obj=this;
        //console.log(this.massBuild);
        //for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
        //this.massBuild=false;
        if (!this.massBuild) {
            if(_obj.areaList.length>0){this.massBuild = true;}
            var mass = this.mapMass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == "空闲"
            }), {
                url: '/static/qbike/img/enable.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
            //this.map_massList.push(this.mapMass);
            var mass_inuse = this.iu_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == "骑行"
            }), {
                url: '/static/qbike/img/in_use.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
            //this.map_massList.push(this.iu_Mass);
            var mass_intouble = this.it_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == "离线";
            }), {
                url: '/static/qbike/img/in_trouble.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
            //this.map_massList.push(this.it_Mass);
            //var mass_indate = this.ip_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 1||e.status==0;
            //}), {
            //    url: '/static/qbike/img/in_date.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 5000
            //});
            //this.map_massList.push(this.ip_Mass);
            //this.ip_Mass.setMap(this.map);
            this.map_massList.push(this.it_Mass);
            this.it_Mass.setMap(this.map);
            this.map_massList.push(this.iu_Mass);
            this.iu_Mass.setMap(this.map);
            this.map_massList.push(this.mapMass);
            this.mapMass.setMap(this.map);
            for(var i in this.map_massList){
                //this.map_massList[i].on('mouseout', function(e) {
                //    _obj.map.remove(_obj.zoomMass);
                //});
                this.map_massList[i].on('mouseover', function(e) {
                    var title = '';
                    var content = [];
                    $.ajax({
                        url: _defautBiz.api("extendsMsg")+e.data.name,
                        dataType: "json",
                        method: 'get',
                        success: function(resp) {
                            content.push("车辆编号:"+e.data.name);
                            content.push("锁编号:"+e.data.lockNumber);
                            content.push("车辆状态:"+e.data.status);
                            content.push("电量:"+e.data.power);
                            content.push("预警类型:"+resp.data.warnInfo);
                            //content.push("当前地址:"+e.data.address);
                            content.push("上报时间:"+e.data.timeCurrStr);
                            //content.push("GPS地址:"+e.data.addressGps);
                            content.push("GPS上报时间:"+e.data.timeGpsStr);
                            content.push("最后骑行开始时间:"+resp.data.lastStartTime);
                            content.push("最后骑行用户:"+resp.data.lastRideUid);
                            $.ajax({
                                url: _defautBiz.api("getLocation"),
                                data: {
                                    lng: e.data.pos[0],
                                    lat: e.data.pos[1]
                                },
                                dataType: "json",
                                method: 'get',
                                success: function(resp) {
                                    content.push("当前地址:"+resp.data.detail);
                                    $.ajax({
                                        url: _defautBiz.api("getLocation"),
                                        data: {
                                            lng: e.data.posCurr[0],
                                            lat: e.data.posCurr[1]
                                        },
                                        dataType: "json",
                                        method: 'get',
                                        success: function(resp) {
                                            content.push("GPS地址:"+resp.data.detail);
                                            _obj.InfoWindow.setContent(createInfoWindow(title, content.join("<br/>")));
                                            _obj.InfoWindow.open(_obj.map, e.data.lnglat);
                                        }});

                                }});
                            //content.push("车辆状态:"+e.data.status);
                            //content.push("车辆状态:"+e.data.status);
                        }});
                    localStorage.bike_id = e.data.name;
                            _obj.map.remove(_obj.zoomMass);
                            var img_url=(function(status){
                                switch(status){
                                    //case "":
                                    //    return  '/static/qbike/img/in_date_Max.png';
                                    //    break;
                                    case "空闲":
                                        return  '/static/qbike/img/enable_Max.png';
                                        break;
                                    case "骑行":
                                        return  '/static/qbike/img/in_use_Max.png';
                                        break;
                                    case "离线":
                                        return  '/static/qbike/img/in_trouble_Max.png';
                                        break;
                                    //case 5:
                                    //    return  '/static/qbike/img/in_trouble_Max.png';
                                    //    break;
                                    //default:
                                    //    return  '/static/qbike/img/enable_Max.png';
                                }
                            })(e.data.status)
                            //console.log(img_url);
                            _obj.zoomMass = new AMap.MassMarks([
                                {
                                    "lnglat": e.data.lnglat,
                                    "name": localStorage.bike_id
                                }
                            ],{
                                url: img_url,
                                anchor: new AMap.Pixel(31, 55),
                                size: new AMap.Size(62, 65),
                                opacity: 1,
                                cursor: 'pointer',
                                zIndex: 6000
                            });
                            _obj.zoomMass.Bikestatus=localStorage.bike_status;
                            //console.log(_obj.zoomMass.Bikestatus+"alpha");
                            _obj.zoomMass.setMap(_obj.map);
                            _obj.zoomMass.on("mouseout",function(){
                                _obj.map.remove(_obj.zoomMass);
                                _obj.InfoWindow.close();
                            })
                    $("#bike_id").text(e.data.name);
                })
            };
        }
        else{
            if($.grep(this.areaList, function(e) {return e.status == "空闲"}).length>0){
                this.mapMass.show();
                this.mapMass.setData($.grep(this.areaList, function(e) {
                    return e.status == "空闲"
                }));
            }
            else this.mapMass.hide()
            if($.grep(this.areaList, function(e) {return e.status == "骑行"}).length>0){
                this.iu_Mass.show();
                this.iu_Mass.setData($.grep(this.areaList, function(e) {
                    return e.status == "骑行"
                }));
            }
            else this.iu_Mass.hide();
            if($.grep(this.areaList, function(e) {return e.status =="离线"}).length>0){
                this.it_Mass.show();
                this.it_Mass.setData($.grep(this.areaList, function(e) {
                    return e.status =="离线"
                }));
            }
            else this.it_Mass.hide();
            //if($.grep(this.areaList, function(e) {return e.status == 1||e.status==0}).length>0){
            //    this.ip_Mass.show();
            //    this.ip_Mass.setData($.grep(this.areaList, function(e) {
            //        return e.status == 1||e.status==0
            //    }));
            //}
            //else this.ip_Mass.hide();
        }

    },
    Data_refresh:function(){
        _obj = this;
        if (this.TimeInterval == null) {
            this.TimeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/supervise/alert_detail.html"&&localStorage.currentUrl!="/index/view.do")
                {clearInterval(_obj.TimeInterval);_obj.TimeInterval = null;}
                //_obj.refreshData();
                //_obj.dataUpdate($(".select-panel.active a").attr("id"),$("#cur_page").text());
            }, 60000);
        }
        if (this.BikeInterval == null) {
            this.BikeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/supervise/alert_detail.html"&&localStorage.currentUrl!="/index/view.do")
                {
                    clearInterval(_obj.BikeInterval);_obj.BikeInterval = null;}
                _obj.mapPointsUpdate();
            }, 5000);
        }

    },
    KillInterval: function() {
        _obj = this;
        setInterval(function() {
            //console.log(_obj.TimeInterval);
            clearInterval(_obj.TimeInterval)
            clearInterval(_obj.BikeInterval)
            _obj.TimeInterval = null;
            _obj.BikeInterval = null;
        }, 1800000);
    },
    paginationUpdate:function(indx){
        var Alertlist="";
        _obj=this;
        if(_obj.map_zoom > 13){
            //console.log(_obj.history_dis);
            //console.log(_obj.cur_district);
            if(_obj.history_dis!=_obj.cur_district||indx!=_obj.history_currPage||_obj.geo_type!=_obj.history_geo_type){
                if(_obj.history_dis!=_obj.cur_district){_obj.history_currPage=(indx=1);$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                _obj.history_dis=_obj.cur_district;
                _obj.history_currPage=indx;
                _obj.history_geo_type=_obj.geo_type;
                $.ajax({
                    url: _defautBiz.api("showPaginate") + "?city="+_obj.cur_city+"&district="+_obj.cur_district+"&isGps="+_obj.geo_type+"&pageSize=10&currPage="+indx,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(resp.data.datas.length>0){
                            //if(_obj.list_totpage!=resp.data.totalPages){$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                            _obj.list_totpage=resp.data.totalPages;
                            $("#detail_previous").removeClass("disabled");
                            $("#detail_next").removeClass("disabled");
                            if($("#detail_next a").attr("data-dt-idx")>_obj.list_totpage)
                                $("#detail_next").addClass("disabled");
                            if($("#detail_previous a").attr("data-dt-idx")==0)
                                $("#detail_previous").addClass("disabled");
                            for(var i in resp.data.datas)Alertlist += '<tr><td style="width: 200px;padding-left: 15px;"><a href="javascript:void(0)">' + resp.data.datas[i] + '</a></td></tr>';
                            $("#alert_list").html("");
                            $("#alert_list").prepend(Alertlist);
                            $("#alert_list a").off().on("click", function () {
                                $("#alert_list a").removeClass("active");
                                $(this).addClass("active");
                                _obj.MapSearching($(this).text());
                            });
                        }
                        else{
                            //if(_obj.list_totpage!=resp.data.totalPages){$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                            _obj.list_totpage=resp.data.totalPages;
                            $("#detail_previous").removeClass("disabled");
                            $("#detail_next").removeClass("disabled");
                            if($("#detail_next a").attr("data-dt-idx")>_obj.list_totpage)
                                $("#detail_next").addClass("disabled");
                            if($("#detail_previous a").attr("data-dt-idx")==0)
                                $("#detail_previous").addClass("disabled");
                            $("#alert_list").html("");
                            $("#alert_list").prepend('<tr><td style="width: 200px;padding-left: 15px;">该区域无车辆</td></tr>');
                        }
                    }
                });
            }
        }
    },
        drawMap:function() {
            _obj=this;
            var map = this.map = new AMap.Map('mapDiv', {
                zoom: 12,
                center: [120.301666,31.57473]
            });
            map.setStatus({keyboardEnable: false});
                this.zoomPre=this.zoomCur=3;
            AMap.plugin(['AMap.ToolBar'],
                function () {
                    map.addControl(new AMap.ToolBar());
                });

                this.map_zoom = 3;
                this.zoomPre=this.zoomCur=3;
                this.map_lat = 31.847684;
                this.map_lng = 117.317514;
            this.first_load = false;
            _obj.InfoWindow = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(0, -60)});
            var M_marker = new AMap.Marker({
                content: '<ul class="dropdown-menu" role="menu" id="bike_result"><a href="/supervise/bike_detail.html"><li><img src="/static/qbike/img/bike_detail.png" alt=""></li><li>车辆编号:<span id="bike_id">8975777</span></li><li class="riding_msg"><div>投放时间:<span>2016.12.24</span></div><div>当前状态:<span>骑行中</span></div></li><li>当前地址:<span>上海市闵行区虹梅南路隧道</span></li><li class="riding_info"><div class="ride_status"><div>骑行次数<p>(/次)</p><p>123</p></div><div>骑行时长<p>(/分钟)</p><p>5131</p></div><div>骑行距离<p>(/公里)</p><p>441</p></div></div></li></a></ul>',
                map: map
            })
            var autoOptions = {
                input: "search-panel"
            };
            var auto = new AMap.Autocomplete(autoOptions);
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

            var geocoder = this.geocoder = new AMap.Geocoder({
                radius: 1000 //范围，默认：500
            });
            var zoomListener = AMap.event.addListener(map, "zoomend", function(e) {
                _obj.gps_flag=false;
                _obj.map_zoom = _obj.map.getZoom();
                if(_obj.map_zoom<12){
                    $(".polyContent").addClass("exchange");
                    $(".polyContent").css("font-size","12px");
                }
                else{
                    $(".polyContent").removeClass("exchange");
                    $(".polyContent").css("font-size","24px");
                }
                _obj.searching_lng="";
                _obj.searching_lat="";
                _obj.geocoder.getAddress([_obj.map_lng,_obj.map_lat], function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        _obj.cur_city=result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province;
                        _obj.cur_district=result.regeocode.addressComponent.district?result.regeocode.addressComponent.district:"";
                        //_obj.paginationUpdate(_obj.list_currPage);
                    }
                    else{
                        _obj.cur_city="无锡";
                        _obj.cur_district="";
                        //_obj.paginationUpdate(_obj.list_currPage);
                    }
                });
                _obj.mapPointsUpdate();
                //}
            });
            var dragListener = AMap.event.addListener(map, "dragend", function(e) {
                setTimeout(function(){
                    _obj.map.remove(_obj.zoomMass);
                    _obj.InfoWindow.close();
                },200);
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
                        //_obj.paginationUpdate(_obj.list_currPage);
                    }
                    else{
                        _obj.cur_city="无锡";
                        _obj.cur_district="";
                        //_obj.paginationUpdate(_obj.list_currPage);
                    }
                });
            });
            var click_able = true;
            this.drawPolygon();
    }
};

var list_flag=true;
function list_toggle(){
    if(!list_flag){
        $(".extends_control").show();
        $(".pull-sign").removeClass("fa-angle-left");
        $(".pull-sign").addClass("fa-angle-right");
        $(".pull-sign").animate({"left":"-12px"});
        $(".alert_list_panel").animate({"left":"-440px"})
        $(".map-search").animate({"left":"10px"})
        $(".amap-maps").animate({"left":"0px"});
        list_flag=!list_flag;
    }
    else{
        $(".extends_control").hide();
        $(".pull-sign").removeClass("fa-angle-right");
        $(".pull-sign").addClass("fa-angle-left");
        $(".pull-sign").animate({"left":"306px"});
        $(".map-search").animate({"left":"310px"});
        $(".amap-maps").animate({"left":"280px"});
        $(".alert_list_panel").show();
        $(".alert_list_panel").animate({"left":"-11px"})
        list_flag=!list_flag;
    }
}
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

poly_obj.init();
var test=new Vcity.CitySelector({input:'citySelect'});
