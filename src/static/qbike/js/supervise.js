/**
 * Created by lihaotian on 2016/12/12.
 */
localStorage.currentUrl="/index/view.do";
localStorage.alert_detail_indx=0;
localStorage.bikeDetailRight=true;
var testing_linedata = [getRDList(), getRDList(), getRDList()];
var testing_xaxis = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
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
                    list:'/track/list'
                },
                product: {
                    statusstatistic: _base_url + '/statusstatistic' + "?" + _v,
                    header: _base_url + '/header' + "?_v=" + _v,
                    warnlist: _base_url + '/warnlist' + "?" + _v,
                    statistichour: _base_url + '/statistichour' + "?_v=" + _v,
                    statisticminute: _base_url + '/statisticminute' + "?_v=" + _v,
                    statistic_income_hour: _base_url + '/statistic_income_hour' + "?_v=" + _v,
                    statistic_income_minute: _base_url + '/statistic_income_minute' + "?_v=" + _v,
                    //1.按累计统计天收益接口
                    ///index/statistic_income_day
                    //2. 按时间统计小时收益
                    ///index/statistic_income_onehour
                    //3. 按时间统计天收益
                    ///index/statistic_income_oneday
                    statistic_income_day: _base_url + '/statistic_income_day' + "?_v=" + _v,
                    statistic_income_onehour: _base_url + '/statistic_income_onehour' + "?_v=" + _v,
                    statistic_income_oneday: _base_url + '/statistic_income_oneday' + "?_v=" + _v,
                    bikeDetail: _base_url + '/bikeDetail' + "?" + _v,
                    accumulateTimesStatistic: _base_url + '/accumulateTimesStatistic' + "?" + _v,
                    bikeDistanceAndElapsedTimeStatistic: _base_url + '/bikeDistanceAndElapsedTimeStatistic' + "?" + _v,
                    listLatestBikes: _base_url + '/listLatestBikes' + "?" + _v,
                    countBarInfo:'/earlyWarning/countBarInfo'+_v,
                    warningDigest:'/earlyWarning/warningDigest'+ "?_v="+_v,
                    getBikeById:'/earlyWarning/getBikeById',
                    list:'/track/list',
                    list_off:'/track/listHistoryPoints',
                    showPaginate:'/bike/list/get'
                }
            }
        }
    };
var superise_obj = {
    pieChart: null,
    mulLineChart: null,
    lineChart: null,
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
    zoomMass:"",
    lastTimestamp_income_th:"",
    income_th_data:[],
    lastTimestamp_income_td:"",
    income_td_data:[],
    lastTimestamp_income_d:"",
    income_d_data:[],
    lastTimestamp_income_h:"",
    income_h_data:[],
    lastTimestamp_income_m:"",
    income_m_data:[],
    lastTimestamp_status_h:"",
    status_h_data:[],
    lastTimestamp_status_m:"",
    status_m_data:[],
    lastTimestamp_useIndx_h:"",
    useIndx_h_data:[],
    lastTimestamp_useIndx_m:"",
    useIndx_m_data:[],
    geo_type:0,
    gps_flag:true,
    cur_city:"",
    cur_district:"",
    history_dis:"",
    list_totpage:0,
    history_currPage:1,
    list_currPage:1,
    history_geo_type:0,
    typeParam:"&type=1,2,3,4",
    typeList:[{type:true},{type:true},{type:true},{type:true}],
    init: function() {
        $("#citySelect").val("全国");
        localStorage.alert_city="全国";
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        _objP = this;
        $("html").on("mouseover", function() {
            _objP.Data_refresh();
        });
        $(".close_ctrl").on("click", function() {
            _objP.map.remove(_obj.zoomMass);
            $("#bike_result").hide();
        })
        $(top.hangge());

        //city_list
        this.dataInit();
        this.drawMap();
        this.drawcharts_I();
        this.drawcharts_II();
        this.drawcharts_III();
        this.componentInit();
        //renderChartsII();
        //renderChartsIII();
        //renderChartsIV();
        // 使用刚指定的配置项和数据显示图表。


        $(".map-ctrl-zoomIn").on("click", function() {
            $("#wrapper").scrollTop(0, 0);
            //$(".citySelector").css({"top":"65px!important","left":"154.781px!important"});
            $(".amap-toolbar").css("top","150px")
            $("#map_panel").addClass("fullpage");
            $("#mapDiv").addClass("fullpage");
            $("#wrapper").addClass("fullpage");
            $(".map-ctrl-zoomIn").hide();
            $(".map-ctrl-zoomOut").show();
            $(".amap-sug-result").addClass("totop");
        });
        $(".map-ctrl-zoomOut").on("click", function() {
            _objP.map.remove(_objP.zoomMass);
            $("#bike_result").hide();
            $(".amap-toolbar").css("top","10px")
            $("#map_panel").removeClass("fullpage");
            $("#wrapper").removeClass("fullpage");
            $("#mapDiv").removeClass("fullpage");
            $(".map-ctrl-zoomIn").show();
            $(".map-ctrl-zoomOut").hide();
            $(".amap-sug-result").removeClass("totop");

        });
    },
    paginationUpdate:function(indx){
        //var type=typeStr?typeStr:"&type=1,2,3,4"
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
            url: _defautBiz.api("showPaginate") + "?city="+_obj.cur_city+"&district="+_obj.cur_district+"&isGps="+_obj.geo_type+"&pageSize=10&currPage="+indx+_obj.typeParam,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if(resp.success) {
                    if (resp.data.datas.length > 0) {
                        //if(_obj.list_totpage!=resp.data.totalPages){$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                        _obj.list_totpage = resp.data.totalPages;
                        $("#detail_previous").removeClass("disabled");
                        $("#detail_next").removeClass("disabled");
                        if ($("#detail_next a").attr("data-dt-idx") > _obj.list_totpage)
                            $("#detail_next").addClass("disabled");
                        if ($("#detail_previous a").attr("data-dt-idx") == 0)
                            $("#detail_previous").addClass("disabled");
                        for (var i in resp.data.datas)Alertlist += '<tr><td style="width: 200px;padding-left: 15px;"><a href="javascript:void(0)">' + resp.data.datas[i] + '</a></td></tr>';
                        $("#alert_list").html("");
                        $("#alert_list").prepend(Alertlist);
                        $("#alert_list a").off().on("click", function () {
                            $("#alert_list a").removeClass("active");
                            $(this).addClass("active");
                            _obj.MapSearching($(this).text());
                        });
                    }
                    else {
                        //if(_obj.list_totpage!=resp.data.totalPages){$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                        _obj.list_totpage = resp.data.totalPages;
                        $("#detail_previous").removeClass("disabled");
                        $("#detail_next").removeClass("disabled");
                        if ($("#detail_next a").attr("data-dt-idx") > _obj.list_totpage)
                            $("#detail_next").addClass("disabled");
                        if ($("#detail_previous a").attr("data-dt-idx") == 0)
                            $("#detail_previous").addClass("disabled");
                        $("#alert_list").html("");
                        $("#alert_list").prepend('<tr><td style="width: 200px;padding-left: 15px;">该区域无车辆</td></tr>');
                    }
                }
                else{
                    //if(_obj.list_totpage!=resp.data.totalPages){$("#detail_next a").attr("data-dt-idx",2);$("#detail_previous a").attr("data-dt-idx",0);_obj.list_currPage=1;}
                    _obj.list_totpage = 0;
                    $("#detail_previous").removeClass("disabled");
                    $("#detail_next").removeClass("disabled");
                    if ($("#detail_next a").attr("data-dt-idx") > _obj.list_totpage)
                        $("#detail_next").addClass("disabled");
                    if ($("#detail_previous a").attr("data-dt-idx") == 0)
                        $("#detail_previous").addClass("disabled");
                    $("#alert_list").html("");
                    $("#alert_list").prepend('<tr><td style="width: 200px;padding-left: 15px;">该区域无车辆</td></tr>');
                }
            }
        });
        }
        }
    },
    componentInit: function() {
        localStorage.c_city_name="全国";
        var click_flag = true;
        _obj = this;
        $("#bike_result .fixed").on("mouseover", function() {
        });
        $("#bike_result .fixed").on("mouseout", function() {
        });
        //satellite
        $("#map-ctrl-satellite").on("click",function(){
            //window.history.go(-1);
            if(!$(this).hasClass("active")){$("#map-ctrl-satellite span").text("地图");$(this).addClass("active");_obj.satellite=[new AMap.TileLayer.Satellite(),new AMap.TileLayer.RoadNet()];_obj.map.setLayers(_obj.satellite)}
            else {$("#map-ctrl-satellite span").text("卫星图");$(this).removeClass("active");_obj.map.setLayers([new AMap.TileLayer()])}
            _obj.massBuild=false;
            if(_obj.map_zoom > 13)_obj.drawMass();
        });
        //next&previous
        $("#detail_previous a").on("click",function(){
            if(!$("#detail_previous").hasClass("disabled")){
                $("#detail_previous").removeClass("disabled");
                $("#detail_next").removeClass("disabled");
                //$.ajax({})
                $("#cur_page").text($(this).attr("data-dt-idx"));
                _obj.list_currPage=$(this).attr("data-dt-idx");
                _obj.paginationUpdate($(this).attr("data-dt-idx"));
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
                //$.ajax({});
                _obj.list_currPage=$(this).attr("data-dt-idx");
                $("#cur_page").text($(this).attr("data-dt-idx"));
                _obj.paginationUpdate($(this).attr("data-dt-idx"));
                $(this).attr("data-dt-idx",(parseInt($(this).attr("data-dt-idx"))+1));
                $("#detail_previous a").attr("data-dt-idx",(parseInt($("#detail_previous a").attr("data-dt-idx"))+1));
                if($(this).attr("data-dt-idx")>_obj.list_totpage)
                    $("#detail_next").addClass("disabled");;
            }
        });
        $(".type_ctrl button").on("click",function(){
            $(".type_ctrl button").removeClass("active");
            $(this).addClass("active");
            switch ($(this).attr("id")) {
                case "accu_ctrl":
                    $("#income").show();
                    $("#income_t").hide();
                    $("#income button").removeClass("active");
                    $("#iM_c").addClass("active");
                    _obj.income_flag = "c";
                    $.ajax({
                        url: _defautBiz.api("statistic_income_minute")+"&lastTimestamp="+_obj.lastTimestamp_income_m,
                        dataType: "json",
                        method: 'get',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                            //xhr.setRequestHeader("User-Agent", "headertest");
                        },
                        success: function(resp) {
                            if(_obj.lastTimestamp_income_m==""){
                                _obj.income_m_data=resp.data.BikeStatisticIncomePerMinute;
                            }
                            else{
                                if(resp.data.BikeStatisticIncomePerMinute.length>0){
                                    if(_obj.income_m_data.length>1440)_obj.income_m_data.shift();
                                    _obj.income_m_data.push(resp.data.BikeStatisticIncomePerMinute[0]);
                                }
                            }
                            if(resp.data.BikeStatisticIncomePerMinute.length>0)_obj.lastTimestamp_income_m=resp.data.BikeStatisticIncomePerMinute[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                            else{
                                _obj.lastTimestamp_income_m="";
                                _obj.income_m_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                            }
                            //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerMinute;
                            _obj.lineChart = echarts.init(document.getElementById('main3'));


                            option3 = {
                                backgroundColor: '#fff',
                                title: {
                                    text: ''
                                },
                                animation: false,
                                color: ['#f0b86a'],
                                tooltip: {
                                    backgroundColor: '#fff',
                                    borderColor:'#000',
                                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                    textStyle:{
                                        color:'#999'
                                    },
                                    trigger: 'axis',
                                    formatter: function(params) {
                                        params = params[0];
                                        var date = new Date(params.name).format("hh:mm");
                                        //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                        //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                        if(params.value)
                                            return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                        else
                                            return params.name + '<br/>收益:'+"0(元)";
                                    },
                                    axisPointer: {
                                        animation: true
                                    }
                                },

                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                    data: _obj.income_m_data.map(function(e, i) {
                                        return new Date(e.endtime).format("hh:mm");
                                    })
                                },
                                yAxis: {
                                    type: 'value',
                                    name:'(元)',
                                    splitNumber:3
                                    //boundaryGap: [0, '100%'],
                                    //splitLine: {
                                    //    show: false
                                    //}
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    containLabel: true
                                },
                                dataZoom: [{
                                    id: 'dataZoomX',
                                    type: 'slider',
                                    xAxisIndex: [0],
                                    filterMode: 'filter',
                                    start:92,
                                }],
                                series: [{
                                    name: '模拟数据',
                                    type: 'line',
                                    showSymbol: false,
                                    hoverAnimation: false,
                                    //data: this.mock_data
                                    areaStyle: {
                                        normal: {
                                            color: '#ffe9ca',
                                        }
                                    },
                                    data: _obj.income_m_data.map(function(e, i) {
                                        return {
                                            name: new Date(e.endtime).format("hh:mm"),
                                            value: [
                                                new Date(e.endtime).format("hh:mm"),
                                                //e.income
                                                (e.income / 100).toFixed(2)
                                            ]
                                        }
                                    })
                                }]
                            };
                            _obj.lineChart.setOption(option3);
                        }
                    })
                    break;
                case "time_ctrl":
                    $("#income_t").show();
                    $("#income").hide();
                    $("#income_t button").removeClass("active");
                    $("#tM_h").addClass("active");
                    _obj.income_flag = "th";
                    $.ajax({
                        url: _defautBiz.api("statistic_income_onehour")+"&lastTimestamp="+_obj.lastTimestamp_income_th,
                        dataType: "json",
                        method: 'get',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                            //xhr.setRequestHeader("User-Agent", "headertest");
                        },
                        success: function(resp) {
                            //var nameList=resp.data.map(function(e,i){return e.name});
                            //var BikeStatisticStatus = resp.data.bikeStatisticIncomeOneday;
                            _obj.lineChart = echarts.init(document.getElementById('main3'));
                            if(_obj.lastTimestamp_income_th==""){
                                _obj.income_th_data=resp.data.bikeStatisticIncomeOneday;
                            }
                            else{
                                if(resp.data.bikeStatisticIncomeOneday.length>0) {
                                    if(_obj.income_th_data.length>720)_obj.income_th_data.shift();
                                    _obj.income_th_data.push(resp.data.bikeStatisticIncomeOneday[0]);
                                }
                            }
                            if(resp.data.bikeStatisticIncomeOneday.length>0)_obj.lastTimestamp_income_th=resp.data.bikeStatisticIncomeOneday[resp.data.bikeStatisticIncomeOneday.length-1].endtime;
                            else{
                                _obj.lastTimestamp_income_th="";
                                _obj.income_th_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                            }
                            //_obj = this;
                            //function randomData() {
                            //    now = new Date(+now + oneDay);
                            //    value = value + Math.random() * 21 - 10;
                            //    _obj.mock_now = now;
                            //    return {
                            //        name: now.toString(),
                            //        value: [
                            //            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                            //            Math.round(value)
                            //        ]
                            //    }
                            //}

                            //this.mock_data = [];
                            //var now = +new Date(1997, 9, 3);
                            //var oneDay = 24 * 3600 * 1000;
                            //var value = Math.random() * 1000;
                            //for (var i = 0; i < 1000; i++) {
                            //    this.mock_data.push(randomData());
                            //}

                            option3 = {
                                backgroundColor: '#fff',
                                animation: false,
                                title: {
                                    text: ''
                                },
                                tooltip: {
                                    backgroundColor:'#fff',
                                    borderColor:'#000',
                                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                    textStyle:{
                                        color:'#999'
                                    },
                                    trigger: 'axis',
                                    formatter: function(params) {
                                        params = params[0];
                                        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                                        //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                        //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                        if(params.value)
                                            return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                        else
                                            return params.name + '<br/>收益:'+"0(元)";
                                    },
                                    axisPointer: {
                                        animation: true
                                    }
                                },
                                color: ['#f0b86a'],
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                    data: _obj.income_th_data.map(function(e, i) {
                                        return new Date(e.endtime).format("MM.dd hh:mm");
                                    })
                                },
                                yAxis: {
                                    type: 'value',
                                    name:'(元)',
                                    splitNumber:3
                                    //boundaryGap: [0, '100%'],
                                    //splitLine: {
                                    //    show: false
                                    //}
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    containLabel: true
                                },
                                dataZoom: [{
                                    id: 'dataZoomX',
                                    type: 'slider',
                                    xAxisIndex: [0],
                                    filterMode: 'filter',
                                    start:77
                                }],
                                series: [{
                                    name: '模拟数据',
                                    type: 'line',
                                    showSymbol: false,
                                    hoverAnimation: false,
                                    //data: this.mock_data
                                    areaStyle: {
                                        normal: {
                                            color: '#ffe9ca',
                                        }
                                    },
                                    data: _obj.income_th_data.map(function(e, i) {
                                        return {
                                            name: new Date(e.endtime).format("MM.dd hh:mm"),
                                            value: [
                                                new Date(e.endtime).format("MM.dd hh:mm"),
                                                //e.income
                                                (e.income / 100).toFixed(2)
                                            ]
                                        }
                                    })
                                }]
                            };
                            _obj.lineChart.setOption(option3);
                        }
                    })
                    break;
            };
        });
        $("button").on("click", function() {
            if (click_flag) {
                switch ($(this).attr("id")) {
                    case "M_h":
                        _obj.user_flag = "h";
                        $("#using button").removeClass("active");
                        $(this).addClass("active");
                        $.ajax({
                            url: _defautBiz.api("statistichour")+"&lastTimestamp="+_obj.lastTimestamp_useIndx_h,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                if(_obj.lastTimestamp_useIndx_h==""){
                                    _obj.useIndx_h_data=resp.data.BikeStatisticStatusPerHour;
                                }
                                else{
                                    if(resp.data.BikeStatisticStatusPerHour.length>0) {
                                            if(_obj.useIndx_h_data.length>720)_obj.useIndx_h_data.shift();
                                            _obj.useIndx_h_data.push(resp.data.BikeStatisticStatusPerHour[0]);
                                    }
                                }
                                if(resp.data.BikeStatisticStatusPerHour.length>0)_obj.lastTimestamp_useIndx_h=resp.data.BikeStatisticStatusPerHour[resp.data.BikeStatisticStatusPerHour.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_useIndx_h="";
                                    _obj.useIndx_h_data=[{"id":null,"endtime":0000000000000,"starttime":0000000000000,"cityId":null,"notUseNumbers":0,"damageNumbers":0,"useNumbers":0,"createTime":null}];
                                }
                                //var BikeStatisticStatus = resp.data.BikeStatisticStatusPerHour;
                                _obj.mulLineChart.setOption({
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        start:77,
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                    }],
                                    xAxis: [{
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: [ '2011.06', '2011.07','2011.08', '2011.09', '2011.10', '2011.11', '2011.12']
                                        data: _obj.useIndx_h_data.map(function(e, i) {
                                            return new Date(e.endtime).format("MM.dd hh:mm");
                                        })
                                        //data: getRDList()
                                    }],
                                    yAxis: [{
                                        name: '(辆)',
                                        type: 'value'
                                    }],
                                    series: [{
                                        name: '可用车辆',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [120, 132, 101, 134, 90, 230, 210]
                                        data: _obj.useIndx_h_data.map(function(e, i) {
                                            return e.notUseNumbers
                                        })
                                    }, {
                                        name: '在用车辆',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [220, 182, 191, 234, 290, 330, 310]
                                        data: _obj.useIndx_h_data.map(function(e, i) {
                                            return e.useNumbers
                                        })
                                    }, {
                                        name: '故障(损坏+离线)',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [150, 232, 201, 154, 190, 330, 410]
                                        data: _obj.useIndx_h_data.map(function(e, i) {
                                            return e.damageNumbers
                                        })
                                    }]
                                });
                            }
                        });
                        break;
                    case "M_c":
                        _obj.user_flag = "c";
                        $("#using button").removeClass("active");
                        $(this).addClass("active");
                        $.ajax({
                            url: _defautBiz.api("statisticminute")+"&lastTimestamp="+_obj.lastTimestamp_useIndx_m,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                if(_obj.lastTimestamp_useIndx_m==""){
                                    _obj.useIndx_m_data=resp.data.BikeStatisticStatusPerMinute;
                                }
                                else{
                                    if(resp.data.BikeStatisticStatusPerMinute.length>0) {
                                        if(resp.data.BikeStatisticStatusPerMinute.length>0) {
                                            if(_obj.useIndx_m_data.length>1440)_obj.useIndx_m_data.shift();
                                            _obj.useIndx_m_data.push(resp.data.BikeStatisticStatusPerMinute[0]);
                                        }
                                    }
                                }
                                if(resp.data.BikeStatisticStatusPerMinute.length>0)_obj.lastTimestamp_useIndx_m=resp.data.BikeStatisticStatusPerMinute[resp.data.BikeStatisticStatusPerMinute.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_useIndx_m="";
                                    _obj.useIndx_m_data=[{"id":null,"endtime":0000000000000,"starttime":0000000000000,"cityId":null,"notUseNumbers":0,"damageNumbers":0,"useNumbers":0,"createTime":null}];
                                }
                                //var BikeStatisticStatus = resp.data.BikeStatisticStatusPerMinute;
                                _obj.mulLineChart.setOption({
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        start:92,
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                    }],
                                    xAxis: [{
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: [ '2011.06', '2011.07','2011.08', '2011.09', '2011.10', '2011.11', '2011.12']
                                        data: _obj.useIndx_m_data.map(function(e, i) {
                                            return new Date(e.endtime).format("hh:mm");
                                        })
                                        //data: getRDList()
                                    }],
                                    yAxis: [{
                                        name: '(辆)',
                                        type: 'value'
                                    }],
                                    series: [{
                                        name: '可用车辆',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [120, 132, 101, 134, 90, 230, 210]
                                        data: _obj.useIndx_m_data.map(function(e, i) {
                                            return e.notUseNumbers
                                        })
                                    }, {
                                        name: '在用车辆',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [220, 182, 191, 234, 290, 330, 310]
                                        data: _obj.useIndx_m_data.map(function(e, i) {
                                            return e.useNumbers
                                        })
                                    }, {
                                        name: '故障(损坏+离线)',
                                        type: 'line',
                                        stack: '总量',
                                        areaStyle: {
                                            normal: {}
                                        },
                                        //data: [150, 232, 201, 154, 190, 330, 410]
                                        data: _obj.useIndx_m_data.map(function(e, i) {
                                            return e.damageNumbers
                                        })
                                    }]
                                });
                            }
                        });
                        break;
                    case "tM_d":
                        $("#income_t button").removeClass("active");
                        $(this).addClass("active");
                        _obj.income_flag = "td";
                        $.ajax({
                            url: _defautBiz.api("statistic_income_oneday")+"&lastTimestamp="+_obj.lastTimestamp_income_td,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                //var nameList=resp.data.map(function(e,i){return e.name});
                                //var BikeStatisticStatus = resp.data.bikeStatisticIncomeOneday;
                                _obj.lineChart = echarts.init(document.getElementById('main3'));
                                if(_obj.lastTimestamp_income_td==""){
                                    _obj.income_td_data=resp.data.bikeStatisticIncomeOneday;
                                }
                                else{
                                    if(resp.data.bikeStatisticIncomeOneday.length>0) {
                                        if(_obj.income_td_data.length>720)_obj.income_td_data.shift();
                                        _obj.income_td_data.push(resp.data.bikeStatisticIncomeOneday[0]);
                                    }
                                }
                                if(resp.data.bikeStatisticIncomeOneday.length>0)_obj.lastTimestamp_income_td=resp.data.bikeStatisticIncomeOneday[resp.data.bikeStatisticIncomeOneday.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_income_td="";
                                    _obj.income_td_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                                }
                                //_obj = this;
                                //function randomData() {
                                //    now = new Date(+now + oneDay);
                                //    value = value + Math.random() * 21 - 10;
                                //    _obj.mock_now = now;
                                //    return {
                                //        name: now.toString(),
                                //        value: [
                                //            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                                //            Math.round(value)
                                //        ]
                                //    }
                                //}

                                //this.mock_data = [];
                                //var now = +new Date(1997, 9, 3);
                                //var oneDay = 24 * 3600 * 1000;
                                //var value = Math.random() * 1000;
                                //for (var i = 0; i < 1000; i++) {
                                //    this.mock_data.push(randomData());
                                //}

                                option3 = {
                                    backgroundColor: '#fff',
                                    animation: false,
                                    title: {
                                        text: ''
                                    },
                                    tooltip: {
                                        backgroundColor:'#fff',
                                        borderColor:'#000',
                                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                        textStyle:{
                                            color:'#999'
                                        },
                                        trigger: 'axis',
                                        formatter: function(params) {
                                            params = params[0];
                                            //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                                            //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                            //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                            if(params.value)
                                                return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                            else
                                                return params.name + '<br/>收益:'+"0(元)";
                                        },
                                        axisPointer: {
                                            animation: true
                                        }
                                    },
                                    color: ['#f0b86a'],
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                        data: _obj.income_td_data.map(function(e, i) {
                                            return new Date(e.endtime).format("yy.MM.dd");
                                        })
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name:'(元)',
                                        splitNumber:3
                                        //boundaryGap: [0, '100%'],
                                        //splitLine: {
                                        //    show: false
                                        //}
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        containLabel: true
                                    },
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                        start:77
                                    }],
                                    series: [{
                                        name: '模拟数据',
                                        type: 'line',
                                        showSymbol: false,
                                        hoverAnimation: false,
                                        //data: this.mock_data
                                        areaStyle: {
                                            normal: {
                                                color: '#ffe9ca',
                                            }
                                        },
                                        data: _obj.income_td_data.map(function(e, i) {
                                            return {
                                                name: new Date(e.endtime).format("yy.MM.dd"),
                                                value: [
                                                    new Date(e.endtime).format("yy.MM.dd"),
                                                    //e.income
                                                    (e.income / 100).toFixed(2)
                                                ]
                                            }
                                        })
                                    }]
                                };
                                _obj.lineChart.setOption(option3);
                            }
                        })
                        break;
                    case "tM_h":
                        $("#income_t button").removeClass("active");
                        $(this).addClass("active");
                        _obj.income_flag = "th";
                        $.ajax({
                            url: _defautBiz.api("statistic_income_onehour")+"&lastTimestamp="+_obj.lastTimestamp_income_th,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                //var nameList=resp.data.map(function(e,i){return e.name});
                                //var BikeStatisticStatus = resp.data.bikeStatisticIncomeOneday;
                                _obj.lineChart = echarts.init(document.getElementById('main3'));
                                if(_obj.lastTimestamp_income_th==""){
                                    _obj.income_th_data=resp.data.bikeStatisticIncomeOneday;
                                }
                                else{
                                    if(resp.data.bikeStatisticIncomeOneday.length>0) {
                                        if(_obj.income_th_data.length>720)_obj.income_th_data.shift();
                                        _obj.income_th_data.push(resp.data.bikeStatisticIncomeOneday[0]);
                                    }
                                }
                                if(resp.data.bikeStatisticIncomeOneday.length>0)_obj.lastTimestamp_income_th=resp.data.bikeStatisticIncomeOneday[resp.data.bikeStatisticIncomeOneday.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_income_th="";
                                    _obj.income_th_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                                }
                                //_obj = this;
                                //function randomData() {
                                //    now = new Date(+now + oneDay);
                                //    value = value + Math.random() * 21 - 10;
                                //    _obj.mock_now = now;
                                //    return {
                                //        name: now.toString(),
                                //        value: [
                                //            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                                //            Math.round(value)
                                //        ]
                                //    }
                                //}

                                //this.mock_data = [];
                                //var now = +new Date(1997, 9, 3);
                                //var oneDay = 24 * 3600 * 1000;
                                //var value = Math.random() * 1000;
                                //for (var i = 0; i < 1000; i++) {
                                //    this.mock_data.push(randomData());
                                //}

                                option3 = {
                                    backgroundColor: '#fff',
                                    animation: false,
                                    title: {
                                        text: ''
                                    },
                                    tooltip: {
                                        backgroundColor:'#fff',
                                        borderColor:'#000',
                                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                        textStyle:{
                                            color:'#999'
                                        },
                                        trigger: 'axis',
                                        formatter: function(params) {
                                            params = params[0];
                                            //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                                            //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                            //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                            if(params.value)
                                                return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                            else
                                                return params.name + '<br/>收益:'+"0(元)";
                                        },
                                        axisPointer: {
                                            animation: true
                                        }
                                    },
                                    color: ['#f0b86a'],
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                        data: _obj.income_th_data.map(function(e, i) {
                                            return new Date(e.endtime).format("MM.dd hh:mm");
                                        })
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name:'(元)',
                                        splitNumber:3
                                        //boundaryGap: [0, '100%'],
                                        //splitLine: {
                                        //    show: false
                                        //}
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        containLabel: true
                                    },
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                        start:77
                                    }],
                                    series: [{
                                        name: '模拟数据',
                                        type: 'line',
                                        showSymbol: false,
                                        hoverAnimation: false,
                                        //data: this.mock_data
                                        areaStyle: {
                                            normal: {
                                                color: '#ffe9ca',
                                            }
                                        },
                                        data: _obj.income_th_data.map(function(e, i) {
                                            return {
                                                name: new Date(e.endtime).format("MM.dd hh:mm"),
                                                value: [
                                                    new Date(e.endtime).format("MM.dd hh:mm"),
                                                    //e.income
                                                    (e.income / 100).toFixed(2)
                                                ]
                                            }
                                        })
                                    }]
                                };
                                _obj.lineChart.setOption(option3);
                            }
                        })
                        break;
                    case "iM_h":
                        $("#income button").removeClass("active");
                        $(this).addClass("active");
                        _obj.income_flag = "h";
                        $.ajax({
                            url: _defautBiz.api("statistic_income_hour")+"&lastTimestamp="+_obj.lastTimestamp_income_h,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                //var nameList=resp.data.map(function(e,i){return e.name});
                                //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerHour;
                                _obj.lineChart = echarts.init(document.getElementById('main3'));
                                if(_obj.lastTimestamp_income_h==""){
                                    _obj.income_h_data=resp.data.BikeStatisticIncomePerHour;
                                }
                                else{
                                        if(resp.data.BikeStatisticIncomePerHour.length>0) {
                                            if(_obj.income_h_data.length>720)_obj.income_h_data.shift();
                                            _obj.income_h_data.push(resp.data.BikeStatisticIncomePerHour[0]);
                                        }
                                }
                                if(resp.data.BikeStatisticIncomePerHour.length>0)_obj.lastTimestamp_income_h=resp.data.BikeStatisticIncomePerHour[resp.data.BikeStatisticIncomePerHour.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_income_h="";
                                    _obj.income_h_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                                }
                                //_obj = this;
                                //function randomData() {
                                //    now = new Date(+now + oneDay);
                                //    value = value + Math.random() * 21 - 10;
                                //    _obj.mock_now = now;
                                //    return {
                                //        name: now.toString(),
                                //        value: [
                                //            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                                //            Math.round(value)
                                //        ]
                                //    }
                                //}

                                //this.mock_data = [];
                                //var now = +new Date(1997, 9, 3);
                                //var oneDay = 24 * 3600 * 1000;
                                //var value = Math.random() * 1000;
                                //for (var i = 0; i < 1000; i++) {
                                //    this.mock_data.push(randomData());
                                //}

                                option3 = {
                                    backgroundColor: '#fff',
                                    animation: false,
                                    title: {
                                        text: ''
                                    },
                                    tooltip: {
                                        backgroundColor:'#fff',
                                        borderColor:'#000',
                                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                        textStyle:{
                                            color:'#999'
                                        },
                                        trigger: 'axis',
                                        formatter: function(params) {
                                            params = params[0];
                                            //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                                            //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                            //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                            if(params.value)
                                                return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                            else
                                                return params.name + '<br/>收益:'+"0(元)";
                                        },
                                        axisPointer: {
                                            animation: true
                                        }
                                    },
                                    color: ['#f0b86a'],
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                        data: _obj.income_h_data.map(function(e, i) {
                                            return new Date(e.endtime).format("MM.dd hh:mm");
                                        })
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name:'(元)',
                                        splitNumber:3
                                        //boundaryGap: [0, '100%'],
                                        //splitLine: {
                                        //    show: false
                                        //}
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        containLabel: true
                                    },
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                        start:77
                                    }],
                                    series: [{
                                        name: '模拟数据',
                                        type: 'line',
                                        showSymbol: false,
                                        hoverAnimation: false,
                                        //data: this.mock_data
                                        areaStyle: {
                                            normal: {
                                                color: '#ffe9ca',
                                            }
                                        },
                                        data: _obj.income_h_data.map(function(e, i) {
                                            return {
                                                name: new Date(e.endtime).format("MM.dd hh:mm"),
                                                value: [
                                                    new Date(e.endtime).format("MM.dd hh:mm"),
                                                    //e.income
                                                    (e.income / 100).toFixed(2)
                                                ]
                                            }
                                        })
                                    }]
                                };
                                _obj.lineChart.setOption(option3);
                            }
                        })
                        break;
                    case "iM_d":
                        $("#income button").removeClass("active");
                        $(this).addClass("active");
                        _obj.income_flag = "d";
                        $.ajax({
                            url: _defautBiz.api("statistic_income_day")+"&lastTimestamp="+_obj.lastTimestamp_income_d,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                //var nameList=resp.data.map(function(e,i){return e.name});
                                //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerDay;
                                _obj.lineChart = echarts.init(document.getElementById('main3'));
                                if(_obj.lastTimestamp_income_d==""){
                                    _obj.income_d_data=resp.data.BikeStatisticIncomePerDay;
                                }
                                else{
                                    if(resp.data.BikeStatisticIncomePerDay.length>0) {
                                        if(_obj.income_d_data.length>720)_obj.income_d_data.shift();
                                        _obj.income_d_data.push(resp.data.BikeStatisticIncomePerDay[0]);
                                    }
                                }
                                if(resp.data.BikeStatisticIncomePerDay.length>0)_obj.lastTimestamp_income_d=resp.data.BikeStatisticIncomePerDay[resp.data.BikeStatisticIncomePerDay.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_income_d="";
                                    _obj.income_d_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                                }
                                //_obj = this;
                                //function randomData() {
                                //    now = new Date(+now + oneDay);
                                //    value = value + Math.random() * 21 - 10;
                                //    _obj.mock_now = now;
                                //    return {
                                //        name: now.toString(),
                                //        value: [
                                //            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                                //            Math.round(value)
                                //        ]
                                //    }
                                //}

                                //this.mock_data = [];
                                //var now = +new Date(1997, 9, 3);
                                //var oneDay = 24 * 3600 * 1000;
                                //var value = Math.random() * 1000;
                                //for (var i = 0; i < 1000; i++) {
                                //    this.mock_data.push(randomData());
                                //}

                                option3 = {
                                    backgroundColor: '#fff',
                                    animation: false,
                                    title: {
                                        text: ''
                                    },
                                    tooltip: {
                                        backgroundColor:'#fff',
                                        borderColor:'#000',
                                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                        textStyle:{
                                            color:'#999'
                                        },
                                        trigger: 'axis',
                                        formatter: function(params) {
                                            params = params[0];
                                            //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                                            //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                            //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                            if(params.value)
                                                return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                            else
                                                return params.name + '<br/>收益:'+"0(元)";
                                        },
                                        axisPointer: {
                                            animation: true
                                        }
                                    },
                                    color: ['#f0b86a'],
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                        data: _obj.income_d_data.map(function(e, i) {
                                            return new Date(e.endtime).format("yy.MM.dd");
                                        })
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name:'(元)',
                                        splitNumber:3
                                        //boundaryGap: [0, '100%'],
                                        //splitLine: {
                                        //    show: false
                                        //}
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        containLabel: true
                                    },
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                        start:77
                                    }],
                                    series: [{
                                        name: '模拟数据',
                                        type: 'line',
                                        showSymbol: false,
                                        hoverAnimation: false,
                                        //data: this.mock_data
                                        areaStyle: {
                                            normal: {
                                                color: '#ffe9ca',
                                            }
                                        },
                                        data: _obj.income_d_data.map(function(e, i) {
                                            return {
                                                name: new Date(e.endtime).format("yy.MM.dd"),
                                                value: [
                                                    new Date(e.endtime).format("yy.MM.dd"),
                                                    //e.income
                                                    (e.income / 100).toFixed(2)
                                                ]
                                            }
                                        })
                                    }]
                                };
                                _obj.lineChart.setOption(option3);
                            }
                        })
                        break;
                    case "iM_c":
                        $("#income button").removeClass("active");
                        $(this).addClass("active");
                        _obj.income_flag = "c";
                        $.ajax({
                            url: _defautBiz.api("statistic_income_minute")+"&lastTimestamp="+_obj.lastTimestamp_income_m,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                if(_obj.lastTimestamp_income_m==""){
                                    _obj.income_m_data=resp.data.BikeStatisticIncomePerMinute;
                                }
                                else{
                                    if(resp.data.BikeStatisticIncomePerMinute.length>0){
                                        if(_obj.income_m_data.length>1440)_obj.income_m_data.shift();
                                        _obj.income_m_data.push(resp.data.BikeStatisticIncomePerMinute[0]);
                                    }
                                }
                                if(resp.data.BikeStatisticIncomePerMinute.length>0)_obj.lastTimestamp_income_m=resp.data.BikeStatisticIncomePerMinute[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                                else{
                                    _obj.lastTimestamp_income_m="";
                                    _obj.income_m_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                                }
                                //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerMinute;
                                _obj.lineChart = echarts.init(document.getElementById('main3'));


                                option3 = {
                                    backgroundColor: '#fff',
                                    title: {
                                        text: ''
                                    },
                                    animation: false,
                                    color: ['#f0b86a'],
                                    tooltip: {
                                        backgroundColor: '#fff',
                                        borderColor:'#000',
                                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                                        textStyle:{
                                            color:'#999'
                                        },
                                        trigger: 'axis',
                                        formatter: function(params) {
                                            params = params[0];
                                            var date = new Date(params.name).format("hh:mm");
                                            //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                                            //return params.name + '<br/>收益:' + params!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                                            if(params.value)
                                                return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                                            else
                                                return params.name + '<br/>收益:'+"0(元)";
                                        },
                                        axisPointer: {
                                            animation: true
                                        }
                                    },

                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                        data: _obj.income_m_data.map(function(e, i) {
                                            return new Date(e.endtime).format("hh:mm");
                                        })
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name:'(元)',
                                        splitNumber:3
                                        //boundaryGap: [0, '100%'],
                                        //splitLine: {
                                        //    show: false
                                        //}
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        containLabel: true
                                    },
                                    dataZoom: [{
                                        id: 'dataZoomX',
                                        type: 'slider',
                                        xAxisIndex: [0],
                                        filterMode: 'filter',
                                        start:92,
                                    }],
                                    series: [{
                                        name: '模拟数据',
                                        type: 'line',
                                        showSymbol: false,
                                        hoverAnimation: false,
                                        //data: this.mock_data
                                        areaStyle: {
                                            normal: {
                                                color: '#ffe9ca',
                                            }
                                        },
                                        data: _obj.income_m_data.map(function(e, i) {
                                            return {
                                                name: new Date(e.endtime).format("hh:mm"),
                                                value: [
                                                    new Date(e.endtime).format("hh:mm"),
                                                    //e.income
                                                    (e.income / 100).toFixed(2)
                                                ]
                                            }
                                        })
                                    }]
                                };
                                _obj.lineChart.setOption(option3);
                            }
                        })

                        break;
                }
                click_flag = false;
                setTimeout(function() {
                    click_flag = true;
                }, 1000);
            }
        })
        $("#geo_type button").off().on("click",function(){
            $("#bike_result").hide();
            if (_obj.zoomMass != null)_obj.map.remove(_obj.zoomMass);
            $("#geo_type button").removeClass("active");
            $(this).addClass("active");
            _obj.geo_type= $(this).attr("data-toggle")=="on"?1:0;
            $("#time_type").text(_obj.geo_type==0?"修正时间:":"定位时间:");
            _obj.gps_flag=true;
            _obj.mapPointsUpdate();
            _obj.paginationUpdate(_obj.list_currPage);
        });
    },
    initPieChart: function(BikeStatus){
        var _obj = this;
        //var Dlength=resp.data.length;
        var selectedList= {
            '故障':(BikeStatus.damagedNumbers+BikeStatus.alarmNumbers==0?false:true),
            '可用':BikeStatus.notUseNumbers==0?false:true,
            '离线':BikeStatus.alarmNumbers==0?false:true,
            '预约中':BikeStatus.reserveNumbers==0?false:true,
            '骑行中':BikeStatus.ridingNumbers==0?false:true,
            '在用':(BikeStatus.ridingNumbers+BikeStatus.reserveNumbers==0)?false:true,
            '损坏':BikeStatus.damagedNumbers==0?false:true,
        }
        _obj.pieChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        option = {
            backgroundColor: '#fff',
            animation: false,
            title: {
                text: ''
            },
            tooltip: {
                backgroundColor:'#fff',
                borderColor:'#000',
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                textStyle:{
                    color:'#999'
                },
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            //legend: {
            //    orient: 'vertical',
            //    x: 'left',
            //    //data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
            //    //data:nameList
            //},
            legend: {
                textStyle:{
                    fontFamily:'Microsoft YaHei',
                    fontSize:'12'
                },
                selected:selectedList,
                show: true,
                //data: ['故障', '可用', '离线', '预约中', '骑行中'],
                data:[{
                    name: '故障',
                    // 强制设置图形为圆。
                    icon: 'circle'
                },
                    {
                        name: '可用',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    },
                    {
                        name: '离线',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    },
                    {
                        name: '预约中',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    },
                    {
                        name: '骑行中',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    },
                    {
                        name: '在用',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    }
                    ,{
                        name: '损坏',
                        // 强制设置图形为圆。
                        icon: 'circle'
                    }
                ],
                bottom: 0
            },
            series: [{
                name: '车辆状态',
                type: 'pie',
                selectedMode: 'single',
                clockwise: true,
                //minAngle:60,
                legendHoverLink: false,
                radius: [0, '30%'],
                color: ['#dad7d7', '#ffc300','#c9d952'],
                label: {
                    normal: {
                        position: 'inner',
                        textStyle: {
                            color: '#fff',
                            fontFamily:'Microsoft YaHei',
                            fontSize:'12'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                    value: (BikeStatus.damagedNumbers+BikeStatus.alarmNumbers),
                    name: '故障'
                }, {
                    value: BikeStatus.notUseNumbers,
                    name: '可用'
                },
                    {
                        value: (BikeStatus.ridingNumbers+BikeStatus.reserveNumbers),
                        name: '在用'
                    }
                    //{value:1548, name:'在用'}
                ]
                //data:$.grep(resp.data,function(e,i){return i<=2})
            }, {
                color: ['#cecece','#dad7d7','#ffc300', '#c9d952', '#e1ef7b'],
                label: {
                    normal: {
                        position: 'outside',
                        textStyle: {
                            color: '#444',
                            fontFamily:'Microsoft YaHei',
                            fontSize:'12'
                        },
                        formatter: "{b}\n{d}%"
                    }
                },
                legendHoverLink: false,
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: '#444'
                        }
                    }
                },
                name: '车辆状态',
                type: 'pie',
                //minAngle:30,
                radius: ['40%', '55%'],
                //data:$.grep(resp.data,function(e,i){return i>2&&i<=Dlength})
                data: [{
                    value: BikeStatus.alarmNumbers,
                    name: '离线',
                    itemStyle: {
                        color: '#fff'
                    }
                }, {
                    value: BikeStatus.damagedNumbers,
                    name: '损坏',
                    itemStyle: {
                        color: '#fff'
                    }
                }, {
                    value: BikeStatus.notUseNumbers,
                    name: '可用'
                },
                    {
                        value: BikeStatus.ridingNumbers,
                        name: '骑行中'
                    },
                    {
                        value: BikeStatus.reserveNumbers,
                        name: '预约中'
                    }]
            }]
        };
        _obj.pieChart.setOption(option);
    },
    drawcharts_I: function() {
        _obj = this;
        $.ajax({
            url: _defautBiz.api("statusstatistic"),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var BikeStatus = resp.data.BikeStatusStatistic;
                _obj.initPieChart(BikeStatus)
            }
        });
    },
    drawcharts_II: function() {
        _obj = this;
        $.ajax({
            url: _defautBiz.api("statisticminute")+"&lastTimestamp="+_obj.lastTimestamp_useIndx_m,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if(_obj.lastTimestamp_useIndx_m==""){
                    _obj.useIndx_m_data=resp.data.BikeStatisticStatusPerMinute;
                }
                else{
                    if(resp.data.BikeStatisticStatusPerMinute.length>0) {
                            if(_obj.useIndx_m_data.length>1440)_obj.useIndx_m_data.shift();
                            _obj.useIndx_m_data.push(resp.data.BikeStatisticStatusPerMinute[0]);
                    }
                }
                if(resp.data.BikeStatisticStatusPerMinute.length>0)_obj.lastTimestamp_useIndx_m=resp.data.BikeStatisticStatusPerMinute[resp.data.BikeStatisticStatusPerMinute.length-1].endtime;
                else{
                    _obj.lastTimestamp_useIndx_m="";
                    _obj.useIndx_m_data=[{"id":null,"endtime":0000000000000,"starttime":0000000000000,"cityId":null,"notUseNumbers":0,"damageNumbers":0,"useNumbers":0,"createTime":null}];
                }
                //var nameList=resp.data.map(function(e,i){return e.name});
                //var BikeStatisticStatus = resp.data.BikeStatisticStatusPerMinute;
                _obj.mulLineChart = echarts.init(document.getElementById('main1'));
                option2 = {
                    backgroundColor: '#fff',
                    //color: ['#ffe17f', '#e4eca8', '#dad7d7'],
                    color: ['#dad7d7', '#e4eca8', '#ffe17f'],
                    animation: false,
                    title: {
                        text: ''
                    },

                    tooltip: {
                        trigger: 'axis',
                        backgroundColor:'#fff',
                        borderColor:'#000',
                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                        textStyle:{
                            color:'#999'
                        }
                    },
                    legend:[
                        {
                            show: true,
                            textStyle:{
                                fontFamily:'Microsoft YaHei',
                                fontSize:'12'
                            },
                            //data: ['故障', '可用', '离线', '预约中', '骑行中'],
                            data:[{
                                name: '在用车辆',

                                icon: 'circle'
                            },
                                {
                                    name: '可用车辆',

                                    icon: 'circle'
                                },
                                {
                                    name: '故障(损坏+离线)',

                                    icon: 'circle'
                                }],
                            bottom: 35
                        }
                    ],
                    grid: {
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        nameTextStyle:{
                        fontFamily:'Microsoft YaHei',
                        fontSize:'12'
                        },
                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                        data: _obj.useIndx_m_data.map(function(e, i) {
                            return new Date(e.endtime).format("hh:mm")
                        })
                    }],
                    yAxis: [{
                        name: '(辆)',
                        type: 'value'
                    }],
                    dataZoom: [{
                        id: 'dataZoomX',
                        start:92,
                        type: 'slider',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                    }],
                    series: [ {
                        name: '故障(损坏+离线)',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {}
                        },
                        //data: [150, 232, 201, 154, 190, 330, 410]
                        data: _obj.useIndx_m_data.map(function(e, i) {
                            return e.damageNumbers
                        })
                    },
                        {
                            name: '在用车辆',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {
                                normal: {}
                            },
                            //data: [220, 182, 191, 234, 290, 330, 310]
                            data: _obj.useIndx_m_data.map(function(e, i) {
                                return e.useNumbers
                            })
                        },
                        {
                            name: '可用车辆',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {
                                normal: {}
                            },
                            //data: [120, 132, 101, 134, 90, 230, 210]
                            data: _obj.useIndx_m_data.map(function(e, i) {
                                return e.notUseNumbers
                            })
                        }
                    ]
                };
                _obj.mulLineChart.setOption(option2);
            }
        });
    },
    drawcharts_III: function() {
        _obj = this;
        $.ajax({
            url: _defautBiz.api("statistic_income_minute")+"&lastTimestamp="+_obj.lastTimestamp_income_m,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if(_obj.lastTimestamp_income_m==""){
                    _obj.income_m_data=resp.data.BikeStatisticIncomePerMinute;
                }
                else{
                    if(resp.data.BikeStatisticIncomePerMinute.length>0) {
                        if(_obj.income_m_data.length>1440)_obj.income_m_data.shift();
                        _obj.income_m_data.push(resp.data.BikeStatisticIncomePerMinute[0]);
                    }
                }
                if(resp.data.BikeStatisticIncomePerMinute.length>0)_obj.lastTimestamp_income_m=resp.data.BikeStatisticIncomePerMinute[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                else{
                    _obj.lastTimestamp_income_m="";
                    _obj.income_m_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                }
                //var nameList=resp.data.map(function(e,i){return e.name});
                //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerMinute;
                _obj.lineChart = echarts.init(document.getElementById('main3'));

                option3 = {
                    backgroundColor: '#fff',
                    title: {
                        text: ''
                    },
                    animation: false,
                    color: ['#f0b86a'],
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor:'#fff',
                        borderColor:'#000',
                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                        textStyle:{
                            color:'#999'
                        },
                        formatter: function(params) {
                            params = params[0];
                            //var date = new Date(params.name);
                            //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            if(params.value)
                            return params.name + '<br/>收益:'+params.value[1].toLocaleString()+"(元)";
                            else
                             return params.name + '<br/>收益:'+"0(元)";
                            //return params.name!=""?params.value[1]:"sb"+ '<br/>收益:' + params.name!=undefined?params.value[1].toLocaleString()+"(元)":"0(元)";
                        },
                        axisPointer: {
                            animation: true
                        }
                    },

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                        data: _obj.income_m_data.map(function(e, i) {
                            return new Date(e.endtime).format("hh:mm");
                        })
                    },
                    yAxis: {
                        type: 'value',
                        name:'(元)',
                        splitNumber:3
                        //boundaryGap: [0, '100%'],
                        //splitLine: {
                        //    show: false
                        //}
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
                    dataZoom: [{
                        id: 'dataZoomX',
                        start:92,
                        type: 'slider',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                    }],
                    series: [{
                        name: '收益',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        //data: this.mock_data
                        areaStyle: {
                            normal: {
                                color: '#ffe9ca',
                            }
                        },
                        data: _obj.income_m_data.map(function(e, i) {
                            return {
                                name: new Date(e.endtime).format("yyyy.MM.dd hh:mm"),
                                value: [
                                    new Date(e.endtime).format("hh:mm"),
                                    (e.income / 100).toFixed(2)
                                ]
                            }
                        })
                    }]
                };
                _obj.lineChart.setOption(option3);
            }
        });
    },
    dataUpdate: function() {
        var now = this.mock_now;
        var oneDay = 24 * 3600 * 1000;
        var value = Math.random() * 1000;
        _obj = this;
        //车辆状态占比
        $.ajax({
            url: _defautBiz.api("statusstatistic"),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var BikeStatus = resp.data.BikeStatusStatistic;
                _obj.initPieChart(BikeStatus)
            }
        });
        //车辆使用率
        switch (_obj.user_flag) {
            case "h":
                $.ajax({
                    url: _defautBiz.api("statistichour")+"&lastTimestamp="+_obj.lastTimestamp_useIndx_h,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(_obj.lastTimestamp_useIndx_h==""){
                            _obj.useIndx_h_data=resp.data.BikeStatisticStatusPerHour;
                        }
                        else{
                            if(resp.data.BikeStatisticStatusPerHour.length>0) {
                                    if(_obj.useIndx_h_data.length>720)_obj.useIndx_h_data.shift();
                                    _obj.useIndx_h_data.push(resp.data.BikeStatisticStatusPerHour[0]);
                            }
                        }
                        if(resp.data.BikeStatisticStatusPerHour.length>0) {
                            _obj.lastTimestamp_useIndx_h=resp.data.BikeStatisticStatusPerHour[resp.data.BikeStatisticStatusPerHour.length-1].endtime;
                        }
                        else{
                            _obj.lastTimestamp_useIndx_h="";
                            _obj.useIndx_h_data=[{"id":null,"endtime":0000000000000,"starttime":0000000000000,"cityId":null,"notUseNumbers":0,"damageNumbers":0,"useNumbers":0,"createTime":null}];
                        }
                        //var BikeStatisticStatus = resp.data.BikeStatisticStatusPerHour;
                        _obj.mulLineChart.setOption({
                            xAxis: [{
                                type: 'category',
                                boundaryGap: false,
                                //data: [ '2011.06', '2011.07','2011.08', '2011.09', '2011.10', '2011.11', '2011.12']
                                data: _obj.useIndx_h_data.map(function(e, i) {
                                    return new Date(e.endtime).format("MM.dd hh:mm");
                                })
                                //data: getRDList()
                            }],
                            yAxis: [{
                                name: '(辆)',
                                type: 'value'
                            }],
                            series: [{
                                name: '可用车辆',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [120, 132, 101, 134, 90, 230, 210]
                                data: _obj.useIndx_h_data.map(function(e, i) {
                                    return e.notUseNumbers
                                })
                            }, {
                                name: '在用车辆',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [220, 182, 191, 234, 290, 330, 310]
                                data: _obj.useIndx_h_data.map(function(e, i) {
                                    return e.useNumbers
                                })
                            }, {
                                name: '故障(损坏+离线)',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [150, 232, 201, 154, 190, 330, 410]
                                data: _obj.useIndx_h_data.map(function(e, i) {
                                    return e.damageNumbers
                                })
                            }]
                        });
                    }
                });
                break;
            case "c":
                $.ajax({
                    url: _defautBiz.api("statisticminute")+"&lastTimestamp="+_obj.lastTimestamp_useIndx_m,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(_obj.lastTimestamp_useIndx_m==""){
                            _obj.useIndx_m_data=resp.data.BikeStatisticStatusPerMinute;
                        }
                        else{
                            if(resp.data.BikeStatisticStatusPerMinute.length>0) {
                                    if(_obj.useIndx_m_data.length>1440)_obj.useIndx_m_data.shift();
                                    _obj.useIndx_m_data.push(resp.data.BikeStatisticStatusPerMinute[0]);
                            }
                        }
                        if(resp.data.BikeStatisticStatusPerMinute.length>0){
                            _obj.lastTimestamp_useIndx_m=resp.data.BikeStatisticStatusPerMinute[resp.data.BikeStatisticStatusPerMinute.length-1].endtime;
                        }
                        //var BikeStatisticStatus = resp.data.BikeStatisticStatusPerMinute;
                        else{
                            _obj.lastTimestamp_useIndx_m="";
                            _obj.useIndx_m_data=[{"id":null,"endtime":0000000000000,"starttime":0000000000000,"cityId":null,"notUseNumbers":0,"damageNumbers":0,"useNumbers":0,"createTime":null}];
                        }
                        _obj.mulLineChart.setOption({
                            xAxis: [{
                                type: 'category',
                                boundaryGap: false,
                                //data: [ '2011.06', '2011.07','2011.08', '2011.09', '2011.10', '2011.11', '2011.12']
                                data: _obj.useIndx_m_data.map(function(e, i) {
                                    return new Date(e.endtime).format("hh:mm");
                                })
                                //data: getRDList()
                            }],
                            yAxis: [{
                                name: '(辆)',
                                type: 'value'
                            }],
                            series: [{
                                name: '可用车辆',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [120, 132, 101, 134, 90, 230, 210]
                                data: _obj.useIndx_m_data.map(function(e, i) {
                                    return e.notUseNumbers
                                })
                            }, {
                                name: '在用车辆',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [220, 182, 191, 234, 290, 330, 310]
                                data: _obj.useIndx_m_data.map(function(e, i) {
                                    return e.useNumbers
                                })
                            }, {
                                name: '故障(损坏+离线)',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {}
                                },
                                //data: [150, 232, 201, 154, 190, 330, 410]
                                data: _obj.useIndx_m_data.map(function(e, i) {
                                    return e.damageNumbers
                                })
                            }]
                        });
                    }
                });
                break;
        }
        //收益趋势
        switch (_obj.income_flag) {
            case "td":
                $.ajax({
                    url: _defautBiz.api("statistic_income_oneday")+"&lastTimestamp="+_obj.lastTimestamp_income_td,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(_obj.lastTimestamp_income_td==""){
                            _obj.income_td_data=resp.data.bikeStatisticIncomeOneday;
                        }
                        else{
                            if(resp.data.bikeStatisticIncomeOneday.length>0) {
                                if(_obj.income_td_data.length>1440)_obj.income_td_data.shift();
                                _obj.income_td_data.push(resp.data.bikeStatisticIncomeOneday[0]);
                            }
                        }
                        if(resp.data.bikeStatisticIncomeOneday.length>0)_obj.lastTimestamp_income_td=resp.data.bikeStatisticIncomeOneday[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                        else{
                            _obj.lastTimestamp_income_td="";
                            _obj.income_td_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                        }
                        //var BikeStatisticStatus = resp.data.bikeStatisticIncomeOneday;
                        //_obj.lineChart = echarts.init(document.getElementById('main3'));


                        option3 = {
                            //animation: false,
                            //backgroundColor: '#fff',
                            //title: {
                            //    text: ''
                            //},
                            //color: ['#f0b86a'],
                            //tooltip: {
                            //    backgroundColor:'#fff',
                            //    borderColor:'#000',
                            //    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            //    textStyle:{
                            //        color:'#999'
                            //    },
                            //    trigger: 'axis',
                            //    formatter: function(params) {
                            //        params = params[0];
                            //        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //        //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            //        return params.name + '<br/>收益:' + params.value[1].toLocaleString()+"(元)";
                            //    },
                            //    axisPointer: {
                            //        animation: true
                            //    }
                            //},

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                data: _obj.income_td_data.map(function(e, i) {
                                    return new Date(e.endtime).format("yy.MM.dd");
                                })
                            },
                            yAxis: {
                                type: 'value',
                                name:'(元)',
                                splitNumber:3
                                //boundaryGap: [0, '100%'],
                                //splitLine: {
                                //    show: false
                                //}
                            },
                            //grid: {
                            //    left: '3%',
                            //    right: '4%',
                            //    containLabel: true
                            //},
                            //dataZoom: [{
                            //    id: 'dataZoomX',
                            //    type: 'slider',
                            //    xAxisIndex: [0],
                            //    filterMode: 'filter',
                            //    start:92,
                            //}],
                            series: [{
                                name: '模拟数据',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                areaStyle: {
                                    normal: {
                                        color: '#ffe9ca',
                                    }
                                },
                                data: _obj.income_td_data.map(function(e, i) {
                                    return {
                                        name: new Date(e.endtime).format("yy.MM.dd"),
                                        value: [
                                            new Date(e.endtime).format("yy.MM.dd"),
                                            //e.income
                                            (e.income / 100).toFixed(2)
                                        ]
                                    }
                                })
                            }]
                        };
                        _obj.lineChart.setOption(option3);
                    }
                })
                break;
            case "th":
                $.ajax({
                    url: _defautBiz.api("statistic_income_onehour")+"&lastTimestamp="+_obj.lastTimestamp_income_th,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(_obj.lastTimestamp_income_th==""){
                            _obj.income_th_data=resp.data.bikeStatisticIncomeOneday;
                        }
                        else{
                            if(resp.data.bikeStatisticIncomeOneday.length>0) {
                                if(_obj.income_th_data.length>1440)_obj.income_th_data.shift();
                                _obj.income_th_data.push(resp.data.bikeStatisticIncomeOneday[0]);
                            }
                        }
                        if(resp.data.bikeStatisticIncomeOneday.length>0)_obj.lastTimestamp_income_th=resp.data.bikeStatisticIncomeOneday[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                        else{
                            _obj.lastTimestamp_income_th="";
                            _obj.income_th_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                        }
                        //var BikeStatisticStatus = resp.data.bikeStatisticIncomeOneday;
                        //_obj.lineChart = echarts.init(document.getElementById('main3'));


                        option3 = {
                            //animation: false,
                            //backgroundColor: '#fff',
                            //title: {
                            //    text: ''
                            //},
                            //color: ['#f0b86a'],
                            //tooltip: {
                            //    backgroundColor:'#fff',
                            //    borderColor:'#000',
                            //    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            //    textStyle:{
                            //        color:'#999'
                            //    },
                            //    trigger: 'axis',
                            //    formatter: function(params) {
                            //        params = params[0];
                            //        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //        //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            //        return params.name + '<br/>收益:' + params.value[1].toLocaleString()+"(元)";
                            //    },
                            //    axisPointer: {
                            //        animation: true
                            //    }
                            //},

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                data: _obj.income_th_data.map(function(e, i) {
                                    return new Date(e.endtime).format("hh:mm");
                                })
                            },
                            yAxis: {
                                type: 'value',
                                name:'(元)',
                                splitNumber:3
                                //boundaryGap: [0, '100%'],
                                //splitLine: {
                                //    show: false
                                //}
                            },
                            //grid: {
                            //    left: '3%',
                            //    right: '4%',
                            //    containLabel: true
                            //},
                            //dataZoom: [{
                            //    id: 'dataZoomX',
                            //    type: 'slider',
                            //    xAxisIndex: [0],
                            //    filterMode: 'filter',
                            //    start:92,
                            //}],
                            series: [{
                                name: '模拟数据',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                areaStyle: {
                                    normal: {
                                        color: '#ffe9ca',
                                    }
                                },
                                data: _obj.income_th_data.map(function(e, i) {
                                    return {
                                        name: new Date(e.endtime).format("hh:mm"),
                                        value: [
                                            new Date(e.endtime).format("hh:mm"),
                                            //e.income
                                            (e.income / 100).toFixed(2)
                                        ]
                                    }
                                })
                            }]
                        };
                        _obj.lineChart.setOption(option3);
                    }
                })
                break;
            case "c":
                $.ajax({
                    url: _defautBiz.api("statistic_income_minute")+"&lastTimestamp="+_obj.lastTimestamp_income_m,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        if(_obj.lastTimestamp_income_m==""){
                            _obj.income_m_data=resp.data.BikeStatisticIncomePerMinute;
                        }
                        else{
                            if(resp.data.BikeStatisticIncomePerMinute.length>0) {
                                if(_obj.income_m_data.length>1440)_obj.income_m_data.shift();
                                _obj.income_m_data.push(resp.data.BikeStatisticIncomePerMinute[0]);
                            }
                        }
                        if(resp.data.BikeStatisticIncomePerMinute.length>0)_obj.lastTimestamp_income_m=resp.data.BikeStatisticIncomePerMinute[resp.data.BikeStatisticIncomePerMinute.length-1].endtime;
                        else{
                            _obj.lastTimestamp_income_m="";
                            _obj.income_m_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                        }
                        //var BikeStatisticStatus = resp.data.BikeStatisticIncomePerMinute;
                        //_obj.lineChart = echarts.init(document.getElementById('main3'));


                        option3 = {
                            //animation: false,
                            //backgroundColor: '#fff',
                            //title: {
                            //    text: ''
                            //},
                            //color: ['#f0b86a'],
                            //tooltip: {
                            //    backgroundColor:'#fff',
                            //    borderColor:'#000',
                            //    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            //    textStyle:{
                            //        color:'#999'
                            //    },
                            //    trigger: 'axis',
                            //    formatter: function(params) {
                            //        params = params[0];
                            //        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //        //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            //        return params.name + '<br/>收益:' + params.value[1].toLocaleString()+"(元)";
                            //    },
                            //    axisPointer: {
                            //        animation: true
                            //    }
                            //},

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                data: _obj.income_m_data.map(function(e, i) {
                                    return new Date(e.endtime).format("hh:mm");
                                })
                            },
                            yAxis: {
                                type: 'value',
                                name:'(元)',
                                splitNumber:3
                                //boundaryGap: [0, '100%'],
                                //splitLine: {
                                //    show: false
                                //}
                            },
                            //grid: {
                            //    left: '3%',
                            //    right: '4%',
                            //    containLabel: true
                            //},
                            //dataZoom: [{
                            //    id: 'dataZoomX',
                            //    type: 'slider',
                            //    xAxisIndex: [0],
                            //    filterMode: 'filter',
                            //    start:92,
                            //}],
                            series: [{
                                name: '模拟数据',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                areaStyle: {
                                    normal: {
                                        color: '#ffe9ca',
                                    }
                                },
                                data: _obj.income_m_data.map(function(e, i) {
                                    return {
                                        name: new Date(e.endtime).format("hh:mm"),
                                        value: [
                                            new Date(e.endtime).format("hh:mm"),
                                            //e.income
                                            (e.income / 100).toFixed(2)
                                        ]
                                    }
                                })
                            }]
                        };
                        _obj.lineChart.setOption(option3);
                    }
                })
                break;
            case "h":
                $.ajax({
                    url: _defautBiz.api("statistic_income_hour")+"&lastTimestamp="+_obj.lastTimestamp_income_h,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        var BikeStatisticStatus = resp.data.BikeStatisticIncomePerHour;
                        //_obj.lineChart = echarts.init(document.getElementById('main3'));
                        if(_obj.lastTimestamp_income_h==""){
                            _obj.income_h_data=resp.data.BikeStatisticIncomePerHour;
                        }
                        else{
                            if(resp.data.BikeStatisticIncomePerHour.length>0) {
                                    if(_obj.income_h_data.length>720)_obj.income_h_data.shift();
                                    _obj.income_h_data.push(resp.data.BikeStatisticIncomePerHour[0]);
                            }
                        }
                        if(resp.data.BikeStatisticIncomePerHour.length>0)_obj.lastTimestamp_income_h=resp.data.BikeStatisticIncomePerHour[resp.data.BikeStatisticIncomePerHour.length-1].endtime;
                        else{
                            _obj.lastTimestamp_income_h="";
                            _obj.income_h_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                        }
                        option3 = {
                            //backgroundColor: '#fff',
                            //title: {
                            //    text: ''
                            //},
                            //animation: false,
                            //color: ['#f0b86a'],
                            //tooltip: {
                            //    backgroundColor:'#fff',
                            //    borderColor:'#000',
                            //    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            //    textStyle:{
                            //        color:'#999'
                            //    },
                            //    trigger: 'axis',
                            //    formatter: function(params) {
                            //        params = params[0];
                            //        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //        //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            //        return params.name + '<br/>收益:' + params.value[1].toLocaleString()+"(元)";
                            //    },
                            //    axisPointer: {
                            //        animation: true
                            //    }
                            //},

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                data: _obj.income_h_data.map(function(e, i) {
                                    return new Date(e.endtime).format("MM.dd hh:mm");
                                })
                            },
                            yAxis: {
                                type: 'value',
                                name:'(元)',
                                splitNumber:3
                                //boundaryGap: [0, '100%'],
                                //splitLine: {
                                //    show: false
                                //}
                            },
                            //grid: {
                            //    left: '3%',
                            //    right: '4%',
                            //    containLabel: true
                            //},
                            //dataZoom: [{
                            //    id: 'dataZoomX',
                            //    start:77,
                            //    type: 'slider',
                            //    xAxisIndex: [0],
                            //    filterMode: 'filter',
                            //}],
                            series: [{
                                name: '模拟数据',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                areaStyle: {
                                    normal: {
                                        color: '#ffe9ca',
                                    }
                                },
                                data: _obj.income_h_data.map(function(e, i) {
                                    return {
                                        name: new Date(e.endtime).format("MM.dd hh:mm"),
                                        value: [
                                            new Date(e.endtime).format("MM.dd hh:mm"),
                                            //e.income
                                            (e.income / 100).toFixed(2)
                                        ]
                                    }
                                })
                            }]
                        };
                        _obj.lineChart.setOption(option3);
                    }
                })
                break;
            case "d":
                $.ajax({
                    url: _defautBiz.api("statistic_income_day")+"&lastTimestamp="+_obj.lastTimestamp_income_d,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        var BikeStatisticStatus = resp.data.BikeStatisticIncomePerDay;
                        //_obj.lineChart = echarts.init(document.getElementById('main3'));
                        if(_obj.lastTimestamp_income_d==""){
                            _obj.income_d_data=resp.data.BikeStatisticIncomePerDay;
                        }
                        else{
                            if(resp.data.BikeStatisticIncomePerDay.length>0) {
                                if(_obj.income_d_data.length>720)_obj.income_d_data.shift();
                                _obj.income_d_data.push(resp.data.BikeStatisticIncomePerDay[0]);
                            }
                        }
                        if(resp.data.BikeStatisticIncomePerDay.length>0)_obj.lastTimestamp_income_d=resp.data.BikeStatisticIncomePerDay[resp.data.BikeStatisticIncomePerDay.length-1].endtime;
                        else{
                            _obj.lastTimestamp_income_d="";
                            _obj.income_d_data=[{"id":null,"income":0,"endtime":0000000000000,"starttime":0000000000000,"cityId":310100,"createTime":null}];
                        }
                        option3 = {
                            //backgroundColor: '#fff',
                            //title: {
                            //    text: ''
                            //},
                            //animation: false,
                            //color: ['#f0b86a'],
                            //tooltip: {
                            //    backgroundColor:'#fff',
                            //    borderColor:'#000',
                            //    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            //    textStyle:{
                            //        color:'#999'
                            //    },
                            //    trigger: 'axis',
                            //    formatter: function(params) {
                            //        params = params[0];
                            //        //var date = new Date(params.name).format("yyyy.MM.dd hh:mm");
                            //        //return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' : ' + params.value[1];
                            //        return params.name + '<br/>收益:' + params.value[1].toLocaleString()+"(元)";
                            //    },
                            //    axisPointer: {
                            //        animation: true
                            //    }
                            //},

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                //data: ['10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16']
                                data: _obj.income_d_data.map(function(e, i) {
                                    return new Date(e.endtime).format("yy.MM.dd");
                                })
                            },
                            yAxis: {
                                type: 'value',
                                name:'(元)',
                                splitNumber:3
                                //boundaryGap: [0, '100%'],
                                //splitLine: {
                                //    show: false
                                //}
                            },
                            //grid: {
                            //    left: '3%',
                            //    right: '4%',
                            //    containLabel: true
                            //},
                            //dataZoom: [{
                            //    id: 'dataZoomX',
                            //    start:77,
                            //    type: 'slider',
                            //    xAxisIndex: [0],
                            //    filterMode: 'filter',
                            //}],
                            series: [{
                                name: '模拟数据',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                areaStyle: {
                                    normal: {
                                        color: '#ffe9ca',
                                    }
                                },
                                data: _obj.income_d_data.map(function(e, i) {
                                    return {
                                        name: new Date(e.endtime).format("yy.MM.dd"),
                                        value: [
                                            new Date(e.endtime).format("yy.MM.dd"),
                                            //e.income
                                            (e.income / 100).toFixed(2)
                                        ]
                                    }
                                })
                            }]
                        };
                        _obj.lineChart.setOption(option3);
                    }
                })
                break;
        }

    },
    MapSearching:function(bid){
        $("#search_rslt").modal('hide');
        $("#wrapper").scrollTop(0, 0);
        _obj=this;
        $("#bike_result").hide();
        _obj.map.remove(_obj.zoomMass);
        $.ajax({
            url: bid?_defautBiz.api("getBikeById")+"?bid="+bid:_defautBiz.api("getBikeById")+"?bid="+ $("#search-panel").val(),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if(resp.success){
                    if(resp.data.BikeBasicDetailRight!=undefined){
                        $("#s_info").text("车辆被隐藏,如需查询,请设置为显示");
                        $("#search_rslt").modal('show');
                        return;
                    }
                    var lnglat=_obj.geo_type==1?[resp.data.lng,resp.data.lat]:resp.data.posCurr;
                    if(lnglat&&lnglat[0]!=null) {
                        _obj.searching_lng = _obj.geo_type == 1 ? resp.data.lng : resp.data.posCurr[0];
                        _obj.searching_lat = _obj.geo_type == 1 ? resp.data.lat : resp.data.posCurr[1];
                        _obj.zoomPre = _obj.map_zoom;
                        _obj.map_zoom = _obj.map.getZoom();
                        _obj.zoomCur = _obj.map_zoom;
                        _obj.map_lat = _obj.searching_lat;
                        _obj.map_lng = _obj.searching_lng;
                        _obj.mapPointsUpdate();
                        _obj.map.setZoomAndCenter(15, lnglat);
                        var img_url = (function (status) {
                            switch (parseInt(status)) {
                                case 1:
                                    return '/static/qbike/img/in_date_Max.png';
                                    break;
                                case 2:
                                    return '/static/qbike/img/enable_Max.png';
                                    break;
                                case 3:
                                    return '/static/qbike/img/in_use_Max.png';
                                    break;
                                case 4:
                                    return '/static/qbike/img/in_trouble_Max.png';
                                    break;
                                case 5:
                                    return '/static/qbike/img/in_trouble_Max.png';
                                    break;
                                default:
                                    return '/static/qbike/img/enable_Max.png';
                            }
                        })(resp.data.bikeStatus)
                        _obj.zoomMass = new AMap.MassMarks([
                            {
                                "lnglat": lnglat,
                                "name": resp.data.bid
                            }
                        ], {
                            url: img_url,
                            anchor: new AMap.Pixel(31, 55),
                            size: new AMap.Size(62, 65),
                            opacity: 1,
                            cursor: 'pointer',
                            zIndex: 6
                        });
                        _obj.zoomMass.Bikestatus = localStorage.bike_status;
                        //console.log(_obj.zoomMass.Bikestatus+"alpha");
                        setTimeout(function () {
                            _obj.zoomMass.setMap(_obj.map);
                        }, 500)

                        $("#map_panel").addClass("fullpage");
                        $("#mapDiv").addClass("fullpage");
                        $("#wrapper").addClass("fullpage");
                        $(".amap-toolbar").css("top","150px")
                        $(".map-ctrl-zoomIn").hide();
                        $(".map-ctrl-zoomOut").show();
                        $(".amap-sug-result").addClass("totop");
                        $("#bike_id").text(resp.data.bid);
                        $("#dt_href").attr("href","javascript:go_Alert("+resp.data.bid+")");
                        localStorage.bike_id = resp.data.bid;
                        $.ajax({
                            url: _defautBiz.api("bikeDetail")+"&bikeNumber="+resp.data.bid ,
                            dataType: "json",
                            method: 'get',
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                                //xhr.setRequestHeader("User-Agent", "headertest");
                            },
                            success: function(resp) {
                                    localStorage.bikeDetailRight = resp.data.right;
                                    _obj.geocoder.getAddress(lnglat, function (status, result) {
                                        if (status === 'complete' && result.info === 'OK') {
                                            localStorage.bike_loc = result.regeocode.formattedAddress
                                            localStorage.bike_time = resp.data.BikeBasicDetail.times;
                                            localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
                                            localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
                                            localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
                                            localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
                                            localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                            localStorage.bike_status = resp.data.BikeBasicDetail.status;
                                            localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
                                            localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power ? resp.data.BikeBasicDetail.bikeEsDto.power : "";
                                            localStorage.locType = (resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 0 ? "(基站定位)" : "(GPS定位)");
                                            if (resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 3)localStorage.locType = "(APP定位)";
                                            $("#bike_power").removeClass("red");
                                            $("#bike_power").text(charegeState(localStorage.bike_power) + "%");
                                            if (Math.abs(parseInt(localStorage.bike_power)) < 20)$("#bike_power").addClass("red");
                                            if (_obj.geo_type == 1) {
                                                $("#bike_loc").text(localStorage.bike_loc + "附近");
                                                $("#loc_type").text("GPS");
                                            }
                                            else {
                                                $("#bike_loc").text(localStorage.bike_loc + "附近");
                                                $("#loc_type").text(resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 0 ? "基站" : "GPS");
                                                if (resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 3)$("#loc_type").text("APP");
                                            }
                                            $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                            $("#loc_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeCurr ?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss") : "-");
                                            var fixTime=resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-";
                                            _obj.geo_type == 1 ? $("#fix_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss")):$("#fix_time").text(fixTime);
                                            $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                            $("#bike_duration").text(Math.round(parseInt(resp.data.BikeBasicDetail.duration) / 60).toLocaleString());
                                            $("#bike_distance").text(Math.round(parseInt(resp.data.BikeBasicDetail.distance) / 1000).toLocaleString());
                                            $("#bike_result").show();
                                        }
                                        else {
                                            localStorage.bike_loc = "未知"
                                            localStorage.bike_time = resp.data.BikeBasicDetail.times;
                                            localStorage.bike_duration = resp.data.BikeBasicDetail.duration;
                                            localStorage.bike_distance = resp.data.BikeBasicDetail.distance;
                                            localStorage.bike_useDate = resp.data.BikeBasicDetail.useDate;
                                            localStorage.bike_useLoc = resp.data.BikeBasicDetail.location;
                                            localStorage.bike_lastMaintainDate = resp.data.BikeBasicDetail.lastMaintainDate;
                                            localStorage.bike_status = resp.data.BikeBasicDetail.status;
                                            localStorage.bike_faultType = resp.data.BikeBasicDetail.faultType;
                                            localStorage.bike_power = resp.data.BikeBasicDetail.bikeEsDto.power ? resp.data.BikeBasicDetail.bikeEsDto.power : "";
                                            localStorage.locType = (resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 0 ? "(基站定位)" : "(GPS定位)");
                                            if (resp.data.BikeBasicDetail.bikeEsDto.locType % 100 == 3)localStorage.locType = "(APP定位)";
                                            $("#bike_power").removeClass("red");
                                            $("#bike_power").text(charegeState(localStorage.bike_power) + "%");
                                            if (Math.abs(parseInt(localStorage.bike_power)) < 20)$("#bike_power").addClass("red");
                                            $("#bike_loc").text(localStorage.bike_loc);
                                            $("#lock_id").text(resp.data.BikeBasicDetail.bikeEsDto.lockNumber);
                                            $("#loc_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeCurr ?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss") : "-");
                                            var fixTime=resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-";
                                            _obj.geo_type == 1 ? $("#fix_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss")):$("#fix_time").text(fixTime);
                                            $("#bike_time").text(resp.data.BikeBasicDetail.times);
                                            $("#bike_duration").text(Math.round(parseInt(resp.data.BikeBasicDetail.duration) / 60).toLocaleString());
                                            $("#bike_distance").text(Math.round(parseInt(resp.data.BikeBasicDetail.distance) / 1000).toLocaleString());
                                            $("#bike_result").show();
                                        }
                                    });
                            }
                        });
                    }
                    else{
                        $("#s_info").text("该车辆属于新投放车辆或在该定位方式下,暂无位置上报!");
                        $("#search_rslt").modal('show');
                    }
                    //superise_obj.refreshData();
                }
                else{
                    $("#s_info").text(resp.message?resp.message:"无搜索结果噢");
                    $("#search_rslt").modal('show');
                }
            }})
    },
    drawMap: function() {
        // $("#searching").on("click", function() {
        //     $("#bike_result").show();
        //     localStorage.cardId=$('#search-panel').val();
        //
        // })
        _obj = this;
        var map = _obj.map = new AMap.Map('mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 4,
            center: [102.342785, 35.312316]
        });
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
                            _obj.paginationUpdate(_obj.list_currPage);
                        }
                        else{
                            _obj.cur_city="全国";
                            _obj.cur_district="";
                            _obj.paginationUpdate(_obj.list_currPage);
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
                            _obj.paginationUpdate(_obj.list_currPage);
                        }
                        else{
                            _obj.cur_city="全国";
                            _obj.cur_district="";
                            _obj.paginationUpdate(_obj.list_currPage);
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
                $(".filter-bk").on("click",function(){
                    _obj.list_currPage=1;
                    _obj.history_currPage=0;
                    $("#cur_page").text("1");
                    $("#detail_previous a").attr("data-dt-idx",0);
                    $("#detail_next a").attr("data-dt-idx",2);
                    //var type=typeStr?typeStr:"&type=1,2,3,4"
                    $("#bike_result").hide();
                    _obj.map.remove(_obj.zoomMass);
                    switch ($(this).attr("id")) {
                        case 'M_inu':
                            _obj.typeList[2].type=!_obj.typeList[2].type;
                            if($(this).hasClass("darkness")){
                                $(this).removeClass("darkness");
                                _obj.map.add(_obj.iu_Mass);
                            }
                            else {
                                $(this).addClass("darkness");
                                _obj.map.remove(_obj.iu_Mass);
                            }
                            break;
                        case 'M_u':
                            _obj.typeList[1].type=!_obj.typeList[1].type;
                            if($(this).hasClass("darkness")){
                                $(this).removeClass("darkness");
                                _obj.map.add(_obj.mapMass);
                            }
                            else {
                                $(this).addClass("darkness");
                                _obj.map.remove(_obj.mapMass);
                            }
                            break;
                        case 'M_p':
                            _obj.typeList[0].type=!_obj.typeList[0].type;
                            if($(this).hasClass("darkness")){
                                $(this).removeClass("darkness");
                                _obj.map.add(_obj.ip_Mass);
                            }
                            else {
                                $(this).addClass("darkness");
                                _obj.map.remove(_obj.ip_Mass);
                            }
                            break;
                        case 'M_t':
                            _obj.typeList[3].type=!_obj.typeList[3].type;
                            if($(this).hasClass("darkness")){
                                $(this).removeClass("darkness");
                                _obj.map.add(_obj.it_Mass);
                            }
                            else {
                                $(this).addClass("darkness");
                                _obj.map.remove(_obj.it_Mass);
                            }
                            break;
                    }
                    var strList=[];
                    for(var i in _obj.typeList){
                        if(_obj.typeList[i].type)strList.push(parseInt(i)+1);
                    }
                    var typeParam=_obj.typeParam="&type="+strList.join(",");
                    _obj.paginationUpdate(_obj.list_currPage);
                    //var typestr=(""+_obj.typeList[0]?1:""+_obj.typeList[0]?2:""+_obj.typeList[0]?3:""+_obj.typeList[0]?4:"");
                });
                $("#searching").on("click", function() {
                    localStorage.cardId=$('#search-panel').val();
                    if (click_able) {
                        $("#bike_result").hide();
                        _obj.map.remove(_obj.zoomMass);
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
                                //superise_obj.refreshData();
                                map.setZoomAndCenter(level, [geocode[0].location.getLng(), geocode[0].location.getLat()]);
                            } else {
                                if(!isNaN($("#search-panel").val()))
                                    _obj.MapSearching();
                                else{
                                    $("#s_info").text("无搜索结果噢");
                                    $("#search_rslt").modal('show');
                                }
                                //for (var i in citys) {
                                //    if (citys[i].name == $("#search-panel").val()) {
                                //        map.setZoomAndCenter(16, citys[i].lnglat);
                                //        $(".map").addClass("fullpage");
                                //        $(".map-ctrl-zoomIn").hide();
                                //        $(".map-ctrl-zoomOut").show();
                                //        $(".amap-sug-result").addClass("totop");
                                //        $("#bike_id").text(citys[i].B_id);
                                //        $("#bike_result").show();
                                //        superise_obj.refreshData();
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
                //}});
            }
        });
    },
    drawMarkersArea: function() {

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
                content: '<div class="marker-route marker-marker-bus-from" style="background: url(/static/qbike/img/num-bubble.png);width: 85px;height: 95px;color:#666;"><div class="area_name" style="padding-top:25px;font-size:16px;width: 100%;text-align: center">' + lnglat_list[i].name.split("市")[0] + '</div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px">' + lnglat_list[i].count + '</div></div>',
                offset: {
                    x: -42,
                    y: -96
                }
            });
            marker.loc = pos;
            //if(this.prev_map_markers.length>0)for(var i in this.prev_map_markers){
            //    console.log(this.prev_map_markers[i].getContent()!=marker.getContent());
            //}
            marker.setMap(this.map);
            marker.on('click', function(e) {
                if (_obj.map.getZoom() < 10) {
                    //console.log(this.loc[0]);
                    //_obj.map_lat = _obj.searching_lat==""?_obj.map.getCenter().getLat():_obj.searching_lat;
                    //_obj.map_lng = _obj.searching_lng==""?_obj.map.getCenter().getLng():_obj.searching_lng;
                    _obj.map.setZoomAndCenter(10, this.loc);
                }
                else if (_obj.map.getZoom() >= 10 && _obj.map.getZoom() < 11) {
                    _obj.map.setZoomAndCenter(11, this.loc);
                }
                else {
                    _obj.map.setZoomAndCenter(15, this.loc);
                    //_obj.mapPointsUpdate();
                }
            });
            this.map_markers.push(marker);
            this.prev_map_markers=this.map_markers;
        }
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
            marker.setMap(this.map);
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
    drawMass: function() {
        _obj=this;
        //console.log(this.massBuild);
        if (!this.massBuild) {
            if(_obj.areaList.length>0){_obj.map.setCenter(_obj.areaList[0].lnglat);this.massBuild = true;}
            var mass = this.mapMass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == 2
            }), {
                url: '/static/qbike/img/enable.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
            //this.map_massList.push(this.mapMass);
            var mass_inuse = this.iu_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == 3
            }), {
                url: '/static/qbike/img/in_use.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
            //this.map_massList.push(this.iu_Mass);
            var mass_intouble = this.it_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == 5||e.status == 4;
            }), {
                url: '/static/qbike/img/in_trouble.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
            //this.map_massList.push(this.it_Mass);
            var mass_indate = this.ip_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
                return e.status == 1
            }), {
                url: '/static/qbike/img/in_date.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5
            });
            this.map_massList.push(this.ip_Mass);
            this.ip_Mass.setMap(this.map);
            this.map_massList.push(this.it_Mass);
            this.it_Mass.setMap(this.map);
            this.map_massList.push(this.iu_Mass);
            this.iu_Mass.setMap(this.map);
            this.map_massList.push(this.mapMass);
            this.mapMass.setMap(this.map);
            for(var i in this.map_massList){
                this.map_massList[i].on('click', function(e) {
                    localStorage.bike_id = e.data.name;
                    $.ajax({
                        url: _defautBiz.api("bikeDetail")+"&bikeNumber="+e.data.name ,
                        dataType: "json",
                        method: 'get',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                            //xhr.setRequestHeader("User-Agent", "headertest");
                        },
                        success: function(resp) {
                            localStorage.bikeDetailRight=resp.data.right;
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
                                    $("#loc_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeCurr ?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss") : "-");
                                    var fixTime=resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-";
                                    _obj.geo_type == 1 ? $("#fix_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss")):$("#fix_time").text(fixTime);
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
                                    $("#loc_time").text(resp.data.BikeBasicDetail.bikeEsDto.timeCurr ?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeCurr).format("MM.dd hh:mm:ss") : "-");
                                    var fixTime=resp.data.BikeBasicDetail.bikeEsDto.timeFix?new Date(resp.data.BikeBasicDetail.bikeEsDto.timeFix).format("MM.dd hh:mm:ss"):"-";
                                    _obj.geo_type == 1 ? $("#fix_time").text(new Date(resp.data.BikeBasicDetail.bikeEsDto.timeGps).format("MM.dd hh:mm:ss")):$("#fix_time").text(fixTime);
                                    $("#bike_duration").text(Math.round(parseInt(resp.data.BikeBasicDetail.duration)/60).toLocaleString());
                                    $("#bike_distance").text(Math.round(parseInt(resp.data.BikeBasicDetail.distance/1000)).toLocaleString());
                                    _obj.map.setCenter(e.data.lnglat);
                                }
                            });
                            var img_url=(function(status){
                                switch(parseInt(status)){
                                    case 1:
                                        return  '/static/qbike/img/in_date_Max.png';
                                        break;
                                    case 2:
                                        return  '/static/qbike/img/enable_Max.png';
                                        break;
                                    case 3:
                                        return  '/static/qbike/img/in_use_Max.png';
                                        break;
                                    case 4:
                                        return  '/static/qbike/img/in_trouble_Max.png';
                                        break;
                                    case 5:
                                        return  '/static/qbike/img/in_trouble_Max.png';
                                        break;
                                    default:
                                        return  '/static/qbike/img/enable_Max.png';
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
            if($.grep(this.areaList, function(e) {return e.status == 2}).length>0){
                this.mapMass.show();
                this.mapMass.setData($.grep(this.areaList, function(e) {
                    return e.status == 2
                }));
            }
            else this.mapMass.hide()
            if($.grep(this.areaList, function(e) {return e.status == 3}).length>0){
                this.iu_Mass.show();
                this.iu_Mass.setData($.grep(this.areaList, function(e) {
                    return e.status == 3
                }));
            }
            else this.iu_Mass.hide();
            if($.grep(this.areaList, function(e) {return e.status == 4||e.status == 5}).length>0){
                this.it_Mass.show();
                this.it_Mass.setData($.grep(this.areaList, function(e) {
                    return e.status == 4||e.status == 5
                }));
            }
            else this.it_Mass.hide();
            if($.grep(this.areaList, function(e) {return e.status == 1}).length>0){
                this.ip_Mass.show();
                this.ip_Mass.setData($.grep(this.areaList, function(e) {
                return e.status == 1
            }));
            }
            else this.ip_Mass.hide();
        }

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
                    $("#charge_award").text(resp.data.totalAmount3);
                    $("#ride_award").text(resp.data.totalAmount5);
                }
                else{
                    $("#user_num").text("--");
                    $("#bike_num").text("--");
                    $("#charge_award").text("--");
                    $("#ride_award").text("--");
                }
            }
        });
        //$("#alert_body").html('');
        var _url="";
        if(_obj.first_flag)
        {
            //_url=_defautBiz.api("warningDigest")+"?area="+($("#citySelect").val()=="全国"?"":$("#citySelect").val()+"市");
            _url=_defautBiz.api("warningDigest");
            _obj.first_flag=false;
        }
        //else _url=_defautBiz.api("warningDigest")+"?area="+($("#citySelect").val()=="全国"?"":$("#citySelect").val()+"市");
        else _url=_defautBiz.api("warningDigest");
        var Alertlist="";
        $.ajax({
            url: _url,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var c_date = new Date().format("yyyy.MM.dd hh:mm");
                $("#alert_time").html(resp.data.length>0?new Date(resp.data[0].createTime).format("yyyy.MM.dd hh:mm"):"/");
                _obj.alert_timeflag=resp.data.length>0?resp.data[0].createTime:"/";
                //$("#alert_body").html("");
                for (var i in resp.data) {
                    var type_class = resp.data[i].warnSource == 0 ? 'system' : 'user';
                    var type_name = resp.data[i].warnSource == 0 ? '系统' : '用户';
                    //var new_stat = resp.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
                    var new_stat = '<img src="/static/qbike/img/new.png">';
                    Alertlist+='<tr><td style="width: 70px;"><a href="javascript:go_Alert('+resp.data[i].bikeNumber+')" class="' + type_class + '">[ ' + type_name + ' ]</a></td><td><a href="javascript:go_Alert('+resp.data[i].bikeNumber+')" style="margin-left:0px;"><span title="" data-toggle="tooltip" style="color:#999" data-original-title="'+ new Date(resp.data[i].createTime).format("yyyy.MM.dd hh:mm")+'">' + (resp.data[i].warnMsg.length>=15?(resp.data[i].warnMsg.substring(0,15)+"..."):resp.data[i].warnMsg)+"("+resp.data[i].bikeNumber+" "+(resp.data[i].warnArea?resp.data[i].warnArea:"")+")" + '</span></a></td></tr>';
                    //$("#alert_body").prepend('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[' + type_name + ']</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
                }
                $("#alert_body").html(Alertlist);
                $("[data-toggle='tooltip']").tooltip();
            }
        });
        $(function() {
            $("[data-toggle='tooltip']").tooltip();
        });
    },
    //listUpdate: function() {
    //    $.ajax({
    //        url: _defautBiz.api("header"),
    //        dataType: "json",
    //        method: 'get',
    //        success: function(resp) {
    //            $("#user_num").text(resp.data.totalUserNumbers.toLocaleString());
    //            $("#bike_num").text(resp.data.totalBikes.toLocaleString());
    //            $("#ride_times").text(resp.data.totalRides.toLocaleString());
    //            $("#ride_dis").text(resp.data.totalMileages.toLocaleString());
    //        }
    //    });
    //    $.ajax({
    //        url: _defautBiz.api("warningDigest"),
    //        dataType: "json",
    //        method: 'get',
    //        success: function(resp) {
    //            $("#alert_body").html("");
    //            for (var i in resp.data) {
    //                var type_class = resp.data[i].warnType == 0 ? 'system' : 'user';
    //                var type_name = resp.data[i].warnType == 0 ? '系统' : '用户';
    //                //var new_stat = resp.data.WarningInfos[i].new == true ? '<img src="/static/qbike/img/new.png">' : '';
    //                var new_stat = '<img src="/static/qbike/img/new.png">';
    //                $("#alert_body").append('<tr><td><a href="/supervise/alert_detail.html" class="' + type_class + '">[&nbsp;' + 'sb?' + '&nbsp;]</a></td><td>' + resp.data[i].msg + new_stat + '</td></tr>');
    //                var c_date = new Date().format("yyyy.MM.dd hh:mm");
    //                $("#alert_time").html(c_date);
    //            }
    //        }
    //    });
    //},
    refreshData: function() {
        //this.drawcharts_I();
        //this.drawcharts_II();
        //this.drawcharts_III();
        this.dataUpdate();
        //this.mapPointsUpdate();
        this.dataInit();
        //this.map.setMapStyle('normal');
        //this.map.setMapStyle('normal');
        //this.mulLineChart.setOption(option);
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
        if(_obj.zoomCur<10&&_obj.zoomPre<10&&!_obj.gps_flag){
            $(".extends_control").hide();
            $(".scroll-sign").removeClass("fa-angle-left");
            $(".scroll-sign").addClass("fa-angle-right");
            $(".scroll-sign").animate({"left":"-12px"});
            $(".alert_list_panel").animate({"left":"-440px"})
            $(".map-search").animate({"left":"10px"})
            $(".amap-maps").animate({"left":"0px"});
            scroll_flag=true;
            return;
        }
        else{
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("listLatestBikes") + "&lng=" + _obj.map_lng + "&lat=" + _obj.map_lat + "&mapZoom=" + _obj.map_zoom+"&locType="+_obj.geo_type,
            //url: _defautBiz.api("listLatestBikes")+"&lng="+"121.479711"+"&lat="+"31.264772"+"&mapZoom="+_obj.map_zoom,
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                if (_obj.map_zoom > 13&&resp.data.bikes) {
                    if(scroll_flag)$(".extends_control").show();
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
                                var img_url=(function(status){
                                    switch(parseInt(status)){
                                        case 1:
                                            return  '/static/qbike/img/in_date_Max.png';
                                            break;
                                        case 2:
                                            return  '/static/qbike/img/enable_Max.png';
                                            break;
                                        case 3:
                                            return  '/static/qbike/img/in_use_Max.png';
                                            break;
                                        case 4:
                                            return  '/static/qbike/img/in_trouble_Max.png';
                                            break;
                                        case 5:
                                            return  '/static/qbike/img/in_trouble_Max.png';
                                            break;
                                        default:
                                            return  '/static/qbike/img/enable_Max.png';
                                    }
                                })(resp.data.bikes[i].bikeStatus)
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
                    $(".extends_control").hide();
                    $(".scroll-sign").removeClass("fa-angle-left");
                    $(".scroll-sign").addClass("fa-angle-right");
                    $(".scroll-sign").animate({"left":"-12px"});
                    $(".alert_list_panel").animate({"left":"-440px"})
                    $(".map-search").animate({"left":"10px"})
                    $(".amap-maps").animate({"left":"0px"});
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
                        _obj.typeList=[{type:true},{type:true},{type:true},{type:true}];
                        _obj.typeParam="&type=1,2,3,4";
                    });
                    //$("#map-ctrl-satellite").hide();
                    $(".button_panel").hide();
                }
                else{
                    $(".extends_control").hide();
                    $(".scroll-sign").removeClass("fa-angle-left");
                    $(".scroll-sign").addClass("fa-angle-right");
                    $(".scroll-sign").animate({"left":"-12px"});
                    $(".alert_list_panel").animate({"left":"-440px"})
                    $(".map-search").animate({"left":"10px"})
                    $(".amap-maps").animate({"left":"0px"});
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
        }
    },
    Data_refresh: function() {
        _obj = this;
        if (this.TimeInterval == null) {
            this.TimeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/index/view.do")
                {clearInterval(_obj.TimeInterval);_obj.TimeInterval = null;}
                _obj.refreshData();
            }, 60000);
        }
        if (this.BikeInterval == null) {
            this.BikeInterval = setInterval(function() {
                if(localStorage.currentUrl!="/index/view.do")
                {
                    clearInterval(_obj.BikeInterval);_obj.BikeInterval = null;}
                $("#c_time").text(new Date().format("yyyy.MM.dd hh:mm"));
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
    }
}

//
// 单车详情
var _bike_obj = {
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
    line_type:0,
    init: function() {
        this.line_type=0;
        //$("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
        this.drawChartI();
        this.drawChartII();
        this.componentInit();
    },
    componentInit: function() {
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
        $("#d_cStatus").text((localStorage.bike_status=="null"?"/":localStorage.bike_status));
        $("#d_power").removeClass("red");
        $("#d_power").text(localStorage.bike_power=="null"?"/":charegeState(localStorage.bike_power)+"%")
        if(Math.abs(parseInt(localStorage.bike_power))<20)$("#d_power").addClass("red");
        $("#bike_indx").text(localStorage.bike_id=="null"?"/":localStorage.bike_id);
        $("#panel_alert").attr("href","javascript:go_Alert("+localStorage.bike_id+")")
        $("button#line_off").addClass("active");
        $("#line_type button").off().on("click",function(){
            $("#line_type button").removeClass("active");
            $(this).addClass("active");
            _bk_obj.line_type= $(this).attr("data-toggle")=="on"?1:0;
            _bk_obj.drawline();
        });
        $(".mp-period").off().on("click",function(){
            $(".mp-period").removeClass("active");
            $(this).addClass("active");
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
            else
            _bk_obj.drawline();
        });
        $(".map-ctrl-goBack").on("click", function() {
            $("#bike_detail").animate({
                "opacity": 0
            });
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
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    //xhr.setRequestHeader("User-Agent", "headertest");
                },
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
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                    //xhr.setRequestHeader("User-Agent", "headertest");
                },
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
                            splitNumber:3,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }, {
                            splitNumber:3,
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
    drawMap: function() {
        var map=this.map = new AMap.Map('dt_mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 4,
            center: [102.342785, 35.312316]
        });
        map.setMapStyle('normal');
        map.setFeatures(['bg','road']);
        this.drawline();
    },
    drawline:function(){
        _bike_obj=this;
        var opt_endtime="";
        for(var i in this.lineList){_bike_obj.map.remove(this.lineList[i]);}
        for(var i in this.startendList){_bike_obj.map.remove(this.startendList[i]);}
        this.lineList=[];
        this.startendList=[];
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
            url: _bike_obj.line_type==1?_defautBiz.api("list") + "?bikeId=" + localStorage.bike_id + "&startTime="+startTime+"&endTime="+endtime:_defautBiz.api("list_off") + "?bikeId=" + localStorage.bike_id + "&startTime="+startTime+"&endTime="+endtime,
            //url: _defautBiz.api("list") + "?bikeId=320116000003&startTime=20170115114353&endTime=20170115235349",
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                for(var i in resp.data){
                    // var lineArr=resp.data[i].points;
                    var lineArr=(_bike_obj.line_type==1?resp.data[i].points:resp.data);
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
                    //if(lineArr.length>0) {
                    //    var S_marker = new AMap.Marker({
                    //        content: '<img src="/static/qbike/img/start.png"/>',
                    //        position: lineArr[(resp.data[i].points.length - 1)],
                    //        offset: new AMap.Pixel(-18, -42),
                    //        map: _bike_obj.map
                    //    });
                    //    var E_marker = new AMap.Marker({
                    //        content: '<img src="/static/qbike/img/end.png"/>',
                    //        position: lineArr[0],
                    //        offset: new AMap.Pixel(-18, -42),
                    //        map: _bike_obj.map
                    //    });
                    //    _bike_obj.startendList.push(S_marker);
                    //    _bike_obj.startendList.push(E_marker);
                    //}
                    _bike_obj.lineList.push(polyline);
                }
                $.ajax({
                    url: _defautBiz.api("getBikeById")+"?bid="+ localStorage.bike_id,
                    dataType: "json",
                    method: 'get',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                        //xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function(resp) {
                        var img_url=(function(status){
                            switch(parseInt(status)){
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
                            position: [_obj.geo_type==1?resp.data.lng:resp.data.posCurr[0],_obj.geo_type==1?resp.data.lat:resp.data.posCurr[1]],
                            map:_bike_obj.map
                        });
                        _bike_obj.map.setZoomAndCenter(14, [_obj.geo_type==1?resp.data.lng:resp.data.posCurr[0],_obj.geo_type==1?resp.data.lat:resp.data.posCurr[1]]);

                        _bike_obj.startendList.push(B_marker);
                    }})
            }});
    },
    drawChartI: function() {
        var bike_obj=this;
        $.ajax({
            url: _defautBiz.api("accumulateTimesStatistic") + "&bikeNumber=" + localStorage.bike_id + "&type=week",
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var chartsItems = resp.data.rideTimesStatisticRank;
                var myChart=bike_obj.myChartI = echarts.init(document.getElementById('dt_main'));
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
                            return e.dateTime.split("-")[1]+"."+e.dateTime.split("-")[2];
                        })
                    }],
                    yAxis: [{
                        name:'(次)',
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
                            return e.times;
                        })
                    }]
                };
                myChart.setOption(option);
            }
        });
    },
    drawChartII: function() {
        var bike_obj=this;
        $.ajax({
            url: _defautBiz.api("bikeDistanceAndElapsedTimeStatistic") + "&bikeNumber=" + localStorage.bike_id + "&type=week",
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function(resp) {
                var chartsItems = resp.data.bikeDistanceAndElapsedTimeStatistic;
                var myChart=bike_obj.myChartII = echarts.init(document.getElementById('dt_main1'));
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
                        splitNumber:3,
                        name:'里程(公里)',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }, {
                        splitNumber:3,
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
            }
        });
    }
}

function showDetail() {
    _bike_obj.line_period=0;
    $("#bike_detail button").removeClass("active");
    $("#time_bytime").addClass("active");
    $("#all_bytime").addClass("active");
    $("#dt_c_ds").addClass("active");
    $("#dt_c").addClass("active");
    $("#line_cur").addClass("active");
    $("#bike_detail").show();
    $("#bike_id_detail").text($("#bike_id").text());
    $("#bike_detail").animate({
        "opacity": 1
    });
    _bike_obj.init();
}

function getRDList() {
    var list = [];
    for (var i = 0; i < 7; i++) {
        list.push(parseInt(Math.random() * 100))
    }
    return list;
}
var list_ctrl = false;

function list_toggle() {
    if (list_ctrl) {
        $(".pull-sign").removeClass("fa-angle-down");
        $(".pull-sign").addClass("fa-angle-up");
        $(".button_panel").animate({
            "height": "30px"
        });
    } else {
        $(".pull-sign").removeClass("fa-angle-up");
        $(".pull-sign").addClass("fa-angle-down");
        $(".button_panel").animate({
            "height": "80px"
        });
    }
    list_ctrl = !list_ctrl
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
superise_obj.init();
//var refresh_data=setInterval(function(){
//    superise_obj.refreshData();
superise_obj.map.setMapStyle('normal');
//},10000);
//function Data_refresh(){
//    superise_obj.refreshData();
//    setTimeout(function(){Data_refresh()},10000)
//}
superise_obj.Data_refresh();
superise_obj.KillInterval();
var test = new Vcity.CitySelector({
    input: 'citySelect'
});

function handle_alert() {
    // $("#m_info").text("处理故障后，单车将变为可用状态，该预警信息将被清空。");
    // $("#f_info").text("确认单车故障已处理完毕?");
    // $("#judge_alert").modal('show');
    // $("#save_judge").off("click");
    // $("#save_judge").on("click", function() {
    //     $('#judge_alert').modal('hide')
    // });
    if(localStorage.bikeDetailRight=="true"){
        localStorage.carInfo=true;
        window.location.href='/supervise/car_analysis.html'
    }
    else{
        $("#s_info").text("您无权限使用该功能!");
        $("#search_rslt").modal('show');
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
    localStorage.alert_city=$("#citySelect").val();
    localStorage.alert_code=$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0";
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
//列表箭头
var scroll_flag=true;
function scroll_toggle(){
    if(!scroll_flag){
        $(".extends_control").show();
        $(".scroll-sign").removeClass("fa-angle-left");
        $(".scroll-sign").addClass("fa-angle-right");
        $(".scroll-sign").animate({"left":"-12px"});
        $(".alert_list_panel").animate({"left":"-440px"})
        $(".map-search").animate({"left":"10px"})
        $(".amap-maps").animate({"left":"0px"});
        scroll_flag=!scroll_flag;
    }
    else{
        $(".extends_control").hide();
        $(".scroll-sign").removeClass("fa-angle-right");
        $(".scroll-sign").addClass("fa-angle-left");
        $(".scroll-sign").animate({"left":"246px"});
        $(".map-search").animate({"left":"250px"});
        $(".amap-maps").animate({"left":"220px"});
        $(".alert_list_panel").show();
        $(".alert_list_panel").animate({"left":"0px"})
        scroll_flag=!scroll_flag;
    }
}
