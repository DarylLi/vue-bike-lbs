/**
 * Created by lihaotian on 2016/12/12.
 */
$(document).ready(function(){
    $.initProv("#pro", "#city", "辽宁省", "大连市");
    //Date picker
    $('#createTime_from').datepicker({
        autoclose: true
    });
    $('#createTime_to').datepicker({
        autoclose: true
    });
    $('#verifyTime_from').datepicker({
        autoclose: true
    });
    $('#verifyTime_to').datepicker({
        autoclose: true
    });

    $('.lock-id').autocomplete({
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

});
var MapControl="";
var testing_linedata = [getRDList(), getRDList(), getRDList()];
var testing_xaxis = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
var clickListener="";
var moveListener="";
var _defautBiz =
    _defautBiz || {
        env: 'product',
        _baseUrl: function() {
            return this.env == 'debug' ? '/static/mock' : ''
        },
        api: function(name) {
            return this._api(this._baseUrl())[this.env][name];
        },
        _api: function(_base_url) {
            var _v = new Date().getTime();
            return {
                debug: {
                    getListData: _base_url + '/state_query_data.json' + "?" + _v,
                    // getListData: _base_url + '/state_query_data.json' + "?" + _v,
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
                    saveArea:'/track/list',
                    export: _base_url + '/action_success.json' + "?_v=" + _v,
                    getCountData: _base_url + '/lockStatus/lockStatusCount' + "?_v=" + _v,
                    searchLockIds: _base_url + '/lockStatus/searchLockIds' + "?_v=" + _v,
                },
                product: {
                    getListData: _base_url + '/lockStatus/listPage' + "?" + _v,
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
                    export: _base_url + '/lockStatus/export?',
                    openLock:_base_url +'/instruction/openLock',
                    openBeep:_base_url +'/instruction/openBeep',
                    setHostPort:_base_url +'/instruction/setHostPort',
                    setOpenLockBack:_base_url +'/instruction/setOpenLockBackTime',
                    setCloseLockBack:_base_url +'/instruction/setCloseLockBackTime',
                    getParamMessage:_base_url +'/instruction/getParamMessage',
                    getCountData: _base_url + '/lockStatus/lockStatusCount' + "?_v=" + _v,
                    searchLockIds: _base_url + '/lockStatus/searchLockIds' + "?_v=" + _v,
                    producer:"/lockStatus/producer"
                }
            }
        }
    };
var totalData = '';
var pageSize = '';
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

    zoomMass:"",
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
    lockId: "",
    status: "",
    pow: "",
    init: function() {
        var params = {
            pageSize: 10,
            currPage: 1
        };

        this.initData(params);
        // var data_append="";
        // for(var i=0;i<10;i++)
        // data_append+="<tr><td>"+("Misc"+i)+"</td><td>I1</td><td>3 1 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_"+i+" style='margin-right:5px '>设置</a></td></tr>";
        // $("#Pagination tbody").append(data_append);
        // $('.M-box1').pagination({
        //     totalData:100,
        //     showData:5,
        //     jump:true,
        //     coping:true,
        //     callback:function(index){
        //         var num=index.getCurrent();
        //         $("#Pagination tbody").html("");
        //         data_append="";
        //         for(var i=0;i<10;i++)
        //             data_append+="<tr><td>"+("Misc"+i+num)+"</td><td>IE Mobile</td><td>Windows Mobile 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_"+num+" style='margin-right:5px '>设置</a></td></tr>";
        //         $("#Pagination tbody").append(data_append);
        //         $("#Pagination a").off().on("click",function(){
        //             $("#s_info").text("无搜索结果噢");
        //             $("#area_list").modal('show');
        //             $("#save_confirm").on("click",function(){
        //                 $("#f_info").text("确定对该智能锁进行修改？");
        //                 $("#judge_alert").modal('show');
        //                 $("#save_judge").on("click", function() {
        //                     $("#m_info").text("设置成功");
        //                     setTimeout(function(){$('#judge_alert').modal('hide');$("#m_info").text("")},1500);
        //                 });
        //             });
        //         });
        //     }
        // });
        $("#Pagination a").off().on("click",function(){
            $("#s_info").text("无搜索结果噢");
            $("#area_list").modal('show');
                $("#save_confirm").on("click",function(){
                    $("#f_info").text("确定对该智能锁进行修改？");
                    $("#judge_alert").modal('show');});
                    $("#save_judge").on("click", function() {
                        $("#m_info").text("设置成功");
                        setTimeout(function(){$('#judge_alert').modal('hide');$("#m_info").text("")},1500);
                    });
        });
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
        //this.drawMap();
        this.componentInit();
        //renderChartsII();
        //renderChartsIII();
        //renderChartsIV();
        // 使用刚指定的配置项和数据显示图表。

    },
    initData: function(params){
        // console.log('init data');
        pageSize = params.pageSize;
        $.ajax({
            url: _defautBiz.api("getListData"),
            dataType: "json",
            method: 'get',
            data: {
                lockId: params.lockId && params.lockId,
                status: params.hasOwnProperty("status") ? params.status : "",
                pow: params.hasOwnProperty("pow") ? params.pow : "",
                pageSize: params.pageSize,
                currPage: params.currPage,
                producer: params.producer,
                channel: params.channel
            },
            // beforeSend: function(xhr) {
            //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            // },
            success: function(data) {
                data.success && data.returnCode == 0 && data.data.data && dispatch_obj.parseData(data.data.data);
            }});
    },

    initNextPageData : function(params){
        // console.log('init next page data');
        pageSize = params.pageSize;
        $.ajax({
            url: _defautBiz.api("getListData"),
            dataType: "json",
            method: 'get',
            data: {
                // lockName: params.lockName && params.lockName,
                // status: params.status && params.status,
                // manufacturer: params.manufacturer && params.manufacturer,
                // provinceArea: params.provinceArea && params.provinceArea,
                // cityArea: params.cityArea && params.cityArea,
                // uploadStartTime: params.uploadStartTime && params.uploadStartTime,
                // uploadEndTime: params.uploadEndTime && params.uploadEndTime,
                // checkStartTime: params.checkStartTime && params.checkStartTime,
                // checkEndTime: params.checkEndTime && params.checkEndTime,
                pageSize: params.pageSize,
                currPage: params.currPage,
                lockId: params.lockId && params.lockId,
                status: params.hasOwnProperty("status") ? params.status : "",
                pow: params.hasOwnProperty("pow") ? params.pow : "",
                producer: params.producer,
                channel: params.channel
            },
            // beforeSend: function(xhr) {
            //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            // },
            success: function(data) {
                data.success && data.returnCode == 0 && data.data.data && dispatch_obj.parseNextPageData(data.data.data);
            }});
    },
    parseNextPageData: function(data){
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append="";
        for(var i = 0;i < pageSize && i < data.datas.length; i++)
            data_append+="<tr><td>"+(data.datas[i].lockId)+"</td><td>" + data.datas[i].onlineStatus + "</td><td>" + data.datas[i].warnInfo + "</td><td>" + data.datas[i].status + "</td><td>" + data.datas[i].lat + "</td><td>" + data.datas[i].lng + "</td><td>" + data.datas[i].location + "</td><td>" + data.datas[i].sysTimeStr + "</td><td>" + data.datas[i].equipmentTimeStr + "</td><td>" + data.datas[i].openLockCount + "</td><td>" + data.datas[i].power + "</td><td>" + data.datas[i].locationModel + "</td><td>" + data.datas[i].gsmSignal + "</td><td>" + data.datas[i].gpsSignal + "</td><td>" + data.datas[i].altitude + "</td><td>" + data.datas[i].speed + "</td><td>" + parseChannel(data.datas[i].channel) + "</td>"+"<td><a class='get_action' href='javascript:void(0)' style='margin-right:5px '>设置</a></td></tr>";
        $("#Pagination tbody").append(data_append);
    },
    parseData: function(data){
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append="";
        for(var i = 0;i < pageSize && i < data.datas.length; i++)
            data_append+="<tr><td>"+(data.datas[i].lockId)+ "</td><td>" + data.datas[i].onlineStatus + "</td><td>" + data.datas[i].warnInfo + "</td><td>" + data.datas[i].status + "</td><td>" + data.datas[i].lat + "</td><td>" + data.datas[i].lng + "</td><td>" + data.datas[i].location + "</td><td>" + data.datas[i].sysTimeStr + "</td><td>" + data.datas[i].equipmentTimeStr + "</td><td>" + data.datas[i].openLockCount + "</td><td>" + data.datas[i].power + "</td><td>" + data.datas[i].locationModel + "</td><td>" + data.datas[i].gsmSignal + "</td><td>" + data.datas[i].gpsSignal + "</td><td>" + data.datas[i].altitude + "</td><td>" + data.datas[i].speed +  "</td><td>" + parseChannel(data.datas[i].channel) + "</td>"+"<td><a class='get_action' href='javascript:void(0)' style='margin-right:5px '>设置</a></td></tr>";
        $("#Pagination tbody").append(data_append);
        $('.M-box1').pagination({
            totalData:totalData,
            showData:pageSize,
            jump:true,
            coping:true,
            callback:function(index){
                var num=index.getCurrent();
                // console.log('current page is:' + num);

                var params = {
                    lockId: dispatch_obj.lockId,
                    status: dispatch_obj.status,
                    pow: dispatch_obj.pow,
                    producer:dispatch_obj.producer,
                    channel:dispatch_obj.channel,
                    pageSize: pageSize,
                    currPage: num
                };
                dispatch_obj.initNextPageData(params);
                // $("#Pagination tbody").html("");
                // data_append="";
                // for(var i=0;i<10;i++)
                //     data_append+="<tr><td>"+("Misc"+i+num)+"</td><td>IE Mobile</td><td>Windows Mobile 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' style='margin-right:5px '>通过</a><a href='javascript:void(0)'>不通过</a></td></tr>";
                // $("#Pagination tbody").append(data_append);
            }
        });
    },

    parseNumberData: function(data){
        $(".device-number-txt").html(data[0]);
        $(".online-number-txt").html(data[1]);
        $(".offline-number-txt").html(data[2]);
    },

    drawLine:function(){
        _obj=this;
        //if(_obj.SaveWindow)_obj.SaveWindow.close();
        _obj.remove();
        var polygon =_obj.draw_polygon= new AMap.Polygon({
            path: _obj.draw_line, //设置多边形边界路径
            strokeColor: "#0000ff",
            strokeOpacity: 1,
            strokeWeight: 3,
            bubble:true,
            fillColor: "#f5deb3",
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
    updateList:function(indx){
        $("#Pagination tbody").html("");
        var data_append="";
        for(var i=0;i<indx;i++)
            data_append+="<tr><td>"+("Misc"+i)+"</td><td>I1</td><td>3 1 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_"+i+" style='margin-right:5px '>设置</a></td></tr>";
        $("#Pagination tbody").append(data_append);
        $('.M-box1').pagination({
            totalData:100,
            showData:indx,
            jump:true,
            coping:true,
            callback:function(index){
                var num=index.getCurrent();
                $("#Pagination tbody").html("");
                data_append="";
                for(var i=0;i<indx;i++)
                    data_append+="<tr><td>"+("Misc"+i+num)+"</td><td>IE Mobile</td><td>Windows Mobile 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_"+num+" style='margin-right:5px '>设置</a></td></tr>";
                $("#Pagination tbody").append(data_append);
            }
        });

    },
    componentInit: function() {
        localStorage.c_city_name="全国";
        var click_flag = true;
        _obj = this;
        $(".pag_list button").on("click",function () {
            $(".pag_list button").removeClass("active");
            $(this).addClass("active");
            var indx=$(this).text();
            // _obj.updateList(indx)
            var params = {
                lockId: dispatch_obj.lockId,
                status: dispatch_obj.status,
                pow: dispatch_obj.pow,
                producer:dispatch_obj.producer,
                channel:dispatch_obj.channel,
                pageSize: indx,
                currPage: 1
            };
            // console.log("pag_list button")
            dispatch_obj.initData(params);

        });

        //单行设置按钮功能
        $(document.body).on('click','.get_action',function(){
            var lockId = $(this).parent().parent().find('td:eq(0)').html();
            //设置功能modal弹出
            $('#lock-id').val(lockId);
            $("#area_list").modal('show');
        });

        //查询按钮功能
        $('.query-list').on('click',function(){
            dispatch_obj.lockId = $('.lock-id').val();
            dispatch_obj.status = $('.online-select').val();
            dispatch_obj.pow = $('.power-select').val();
            dispatch_obj.producer = $('.producer-select').val();
            dispatch_obj.channel = $('.channel-select').val();

            var params = {
                lockId: dispatch_obj.lockId,
                status: dispatch_obj.status,
                pow: dispatch_obj.pow,
                producer:dispatch_obj.producer,
                channel:dispatch_obj.channel,
                currPage : 1,
                pageSize: $('.pag_list').find('.active').html()
            };
            dispatch_obj.initData(params);
        });

        $('#save_confirm').on('click',function(){
            var type = $('.action-type').val();
            var lockId = $('#lock-id').val();
            var ipAddress = $('.ip-address').val();
            var portNum = $('.port-number').val();
            var timeInterval = $('.time-interval').val();
            if(lockId == ""){
                $("#lock_info").html('请输入智能锁id');
                $("#lock_commend").modal('show');
            }
            switch(parseInt(type)){
                //服务器地址设置
                case 1:
                    //ipAddress和portNum必填项
                    if(ipAddress == "" || portNum == ""){
                        //弹出输入服务器ip地址和端口号的modal
                        $("#lock_info").html('请输入服务器ip地址和端口号');
                        // $("#area_list").modal('hide');
                        $("#lock_commend").modal('show');
                        return;
                    }else{
                        //发送服务器地址设置请求
                        $.ajax({
                            url: _defautBiz.api("setHostPort"),
                            dataType: "json",
                            method: 'get',
                            data: {
                                lockId: lockId,
                                host: ipAddress,
                                port: portNum
                            },
                            success: function(data) {
                                if(data.success){
                                    $("#area_list").modal('hide');
                                    $('#action_success').modal('show');
                                }
                                else{
                                    $("#area_list").modal('hide');
                                    $('#action_false').modal('show');
                                }
                            }});
                        return;
                    }
                case 2:
                    //回传间隔为必填项
                    if(timeInterval == ""){
                        //弹出输入回传间隔modal
                        $("#lock_info").html('请输入服务器回传间隔');
                        $("#lock_commend").modal('show');
                        return;
                    }else{
                        //发送锁开回传间隔请求
                        $.ajax({
                            url: _defautBiz.api("setOpenLockBack"),
                            dataType: "json",
                            method: 'get',
                            data: {
                                lockId: lockId,
                                time: timeInterval
                            },
                            success: function(data) {
                                if(data.success){
                                    $("#area_list").modal('hide');
                                    $('#action_success').modal('show');
                                }
                                else{
                                    $("#area_list").modal('hide');
                                    $('#action_false').modal('show');
                                }
                            }});
                        return;
                    }
                case 3:
                    //回传间隔为必填项
                    if(timeInterval == ""){
                        //弹出输入回传间隔modal
                        $("#lock_info").html('请输入服务器回传间隔');
                        $("#lock_commend").modal('show');
                        return;
                    }else{
                        //发送锁关回传间隔请求
                        $.ajax({
                            url: _defautBiz.api("setCloseLockBack"),
                            dataType: "json",
                            method: 'get',
                            data: {
                                lockId: lockId,
                                time: timeInterval
                            },
                            success: function(data) {
                                if(data.success){
                                    $("#area_list").modal('hide');
                                    $('#action_success').modal('show');
                                }
                                else{
                                    $("#area_list").modal('hide');
                                    $('#action_false').modal('show');
                                }
                            }});
                        return;
                    }
                case 4:
                    //发送参数查询请求
                    $.ajax({
                        url: _defautBiz.api("getParamMessage"),
                        dataType: "json",
                        method: 'get',
                        data: {
                            lockId: lockId
                        },
                        success: function(data) {
                            if(data.success){
                                $("#area_list").modal('hide');
                                $('#action_success').modal('show');
                            }
                            else{
                                $("#area_list").modal('hide');
                                $('#action_false').modal('show');
                            }
                        }});
                    return;
            }

        });
        $("#flow_sel").on("click",function(){
            if($(this).is(':checked'))_obj.drawFlow();
            else _obj.drawArea();
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
        // $("#show_list").on("click",function(){
        //         $.ajax({
        //             url: _defautBiz.api("listArea"),
        //             dataType: "json",
        //             method: 'get',
        //             beforeSend: function(xhr) {
        //                 xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //                 //xhr.setRequestHeader("User-Agent", "headertest");
        //             },
        //             success: function(resp) {
        //                 $("#area_list tbody").html("");
        //                 $("#area_list tbody").append('<tr><th>序号</th><th>区域名称</th><th>创建人</th><th>创建时间</th><th>操作</th></tr>');
        //                 for(var i in resp.data){
        //                     $("#area_list tbody").append('<tr a_num='+resp.data[i].id+'><td>'+(parseInt(i)+1)+'</td><td>'+resp.data[i].name+'</td><td><span>sbb</span></td><td><div>'+new Date(resp.data[i].createTime).format("hh:mm")+'</div></td><td><span class=""><a add_num="'+resp.data[i].id+'" create_time="'+resp.data[i].createTime+'" area_name="'+resp.data[i].name+'" user_id="'+resp.data[i].userId+'" add_points="'+resp.data[i].points+'" id="add_'+resp.data[i].id+'" style="margin-right:10px">打开</a><a del_num="'+resp.data[i].id+'" id="del_'+resp.data[i].id+'">删除</a></span></td></tr>');
        //                     //href="javascript:del('+_v+')"
        //                     $("#del_"+resp.data[i].id).on("click",function(){
        //                         that=this;
        //                         $("#m_info").text("操作后所保存的区域将被清除");
        //                         $("#f_info").text("确认删除?");
        //                         $("#judge_alert").modal('show');
        //                         $("#save_judge").off("click");
        //                         $("#save_judge").on("click", function() {
        //                         $('#judge_alert').modal('hide')
        //                         $.ajax({
        //                             url: _defautBiz.api("delArea")+"?id="+$(that).attr("del_num"),
        //                             dataType: "json",
        //                             method: 'get',
        //                             beforeSend: function(xhr) {
        //                                 xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //                                 //xhr.setRequestHeader("User-Agent", "headertest");
        //                             },
        //                             success: function(resp) {
        //                                 $("tr[a_num="+$(that).attr("del_num")+"]").remove();
        //
        //                             }
        //                         });
        //                         for(var i in _obj.SaveWindows){
        //                             if(_obj.SaveWindows[i]._v==$(that).attr("del_num")){
        //                                 _obj.map.remove(_obj.SaveWindows[i]);
        //                             }
        //                         }
        //                         for(var i in _obj.areaOnMap){
        //                             if(_obj.areaOnMap[i]._v==$(that).attr("del_num")){
        //                                 _obj.map.remove(_obj.areaOnMap[i]);
        //                             }}
        //                         });
        //
        //                     });
        //                     $("#add_"+resp.data[i].id).on("click",function(){
        //                         that=this;
        //                         if($.grep(_obj.areaOnMap,function(e,i){
        //                                 return e._v==$(that).attr("add_num");
        //                             }).length<1){
        //                             var save_line=eval($(that).attr("add_points"))
        //                         var polygon =_obj.draw_polygon= new AMap.Polygon({
        //                             path: save_line, //设置多边形边界路径
        //                             strokeColor: "#0000ff",
        //                             strokeOpacity: 1,
        //                             strokeWeight: 3,
        //                             bubble:true,
        //                             fillColor: "#f5deb3",
        //                             fillOpacity: 0.35
        //                         });
        //                         polygon.setMap(_obj.map);
        //                         polygon._v=$(that).attr("add_num");
        //                         _obj.areaOnMap.push(polygon);
        //                         var marker= _obj.info_marker= new AMap.Marker({ //添加自定义点标记
        //                             map: _obj.map,
        //                             position: polygon.getPath()[0], //基点位置
        //                             offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
        //                             content: "<div class='area_detail'><div>区域名称:<span class='save_area_name'>"+$(that).attr('area_name')+"</span> "+"</div><div>车辆数辆:12345</div><div>需求总次数:12345</div><div>供需比:1.2</div><div>创建人:"+$(that).attr('user_id')+"</div><div>"+"创建时间:"+new Date(parseInt($(that).attr('create_time'))).format('hh:mm')+"</div></div></div>"
        //                         });
        //                         marker._v=$(that).attr("add_num");
        //                         _obj.SaveWindows.push(marker);
        //                         _obj.map.setCenter(polygon.getPath()[0]);
        //
        //                         }
        //
        //                     });
        //                 }
        //             }});
        //     $("#area_list").modal('show');
        // });
        // $("#save_confirm").on("click",function(){
        //     if($("#area_input").val()==""){_obj.saveable=false;$("#save_info").text("请输入区域名!");}
        //     if(_obj.saveable){
        //     var _v=$(this).attr("save_indx");
        //     $("#"+_v+" .save_area_name").text($("#area_input").val());
        //         //var points= $.grep(_obj.areaOnMap,function(e,i){
        //         //    return e._v==_v;
        //         //})[0].getPath();
        //         var points=_obj.draw_polygon.getPath();
        //         var str="";
        //         for(var i in points){
        //             str+="["+points[i].toString()+"]"+(i==(points.length-1)?"":",");
        //         }
        //         req_str="["+str+"]";
        //         $.ajax({
        //             url: _defautBiz.api("saveArea") + "?name=" + $("#area_input").val() + "&points=" +req_str,
        //             dataType: "json",
        //             method: 'get',
        //             beforeSend: function(xhr) {
        //                 xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
        //                 //xhr.setRequestHeader("User-Agent", "headertest");
        //             },
        //             success: function(resp) {
        //                 _obj.draw_polygon._v=resp.data;
        //                 _obj.info_marker._v=resp.data;
        //                 _obj.areaOnMap.push(_obj.draw_polygon);
        //                 _obj.SaveWindows.push(_obj.info_marker);
        //                 $("#"+_v+" a").hide();
        //                 $("#area_input").val("");
        //                 $('#save_area').modal('hide')
        //             }});
        //     }
        // });
        document.onkeydown=function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 27) {
                endLine();
            }
        };
        //区域绘制
        function endLine() {
            //var SaveWindow = new AMap.InfoWindow({isCustom: true,offset: new AMap.Pixel(0, 0)});
            _obj.draw_polygon.setPath(_obj.save_line);
            //_obj.draw_polygon.setPath(_obj.draw_line);
            var _v = new Date().getTime();
            //_obj.draw_polygon._v=_v;
            var marker =_obj.info_marker= new AMap.Marker({ //添加自定义点标记
                map: _obj.map,
                position: _obj.draw_polygon.getPath()[0], //基点位置
                offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
                content: "<div class='area_detail' id="+_v+"><div>区域名称:<span class='save_area_name'>无</span> "+"<a href='javascript:saveArea("+_v+")' id='save'>保存</a></div><div>车辆数辆:12345</div><div>需求总次数:12345</div><div>供需比:1.2</div><div>创建人:12345</div><div>"+"创建时间:"+new Date().format("yyyy.MM.dd hh:mm")+"</div></div></div>"
            });
            marker._v=_v;
            //console.log(_obj.draw_polygon.getPath()[0]);
            _obj.areaOnMap.push(_obj.draw_polygon);
            _obj.SaveWindows.push(_obj.info_marker);
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
                    _obj.zoomPre=_obj.map_zoom;
                    _obj.map_zoom = _obj.map.getZoom();
                    _obj.zoomCur=_obj.map_zoom;
                    _obj.map_lat = _obj.searching_lat==""?_obj.map.getCenter().getLat():_obj.searching_lat;
                    _obj.map_lng = _obj.searching_lng==""?_obj.map.getCenter().getLng():_obj.searching_lng;
                    _obj.searching_lng="";
                    _obj.searching_lat="";
                    _obj.InfoWindow.close();
                    _obj.mapPointsUpdate();
                    //}
                });
                var dragListener = AMap.event.addListener(map, "dragend", function(e) {
                    //_obj.zoomPre=_obj.map_zoom;
                    //_obj.map_zoom = _obj.map.getZoom();
                    //_obj.zoomCur=_obj.map_zoom;
                    //_obj.map_lat = _obj.map.getCenter().getLat();
                    //_obj.map_lng = _obj.map.getCenter().getLng();
                    //_obj.mapPointsUpdate();
                    //$("#bike_result").hide();
                    //alert("fck");
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
    drawMass: function() {
        if (!this.massBuild) {
            if(_obj.areaList.length>0){_obj.map.setCenter(_obj.areaList[0].lnglat);this.massBuild = true;}
            var mass = this.mapMass = new AMap.MassMarks(this.areaList, {
                url: '/static/qbike/img/total.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 1
            });
            //var mass = this.mapMass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 2
            //}), {
            //    url: '/static/qbike/img/enable.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 1
            //});
            ////this.map_massList.push(this.mapMass);
            //var mass_inuse = this.iu_Mass = new AMap.MassMarks($.grep(this.areaList, function(e) {
            //    return e.status == 3
            //}), {
            //    url: '/static/qbike/img/in_use.png',
            //    anchor: new AMap.Pixel(23, 42),
            //    size: new AMap.Size(48, 51),
            //    opacity: 1,
            //    cursor: 'pointer',
            //    zIndex: 1
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
            //    zIndex: 1
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
            //    zIndex: 1
            //});
            //this.map_massList.push(this.ip_Mass);
            //this.ip_Mass.setMap(this.map);
            //this.map_massList.push(this.it_Mass);
            //this.it_Mass.setMap(this.map);
            //this.map_massList.push(this.iu_Mass);
            //this.iu_Mass.setMap(this.map);
            this.map_massList.push(this.mapMass);
            this.mapMass.setMap(this.map);
        }
        else{
            if(this.areaList.length>0){
                this.mapMass.show();
                this.mapMass.setData(this.areaList);
            }
            else this.mapMass.hide()
            //if($.grep(this.areaList, function(e) {return e.status == 3}).length>0){
            //    this.iu_Mass.show();
            //    this.iu_Mass.setData($.grep(this.areaList, function(e) {
            //        return e.status == 3
            //    }));
            //}
            //else this.iu_Mass.hide();
            //if($.grep(this.areaList, function(e) {return e.status == 4||e.status == 5}).length>0){
            //    this.it_Mass.show();
            //    this.it_Mass.setData($.grep(this.areaList, function(e) {
            //        return e.status == 4||e.status == 5
            //    }));
            //}
            //else this.it_Mass.hide();
            //if($.grep(this.areaList, function(e) {return e.status == 1}).length>0){
            //    this.ip_Mass.show();
            //    this.ip_Mass.setData($.grep(this.areaList, function(e) {
            //        return e.status == 1
            //    }));
            //}
            //else this.ip_Mass.hide();
        }

    },
    drawArea:function(){
        _obj=this;
        clearTimeout(_obj.shinningControl);
        _obj.shinningControl=null;
        if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
        if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
        if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
        _obj.F_circle=[];
        _obj.F_marker=[];
        _obj.F_line=[];
        var pt_list=[
            [121.462036, 31.021029],[121.466036, 31.026029],[121.462536, 31.024029],[121.452036, 31.031029],[121.482036, 31.011029]
        ];
        for(var i in pt_list) {
            var circle = new AMap.Circle({
                center: pt_list[i], // 圆心位置
                radius: 100, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 0.2, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                zIndex:30,
                fillOpacity: 0.35 //填充透明度
            });
            circle.randomZoom=parseInt(Math.random()*5);
            _obj.F_circle.push(circle);
            circle.setMap(_obj.map);
        }
        this.Shinning();
    },
    drawFlow:function(){
        _obj=this;
        clearTimeout(_obj.shinningControl);
        _obj.shinningControl=null;
        if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
        if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
        if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
        _obj.F_circle=[];
        _obj.F_marker=[];
        _obj.F_line=[];
        var pt_list=[
            [121.462036, 31.021029],[121.466036, 31.026029],[121.462536, 31.024029],[121.452036, 31.031029],[121.482036, 31.011029]
        ];
        for(var i in pt_list){
            var circle = new AMap.Circle({
                center: pt_list[i], // 圆心位置
                radius: 100, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 0.2, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                zIndex:30,
                fillOpacity: 0.35 //填充透明度
            });
            circle.randomZoom=parseInt(Math.random()*5);
            _obj.F_circle.push(circle);
            circle.setMap(_obj.map);
            for(var j in pt_list){
                if(pt_list[i]!=pt_list[j]){
                    var l_arr=[pt_list[i],pt_list[j]];
                    var polyline = new AMap.Polyline({
                        zIndex:0,
                        path: l_arr,            // 设置线覆盖物路径
                        strokeColor: '#3366FF',   // 线颜色
                        strokeOpacity: 0.6,         // 线透明度
                        strokeWeight: 5,          // 线宽
                        strokeStyle: 'solid',     // 线样式
                        strokeDasharray: [10, 5], // 补充线样式
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

            }
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
            url: _defautBiz.api("producer"),
            dataType: "json",
            method: "GET",
            success: function(resp) {
                if(resp.success && resp.data){
                    $(".producer-select").html("")
                    $(".producer-select").append('<option value="">全部</option>');
                    for(var i in resp.data)
                    $(".producer-select").append('<option value="'+resp.data[i]+'">'+resp.data[i]+'</option>');}
            }});
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
                    $("#request_num").text(parseInt(resp.data.userDemand).toLocaleString());
                    $("#proportion").text(resp.data.ratio);
                }
                else{
                    $("#user_num").text("--");
                    $("#bike_num").text("--");
                    $("#request_num").text("--");
                    $("#proportion").text("--");
                }
            }
        });

        $.ajax({
            url: _defautBiz.api("getCountData"),
            dataType: "json",
            method: 'get',
            success: function(data){
                data.success && data.returnCode == 0 && data.data && dispatch_obj.parseNumberData(data.data)
            }
        })
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
                        _obj.drawMass();
                        if($("#flow_sel").is(':checked'))_obj.drawFlow();
                        else _obj.drawArea();
                        $(".button_panel").show();
                    } else if (_obj.map_zoom <= 13 && _obj.map_zoom >= 10) {
                        $("#bike_result").hide();
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
                        if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
                        if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
                        _obj.F_circle=[];
                        _obj.F_marker=[];
                        _obj.F_line=[];
                        _obj.areaList = [];
                        if(_obj.areaOnMap.length>0)for(var i in _obj.areaOnMap)_obj.map.remove(_obj.areaOnMap[i]);
                        _obj.areaOnMap=[];
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
                        _obj.map.remove(_obj.map_markers);
                        _obj.massBuild = false;
                        for (var i in _obj.map_massList) _obj.map.remove(_obj.map_massList[i]);
                        _obj.map_massList = [];
                        if(_obj.F_circle.length>0)for(var i in _obj.F_circle)_obj.map.remove(_obj.F_circle[i]);
                        if(_obj.F_marker.length>0)for(var i in _obj.F_marker){_obj.map.remove(_obj.F_marker[i]);_obj.F_marker[i].stopMove()};
                        if(_obj.F_line.length>0)for(var i in _obj.F_line)_obj.map.remove(_obj.F_line[i]);
                        _obj.F_circle=[];
                        _obj.F_marker=[];
                        _obj.F_line=[];
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
    Shinning:function(){
        _obj = this;
        if(_obj.F_circle.length>0)for(var i in _obj.F_circle){
            _obj.F_circle[i].randomZoom=_obj.F_circle[i].randomZoom<5?(_obj.F_circle[i].randomZoom+1):1;
            _obj.F_circle[i].setRadius(_obj.F_circle[i].randomZoom*20);
            if(_obj.shinningZoom%2==0)_obj.F_circle[i].setOptions({fillColor: "#ee2200",strokeColor: '#F33'});
            else _obj.F_circle[i].setOptions({fillColor: "rgba(17,0,255,255)",strokeColor:"rgba(17,0,255,255)"});
        }
        _obj.shinningControl=setTimeout(function(){_obj.Shinning()},150);
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
//dispatch_obj.map.setMapStyle('normal');
//},10000);
//function Data_refresh(){
//    dispatch_obj.refreshData();
//    setTimeout(function(){Data_refresh()},10000)
//}
dispatch_obj.Data_refresh();
dispatch_obj.KillInterval();


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
    function saveArea(_v){
    $("#save_confirm").attr("save_indx",_v);
    $("#save_area").modal('show');
}




var xhr = new XMLHttpRequest();

//监听选择文件信息
function fileSelected() {
    //HTML5文件API操作
    var file = document.getElementById('uploadFile').files[0];
    if (file) {
        var fileSize = 0;
        if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        document.getElementById('uploadFile').innerHTML = 'Name: ' + file.name;
        document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
        document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
    }
}

//上传文件
function uploadFile() {
    if(document.getElementById('uploadFile').files[0]){
    var fd = new FormData();
    //关联表单数据,可以是自定义参数
    //fd.append("name", document.getElementById('name').value);
    fd.append("uploadFile", document.getElementById('uploadFile').files[0]);

    //监听事件
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    //发送文件和表单自定义参数
    xhr.open("POST", "<%=path%>/user/uploadifyTest_doUpload");
    xhr.send(fd);
    }
}
//取消上传
function cancleUploadFile(){
    xhr.abort();
}
//开锁
function openLock(){
    var lockId=$("#lock-id").val();
    $.ajax({
        url: _defautBiz.api("openLock"),
        dataType: "json",
        method: 'get',
        data: {
            lockId: lockId
        },
        success: function(data) {
        }
});
}
//开蜂鸣器
function openBeep(){
    var lockId=$("#lock-id").val();
    $.ajax({
        url: _defautBiz.api("openBeep"),
        dataType: "json",
        method: 'get',
        data: {
            lockId: lockId
        },
        success: function(data) {
        }
    });
}

//上传进度
function uploadProgress(evt) {
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
    }
    else {
        document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
}

//上传成功响应
function uploadComplete(evt) {
    //服务断接收完文件返回的结果
    alert(evt.target.responseText);
}

//上传失败
function uploadFailed(evt) {
    alert("上传失败");
}
//取消上传
function uploadCanceled(evt) {
    alert("您取消了本次上传.");
}
//导出表格
function to_excell(){
    $("#f_info").text("确定要导出这些记录么？");
    $("#judge_alert").modal('show');
}
//渠道转换
function parseChannel(source){
    switch (source){
        //case '':
        //    return "--";
        case '1':
            return "通讯平台";
        default:
            return "第三方平台";
    }
}


$("#save_judge").on('click',function(){
    var lockId = $('.lock-id').val();
    var url=dispatch_obj.status!=undefined?("lockId="+lockId+"&status="+dispatch_obj.status+"&pow="+dispatch_obj.pow+"&channel="+dispatch_obj.channel+"&producer="+dispatch_obj.producer):("lockId="+lockId);
    window.open(_defautBiz.api("export")+url)
    $("#judge_alert").modal('hide');
    //$.ajax({
    //    url: _defautBiz.api("export"),
    //    dataType: "json",
    //    method: 'get',
    //    data: {
    //        lockId: lockId
    //    },
    //    // beforeSend: function(xhr) {
    //    //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
    //    // },
    //    success: function(data) {
    //        if(data.success){
    //            $("#judge_alert").modal('hide');
    //        }
    //    }});
});