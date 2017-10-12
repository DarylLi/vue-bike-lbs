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
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo?'+_v,
                    warningDigestPage:'/earlyWarning/warningDigestPage',
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list',
                    listBikes:'/lock/map/list',
                    bikeDetail:'/lock/map/detail',
                    bikeSearch:'/lock/map/search',
                    searchLockIds: '/lockStatus/searchLockIds' + "?_v=" + _v
                }
            }
        }
    };

var lock_obj={
    geocoder:null,
    map:null,
    pos_list:[],
    off_list:[],
    data_storage:[],
    mapMass:null,
    offMass:null,
    zoomMass:null,
    tot_page:0,
    cur_page:1,
    first_load:true,
    LockInfo:null,
    InfoData:[],
    init:function(){
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        //this.drawMap();
        this.refreshList("?pageSize=10&currPage="+this.cur_page);
        this.componentInit();
    },
    refreshList:function(url){
        var Alertlist="";
        _obj=this;
        $.ajax({
            url:_defautBiz.api("listBikes")+url,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var Alertlist="";
                _obj.tot_page=resp.data.totalPages;
                if($("#detail_previous a").attr("data-dt-idx")==0)
                    $("#detail_previous").addClass("disabled");
                if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");
                $("#alert_body").html("");
                //var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
                //$("#alert_time").html(c_date);
                _obj.data_storage=resp.data;
                //$("#alert_body").html("");
                //_obj.pos_list.push({
                //    //"lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
                //    "lnglat": [121.4628360, 31.0328570],
                //    "name": 240
                //});
                for (var i in resp.data.datas) {
                    //if(resp.data.datas[i].lng!=undefined&&resp.data.datas[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)

                    //edit by zhao
                    //var type_class = resp.data.datas[i].isOnline== 0 ? 'system' : 'user';
                    var type_class = resp.data.datas[i].isOnline== 0 ? 'offline' : 'user';
                    //end
                    var type_name = resp.data.datas[i].isOnline == 0 ? '离线' : '在线';
                    //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                    var new_stat = '<img src="/static/qbike/img/new.png">';
                    Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.datas[i].lockNumber+'"class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.datas[i].lockNumber+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999">' +resp.data.datas[i].lockNumber + '</span></a></td></tr>';
                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                }
                $("#alert_body").prepend(Alertlist);
                var $list=[];
                for(var i in _obj.InfoData){
                    $.grep($("#alert_body td a"),function(el,j){
                        return $(el).attr("bid")==_obj.InfoData[i].lockNumber;
                    })[0]?$list.push(
                        $.grep($("#alert_body td a"),function(el,j){
                            return $(el).attr("bid")==_obj.InfoData[i].lockNumber;
                        })[1]
                    ):"";
                }
                for(var i in $list)$($list[i]).attr("class","active");
                $("[data-toggle='tooltip']").tooltip();
                $("#alert_body a").off().on("click",function(){
                    if($(this).hasClass("active"))$(this).removeClass("active");
                    else $(this).addClass("active");
                    $(this).hasClass("active")?_obj.toDetail($(this).attr("bid")):_obj.removeBid($(this).attr("bid"));
                });
                _obj.drawMap();
                $("#alert_filter a").off().on("click",function(){
                    $(".select-panel").removeClass("active");
                    $(this).closest(".select-panel").addClass("active");
                    _obj.dataUpdate($(this).attr("id"));
                })
            }
        })

    },
    componentInit:function(){
        _obj=this;
        localStorage.ac_city_name="全国";
        $("#map-ctrl-satellite").on("click",function(){
            //window.history.go(-1);
            if(!$(this).hasClass("active")){$("#map-ctrl-satellite span").text("地图");$(this).addClass("active");_obj.satellite=[new AMap.TileLayer.Satellite(),new AMap.TileLayer.RoadNet()];_obj.map.setLayers(_obj.satellite)}
            else {$("#map-ctrl-satellite span").text("卫星图");$(this).removeClass("active");_obj.map.setLayers([new AMap.TileLayer()])}
            _obj.mapMass.setMap(_obj.map);
            _obj.offMass.setMap(_obj.map);
            //_obj.massBuild=false;
            //_obj.drawMass();
        })
        $('#search-panel').autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: _defautBiz.api("searchLockIds"), // 后台请求路径
                    dataType: "json",
                    method: 'get',
                    data:{
                        id: request.term    // 获取输入框内容
                    },
                    success: function( data ) {
                        if(data && data.success && data.returnCode == 0){
                            response($.map(data.data, function(value){
                                return {
                                    // 设置item信息
                                    label: value, // 下拉项显示内容
                                    value: value,   // 下拉项对应数值
                                }
                            }))
                        }
                    }
                });
            }
        })
        $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
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
                _obj.refreshList("?pageSize=10&currPage="+$(this).attr("data-dt-idx"));
                //$.ajax({
                //    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                //    url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx"),
                //    dataType: "json",
                //    beforeSend: function(xhr) {
                //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //        //xhr.setRequestHeader("User-Agent", "headertest");
                //    },
                //    method: 'get',
                //    success: function(resp) {
                //        var Alertlist="";
                //        _obj.tot_page=resp.data.page.totalPage;
                //        _obj.pos_list=[];
                //        $("#alert_body").html("");
                //        var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
                //        $("#alert_time").html(c_date);
                //        _obj.data_storage=resp.data.data;
                //        //$("#alert_body").html("");
                //        for (var i in resp.data.data) {
                //            if(resp.data.data[i].lng!=undefined&&resp.data.data[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)
                //                _obj.pos_list.push({
                //                    "lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
                //                    //"lnglat": [121.4628360, 31.0328570],
                //                    "name": resp.data.data[i].bike_number
                //                });
                //            var type_class = resp.data.data[i].warn_source== 0 ? 'system' : 'user';
                //            var type_name = resp.data.data[i].warn_source == 0 ? '系统' : '用户';
                //            //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                //            var new_stat = '<img src="/static/qbike/img/new.png">';
                //            Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999!important" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg) + new_stat + '</span></a></td></tr>';
                //            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                //        }
                //        $("#alert_body").prepend(Alertlist);
                //        $("[data-toggle='tooltip']").tooltip();
                //        $("#alert_body a").off().on("click",function(){
                //            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                //        });
                //        _obj.drawMap();
                //        $("#alert_filter a").off().on("click",function(){
                //            =0;
                //            $(".select-panel").removeClass("active");
                //            $(this).closest(".select-panel").addClass("active");
                //            _obj.dataUpdate($(this).attr("id"));
                //        })
                //    }
                //})
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))-1));
                $("#detail_next a").attr("data-dt-idx",(parseInt($("#detail_next a").attr("data-dt-idx"))-1));
                if($(this).attr("data-dt-idx")==0)
                $("#detail_previous").addClass("disabled");;
            }
        });
        $("#detail_next a").on("click",function(){
            if(!$("#detail_next").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                _obj.refreshList("?pageSize=10&currPage="+$(this).attr("data-dt-idx"));
                //$.ajax({
                //    url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx"),
                //    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                //    dataType: "json",
                //    method: 'get',
                //    beforeSend: function(xhr) {
                //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //        //xhr.setRequestHeader("User-Agent", "headertest");
                //    },
                //    success: function(resp) {
                //        var Alertlist="";
                //        _obj.tot_page=resp.data.page.totalPage;
                //        if($("#detail_previous a").attr("data-dt-idx")==0)
                //            $("#detail_previous").addClass("disabled");
                //        if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
                //            $("#detail_next").addClass("disabled");
                //        _obj.pos_list=[];
                //        $("#alert_body").html("");
                //        var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
                //        $("#alert_time").html(c_date);
                //        _obj.data_storage=resp.data.data;
                //        //$("#alert_body").html("");
                //        for (var i in resp.data.data) {
                //            if(resp.data.data[i].lng!=undefined&&resp.data.data[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)
                //                _obj.pos_list.push({
                //                    "lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
                //                    //"lnglat": [121.4628360, 31.0328570],
                //                    "name": resp.data.data[i].bike_number
                //                });
                //            var type_class = resp.data.data[i].warn_source== 0 ? 'system' : 'user';
                //            var type_name = resp.data.data[i].warn_source == 0 ? '系统' : '用户';
                //            //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                //            var new_stat = '<img src="/static/qbike/img/new.png">';
                //            Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999!important" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg) + new_stat + '</span></a></td></tr>';
                //            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                //        }
                //        $("#alert_body").prepend(Alertlist);
                //        $("[data-toggle='tooltip']").tooltip();
                //        $("#alert_body a").off().on("click",function(){
                //            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
                //        });
                //        _obj.drawMap();
                //        $("#alert_filter a").off().on("click",function(){
                //            localStorage.alert_detail_indx=0;
                //            $(".select-panel").removeClass("active");
                //            $(this).closest(".select-panel").addClass("active");
                //            _obj.dataUpdate($(this).attr("id"));
                //        })
                //    }
                //})
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))+1));
                $("#detail_previous a").attr("data-dt-idx",(parseInt($("#detail_previous a").attr("data-dt-idx"))+1));
                if($(this).attr("data-dt-idx")>_obj.tot_page)
                    $("#detail_next").addClass("disabled");;
            }
        });
        //var Alertlist="";
        //$.ajax({
        //    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+this.cur_page+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
        //    url:_defautBiz.api("warningDigestPage")+"?currentPage="+this.cur_page,
        //    dataType: "json",
        //    method: 'get',
        //    beforeSend: function(xhr) {
        //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //        //xhr.setRequestHeader("User-Agent", "headertest");
        //    },
        //    success: function(resp) {
        //        _obj.tot_page=resp.data.page.totalPage;
        //        var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
        //        $("#alert_time").html(c_date);
        //        _obj.data_storage=resp.data.data;
        //        //$("#alert_body").html("");
        //        for (var i in resp.data.data) {
        //            if(resp.data.data[i].lng!=undefined&&resp.data.data[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)
        //            _obj.pos_list.push({
        //                "lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
        //                //"lnglat": [121.4628360, 31.0328570],
        //                "name": resp.data.data[i].bike_number
        //            });
        //            var type_class = resp.data.data[i].warn_source== 0 ? 'system' : 'user';
        //            var type_name = resp.data.data[i].warn_source == 0 ? '系统' : '用户';
        //            //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
        //            var new_stat = '<img src="/static/qbike/img/new.png">';
        //            Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999!important" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg) + new_stat + '</span></a></td></tr>';
        //            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
        //        }
        //        $("#alert_body").prepend(Alertlist);
        //        $("[data-toggle='tooltip']").tooltip();
        //        $("#alert_body a").off().on("click",function(){
        //            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
        //        });
        //        _obj.drawMap();
        //        $("#alert_filter a").off().on("click",function(){
        //            localStorage.alert_detail_indx=0;
        //            $(".select-panel").removeClass("active");
        //            $(this).closest(".select-panel").addClass("active");
        //            _obj.dataUpdate($(this).attr("id"));
        //        })
        //    }
        //});
        $(".close_ctrl").on("click",function(){
            if(_obj.zoomMass!=null)_obj.map.remove(_obj.zoomMass);
            $("#bike_result").hide();
        })
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
            $(".select-panel").removeClass("active");
            $(this).closest(".select-panel").addClass("active");
        })

        //add By zhao 地图位置默认显示列表
        list_toggle();
        //end
    },
    dataUpdate:function(type){
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
                $("#ride_dis").text(resp.data.countBikes+"条");
                $("#cur_all").text("当前全部:"+resp.data.countAll);
                $("#countUserUpload").text("用户上报:"+resp.data.countUserUpload);
                $("#countLongTimeNoUse").text("长时未用:"+resp.data.countLongTimeNoUse);
                $("#countAbnormalMoving").text("异常移动:"+resp.data.countAbnormalMoving);
                $("#countBrokeLock").text("撬锁警报:"+resp.data.countBrokeLock);
                $("#countLowBattery").text("低电量:"+resp.data.countLowBattery);
                $("#countOffLine").text("离线:"+resp.data.countOffline);
            }})
//$("#alert_body").html("");
        _obj=this;
        //if(_obj.zoomMass!=null)_obj.map.remove(_obj.zoomMass);
        $("#bike_result").hide();
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
            case 'countBrokeLock':
                var url="?type=6";
                break;
            case 'countLowBattery':
                var url="?type=3";
                break;
            case 'countOffLine':
                var url="?type=8";
                break;
        }
        _obj.refreshList("?pageSize=10&currPage=1");
        //$.ajax({
        //    //url:_defautBiz.api("warningDigestPage")+(url==""?"?":url)+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
        //    url:_defautBiz.api("warningDigestPage")+(url==""?"?":url),
        //    dataType: "json",
        //    method: 'get',
        //    beforeSend: function(xhr) {
        //        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //        //xhr.setRequestHeader("User-Agent", "headertest");
        //    },
        //    success: function(resp) {
        //        var Alertlist="";
        //        _obj.tot_page=resp.data.page.totalPage;
        //        $("#detail_previous").removeClass("disabled");
        //        $("#detail_next").removeClass("disabled");
        //        $("#detail_previous a").attr("data-dt-idx",0);
        //        $("#detail_next a").attr("data-dt-idx",2);
        //        if($("#detail_previous a").attr("data-dt-idx")==0)
        //            $("#detail_previous").addClass("disabled");
        //        if($("#detail_next a").attr("data-dt-idx")>_obj.tot_page)
        //            $("#detail_next").addClass("disabled");
        //        _obj.pos_list=[];
        //        $("#alert_body").html("");
        //        var c_date = (resp.data.data.length>0?new Date(resp.data.data[0].create_time).format("yyyy.MM.dd hh:mm"):"/");
        //        $("#alert_time").html(c_date);
        //        _obj.data_storage=resp.data.data;
        //        //$("#alert_body").html("");
        //        for (var i in resp.data.data) {
        //            if(resp.data.data[i].lng!=undefined&&resp.data.data[i].lat!=undefined&&$.grep(_obj.pos_list,function(e){return e.name==resp.data.data[i].bike_number}).length==0)
        //                _obj.pos_list.push({
        //                    "lnglat": [resp.data.data[i].lng, resp.data.data[i].lat],
        //                    //"lnglat": [121.4628360, 31.0328570],
        //                    "name": resp.data.data[i].bike_number
        //                });
        //            var type_class = resp.data.data[i].warn_source== 0 ? 'system' : 'user';
        //            var type_name = resp.data.data[i].warn_source == 0 ? '系统' : '用户';
        //            //var new_stat = resp.data.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
        //            var new_stat = '<img src="/static/qbike/img/new.png">';
        //            Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.data[i].bike_number+'" lng="'+resp.data.data[i].lng+'" lat="'+resp.data.data[i].lat+'" style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999!important" data-original-title="'+new Date(resp.data.data[i].create_time).format("yyyy.MM.dd hh:mm")+'">' +(resp.data.data[i].warn_msg.length>=15?(resp.data.data[i].warn_msg.substring(0,15)+"..."):resp.data.data[i].warn_msg) + new_stat + '</span></a></td></tr>';
        //            //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
        //        }
        //        $("#alert_body").prepend(Alertlist);
        //        $("[data-toggle='tooltip']").tooltip();
        //        $("#alert_body a").off().on("click",function(){
        //            _obj.toDetail($(this).attr("bid"),$(this).attr("lng"),$(this).attr("lat"));
        //        });
        //        _obj.drawMap();
        //        $("#alert_filter a").off().on("click",function(){
        //            localStorage.alert_detail_indx=0;
        //            $(".select-panel").removeClass("active");
        //            $(this).closest(".select-panel").addClass("active");
        //            _obj.dataUpdate($(this).attr("id"));
        //        })
        //    }
        //})
    },
    removeBid:function(bid){
        _obj=this
        _obj.LockInfo.close();
        var del_obj= $.grep(_obj.InfoData,function(e,i){
            return e.lockNumber==bid;
        })[0];
        _obj.InfoData= $.grep(_obj.InfoData,function(e,i){
            return e.lockNumber!=bid;
        })
        console.log(_obj.off_list)
        if(del_obj.isOnline==1)_obj.pos_list= $.grep(_obj.pos_list,function(e,i){return e.name!=bid;});
        if(del_obj.isOnline==0) _obj.off_list=$.grep(_obj.off_list,function(e,i){return e.name!=bid;});
        _obj.mapMass.setData(_obj.pos_list);
        _obj.offMass.setData(_obj.off_list);
        console.log(_obj.pos_list.length+"--pos");
        console.log(_obj.off_list.length+"--off");
        if(_obj.pos_list.length==0)_obj.mapMass.hide();
        else _obj.mapMass.show();
        if(_obj.off_list.length==0)_obj.offMass.hide();
        else _obj.offMass.show();
    },
    toDetail:function(bid){
        _obj=this;
        $.ajax({
            url: _defautBiz.api("bikeDetail")+"?lockNumbers="+bid ,
            dataType: "json",
            method: 'get',
            success: function(resp) {
                if(resp.data[0].posCurr){
                var lngX = 116.397428, latY = 39.90923;
                lngX = lngX + Math.random() * 0.05;
                latY = latY + Math.random() * 0.06;
                _obj.InfoData.push(resp.data[0]);
                            if(resp.data[0].isOnline==1)_obj.pos_list.push({
                                "lnglat": [resp.data[0].posCurr[0]?resp.data[0].posCurr[0]:lngX,resp.data[0].posCurr[1]?resp.data[0].posCurr[1]:latY],
                                //"lnglat": [121.4628360, 31.0328570],
                                "name": resp.data[0].lockNumber
                            });
                            if(resp.data[0].isOnline==0) _obj.off_list.push({
                                "lnglat": [resp.data[0].posCurr[0]?resp.data[0].posCurr[0]:lngX,resp.data[0].posCurr[1]?resp.data[0].posCurr[1]:latY],
                                //"lnglat": [121.4628360, 31.0328570],
                                "name": resp.data[0].lockNumber
                            });
                _obj.mapMass.setData(_obj.pos_list);
                _obj.offMass.setData(_obj.off_list);
                if(_obj.pos_list.length==0)_obj.mapMass.hide();
                else _obj.mapMass.show();
                if(_obj.off_list.length==0)_obj.offMass.hide();
                else _obj.offMass.show();
                _obj.map.setZoomAndCenter(15, [resp.data[0].posCurr[0]?resp.data[0].posCurr[0]:lngX,resp.data[0].posCurr[1]?resp.data[0].posCurr[1]:latY]);
                }
                else{
                    $("#s_info").text("该车辆暂无位置上报!");
                    $("#search_rslt").modal('show');
                }
            }})

    } ,
        searchDetail:function(bid){
            $.ajax({
                url:_defautBiz.api("bikeSearch")+"?lockNumber="+bid,
                //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                dataType: "json",
                method: 'get',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    //xhr.setRequestHeader("User-Agent", "headertest");
                },
                success: function(resp) {
                    var Alertlist='';
                    if(resp.data){
                        var type_class = resp.data.isOnline== 0 ? 'system' : 'user';
                        var type_name = resp.data.isOnline == 0 ? '离线' : '在线';
                        Alertlist+='<tr><td style="width: 70px;"><a href="javascript:void(0)" bid="'+resp.data.lockNumber+'"class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:void(0)" bid="'+resp.data.lockNumber+'" s style="padding-left:5px;margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999">' +resp.data.lockNumber + '</span></a></td></tr>';
                        $("#alert_body").html("");
                        $("#alert_body").prepend(Alertlist);
                        var $list=[];
                        for(var i in _obj.InfoData){
                            $.grep($("#alert_body td a"),function(el,j){
                                return $(el).attr("bid")==_obj.InfoData[i].lockNumber;
                            })[0]?$list.push(
                                $.grep($("#alert_body td a"),function(el,j){
                                    return $(el).attr("bid")==_obj.InfoData[i].lockNumber;
                                })[1]
                            ):"";
                        }
                        for(var i in $list)$($list[i]).attr("class","active");
                        $("[data-toggle='tooltip']").tooltip();
                        $("#alert_body a").off().on("click",function(){
                            if($(this).hasClass("active"))$(this).removeClass("active");
                            else $(this).addClass("active");
                            $(this).hasClass("active")?_obj.toDetail($(this).attr("bid")):_obj.removeBid($(this).attr("bid"));
                        });
                        _obj.drawMap();
                        $("#alert_filter a").off().on("click",function(){
                            $(".select-panel").removeClass("active");
                            $(this).closest(".select-panel").addClass("active");
                            _obj.dataUpdate($(this).attr("id"));
                        })
                    }
                    else{
                        $("#s_info").text("无搜索结果噢");
                        $("#search_rslt").modal('show');
                    }
                }});
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
            AMap.plugin(['AMap.ToolBar'],
                function () {
                    map.addControl(new AMap.ToolBar());
                });
            _obj.LockInfo = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(-10, -40)});
            this.first_load = false;
            //map.setMapStyle('blue_night');
            //map.setFeatures(['bg','road']);
            var mass = this.mapMass = new AMap.MassMarks(_obj.pos_list, {
                url: '/static/qbike/img/total.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
                var off = this.offMass = new AMap.MassMarks(_obj.pos_list, {
                    url: '/static/qbike/img/in_trouble.png',
                    anchor: new AMap.Pixel(23, 42),
                    size: new AMap.Size(48, 51),
                    opacity: 1,
                    cursor: 'pointer',
                    zIndex: 5
                });
            var M_marker = new AMap.Marker({
                content: '<ul class="dropdown-menu" role="menu" id="bike_result"><a href="/supervise/bike_detail.html"><li><img src="/static/qbike/img/bike_detail.png" alt=""></li><li>车辆编号:<span id="bike_id">8975777</span></li><li class="riding_msg"><div>投放时间:<span>2016.12.24</span></div><div>当前状态:<span>骑行中</span></div></li><li>当前地址:<span>上海市闵行区虹梅南路隧道</span></li><li class="riding_info"><div class="ride_status"><div>骑行次数<p>(/次)</p><p>123</p></div><div>骑行时长<p>(/分钟)</p><p>5131</p></div><div>骑行距离<p>(/公里)</p><p>441</p></div></div></li></a></ul>',
                map: map
            })
            //单车单一预警详情跳转

            mass.on('mouseover', function (e) {
                //M_marker.setPosition(e.data.lnglat);
                //M_marker.setLabel({content:e.data.name+",id:"+e.data.B_id})
            })
            mass.on('click', function (e) {
                //if (_obj.zoomMass != null)map.remove(_obj.zoomMass);
                //map.setCenter(e.data.lnglat);
                //_obj.zoomMass = new AMap.MassMarks([
                //    {
                //        "lnglat": e.data.lnglat,
                //        "name": e.data.name
                //    }
                //], {
                //    url: '/static/qbike/img/in_trouble_Max.png',
                //    anchor: new AMap.Pixel(31, 55),
                //    size: new AMap.Size(62, 65),
                //    opacity: 1,
                //    cursor: 'pointer',
                //    zIndex: 2
                //});
                //_obj.zoomMass.setMap(map);
                var content_obj= $.grep(_obj.InfoData,function(el,i){
                    return el.lockNumber==e.data.name;
                })[0]
                var title="";
                var content = [];
                //content.push("区域名称:"+this.city);
                content.push("智能锁名称:"+"<span class='info_content'>"+(content_obj.lockNumber?content_obj.lockNumber:"")+"</span>");
                content.push("在线情况:"+"<span class='info_content'>"+(content_obj.isOnline == 0 ? '离线' : '在线')+"</span>");
                //content.push("在线情况:"+"<span class='info_content'>"+(content_obj.isOnline?(content_obj.isOnline==0?'离线':'在线'))+"</span>");
                content.push("报警:"+"<span class='info_content'>"+(content_obj.warnInfo?content_obj.warnInfo:"")+"</span>");
                content.push("状态:"+"<span class='info_content'>"+(content_obj.lockStatusStr?content_obj.lockStatusStr:"")+"</span>");
                content.push("位置:"+"<span class='info_content'>"+((content_obj.province?content_obj.province:"")+(content_obj.city?content_obj.city:"")+(content_obj.district?content_obj.district:""))+"</span>");
                content.push("系统时间:"+"<span class='info_content'>"+(content_obj.timeCurr?new Date(content_obj.timeCurr).format("yyyy-MM-dd hh:mm:ss"):"")+"</span>");
                content.push("智能锁时间:"+"<span class='info_content'>"+(content_obj.devTime?content_obj.devTime:"")+"</span>");
                content.push("开锁次数:"+"<span class='info_content'>"+(content_obj.unlckCnt?content_obj.unlckCnt:"")+"</span>");
                content.push("电量:"+"<span class='info_content'>"+(content_obj.power?(content_obj.power+"%"):"0%")+"</span>");
                content.push("定位方式:"+"<span class='info_content'>"+(content_obj.locTypeStr?content_obj.locTypeStr:"")+"</span>");
                //content.push("休眠时间:"+"<span class='info_content'>"+(content_obj.timeGps?new Date(content_obj.timeGps).format("yyyy.MM.dd hh:mm"):"")+"</span>");
                _obj.LockInfo.setContent(createAreaInfo(title, content.join("<br/>")));
                _obj.LockInfo.open(_obj.map,e.data.lnglat);
                $(".alert_msg").html("");
                localStorage.bike_id = e.data.name;
                var warn_list = $.grep(_obj.data_storage, function (el) {
                    return el.bike_number == e.data.name
                });
                for (var i in warn_list) {
                    $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间' + new Date(warn_list[i].update_time).format("yyyy.MM.dd hh:mm") + '</div><div class="al_type">故障类型:' + (warn_list[i].warn_source == 0 ? '系统上报' : '用户上报') + '/' + warnType_parser(warn_list[i].warn_type) + '</div><div class="al_msg">故障描述:' + warn_list[i].warn_msg + '</div></div>');
                }
                //M_marker.setPosition(e.data.lnglat);
                $("#bike_id").text(e.data.name);
            });
                off.on('click', function (e) {
                    //if (_obj.zoomMass != null)map.remove(_obj.zoomMass);
                    //map.setCenter(e.data.lnglat);
                    //_obj.zoomMass = new AMap.MassMarks([
                    //    {
                    //        "lnglat": e.data.lnglat,
                    //        "name": e.data.name
                    //    }
                    //], {
                    //    url: '/static/qbike/img/in_trouble_Max.png',
                    //    anchor: new AMap.Pixel(31, 55),
                    //    size: new AMap.Size(62, 65),
                    //    opacity: 1,
                    //    cursor: 'pointer',
                    //    zIndex: 2
                    //});
                    //_obj.zoomMass.setMap(map);
                    var content_obj= $.grep(_obj.InfoData,function(el,i){
                        return el.lockNumber==e.data.name;
                    })[0]
                    var title="";
                    var content = [];
                    //content.push("区域名称:"+this.city);
                    content.push("智能锁名称:"+"<span class='info_content'>"+(content_obj.lockNumber?content_obj.lockNumber:"")+"</span>");
                    content.push("在线情况:"+"<span class='info_content'>"+(content_obj.isOnline == 0 ? '离线' : '在线')+"</span>");
                    //content.push("在线情况:"+"<span class='info_content'>"+content_obj.isOnline+"</span>");
                    content.push("报警:"+"<span class='info_content'>"+(content_obj.warnInfo?content_obj.warnInfo:"")+"</span>");
                    content.push("状态:"+"<span class='info_content'>"+(content_obj.lockStatusStr?content_obj.lockStatusStr:"")+"</span>");
                    content.push("位置:"+"<span class='info_content'>"+((content_obj.province?content_obj.province:"")+(content_obj.city?content_obj.city:"")+(content_obj.district?content_obj.district:""))+"</span>");
                    content.push("系统时间:"+"<span class='info_content'>"+(content_obj.timeCurr?new Date(content_obj.timeCurr).format("yyyy-MM-dd hh:mm:ss"):"")+"</span>");
                    content.push("智能锁时间:"+"<span class='info_content'>"+(content_obj.devTime?content_obj.devTime:"")+"</span>");
                    content.push("开锁次数:"+"<span class='info_content'>"+(content_obj.unlckCnt?content_obj.unlckCnt:"")+"</span>");
                    content.push("电量:"+"<span class='info_content'>"+(content_obj.power?(content_obj.power+"0%"):"")+"</span>");
                    content.push("定位方式:"+"<span class='info_content'>"+(content_obj.locTypeStr?content_obj.locTypeStr:"")+"</span>");
                    //content.push("休眠时间:"+"<span class='info_content'>"+(content_obj.timeGps?new Date(content_obj.timeGps).format("yyyy.MM.dd hh:mm"):"")+"</span>");
                    _obj.LockInfo.setContent(createAreaInfo(title, content.join("<br/>")));
                    _obj.LockInfo.open(_obj.map,e.data.lnglat);
                    $(".alert_msg").html("");
                    localStorage.bike_id = e.data.name;
                    var warn_list = $.grep(_obj.data_storage, function (el) {
                        return el.bike_number == e.data.name
                    });
                    for (var i in warn_list) {
                        $(".alert_msg").append('<div class="alert_panel"><div class="al_time">预警时间' + new Date(warn_list[i].update_time).format("yyyy.MM.dd hh:mm") + '</div><div class="al_type">故障类型:' + (warn_list[i].warn_source == 0 ? '系统上报' : '用户上报') + '/' + warnType_parser(warn_list[i].warn_type) + '</div><div class="al_msg">故障描述:' + warn_list[i].warn_msg + '</div></div>');
                    }
                    //M_marker.setPosition(e.data.lnglat);
                    $("#bike_id").text(e.data.name);
                });
                mass.setMap(map);
            off.setMap(map);
            var dragListener = AMap.event.addListener(map, "dragend", function (e) {
                //$("#bike_result").hide();
            });
            var geocoder = this.geocoder = new AMap.Geocoder({
                radius: 1000 //范围，默认：500
            });
            var click_able = true;
            $("#searching").on("click", function () {
                if (click_able) {
                    $("#bike_result").hide();
                    if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
                    click_able = false;
                    setTimeout(function () {
                        click_able = true
                    }, 2000);
                            _obj.searchDetail($("#search-panel").val().replace(/[~'!<>@#$%^&*()-+_=:]/g, ""));


                }
            });
        }
            else{
                //_obj.map.remove(_obj.zoomMass);
                if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
                if(_obj.pos_list.length>0){
                    _obj.mapMass.show();
                    _obj.mapMass.setData(_obj.pos_list);
                }
                else _obj.mapMass.hide()
            }
    }
};

function showDetail(){
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
            return '长时未用'
            break;
        case 6:
            return '撬锁'
            break;
        case 8:
            return '离线'
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
//map info content creat
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

lock_obj.init();
