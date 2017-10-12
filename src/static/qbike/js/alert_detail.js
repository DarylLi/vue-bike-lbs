/**
 * Created by lihaotian on 2016/12/15.
 */
localStorage.currentUrl="/supervise/alert_detail.html";
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
                    //listLatestBikes: 'http://10.172.20.121:8080/index/listLatestWarningBikes' + "?" + _v,
                    listLatestBikes: '/index/listLatestWarningBikes' + "?" + _v,
                    exportList:'/earlyWarning/exportWarningDigestByType'
                }
            }
        }
    };

var alert_obj={
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
    param_update:"cur_all",
    judgmentStr:"",
    TimeInterval: null,
    BikeInterval: null,
    refreshFlag:0,
    areas:"",
    init:function(){
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
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
    componentInit:function(){
        _obj=this;
        localStorage.ac_city_name="全国";
        $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
        //for(var i=0;i<60;i++){
        //    $("#alert_body").append('<tr><td>1.</td><td>Update software</td><td>wallllaaa</td><td>2016-11-12</td></tr>');
        //}
        $("#exportList").on("click",function(){
            var url=_obj.warn_type?("?type="+_obj.warn_type):""
            url+=_obj.warn_lvl?("&level="+_obj.warn_lvl):""
            //--5/15version
            console.log($(".cityTab.hot").children())
            if(_obj.warn_source==0)
            window.open(_defautBiz.api("exportList")+url+(url?"&area=":"?area=")+($("#citySelect").attr("areacode")&&$("#citySelect").attr("areacode")!=0?$("#citySelect").attr("areacode"):(_obj.areas+"0")));
            else{
                $('#exportTime_from').datetimepicker({format: 'yyyy-mm-dd hh:ii',autoclose:true});
                $('#exportTime_to').datetimepicker({format: 'yyyy-mm-dd hh:ii',autoclose:true});
                $("#exportTime_from").val(new Date().format("yyyy-MM-dd hh:mm"));
                $("#exportTime_to").val(new Date().format("yyyy-MM-dd hh:mm"));
                $("#date_select").modal('show');
            }
            //
        });
        $("#alert_filter a").off().on("click",function(){
            localStorage.alert_detail_indx=0;
            $("#cur_page").text(1);
            $(".select-panel").removeClass("active");
            $(this).closest(".select-panel").addClass("active");
            $("#alert_filter a").removeClass("selected");
            $(this).addClass("selected");
            _obj.warn_lvl="";
            _obj.refreshFlag=0;
            $(".select-content-container").hide();
            $("#bg_item").hide();
            _obj.param_update=$(this).attr("id");
            _obj.dataUpdate(_obj.param_update);
        })
        $("#conf_export").on("click",function(){
            var url="?source="+_obj.warn_source+"&startTime="+($("#exportTime_from").val().replace(/[ ]/g,"").replace(/-/g,"").replace(/:/g,"")+"00")+"&endTime="+($("#exportTime_to").val().replace(/[ ]/g,"").replace(/-/g,"").replace(/:/g,"")+"00");
            window.open(_defautBiz.api("exportList")+url+"&area="+($("#citySelect").attr("areacode")&&$("#citySelect").attr("areacode")!=0?$("#citySelect").attr("areacode"):(_obj.areas+"0")));
        });
        $("#bike_result .fixed").on("mouseover",function(){
        });
        $("#bike_result .fixed").on("mouseout",function(){
        });
        $("#detail_previous a").on("click",function(){
            //var type=$($.grep($(".select-panel"),function(e,i){
            //    return $(e).hasClass("active");
            //})[0]).children().children().attr("id");
            var type=_obj.param_update;
            switch (type) {
                case 'cur_all':
                    var url="";
                    break;
                case 'countUserUpload':
                    var url="?source=1";
                    break;
                case 'countLongTimeNoUse':
                    var url="?type=5";
                    break;
                case 'countAbnormalMoving':
                    var url="?type=4";
                    break;
                case 'countUnLocked':
                    var url="?type=9";
                    break;
                case 'countLowBattery':
                    var url="?type=3";
                    break;
                case 'countOffLine':
                    var url="?type=8";
                    break;
                case'NoUse1':
                    var url="?type=5&level=1";
                    break;
                case'NoUse2':
                    var url="?type=5&level=2";
                    break;
                case'NoUse3':
                    var url="?type=5&level=3";
                    break;
                case'NoUse4':
                    var url="?type=5&level=4";
                    break;
                case'OffLine1':
                    var url="?type=8&level=1";
                    break;
                case'OffLine2':
                    var url="?type=8&level=2";
                    break;
                case'OffLine3':
                    var url="?type=8&level=3";
                    break;
                case'OffLine4':
                    var url="?type=8&level=4";
                    break;
            }
            if(!$("#detail_previous").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                $.ajax({
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx"),
                    url:_defautBiz.api("warningDigestPage")+url+(url==""?"?currentPage="+$(this).attr("data-dt-idx"):"&currentPage="+$(this).attr("data-dt-idx")),
                    dataType: "json",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    method: 'get',
                    success: function(resp) {
                        var Alertlist="";
                        _obj.tot_page=resp.data.page.totalPage;
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
                            Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg)+"("+resp.data.data[i].bike_number+" "+(resp.data.data[i].warn_area?resp.data.data[i].warn_area:"")+")"  + '</span></a></td></tr>';
                            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                        }
                        $("#alert_body").prepend(Alertlist);
                        $("[data-toggle='tooltip']").tooltip();
                        $("#alert_body a").off().on("click",function(){
                            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                        });
                        //_obj.drawMap();
                        //$("#alert_filter a").off().on("click",function(){
                        //    $("#cur_page").text(1);
                        //    localStorage.alert_detail_indx=0;
                        //    $(".select-panel").removeClass("active");
                        //    $(this).closest(".select-panel").addClass("active");
                        //    _obj.dataUpdate($(this).attr("id"));
                        //})
                    }
                })
                $("#cur_page").text($(this).attr("data-dt-idx"));
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))-1));
                $("#detail_next a").attr("data-dt-idx",(parseInt($("#detail_next a").attr("data-dt-idx"))-1));
                if($(this).attr("data-dt-idx")==0)
                $("#detail_previous").addClass("disabled");;
            }
        });
        $("#detail_next a").on("click",function(){
            //var type=$($.grep($(".select-panel"),function(e,i){
            //    return $(e).hasClass("active");
            //})[0]).children().children().attr("id");
            var type=_obj.param_update;
            switch (type) {
                case 'cur_all':
                    var url="";
                    break;
                case 'countUserUpload':
                    var url="?source=1";
                    break;
                case 'countLongTimeNoUse':
                    var url="?type=5";
                    break;
                case 'countAbnormalMoving':
                    var url="?type=4";
                    break;
                case 'countUnLocked':
                    var url="?type=9";
                    break;
                case 'countLowBattery':
                    var url="?type=3";
                    break;
                case 'countOffLine':
                    var url="?type=8";
                    break;
                case'NoUse1':
                    var url="?type=5&level=1";
                    break;
                case'NoUse2':
                    var url="?type=5&level=2";
                    break;
                case'NoUse3':
                    var url="?type=5&level=3";
                    break;
                case'NoUse4':
                    var url="?type=5&level=4";
                    break;
                case'OffLine1':
                    var url="?type=8&level=1";
                    break;
                case'OffLine2':
                    var url="?type=8&level=2";
                    break;
                case'OffLine3':
                    var url="?type=8&level=3";
                    break;
                case'OffLine4':
                    var url="?type=8&level=4";
                    break;
            }
            if(!$("#detail_next").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                $.ajax({
                    url:_defautBiz.api("warningDigestPage")+url+(url==""?"?currentPage="+$(this).attr("data-dt-idx"):"&currentPage="+$(this).attr("data-dt-idx")),
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        var Alertlist="";
                        _obj.tot_page=resp.data.page.totalPage;
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
                            Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg)+"("+resp.data.data[i].bike_number+" "+(resp.data.data[i].warn_area?resp.data.data[i].warn_area:"")+")" + '</span></a></td></tr>';
                            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                        }
                        $("#alert_body").prepend(Alertlist);
                        $("[data-toggle='tooltip']").tooltip();
                        $("#alert_body a").off().on("click",function(){
                            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                        });
                        //_obj.drawMap();
                        //$("#alert_filter a").off().on("click",function(){
                        //    $("#cur_page").text(1);
                        //    localStorage.alert_detail_indx=0;
                        //    $(".select-panel").removeClass("active");
                        //    $(this).closest(".select-panel").addClass("active");
                        //    _obj.dataUpdate($(this).attr("id"));
                        //})
                    }
                })
                $("#cur_page").text($(this).attr("data-dt-idx"));
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))+1));
                $("#detail_previous a").attr("data-dt-idx",(parseInt($("#detail_previous a").attr("data-dt-idx"))+1));
                if($(this).attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");;
            }
        });
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
        var Alertlist="";
        $.ajax({
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+this.cur_page+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            url:_defautBiz.api("warningDigestPage")+"?currentPage="+this.cur_page,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                _obj.tot_page=resp.data.page.totalPage;
                var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
                $("#alert_time").html(c_date);
                _obj.data_storage=resp.data.data;
                //单车单一预警详情跳转
                if (localStorage.alert_detail_indx != 0) {
                    //$(".map-ctrl-zoomIn").show();
                    _obj.searchDetail(localStorage.alert_detail_indx)
                }
                if($("#detail_previous a").attr("data-dt-idx")==0)
                    $("#detail_previous").addClass("disabled");
                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");
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
                    Alertlist+='<tr><td style="width: 50px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg)+"("+resp.data.data[i].bike_number+" "+(resp.data.data[i].warn_area?resp.data.data[i].warn_area:"")+")" + '</span></a></td></tr>';
                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                }
                $("#alert_body").prepend(Alertlist);
                $("[data-toggle='tooltip']").tooltip();
                $("#alert_body a").off().on("click",function(){
                    $("#alert_body a").removeClass("active");
                    $(this).addClass("active");
                    _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                });
                //_obj.drawMap();
                //$("#alert_filter a").off().on("click",function(){
                //    $("#cur_page").text(1);
                //    localStorage.alert_detail_indx=0;
                //    $(".select-panel").removeClass("active");
                //    $(this).closest(".select-panel").addClass("active");
                //    _obj.param_update=$(this).attr("id");
                //    _obj.dataUpdate(_obj.param_update);
                //})
            }
        });
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
        $("#map-ctrl-satellite").on("click",function(){
            //window.history.go(-1);
            if(!$(this).hasClass("active")){$("#map-ctrl-satellite span").text("地图");$(this).addClass("active");_obj.satellite=[new AMap.TileLayer.Satellite(),new AMap.TileLayer.RoadNet()];_obj.map.setLayers(_obj.satellite)}
            else {$("#map-ctrl-satellite span").text("卫星图");$(this).removeClass("active");_obj.map.setLayers([new AMap.TileLayer()])}
            //_obj.drawsatelliteMass();
            _obj.massBuild=false;
            if(_obj.map_zoom > 13)_obj.drawMass();
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
        //if(_obj.zoomCur<10&&_obj.zoomPre<10){
        //    //$(".extends_control").hide();
        //    //$(".scroll-sign").removeClass("fa-angle-left");
        //    //$(".scroll-sign").addClass("fa-angle-right");
        //    //$(".scroll-sign").animate({"left":"-12px"});
        //    //$(".alert_list_panel").animate({"left":"-440px"})
        //    //$(".map-search").animate({"left":"10px"})
        //    //$(".amap-maps").animate({"left":"0px"});
        //    scroll_flag=true;
        //    return;
        //}
        //else{
            $.ajax({
                //lng=121.479711&lat=31.264772
                url: _defautBiz.api("listLatestBikes") + "&lng=" + _obj.map_lng + "&lat=" + _obj.map_lat + "&mapZoom=" + _obj.map_zoom+"&locType=0"+_obj.judgmentStr,
                //url: _defautBiz.api("listLatestBikes")+"&lng="+"121.479711"+"&lat="+"31.264772"+"&mapZoom="+_obj.map_zoom,
                dataType: "json",
                method: 'get',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    //xhr.setRequestHeader("User-Agent", "headertest");
                },
                success: function(resp) {
                    if (_obj.map_zoom > 13&&resp.data.bikes) {
                        //if(scroll_flag)$(".extends_control").show();
                        //console.log(scroll_flag);
                        _obj.map.remove(_obj.map_markers);
                        _obj.areaList = [];
                        for (var i in resp.data.bikes) {
                            //选中图表更新
                            if(_obj.zoomMass!=""){
                                if(_obj.zoomMass.getData()[0].name==resp.data.bikes[i].bid){
                                    _obj.zoomMass.setData([
                                        {
                                            "lnglat": [resp.data.bikes[i].lng, resp.data.bikes[i].lat],
                                            "name": resp.data.bikes[i].bid
                                        }
                                    ]);
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
                                    })(resp.data.bikes[i].warnType,resp.data.bikes[i].level?resp.data.bikes[i].level:1)
                                    _obj.zoomMass.setStyle({
                                        url: img_url,
                                        anchor: new AMap.Pixel(31, 55),
                                        size: new AMap.Size(62, 65),
                                        opacity: 1,
                                        cursor: 'pointer',
                                        zIndex: 6
                                    });
                                    //console.log(img_url);
                                }
                            }
                            _obj.areaList.push({
                                "lnglat": [resp.data.bikes[i].lng, resp.data.bikes[i].lat],
                                "name": resp.data.bikes[i].bid,
                                "status": resp.data.bikes[i].bikeStatus,
                                "level": resp.data.bikes[i].level?resp.data.bikes[i].level:1,
                                "warnType": resp.data.bikes[i].warnType
                                //"count": resp.data.bikes[i].count
                            });
                        }
                        //scroll_flag;
                        //_obj.paginationUpdate(_obj.list_currPage);
                        //_obj.map.setCenter([resp.data.bikes[0].lng,resp.data.bikes[0].lat]);
                        _obj.drawMass();
                        $("#map-ctrl-satellite").show();
                        $(".button_panel").show();
                    } else if (_obj.map_zoom <= 13 && _obj.map_zoom >= 10) {
                        //$(".extends_control").hide();
                        //$(".scroll-sign").removeClass("fa-angle-left");
                        //$(".scroll-sign").addClass("fa-angle-right");
                        //$(".scroll-sign").animate({"left":"-12px"});
                        //$(".alert_list_panel").animate({"left":"-440px"})
                        //$(".map-search").animate({"left":"10px"})
                        //$(".amap-maps").animate({"left":"0px"});
                        $("#bike_result").hide();
                        scroll_flag=true;
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        _obj.map.remove(_obj.zoomMass);
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        _obj.areaList = [];
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
                        //$(".extends_control").hide();
                        //$(".scroll-sign").removeClass("fa-angle-left");
                        //$(".scroll-sign").addClass("fa-angle-right");
                        //$(".scroll-sign").animate({"left":"-12px"});
                        //$(".alert_list_panel").animate({"left":"-440px"})
                        //$(".map-search").animate({"left":"10px"})
                        //$(".amap-maps").animate({"left":"0px"});
                        scroll_flag=true;
                        $("#bike_result").hide();
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        _obj.map.remove(_obj.zoomMass);
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        _obj.areaList = [];
                        for (var i in resp.data) {
                            _obj.areaList.push({
                                "lnglat": [resp.data[i].lng, resp.data[i].lat],
                                "name": resp.data[i].areaName,
                                "count": resp.data[i].count
                            });
                        }
                        _obj.drawMarkers();
                        //$("#map-ctrl-satellite").hide();
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
        _obj=this;
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
                //_obj.drawMap();
                //$("#alert_filter a").off().on("click",function(){
                //    localStorage.alert_detail_indx=0;
                //    $("#cur_page").text(1);
                //    $(".select-panel").removeClass("active");
                //    $(this).closest(".select-panel").addClass("active");
                //    $("#alert_filter a").removeClass("selected");
                //    $(this).addClass("selected");
                //    _obj.warn_lvl="";
                //    _obj.refreshFlag=0;
                //    $(".select-content-container").hide();
                //    _obj.dataUpdate($(this).attr("id"));
                //})
            }
        })
    },
    toDetail:function(bid,lng,lat){
        _obj=this;
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
                        console.log(img_url);
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
            _obj=this;
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
                        //this.map.setCenter([searchResult[0].lng, searchResult[0].lat]);
                        //_obj.zoomMass = new AMap.MassMarks([
                        //    {
                        //        "lnglat": [searchResult[0].lng, searchResult[0].lat],
                        //        "name": bid
                        //    }
                        //], {
                        //    url: '/static/qbike/img/in_trouble_Max.png',
                        //    anchor: new AMap.Pixel(31, 55),
                        //    size: new AMap.Size(62, 65),
                        //    opacity: 1,
                        //    cursor: 'pointer',
                        //    zIndex: 10
                        //});
                        //_obj.zoomMass.setMap(_obj.map);
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
        drawMass: function() {
            _obj=this;
        //console.log(this.massBuild);
        if (!this.massBuild) {
            if(_obj.areaList.length>0){this.massBuild = true;}
            var mass = this.mapMass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
                //return e.status != 5
                return e.warnType != 5&&e.warnType!=8;
            }), {
                url: '/static/qbike/img/enable.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
            //var mass_intouble = this.it_Mass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
            //    return e.status == 5
            //}), {
            //    url: '/static/qbike/img/in_trouble.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 5
            //});
            //离线地图图标初始
            this.off1Mass=Genertate(8,1);
            this.map_massList.push(this.off1Mass);
            this.off1Mass.setMap(this.map);

            this.off2Mass=Genertate(8,2);
            this.map_massList.push(this.off2Mass);
            this.off2Mass.setMap(this.map);

            this.off3Mass=Genertate(8,3);
            this.map_massList.push(this.off3Mass);
            this.off3Mass.setMap(this.map);
            //长时未用地图图标初始
            this.long1Mass=Genertate(5,1);
            this.map_massList.push(this.long1Mass);
            this.long1Mass.setMap(this.map);

            this.long2Mass=Genertate(5,2);
            this.map_massList.push(this.long2Mass);
            this.long2Mass.setMap(this.map);

            this.long3Mass=Genertate(5,3);
            this.map_massList.push(this.long3Mass);
            this.long3Mass.setMap(this.map);

            this.off4Mass=Genertate(8,4);
            this.map_massList.push(this.off4Mass);
            this.off4Mass.setMap(this.map);

            function Genertate(type,level){
                var name=(type==8?"off":"long")+level;
                var mass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
                    return e.warnType == type&&e.level==level;
                }), {
                    url: '/static/qbike/img/'+name+'.png',
                    anchor: new AMap.Pixel(23, 42),
                    size: new AMap.Size(48, 51),
                    opacity: 1,
                    cursor: 'pointer',
                    zIndex: 5
                });
                return mass;
            }
            //this.map_massList.push(this.mapMass);
            //var mass_inuse = this.iu_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 3
            //}), {
            //    url: '/static/qbike/img/in_use.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 5
            //});
            ////this.map_massList.push(this.iu_Mass);
            //var mass_intouble = this.it_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 5||e.status == 4;
            //}), {
            //    url: '/static/qbike/img/in_trouble.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 5
            //});
            ////this.map_massList.push(this.it_Mass);
            //var mass_indate = this.ip_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 1
            //}), {
            //    url: '/static/qbike/img/in_date.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 5
            //});
            //this.map_massList.push(this.ip_Mass);
            //this.ip_Mass.setMap(this.map);

            //this.map_massList.push(this.iu_Mass);
            //this.iu_Mass.setMap(this.map);
            this.map_massList.push(this.mapMass);
            this.mapMass.setMap(this.map);

            for(var i in this.map_massList){
                this.map_massList[i].on('click', function(e) {
                    $(".alert_msg").html("");
                    var warn_list=[];
                    var resultObj={};
                    localStorage.bike_id = e.data.name;
                    $.ajax({
                        url: _defautBiz.api("getBikeById")+"?bid="+ e.data.name,
                        dataType: "json",
                        method: 'get',
                        success: function(resp) {
                            resultObj.bike_number = resp.data.bid;
                            resultObj.lng = resp.data.posCurr[0];
                            resultObj.lat = resp.data.posCurr[1];
                            resultObj.update_time = resp.data.warn_time;
                            resultObj.warn_source = resp.data.warn_source;
                            resultObj.warn_type = resp.data.warn_type;
                            resultObj.warn_msg = resp.data.warn_msg;
                            warn_list.push(resultObj);
                            console.log(warn_list);
                            for (var i in warn_list) {
                                $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间' + new Date(warn_list[i].update_time).format("yyyy.MM.dd hh:mm") + '</div><div class="al_type">故障类型:' + (warn_list[i].warn_source == 0 ? '系统上报' : '用户上报') + '/' + warnType_parser(warn_list[i].warn_type) + '</div><div class="al_msg">故障描述:' + warn_list[i].warn_msg + '</div></div>');
                            }
                        }});
                    $.ajax({
                        url: _defautBiz.api("bikeDetail")+"&bikeNumber="+e.data.name ,
                        dataType: "json",
                        method: 'get',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                            //xhr.setRequestHeader("User-Agent", "headertest");
                        },
                        success: function(resp) {
                            _obj.map.remove(_obj.zoomMass);
                            _obj.geocoder.getAddress(e.data.lnglat, function(status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    localStorage.bike_loc = result.regeocode.formattedAddress
                                    localStorage.bike_time = resp.data.BikeBasicDetail.times;
                                    localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
                                    localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
                                    localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
                                    localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
                                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                    localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                    localStorage.bike_status = resp.data.BikeBasicDetail.status;
                                    localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
                                    localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power?resp.data.BikeBasicDetail.bikeEsDto.power:"";
                                    localStorage.locType=(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)");
                                    if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)localStorage.locType="(APP定位)";
                                    $("#bike_power").removeClass("red");
                                    $("#bike_power").text(charegeState(localStorage.bike_power)+"%");
                                    if(Math.abs(parseInt(localStorage.bike_power))<20)$("#bike_power").addClass("red");
                                    //if(_obj.geo_type==1)$("#bike_loc").text(localStorage.bike_loc+"附近"+"(GPS定位)");
                                    //else $("#bike_loc").text(localStorage.bike_loc+"附近"+(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"(基站定位)":"(GPS定位)"));
                                    if(_obj.geo_type==1){
                                        $("#bike_loc").text(localStorage.bike_loc+"附近");
                                        $("#loc_type").text("GPS");
                                    }
                                    else {
                                        $("#bike_loc").text(localStorage.bike_loc+"附近");
                                        $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType%100==0?"基站":"GPS");
                                        if(resp.data.BikeBasicDetail.bikeEsDto.locType%100==3)$("#loc_type").text("APP");
                                    }
                                    $("#dt_href").attr("href","javascript:go_Alert("+e.data.name+")");
                                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                                    $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                                    $("#bike_duration").text(Math.round(parseInt(resp.data.BikeBasicDetail.duration)/60).toLocaleString());
                                    $("#bike_distance").text(Math.round(parseInt(resp.data.BikeBasicDetail.distance)/1000).toLocaleString());
                                    _obj.map.setCenter(e.data.lnglat);
                                }
                                else{
                                    localStorage.bike_loc = "未知"
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
                                    $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                    $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                    $("#fix_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-");
                                    $("#loc_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss"));
                                    $("#bike_duration").text(Math.round(parseInt(resp.data.BikeBasicDetail.duration)/60).toLocaleString());
                                    $("#bike_distance").text(Math.round(parseInt(resp.data.BikeBasicDetail.distance/1000)).toLocaleString());
                                    _obj.map.setCenter(e.data.lnglat);
                                }
                            });
                            //console.log(img_url);
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
                            })(e.data.warnType,e.data.level);
                    _obj.zoomMass = new AMap.MassMarks([
                                {
                                    "lnglat": e.data.lnglat,
                                    "name": localStorage.bike_id
                                }
                            ],{
                                //url: '/static/qbike/img/in_trouble_Max.png',
                                url:img_url,
                                anchor: new AMap.Pixel(31, 55),
                                size: new AMap .Size(62, 65),
                                opacity: 1,
                                cursor: 'pointer',
                                zIndex: 6
                            });
                            _obj.zoomMass.Bikestatus=localStorage.bike_status;
                            //console.log(_obj.zoomMass.Bikestatus+"alpha");
                            _obj.zoomMass.setMap(_obj.map);
                        }
                    })
                    $("#bike_id").text(e.data.name);
                    $("#bike_result").show();
                })
            };
        }
        else{
            if(this.areaList.length>0){
                var normalMass=$.grep(this.areaList, function(e) {
                    return e.warnType != 5&&e.warnType!=8
                });
                //var troubleMass=$.grep(this.areaList, function(e) {
                //    return e.status == 5
                //})
                var off1Mass=checkMass(8,1);
                this.off1Mass.show();
                this.off1Mass.setData(off1Mass);
                if(off1Mass.length==0){this.off1Mass.hide()}

                var off2Mass=checkMass(8,2);
                this.off2Mass.show();
                this.off2Mass.setData(off2Mass);
                if(off2Mass.length==0){this.off2Mass.hide()}

                var off3Mass=checkMass(8,3);
                this.off3Mass.show();
                this.off3Mass.setData(off3Mass);
                if(off3Mass.length==0){this.off3Mass.hide()}

                var off4Mass=checkMass(8,4);
                this.off4Mass.show();
                this.off4Mass.setData(off4Mass);
                if(off4Mass.length==0){this.off4Mass.hide()}

                var long1Mass=checkMass(5,1);
                this.long1Mass.show();
                this.long1Mass.setData(long1Mass);
                if(long1Mass.length==0){this.long1Mass.hide()}

                var long2Mass=checkMass(5,2);
                this.long2Mass.show();
                this.long2Mass.setData(long2Mass);
                if(long2Mass.length==0){this.long2Mass.hide()}

                var long3Mass=checkMass(5,3);
                this.long3Mass.show();
                this.long3Mass.setData(long3Mass);
                if(long3Mass.length==0){this.long3Mass.hide()}

                function checkMass(type,level){
                    var mass=$.grep(_obj.areaList, function(e) {
                        return e.warnType == type&&e.level==level;
                    });
                    return mass;
                }
                this.mapMass.show();
                this.mapMass.setData(normalMass);
                if(normalMass.length==0){this.mapMass.hide()}
            }
            else {
                for(var i in this.map_massList){
                    this.map_massList[i].hide();
                }
            }
        }

    },
    Data_refresh:function(){
        var bike_obj = this;
        if (this.TimeInterval == null) {
            this.TimeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/supervise/alert_detail.html")
                {
                    clearInterval(bike_obj.TimeInterval);bike_obj.TimeInterval = null;
                }
                //_obj.refreshData();
                bike_obj.dataUpdate(_obj.param_update,$("#cur_page").text());
            }, 60000);
        }
        if (this.BikeInterval == null) {
            this.BikeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/supervise/alert_detail.html")
                {
                    clearInterval(bike_obj.BikeInterval);bike_obj.BikeInterval = null;
                }
                bike_obj.mapPointsUpdate();
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
        for (var i in lnglat_list) {
            var pos = [lnglat_list[i].lng, lnglat_list[i].lat];
            var marker = new AMap.Marker({
                position: pos,
                //icon: "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
                content: '<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/num-bubble.png);width: 85px;height: 95px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 85px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center">' + (lnglat_list[i].name.split("市").length>2?lnglat_list[i].name:lnglat_list[i].name.split("市")[0]) + '</div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px">' + lnglat_list[i].count + '</div></div>',
                offset: {
                    x: -42,
                    y: -96
                }
            });
            marker.loc = pos;
            //if(this.prev_map_markers.length>0)for(var i in this.prev_map_markers){
            //    console.log(this.prev_map_markers[i].getContent()!=marker.getContent());
            //}
            marker.setMap(_obj.map);
            marker.on('click', function(e) {
                if (_obj.map.getZoom() < 10) {
                    //console.log(this.loc[0]+":"+this.loc[1]);
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
                    //_obj.mapPointsUpdate();
                }
            });
            this.map_markers.push(marker);
            this.prev_map_markers=this.map_markers;
        }
    },
        drawMap:function() {
            _obj=this;
            if(this.first_load){
            var map = this.map = new AMap.Map('mapDiv', {
                layers: [new AMap.TileLayer({
                    textIndex: 2
                })],
                zoom: 4,
                center: [102.342785, 35.312316]
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
                    url: _defautBiz.api("listLatestBikes") + "&lng=" + "117.317514" + "&lat=" + "31.847684" + "&mapZoom=" + "3&locType=0",
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
                                    "count": resp.data[i].count
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
                            _obj.mapPointsUpdate();
                            //}
                        });
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
                        var click_able = true;
                        //}});
                    }
                });


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

            var geocoder = this.geocoder = new AMap.Geocoder({
                radius: 1000 //范围，默认：500
            });
            var click_able = true;
            $("#searching").on("click", function () {
                if (click_able) {
                    $("#bike_result").hide();
                    $("#alert_body a").removeClass("active");
                    if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
                    click_able = false;
                    setTimeout(function () {
                        click_able = true
                    }, 2000);

                    geocoder.getLocation($("#search-panel").val().replace(/[~'!<>@#$%^&*()-+_=:]/g, ""), function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            var geocode = result.geocodes;
                            //addMarker(0, geocode[0]);
                            var marker = new AMap.Marker({
                                map: null,
                                position: [geocode[0].location.getLng(), geocode[0].location.getLat()]
                            });
                            //map.setFitView();
                            var level = 18;
                            //$("#citySelect").val(geocode[0].addressComponent.city.split("市")[0].substring(0, 2));
                            localStorage.ac_city_name = geocode[0].addressComponent.city.split("市")[0];
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
                            map.setZoomAndCenter(level, [geocode[0].location.getLng(), geocode[0].location.getLat()]);
                        }
                        else {
                            //if(!isNaN($("#search-panel").val()))
                            //else{
                            //    $("#s_info").text("无搜索结果噢");
                            //    $("#search_rslt").modal('show');
                            //}
                            _obj.searchDetail($("#search-panel").val().replace(/[~'!<>@#$%^&*()-+_=:]/g, ""));
                            //for (var i in citys) {
                            //    if (citys[i].B_id == $("#search-panel").val()) {
                            //        map.setZoomAndCenter(16, citys[i].lnglat);
                            //        $(".map").addClass("fullpage");
                            //        $(".map-ctrl-zoomIn").hide();
                            //        $(".map-ctrl-zoomOut").show();
                            //        $(".amap-sug-result").addClass("totop");
                            //        $("#bike_id").text(citys[i].B_id);
                            //        $("#bike_result").show();
                            //        return;
                            //    }
                            //}
                            ////alert("无搜索结果噢");
                            //$("#s_info").text("无搜索结果噢");
                            //$("#search_rslt").modal('show');
                        }
                    });

                }
            });
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
var _bike_obj={
    map:null,
    myChartI:null,
    myChartII:null,
    times_filter_typeI:"",
    times_filter_typeII:"",
    mul_filter_typeI:"",
    mul_filter_typeII:"",
    lineList:[],
    startendList:[],
    //线路时间段:
    //0：当天 1：一周 2：一月
    line_period:0,
    init:function(){
        this.componentInit();
        //$("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.drawChartI();
        this.drawChartII();
    },
    componentInit:function(){
        var _bk_obj=this;
        _bk_obj.times_filter_typeI="bytime";
        _bk_obj.times_filter_typeII="week";
        _bk_obj.mul_filter_typeI="bytime";
        _bk_obj.mul_filter_typeII="week";
        $("#d_time").text(localStorage.bike_useDate=="null"?"/":localStorage.bike_useDate);
        $("#d_place").text(localStorage.bike_useLoc=="null"?"/":localStorage.bike_useLoc);
        $("#dr_time").text(localStorage.bike_lastMaintainDate=="null"?"/":localStorage.bike_lastMaintainDate);
        $("#d_pos").text(localStorage.bike_loc=="null"?"/":localStorage.bike_loc+localStorage.locType);
        $("#d_Type").text(localStorage.bike_faultType=="null"?"/":localStorage.bike_faultType);
        $("#d_totNum").text(localStorage.bike_time=="null"?"/":parseInt(localStorage.bike_time).toLocaleString()+"次");
        $("#d_totTime").text(localStorage.bike_duration=="null"?"/":Math.round(parseInt(localStorage.bike_duration)/60).toLocaleString()+"分钟");
        $("#d_totDis").text(localStorage.bike_distance=="null"?"/":Math.round(parseInt(localStorage.bike_distance)/1000).toLocaleString()+"公里");
        $("#d_cStatus").text(localStorage.bike_status=="null"?"/":localStorage.bike_status);
        $("#d_power").removeClass("red");
        $("#d_power").text(localStorage.bike_power=="null"?"/":charegeState(localStorage.bike_power)+"%")
        if(Math.abs(parseInt(localStorage.bike_power))<20)$("#d_power").addClass("red");
        $("#bike_indx").text(localStorage.bike_id=="null"?"/":localStorage.bike_id);
        $("#panel_alert").attr("href","javascript:go_Alert("+localStorage.bike_id+")")
        $(".mp-period").off().on("click",function(){
            $(".mp-period").removeClass("active");
            $(this).addClass("active");
            console.log($(this).attr("id"));
            switch ($(this).attr("id")) {
                case "line_cur":
                    _bk_obj.line_period=0;
                    $(".opt_panel").hide();
                    _bk_obj.drawline();
                    break;
                case "line_week":
                    _bk_obj.line_period=1;
                    $(".opt_panel").hide();
                    _bk_obj.drawline();
                    break;
                case "line_month":
                    _bk_obj.line_period=2;
                    $(".opt_panel").hide();
                    _bk_obj.drawline();
                    break;
                case "line_option":
                    $(".opt_panel").show();
                    //2017-04-14 11:30
                    $('#createTime_from').datetimepicker({format: 'yyyy-mm-dd hh:ii',autoclose:true});
                    $('#createTime_to').datetimepicker({format: 'yyyy-mm-dd hh:ii',autoclose:true});
                    $("#createTime_to").val(new Date().format("yyyy-MM-dd hh:mm"));
                    $("#createTime_from").val(new Date(parseInt(new Date()-5*3600000)).format("yyyy-MM-dd hh:mm"));
                    _bk_obj.line_period=3;
            };
        });
        $("#set_opt").on("click",function(){
            if(new Date($("#createTime_to").val().replace(/\-/g, "\/"))<new Date($("#createTime_from").val().replace(/\-/g, "\/"))){
                $("#time_alert").show();
                setTimeout(function(){
                    $("#time_alert").fadeOut();
                },2000)
            }
            else _bk_obj.drawline();
        });
        $("#detail_goBack").on("click",function(){
            $("#bike_detail").animate({"opacity":0});
            $("#bike_detail").hide();
            //window.history.go(-1);
        });
        $("#ride_time button").off().on("click",function(){
            switch ($(this).attr("id")) {
                case "time_bytime":
                {
                    $("#time_byacu").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.times_filter_typeI="bytime";
                    break
                };
                case "time_byacu":
                {
                    $("#time_bytime").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.times_filter_typeI="byacu";
                    break;
                }
                case "dt_c":
                {
                    $("#dt_h").removeClass("active");
                    $("#dt_d").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.times_filter_typeII="week";
                    break;
                }
                case "dt_h":
                {
                    $("#dt_c").removeClass("active");
                    $("#dt_d").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.times_filter_typeII="month";
                    break;
                }
                case "dt_d":
                {
                    $("#dt_h").removeClass("active");
                    $("#dt_c").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.times_filter_typeII="all";
                    break;
                }
            }
            $.ajax({
                url: _defautBiz.api("accumulateTimesStatistic") + "&bikeNumber=" + localStorage.bike_id + "&type="+_bk_obj.times_filter_typeII,
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    var chartsItems = resp.data.rideTimesStatisticRank;
                    //var myChart = echarts.init(document.getElementById('dt_main'));
                    option = {
                        tooltip: {
                            backgroundColor:'#fff',
                            borderColor:'#000',
                            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            textStyle:{
                                color:'#999'
                            },
                            trigger: 'axis'
                        },
                        toolbox: {},
                        xAxis: [{
                            splitLine: {
                                show: false
                            },
                            type: 'category',
                            data: chartsItems.map(function(e, i) {
                                //return e.dateTime;
                                return e.dateTime.split("-")[1]+"."+e.dateTime.split("-")[2];
                            })
                        }],
                        yAxis: [{
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }],
                        series: [{
                            name: '骑行次数',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#ffe0b2'
                                },
                                emphasis: {
                                    color: '#ffc878'
                                }
                            },
                            data: chartsItems.map(function(e, i) {
                                return _bk_obj.times_filter_typeI=='bytime'?e.times: e.accumulateTimes;
                            })
                        }]
                    };
                    _bk_obj.myChartI.setOption(option);
                }
            })

        });
        $("#ride_per button").off().on("click",function(){
            switch ($(this).attr("id")) {
                case "all_bytime":
                {
                    $("#all_byacu").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.mul_filter_typeI="bytime";
                    break
                };
                case "all_byacu":
                {
                    $("#all_bytime").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.mul_filter_typeI="byacu";
                    break;
                }
                case "dt_c_ds":
                {
                    $("#dt_h_ds").removeClass("active");
                    $("#dt_d_ds").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.mul_filter_typeII="week";
                    break;
                }
                case "dt_h_ds":
                {
                    $("#dt_c_ds").removeClass("active");
                    $("#dt_d_ds").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.mul_filter_typeII="month";
                    break;
                }
                case "dt_d_ds":
                {
                    $("#dt_c_ds").removeClass("active");
                    $("#dt_h_ds").removeClass("active");
                    $(this).addClass("active");
                    _bk_obj.mul_filter_typeII="all";
                    break;
                }
            }
            $.ajax({
                url: _defautBiz.api("bikeDistanceAndElapsedTimeStatistic") + "&bikeNumber=" + localStorage.bike_id + "&type="+_bk_obj.mul_filter_typeII,
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    var chartsItems = resp.data.bikeDistanceAndElapsedTimeStatistic;
                    option = {
                        color: ['', '#6ebdec'],
                        tooltip: {
                            backgroundColor:'#fff',
                            borderColor:'#000',
                            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            textStyle:{
                                color:'#999'
                            },
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['里程', '时长'],
                            bottom: '0'
                        },
                        xAxis: [{
                            splitLine: {
                                show: false
                            },
                            type: 'category',
                            data: chartsItems.map(function(e, i) {
                                //return e.dateTime;
                                return e.dateTime.split("-")[1]+"."+e.dateTime.split("-")[2];
                            })
                        }],
                        yAxis: [{
                            name:'里程(公里)',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }, {
                            name:'时长(分)',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }],
                        series: [{
                            name: '里程',
                            itemStyle: {
                                normal: {
                                    color: '#ffe0b2'
                                },
                                emphasis: {
                                    color: '#ffc878'
                                }
                            },
                            type: 'bar',
                            data: chartsItems.map(function(e, i) {
                                return _bk_obj.mul_filter_typeI=='bytime'?e.distance: e.accumulateDistance
                            })
                        }, {
                            name: '时长',
                            type: 'line',
                            yAxisIndex: 1,
                            data: chartsItems.map(function(e, i) {
                                return _bk_obj.mul_filter_typeI=='bytime'?e.elapsedTime: e.accumulateElapsedTime
                            })
                        }]
                    };
                    _bk_obj.myChartII.setOption(option);
                }
            })

        });
    },
    drawMap:function(){
        var map=this.map=new AMap.Map('dt_mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 4,
            center: [102.342785, 35.312316]
        });
        //map.setMapStyle('blue_night');
        //map.setFeatures(['bg','road']);
        this.drawline();

    },
    drawline:function(){
        var _bike_obj=this;
        if(this.lineList!=[])for(var i in _bike_obj.lineList){_bike_obj.map.remove(_bike_obj.lineList[i]);}
        if(this.startendList!=[])for(var i in _bike_obj.startendList){_bike_obj.map.remove(_bike_obj.startendList[i]);}
        this.lineList=[];
        this.startendList=[];
        var opt_endtime="";
        var startTime=null;
        //0：当天 1：一周 2：一月
        if(this.line_period==0){
            startTime=(new Date().format("yyyyMMddhhmmss")).substring(0,8)+"000000";
        }
        else if(this.line_period==1){
            startTime=new Date(parseInt(new Date()-7*86400000)).format("yyyyMMddhhmmss");
        }
        else if(this.line_period==3){
            startTime=$("#createTime_from").val().replace(/[ ]/g,"").replace(/-/g,"").replace(/:/g,"")+"00";
            opt_endtime=$("#createTime_to").val().replace(/[ ]/g,"").replace(/-/g,"").replace(/:/g,"")+"00";
        }
        else{
            startTime=new Date(parseInt(new Date()-30*86400000)).format("yyyyMMddhhmmss")
        }
        var endtime=opt_endtime?opt_endtime:new Date().format("yyyyMMddhhmmss");
        $.ajax({
            url: _defautBiz.api("list") + "?bikeId=" + localStorage.bike_id + "&startTime="+startTime+"&endTime="+endtime,
            //url: _defautBiz.api("list") + "?bikeId=320116000003&startTime=20170109164353&endTime=20170111165349",
            dataType: "json",
            method: 'get',
            success: function(resp) {
                for(var i in resp.data){
                    if(resp.data.length>0){
                    var lineArr=resp.data[i].points;
                        var arrList=[];
                        for(var i in lineArr){
                            //if(lineArr[i].locType==0){ break;}
                            //else
                            arrList.push([lineArr[i].lng,lineArr[i].lat]);
                        }
                    var polyline = new AMap.Polyline({
                        path: arrList, //设置线覆盖物路径
                        strokeColor: "#08e528", //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 5, //线宽
                        strokeStyle: "solid", //线样式
                        strokeDasharray: [10, 5] //补充线样式
                    });
                    polyline.setMap(_bike_obj.map);
                    //    if(lineArr.length>0){
                    //var S_marker = new AMap.Marker({
                    //    content:'<img src="/static/qbike/img/start.png"/>',
                    //    offset: new AMap.Pixel(-18, -42),
                    //    position: lineArr[(resp.data[i].points.length-1)],
                    //    map:_bike_obj.map
                    //});
                    //var E_marker = new AMap.Marker({
                    //    content:'<img src="/static/qbike/img/end.png"/>',
                    //    offset: new AMap.Pixel(-18, -42),
                    //    position:  lineArr[0],
                    //    map:_bike_obj.map
                    //});
                    //_bike_obj.startendList.push(S_marker);
                    //_bike_obj.startendList.push(E_marker);
                    //    }
                    _bike_obj.lineList.push(polyline);
                }
                }
                $.ajax({
                    url: _defautBiz.api("getBikeById")+"?bid="+ localStorage.bike_id,
                    dataType: "json",
                    method: 'get',
                    success: function(resp) {
                        var img_url=(function(status){
                            switch(status){
                                case 1:
                                    return  '/static/qbike/img/in_date.png';
                                    break;
                                case 2:
                                    return  '/static/qbike/img/enable.png';
                                    break;
                                case 3:
                                    return  '/static/qbike/img/in_use.png';
                                    break;
                                case 4:
                                    return  '/static/qbike/img/in_trouble.png';
                                    break;
                                case 5:
                                    return  '/static/qbike/img/in_trouble.png';
                                    break;
                                default:
                                    return  '/static/qbike/img/enable.png';
                            }
                        })(resp.data.bikeStatus)
                        var B_marker = new AMap.Marker({
                            content:'<img src='+img_url+'/>',
                            position: [resp.data.lng,resp.data.lat],
                            map:_bike_obj.map
                        });
                        _bike_obj.map.setZoomAndCenter(14, [resp.data.posCurr[0],resp.data.posCurr[1]]);
                        _bike_obj.startendList.push(B_marker);
                    }})

                //var lineArr = [
                //    [116.368904, 39.913423],
                //    [116.382122, 39.901176],
                //    [116.387271, 39.912501],
                //    [116.398258, 39.904600]
                //];
            }});
    },
    drawChartI:function(){
        var bike_obj=this;
        $.ajax({
            url: _defautBiz.api("accumulateTimesStatistic")+"&bikeNumber="+localStorage.bike_id+"&type=week",
            dataType: "json",
            method: 'get',
            success: function(resp) {
                var chartsItems=resp.data.rideTimesStatisticRank;
                var myChart =bike_obj.myChartI= echarts.init(document.getElementById('dt_main'));
                option = {
                    tooltip: {
                        backgroundColor:'#fff',
                        borderColor:'#000',
                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                        textStyle:{
                            color:'#999'
                        },
                        trigger: 'axis'
                    },
                    toolbox: {},
                    xAxis: [{
                        splitLine: {
                            show: false
                        },
                        type: 'category',
                        data: chartsItems.map(function(e, i) {
                            //return e.dateTime;
                            return e.dateTime.split("-")[1]+"."+e.dateTime.split("-")[2];
                        })
                    }],
                    yAxis: [{
                        name:'(次)',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                    ],
                    series: [{
                        name: '骑行次数',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#ffe0b2'
                            },
                            emphasis: {
                                color: '#ffc878'
                            }
                        },
                        data: chartsItems.map(function(e, i) {
                            return e.times;
                        })
                    }]
                };
                myChart.setOption(option);
            }})    },
    drawChartII:function(){
        var bike_obj=this;
        $.ajax({
            url: _defautBiz.api("bikeDistanceAndElapsedTimeStatistic")+"&bikeNumber="+localStorage.bike_id+"&type=week",
            dataType: "json",
            method: 'get',
            success: function(resp) {
                var chartsItems=resp.data.bikeDistanceAndElapsedTimeStatistic;
                var myChart =bike_obj.myChartII= echarts.init(document.getElementById('dt_main1'));
                option = {
                    color: ['', '#6ebdec'],
                    tooltip: {
                        backgroundColor:'#fff',
                        borderColor:'#000',
                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                        textStyle:{
                            color:'#999'
                        },
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['里程', '时长'],
                        bottom: '0'
                    },
                    xAxis: [{
                        splitLine: {
                            show: false
                        },
                        type: 'category',
                        data: chartsItems.map(function(e, i) {
                            return e.dateTime.split("-")[1]+"."+e.dateTime.split("-")[2];
                        })
                    }],
                    yAxis: [{
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }, {
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }],
                    series: [{
                        name: '里程',
                        itemStyle: {
                            normal: {
                                color: '#ffe0b2'
                            },
                            emphasis: {
                                color: '#ffc878'
                            }
                        },
                        type: 'bar',
                        data: chartsItems.map(function(e, i) {
                            return e.distance;
                        })
                    }, {
                        name: '时长',
                        type: 'line',
                        yAxisIndex: 1,
                        data: chartsItems.map(function(e, i) {
                            return e.elapsedTime;
                        })
                    }]
                };
                myChart.setOption(option);
            }})    }}

function showDetail(){
    _bike_obj.line_period=0;
    $("#bike_detail button").removeClass("active");
    $("#time_bytime").addClass("active");
    $("#all_bytime").addClass("active");
    $("#dt_c_ds").addClass("active");
    $("#dt_c").addClass("active");
    $("#line_cur").addClass("active");
    $("#bike_detail").show();
    $("#bike_detail").show();
    $("#bike_id_detail").text($("#bike_id").text());
    $("#bike_detail").animate({"opacity":1});
    _bike_obj.init();
}
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
alert_obj.init();
alert_obj.Data_refresh();
alert_obj.KillInterval();
var test=new Vcity.CitySelector({input:'citySelect'});
