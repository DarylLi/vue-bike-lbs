/**
 * Created by lihaotian on 2017/2/27.
 */
$('#createTime_from').datetimepicker({format: 'yyyy-mm-dd hh:ii'});
$('#createTime_to').datetimepicker({format: 'yyyy-mm-dd hh:ii'});
var MapControl="";
var testing_linedata = [getRDList(), getRDList(), getRDList()];
var testing_xaxis = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
var clickListener="";
var moveListener="";
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
                    list_list: "/bike/report/list",
                    warn_list: "/bike/report/warningList",
                    bikedetail: "/bike/report/detail",
                    hist: "/bike/report/hist",
                    order: "/bike/report/order",
                    reply: "/bike/report/reply",
                    //车辆列表骑行收益
                    cost: "/bike/report/cost",
                    //预警车辆预警类型统计
                    warnType: "/bike/report/warnType",
                    cityList:"/bike/putArea/list",
                    trackMode:"/bike/report/trackMode",
                    bikeExport:"/bike/report/bikeExport",
                    warnExport:"/bike/report/warningBikeExport",
                }
            }
        }
    };
var anal_obj = {
    map:null,
    list_size:10,
    warn_size:10,
    geocoder: null,
    cur_pos:[],
    gps_pos:[],
    geo_type: 0,
    bike_id:""||localStorage.cardId,
    list_url:"",
    warn_url:"",
    only_mass:"",
    init:function(){
        if(localStorage.carInfo){
            $('.select-panel').eq(2).addClass('active').siblings().removeClass('active');
            $('#car_detail_row').show().prev().hide().prev().hide();
            $('#search-panel').val(localStorage.cardId);
            this.render_cardetail();

            setTimeout(function(){
                localStorage.carInfo="";
            },1000)
        }
        var geocoder = this.geocoder = new AMap.Geocoder({
            radius: 1000 //范围，默认：500
        });
        $.ajax({
            url:_defautBiz.api("cityList"),
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp1) {
                $("#list-city").html("");
                $("#list-city").append('<option value="">全部</option>');
                for(var i in resp1.data){
                    $("#list-city").append('<option value="'+resp1.data[i].areacode+'">'+resp1.data[i].areaname+'</option>');
                }
            }});
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.componentinit();
        this.render_carList(this.list_size);
    },
    render_carList:function(tot){
        var _obj=this;
        var url="?pageSize="+tot+"&currPage=1";
        var var_city=$("#list-city").val()!=0?("&cityId="+$("#list-city").val()):"";
        var var_state=$("#list-state").val()!=0?("&bikeStatus="+$("#list-state").val()):"";
        var var_id=$("#list-id").val()?("&bikeId="+$("#list-id").val()):"";
        $.ajax({
            url:_defautBiz.api("list_list")+url+var_city+var_state+var_id,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                $("#car_table tbody").html("");
                $("#list-tot").text(resp.data.total);
                var data_append="";
                for(var i in resp.data.datas){
                    //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                    var bikeStatus=resp.data.datas[i].bikeStatus?
                    (function(status){
                        switch (parseInt(status)) {
                            case 1:
                                return '已预约';
                                break;
                            case 2:
                                return '空闲';
                                break;
                            case 3:
                                return '使用中';
                                break;
                            case 4:
                                return '已损坏';
                                break;
                            case 5:
                                return '已告警';
                                break;
                            default:
                                return '可用';
                        }
                    })(resp.data.datas[i].bikeStatus):"";
                    data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td>"+(resp.data.datas[i].putDate?resp.data.datas[i].putDate:"")+"</td><td>"+(resp.data.datas[i].cost?resp.data.datas[i].cost:"")+"</td><td>"+(resp.data.datas[i].effectiveOrderCount?resp.data.datas[i].effectiveOrderCount:"")+"</td><td>"+(resp.data.datas[i].rideCount?resp.data.datas[i].rideCount:"")+"</td><td>"+(resp.data.datas[i].userCount?resp.data.datas[i].userCount:"")+"</td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td><td>"+(resp.data.datas[i].distance?resp.data.datas[i].distance:"")+"</td><td>"+bikeStatus+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                }
                $("#car_table tbody").append(data_append);
                $("[data-toggle='tooltip']").tooltip();
                $("#car_table a").on("click",function(){
                    _obj.bike_id=$(this).attr("link_id");
                    _obj.render_cardetail();
                    $(".select-panel").removeClass("active");
                    $("#car_detail").closest(".select-panel").addClass("active");
                    $("#car_list_row").hide();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").show();
                })
                $('#list-box').pagination({
                    totalData:resp.data.total,
                    showData:tot,
                    jump:true,
                    coping:true,
                    callback:function(index){
                        var num=index.getCurrent();
                        _obj.refresh_carList(tot,num);
                    }
                })

            }});
        var _v = new Date().getTime();
        $.ajax({
            url:_defautBiz.api("cost")+"?_v="+_v+var_city+var_state+var_id,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                $("#list-earn").text(resp.data);
            }});
    },
    refresh_carList:function(tot,index){
        var _obj=this;
        var var_city=$("#list-city").val()?("&cityId="+$("#list-city").val()):"";
        var var_state=$("#list-state").val()?("&bikeStatus="+$("#list-state").val()):"";
        var var_id=$("#list-id").val()?("&bikeId="+$("#list-id").val()):"";
        var url="?pageSize="+tot+"&currPage="+index+var_id+var_city+var_state;
        $.ajax({
            url:_defautBiz.api("list_list")+url,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                $("#car_table tbody").html("");
                $("#list-tot").text(resp.data.total);
                var data_append="";
                for(var i in resp.data.datas){
                    //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                    var bikeStatus=resp.data.datas[i].bikeStatus?
                        (function(status){
                            switch (parseInt(status)) {
                                case 1:
                                    return '已预约';
                                    break;
                                case 2:
                                    return '空闲';
                                    break;
                                case 3:
                                    return '使用中';
                                    break;
                                case 4:
                                    return '已损坏';
                                    break;
                                case 5:
                                    return '已告警';
                                    break;
                                default:
                                    return '可用';
                            }
                        })(resp.data.datas[i].bikeStatus):"";
                    data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td>"+(resp.data.datas[i].putDate?resp.data.datas[i].putDate:"")+"</td><td>"+(resp.data.datas[i].cost?resp.data.datas[i].cost:"")+"</td><td>"+(resp.data.datas[i].effectiveOrderCount?resp.data.datas[i].effectiveOrderCount:"")+"</td><td>"+(resp.data.datas[i].rideCount?resp.data.datas[i].rideCount:"")+"</td><td>"+(resp.data.datas[i].userCount?resp.data.datas[i].userCount:"")+"</td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td><td>"+(resp.data.datas[i].distance?resp.data.datas[i].distance:"")+"</td><td>"+bikeStatus+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                }
                $("#car_table tbody").append(data_append);
                $("[data-toggle='tooltip']").tooltip();
                $("#car_table a").on("click",function(){
                    _obj.bike_id=$(this).attr("link_id");
                    _obj.render_cardetail();
                    $(".select-panel").removeClass("active");
                    $("#car_detail").closest(".select-panel").addClass("active");
                    $("#car_list_row").hide();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").show();
                })
            }});
    },
    render_carWarn:function(tot){
        var _obj=this;
        var url="?pageSize="+tot+"&currPage=1";
        var var_city=$("#warn-city").val()!=0?("&cityId="+$("#warn-city").val()):"";
        var var_state=$("#warn-state").val()!=0?("&warnType="+$("#warn-state").val()):"";
        var var_id=$("#warn-id").val()?("&bikeId="+$("#warn-id").val()):"";
        $.ajax({
            url:_defautBiz.api("cityList"),
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp1) {
                $("#warn-city").html("");
                $("#warn-city").append('<option value="">全部</option>');
                for(var i in resp1.data){
                    $("#warn-city").append('<option value="'+resp1.data[i].areacode+'">'+resp1.data[i].areaname+'</option>');
                }
            }});
        $.ajax({
            url:_defautBiz.api("warn_list")+url+var_city+var_state+var_id,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                $("#warn_table tbody").html("");
                var data_append="";
                for(var i in resp.data.datas){
                    //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                    var bikeStatus=resp.data.datas[i].bikeStatus?
                        (function(status){
                            switch (parseInt(i)) {
                                case 1:
                                    return '已预约';
                                    break;
                                case 2:
                                    return '空闲';
                                    break;
                                case 3:
                                    return '使用中';
                                    break;
                                case 4:
                                    return '已损坏';
                                    break;
                                case 5:
                                    return '已告警';
                                    break;
                                default:
                                    return '可用';
                            }
                        })(resp.data.datas[i].bikeStatus):"";
                    data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td><td>"+(resp.data.datas[i].unuploadTime?resp.data.datas[i].unuploadTime:"")+"</td><td>"+(resp.data.datas[i].unrideTime?resp.data.datas[i].unrideTime:"")+"</td><td>"+(resp.data.datas[i].unlockTime?resp.data.datas[i].unlockTime:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"</span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"</span></td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].pos?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                    //data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td><td>"+(resp.data.datas[i].unuploadTime?resp.data.datas[i].unuploadTime:"")+"</td><td>"+(resp.data.datas[i].unrideTime?resp.data.datas[i].unrideTime:"")+"</td><td>"+(resp.data.datas[i].unlockTime?resp.data.datas[i].unlockTime:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"</span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"</span></td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].gpsLoc?resp.data.datas[i].gpsLoc:"")+"' >"+(resp.data.datas[i].gpsPos?resp.data.datas[i].gpsLoc:"")+"</span></td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].pos?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                }
                $("#warn_table tbody").append(data_append);
                $("[data-toggle='tooltip']").tooltip();
                $("#warn_table a").on("click",function(){
                    _obj.bike_id=$(this).attr("link_id");
                    _obj.render_cardetail();
                    $(".select-panel").removeClass("active");
                    $("#car_detail").closest(".select-panel").addClass("active");
                    $("#car_list_row").hide();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").show();
                });
                $('#warn-box').pagination({
                    totalData:resp.data.total,
                    showData:tot,
                    jump:true,
                    coping:true,
                    callback:function(index){
                        var num=index.getCurrent();
                        _obj.refresh_carWarn(tot,num);
                    }
                });
                var _v = new Date().getTime();
                $.ajax({
                    url:_defautBiz.api("warnType")+"?_v="+_v+var_city+var_state+var_id,
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    dataType: "json",
                    method: 'get',
                    success: function(resp1) {
                        $("#warn-tot").text(resp.data.total);
                        $("#warn-off").text($.grep(resp1.data,function(e,i){return e.warnType==8})[0].count);
                        $("#warn-low").text($.grep(resp1.data,function(e,i){return e.warnType==3})[0].count);
                        $("#warn-unlock").text($.grep(resp1.data,function(e,i){return e.warnType==9})[0].count);
                        $("#warn-notuse").text($.grep(resp1.data,function(e,i){return e.warnType==5})[0].count);
                    }})

            }});
    },
    refresh_carWarn:function(tot,index){
        var _obj=this;
        var var_city=$("#warn-city").val()?("&cityId="+$("#warn-city").val()):"";
        var var_state=$("#warn-state").val()?("&warnType="+$("#warn-state").val()):"";
        var var_id=$("#warn-id").val()?("&bikeId="+$("#warn-id").val()):"";
        var url="?pageSize="+tot+"&currPage="+index+var_city+var_state+var_id;
        $.ajax({
            url:_defautBiz.api("warn_list")+url,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                $("#warn_table tbody").html("");
                var data_append="";
                for(var i in resp.data.datas){
                    //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                    var bikeStatus=resp.data.datas[i].bikeStatus?
                        (function(status){
                            switch (parseInt(i)) {
                                case 1:
                                    return '已预约';
                                    break;
                                case 2:
                                    return '空闲';
                                    break;
                                case 3:
                                    return '使用中';
                                    break;
                                case 4:
                                    return '已损坏';
                                    break;
                                case 5:
                                    return '已告警';
                                    break;
                                default:
                                    return '可用';
                            }
                        })(resp.data.datas[i].bikeStatus):"";
                    data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td><td>"+(resp.data.datas[i].unuploadTime?resp.data.datas[i].unuploadTime:"")+"</td><td>"+(resp.data.datas[i].unrideTime?resp.data.datas[i].unrideTime:"")+"</td><td>"+(resp.data.datas[i].unlockTime?resp.data.datas[i].unlockTime:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"</span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"</span></td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].gpsLoc?resp.data.datas[i].gpsLoc:"")+"' >"+(resp.data.datas[i].gpsLoc?resp.data.datas[i].gpsLoc:"")+"</span></td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                }
                $("#warn_table tbody").append(data_append);
                $("[data-toggle='tooltip']").tooltip();
                $("#warn_table a").on("click",function(){
                    _obj.bike_id=$(this).attr("link_id");
                    _obj.render_cardetail();
                    $(".select-panel").removeClass("active");
                    $("#car_detail").closest(".select-panel").addClass("active");
                    $("#car_list_row").hide();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").show();
                });
            }});
    },
    render_cardetail:function(){
        var _obj=this;
        var map = this.map = new AMap.Map('mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoomEnable: false,
            dragEnable: false,
            keyboardEnable: false,
            doubleClickZoom: false,
            zoom: 4,
            center: [102.342785, 35.312316]
        });
        $("#map-ctrl-satellite span").text("卫星图");$("#map-ctrl-satellite").removeClass("active");_obj.map.setLayers([new AMap.TileLayer()]);
        var url=this.bike_id?("?bikeId="+this.bike_id):"";
        $("#fb_table tbody").html("");
        $("#order_table tbody").html("");
        $("#pos_table tbody").html("");
        $("#cur_pos").text("")
        $("#bike_id").text("");
        $("#lock_id").text("");
        $("#bike_status").text("");
        $("#warn_type").text("");
        $("#tot_fb").text("0");
        $("#no_fb").text("0");
        if(this.bike_id){
        $.ajax({
            url:_defautBiz.api("bikedetail")+url,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                if(resp.data.bikeId){
                    $("#result_panel").show();
            $("#bike_id").text(resp.data.bikeId);
            $("#track_switch").attr("stat",resp.data.trackStatus?"close":"open").text(resp.data.trackStatus?"关闭追踪模式":"开启追踪模式");
            $("#lock_id").text(resp.data.lockId);
            $("#bike_status").text(resp.data.bikeStatusStr);
                    if(resp.data.warnTypes){
                        $("#warn_type").text(resp.data.warnTypes.length>0?resp.data.warnTypes[0]:"");
                        $("#warn_type").text(resp.data.warnTypes.length>1?(resp.data.warnTypes[0]+"等"):resp.data.warnTypes[0]);
                    }
                    //$("#warn_fix").html("<a href='javascript:void(0)' lng='121.6269017' lat='31.2020191'>ffc</a>");
                    $("#warn_fix").html("<a href='javascript:void(0)' lng='" + resp.data.pos[0] + "' lat='" + resp.data.pos[1] + "'>"+resp.data.locTypeStr+"</a>");
                    $("#warn_fix a").on("click",function(){
                        var new_lng=$(this).attr("lng");
                        var new_lat=$(this).attr("lat");
                        _obj.geocoder.getAddress([new_lng,new_lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                $("#cur_pos").text(result.regeocode.formattedAddress)
                            }
                            else{
                                $("#cur_pos").text("未知")
                            }
                        })
                        _obj.map.setZoomAndCenter(17,[$(this).attr("lng"),$(this).attr("lat")]);
                        _obj.only_mass.setData([
                            {
                                "lnglat": [new_lng,new_lat],
                            }
                        ]);
                    });
                    _obj.map.setZoomAndCenter(17,resp.data.pos);
                var bikeList=[];
                bikeList.push({
                    "lnglat": resp.data.pos
                });
                    var img_url=(function(status){
                        switch(status){
                            //case "":
                            //    return  '/static/qbike/img/in_date_Max.png';
                            //    break;
                            case "空闲":
                                return  '/static/qbike/img/enable.png';
                                break;
                            case "使用中":
                                return  '/static/qbike/img/in_use.png';
                                break;
                            case "离线":
                                return  '/static/qbike/img/in_trouble.png';
                                break;
                            //case 5:
                            //    return  '/static/qbike/img/in_trouble_Max.png';
                            //    break;
                            //default:
                            //    return  '/static/qbike/img/enable_Max.png';
                        }
                    })(resp.data.bikeStatusStr?resp.data.bikeStatusStr:"离线")
                    _obj.only_mass = new AMap.MassMarks(bikeList, {
                    //url: '/static/qbike/img/img_url.png',
                    url: img_url,
                    anchor: new AMap.Pixel(23, 42),
                    size: new AMap.Size(48, 51),
                    opacity: 1,
                    cursor: 'pointer',
                    zIndex: 100
                });
                 _obj.only_mass.setMap(_obj.map);
                _obj.geocoder.getAddress(resp.data.pos, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        $("#cur_pos").text(result.regeocode.formattedAddress)
                    }
                    else{
                        $("#cur_pos").text("未知")
                    }
                });
                }
                else{
                    $("#result_panel").hide();
                    $("#s_info").text("搜索无结果!");
                    $("#search_rslt").modal('show');
                }
            }});
        $.ajax({
            url:_defautBiz.api("reply")+url,
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                var fbList="";
                $("#tot_fb").text(resp.data.total)
                $("#no_fb").text(resp.data.untreated)
                for(var i in resp.data.datas){
                    fbList+="<tr><td>"+(parseInt(i)+1)+"</td><td>"+resp.data.datas[i].userName+"</td><td>"+new Date(resp.data.datas[i].replyTime).format("MM.dd hh:mm:ss")+"</td><td>"+resp.data.datas[i].replyContent+"</td></tr>";
                }
                $("#fb_table tbody").append(fbList);
            }});
            $.ajax({
                url:_defautBiz.api("order")+url,
                //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    var fbList="";
                    for(var i in resp.data){
                        var orderStatus=resp.data[i].status?
                            (function(status){
                                switch (status) {
                                    case 0:
                                        return '未支付';
                                        break;
                                    case 1:
                                        return '支付中';
                                        break;
                                    case 2:
                                        return '支付成功';
                                        break;
                                    default:
                                        return '未知';
                                        break;
                                }
                            })(resp.data[i].status):"";
                        fbList+="<tr><td>"+resp.data[i].orderId+"</td><td>"+resp.data[i].userName+"</td><td>"+resp.data[i].userId+"</td><td>"+(resp.data[i].status?orderStatus:"")+"</td>"+"<td>"+resp.data[i].cost+"</td>"+"<td>"+new Date(resp.data[i].startTime).format("MM.dd hh:mm:ss")+"</td>"+"<td>"+resp.data[i].useTime+"</td>"+"<td>"+resp.data[i].distance+"</td>"+"</tr>";
                    }
                    $("#order_table tbody").append(fbList);
                }});
            $.ajax({
                url:_defautBiz.api("hist")+url+"&isGps="+_obj.geo_type,
                //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    var fbList="";
                    for(var i in resp.data){
                        var orderStatus=resp.data[i].status?
                            (function(status){
                                switch (parseInt(i)) {
                                    case 0:
                                        return '未支付';
                                        break;
                                    case 1:
                                        return '支付中';
                                        break;
                                    case 2:
                                        return '支付成功';
                                        break;
                                }
                            })(resp.data[i].status):"";
                        fbList+="<tr><td>"+resp.data[i].warnInfo+"</td><td>"+resp.data[i].lockStatus+"</td><td>"+resp.data[i].lng+"</td>"+"<td>"+resp.data[i].lat+"</td>"+"<td><a href='javascript:void(0)' lng='"+resp.data[i].lng+"' lat='"+resp.data[i].lat+"'>"+(resp.data[i].prov+resp.data[i].city+resp.data[i].district)+"</a></td>"+"<td>"+new Date(resp.data[i].ts).format("MM.dd hh:mm:ss")+"</td>"+"<td>"+resp.data[i].locTypeStr+"</td>"+"<td>"+resp.data[i].power+"</td>"+"</tr>";
                    }
                    $("#pos_table tbody").append(fbList);
                    $("#pos_table a").on("click",function(){
                        var new_lng=$(this).attr("lng");
                        var new_lat=$(this).attr("lat");
                        _obj.geocoder.getAddress([new_lng,new_lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                $("#cur_pos").text(result.regeocode.formattedAddress)
                            }
                            else{
                                $("#cur_pos").text("未知")
                            }
                        })
                        _obj.map.setZoomAndCenter(17,[$(this).attr("lng"),$(this).attr("lat")]);
                        _obj.only_mass.setData([
                            {
                                "lnglat": [new_lng,new_lat],
                            }
                        ]);
                    })
                }});
        }
    },
    formattPos:function(target,lng,lat){
        var _obj=this;
            this.geocoder.getAddress([lng,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    $("#"+target).text(result.regeocode.formattedAddress.split("市")[1])

                }
                else{
                    $("#"+target).text("未知")
                }
            })
            //return "";

    },
    componentinit:function(){
        var op_obj=this;
        $("#map-ctrl-satellite").on("click",function(){
            //window.history.go(-1);
            if(!$(this).hasClass("active")){$("#map-ctrl-satellite span").text("地图");$(this).addClass("active");op_obj.satellite=[new AMap.TileLayer.Satellite(),new AMap.TileLayer.RoadNet()];op_obj.map.setLayers(op_obj.satellite)}
            else {$("#map-ctrl-satellite span").text("卫星图");$(this).removeClass("active");op_obj.map.setLayers([new AMap.TileLayer()])}
            op_obj.only_mass.setMap(op_obj.map);
            //_obj.massBuild=false;
            //_obj.drawMass();
        })
        $("#list-export").on("click",function(){
            var url="?bikeId="+$("#list-id").val()+"&bikeStatus="+$("#list-state").val()+"&cityId="+$("#list-city").val();
            window.open(_defautBiz.api("bikeExport")+url)
        });
        $("#warn-export").on("click",function(){
            var url="?bikeId="+$("#warn-id").val()+"&warnType="+$("#warn-state").val()+"&cityId="+$("#warn-city").val();
            window.open(_defautBiz.api("warnExport")+url)
        });
        $("#track_switch").on("click",function(){
            var _obj=this;
            $.ajax({
                        url:_defautBiz.api("trackMode"),
                        //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                        dataType: "json",
                        data: {
                            bikeId: $("#bike_id").text(),
                            open:$(this).attr("stat")=="open"?1:0
                        },
                        method: 'get',
                        success: function(resp) {
                            if(resp.success){
                                $("#s_info").text("操作成功");
                                $("#search_rslt").modal('show')
                                $(_obj).attr("stat",$(_obj).attr("stat")=="open"?"close":"open");
                                $(_obj).text($(_obj).attr("stat")=="open"?"开启追踪模式":"关闭追踪模式");
                    }
                            else{
                                $("#s_info").text(resp.message);
                                $("#search_rslt").modal('show');
                            }
                }});
        })

        $("#car-list button").on("click",function(){
            $("#car-list button").removeClass("active");
            $(this).addClass("active");
            op_obj.list_size=$(this).text();
            op_obj.render_carList(op_obj.list_size);
        });
        $("#car-warn button").on("click",function(){
            $("#car-warn button").removeClass("active");
            $(this).addClass("active");
            op_obj.warn_size=$(this).text();
            op_obj.render_carWarn(op_obj.warn_size);
        });
        $("#map-ctrl-gps").on("click",function() {
            if(op_obj.bike_id) {
                //window.history.go(-1);;
                if (!$(this).hasClass("active")) {
                    op_obj.geo_type = 1;
                    $(this).addClass("active");

                }
                else {
                    op_obj.geo_type = 0;
                    $(this).removeClass("active");
                }
                var url = op_obj.bike_id ? ("?bikeId=" + op_obj.bike_id) : "";
                $("#pos_table tbody").html("");
                $.ajax({
                    url: _defautBiz.api("hist") + url + "&isGps=" + op_obj.geo_type,
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    dataType: "json",
                    method: 'get',
                    success: function (resp) {
                        var fbList = "";
                        for (var i in resp.data) {
                            var orderStatus = resp.data[i].status ?
                                (function (status) {
                                    switch (parseInt(i)) {
                                        case 0:
                                            return '未支付';
                                            break;
                                        case 1:
                                            return '支付中';
                                            break;
                                        case 2:
                                            return '支付成功';
                                            break;
                                    }
                                })(resp.data[i].status) : "";
                            fbList += "<tr><td>" + resp.data[i].warnInfo + "</td><td>" + resp.data[i].lockStatus + "</td><td>" + resp.data[i].lng + "</td>" + "<td>" + resp.data[i].lat + "</td>" + "<td><a href='javascript:void(0)' lng='" + resp.data[i].lng + "' lat='" + resp.data[i].lat + "'>" + (resp.data[i].prov + resp.data[i].city + resp.data[i].district) + "</a></td>" + "<td>" + new Date(resp.data[i].ts).format("MM.dd hh:mm:ss") + "</td>" + "<td>" + resp.data[i].locTypeStr + "</td>" + "<td>" + resp.data[i].power + "</td>" + "</tr>";
                        }
                        $("#pos_table tbody").append(fbList);
                        $("#pos_table a").on("click", function () {
                            var new_lng = $(this).attr("lng");
                            var new_lat = $(this).attr("lat");
                            op_obj.map.setZoomAndCenter(17, [$(this).attr("lng"), $(this).attr("lat")]);
                            op_obj.only_mass.setData([
                                {
                                    "lnglat": [new_lng, new_lat],
                                }
                            ]);
                        });
                        $("#cur_pos").text("未知");
                        op_obj.only_mass.hide();
                        if (resp.data.length > 0) {
                            op_obj.map.setZoomAndCenter(17, [resp.data[0].lng, resp.data[0].lat]);
                            op_obj.geocoder.getAddress([resp.data[0].lng, resp.data[0].lat], function(status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    $("#cur_pos").text(result.regeocode.formattedAddress)
                                }
                                else{
                                    $("#cur_pos").text("未知")
                                }
                            })
                            op_obj.only_mass.setData([
                                {
                                    "lnglat": [resp.data[0].lng, resp.data[0].lat],
                                }
                            ]);
                            op_obj.only_mass.show();
                        }
                    }
                })
            }
        });
        $("#warn-searching").on("click",function(){
            var url="?pageSize="+op_obj.warn_size+"&currPage=1";
            //var var_city=$("#warn-city").val()?("&cityId="+$("#warn-city").val()):"";
            //var var_state=$("#warn-state").val()?("&warnType="+$("#warn-state").val()):"";
            //var var_id=$("#warn-id").val()?("&bikeId="+$("#warn-id").val()):"";
            //if($("#warn-id").val()){
                var var_city=$("#warn-city").val()?("&cityId="+$("#warn-city").val()):"";
                var var_state=$("#warn-state").val()?("&warnType="+$("#warn-state").val()):"";
                var var_id=$("#warn-id").val()?("&bikeId="+$("#warn-id").val()):"";
                op_obj.warn_url="?pageSize="+op_obj.warn_size+"&currPage=1"+var_city+var_state+var_id;
                $.ajax({
                        url:_defautBiz.api("warn_list")+op_obj.warn_url,
                        //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                        dataType: "json",
                        method: 'get',
                        success: function(resp) {
                            $("#warn_table tbody").html("");
                            var data_append = "";
                            for (var i in resp.data.datas) {
                                //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                                var warnStatus = resp.data.datas[i].status ?
                                    (function (status) {
                                        switch (parseInt(i)) {
                                            //0: 未知, 1:车辆丢失, 2:车辆损坏, 3:车辆电量低, 4:异常移动, 5:长时未用, 6:撬锁，7:撞击上传,8:离线,9:长时间未锁
                                            case 0:
                                                return '未知';
                                                break;
                                            case 1:
                                                return '车辆丢失';
                                                break;
                                            case 2:
                                                return '车辆损坏';
                                                break;
                                            case 3:
                                                return '车辆电量低';
                                                break;
                                            case 4:
                                                return '异常移动';
                                                break;
                                            case 5:
                                                return '长时未用';
                                                break;
                                            case 6:
                                                return '撬锁';
                                                break;
                                            case 7:
                                                return '撞击上传';
                                                break;
                                            case 8:
                                                return '离线';
                                                break;
                                            case 9:
                                                return '长时间未锁';
                                                break;
                                            default:
                                                return '未知';
                                        }
                                    })(resp.data.datas[i].status) : "";
                                data_append+="<tr><td>"+(resp.data.datas[i].putAreaName?resp.data.datas[i].putAreaName:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>"+(resp.data.datas[i].currProvince?resp.data.datas[i].currProvince:"")+"</td><td>"+(resp.data.datas[i].currCity?resp.data.datas[i].currCity:"")+"</td><td>"+(resp.data.datas[i].currDistrict?resp.data.datas[i].currDistrict:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>"+(resp.data.datas[i].power?resp.data.datas[i].power:"")+"</td><td>"+(resp.data.datas[i].unuploadTime?resp.data.datas[i].unuploadTime:"")+"</td><td>"+(resp.data.datas[i].unrideTime?resp.data.datas[i].unrideTime:"")+"</td><td>"+(resp.data.datas[i].unlockTime?resp.data.datas[i].unlockTime:"")+"</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].timeCurr?new Date(resp.data.datas[i].timeCurr).format("MM.dd hh:mm:ss"):"")+"</span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"'>"+(resp.data.datas[i].startTime?new Date(resp.data.datas[i].startTime).format("MM.dd hh:mm:ss"):"")+"</span></td><td>"+(resp.data.datas[i].useTime?resp.data.datas[i].useTime:"")+"</td>"+"<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >"+(resp.data.datas[i].pos?resp.data.datas[i].loc:"")+"</span></td>"+"</tr>";
                            }
                            var _v = new Date().getTime();
                            $.ajax({
                                url:_defautBiz.api("warnType")+"?_v="+_v+var_city+var_state+var_id,
                                //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                                dataType: "json",
                                method: 'get',
                                success: function(resp1) {
                                    $("#warn-tot").text(resp.data.total);
                                    $("#warn-off").text($.grep(resp1.data,function(e,i){return e.warnType==8})[0].count);
                                    $("#warn-low").text($.grep(resp1.data,function(e,i){return e.warnType==3})[0].count);
                                    $("#warn-unlock").text($.grep(resp1.data,function(e,i){return e.warnType==9})[0].count);
                                    $("#warn-notuse").text($.grep(resp1.data,function(e,i){return e.warnType==5})[0].count);
                                }})
                            $("#warn_table tbody").append(data_append);
                            $("[data-toggle='tooltip']").tooltip();
                            $("#warn_table a").on("click",function(){
                                op_obj.bike_id=$(this).attr("link_id");
                                op_obj.render_cardetail();
                                $(".select-panel").removeClass("active");
                                $("#car_detail").closest(".select-panel").addClass("active");
                                $("#car_list_row").hide();
                                $("#car_warn_row").hide();
                                $("#car_detail_row").show();
                            });
                            $('#warn-box').pagination({
                                totalData: resp.data.total,
                                showData: op_obj.warn_size,
                                jump: true,
                                coping: true,
                                callback: function (index) {
                                    var num = index.getCurrent();
                                    op_obj.refresh_carWarn(op_obj.warn_size, num);
                                }
                            })
                        }
                    }
                );
;
            //}
            //else{
            //    $("#s_info").text("请输入车辆编号");
            //    $("#search_rslt").modal('show');
            //}
        })
        $("#list-searching").on("click",function(){
                $("#list-earn").text("");
                $("#list-tot").text("");
                var url="?pageSize="+op_obj.list_size+"&currPage=1";
                //if($("#list-id").val()){
                var var_city=$("#list-city").val()?("&cityId="+$("#list-city").val()):"";
                var var_state=$("#list-state").val()?("&bikeStatus="+$("#list-state").val()):"";
                var var_id=$("#list-id").val()?("&bikeId="+$("#list-id").val()):"";
                op_obj.list_url="?pageSize="+op_obj.list_size+"&currPage=1"+var_city+var_state+var_id;
                $.ajax({
                    url:_defautBiz.api("list_list")+op_obj.list_url,
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    dataType: "json",
                    method: 'get',
                    success: function(resp) {
                        $("#car_table tbody").html("");
                        $("#list-tot").text(resp.data.total);
                        var data_append = "";
                        for (var i in resp.data.datas) {
                            //data_append+="<tr><td>"+resp.data.data.datas[i].lockId+"</td><td>"+resp.data.data.datas[i].warnInfo+"</td><td>"+resp.data.data.datas[i].status+"</td><td>"+resp.data.data.datas[i].lng+"</td><td>"+resp.data.data.datas[i].lat+"</td><td>"+resp.data.data.datas[i].location+"</td><td>"+resp.data.data.datas[i].sysTimeStr+"</td><td>"+resp.data.data.datas[i].equipmentTimeStr+"</td><td>"+resp.data.data.datas[i].openLockCount+"</td><td>"+resp.data.data.datas[i].power+"%</td><td>"+resp.data.data.datas[i].locationModel+"</td><td>"+resp.data.data.datas[i].gsmSignal+"</td><td>"+resp.data.data.datas[i].gpsSignal+"</td><td>"+resp.data.data.datas[i].altitude+"</td><td>"+resp.data.data.datas[i].speed+"</td></tr>";
                            var bikeStatus = resp.data.datas[i].bikeStatus ?
                                (function (status) {
                                    switch (parseInt(status)) {
                                        case 1:
                                            return '已预约';
                                            break;
                                        case 2:
                                            return '空闲';
                                            break;
                                        case 3:
                                            return '使用中';
                                            break;
                                        case 4:
                                            return '已损坏';
                                            break;
                                        case 5:
                                            return '已告警';
                                            break;
                                        default:
                                            return '可用';
                                    }
                                })(resp.data.datas[i].bikeStatus) : "";
                            data_append += "<tr><td>" + (resp.data.datas[i].putAreaName ? resp.data.datas[i].putAreaName : "") + "</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'><a href='javascript:void(0)' link_id='"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"'>"+(resp.data.datas[i].bikeId?resp.data.datas[i].bikeId:"")+"</a></span></td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"'>"+(resp.data.datas[i].lockId?resp.data.datas[i].lockId:"")+"</span></td><td>" + (resp.data.datas[i].currProvince ? resp.data.datas[i].currProvince : "") + "</td><td>" + (resp.data.datas[i].currCity ? resp.data.datas[i].currCity : "") + "</td><td>" + (resp.data.datas[i].currDistrict ? resp.data.datas[i].currDistrict : "") + "</td><td>" + (resp.data.datas[i].putDate ? resp.data.datas[i].putDate : "") + "</td><td>" + (resp.data.datas[i].cost ? resp.data.datas[i].cost : "") + "</td><td>" + (resp.data.datas[i].effectiveOrderCount ? resp.data.datas[i].effectiveOrderCount : "") + "</td><td>" + (resp.data.datas[i].rideCount ? resp.data.datas[i].rideCount : "") + "</td><td>" + (resp.data.datas[i].userCount ? resp.data.datas[i].userCount : "") + "</td><td>" + (resp.data.datas[i].useTime ? resp.data.datas[i].useTime : "") + "</td><td>" + (resp.data.datas[i].distance ? resp.data.datas[i].distance : "") + "</td><td>" + bikeStatus + "</td><td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"'>"+(resp.data.datas[i].lastUser?resp.data.datas[i].lastUser:"")+"</span></td><td>" + (resp.data.datas[i].power ? resp.data.datas[i].power : "") + "</td>" + "<td><span data-toggle='tooltip' data-original-title='"+(resp.data.datas[i].loc?resp.data.datas[i].loc:"")+"' >" + (resp.data.datas[i].loc ? resp.data.datas[i].loc : "") + "</span></td>" + "</tr>";
                        }
                        $("#car_table tbody").append(data_append);
                        $("[data-toggle='tooltip']").tooltip();
                        $("#car_table a").on("click",function(){
                            op_obj.bike_id=$(this).attr("link_id");
                            op_obj.render_cardetail();
                            $(".select-panel").removeClass("active");
                            $("#car_detail").closest(".select-panel").addClass("active");
                            $("#car_list_row").hide();
                            $("#car_warn_row").hide();
                            $("#car_detail_row").show();
                        });
                        $('#list-box').pagination({
                            totalData: resp.data.total,
                            showData: op_obj.list_size,
                            jump: true,
                            coping: true,
                            callback: function (index) {
                                var num = index.getCurrent();
                                op_obj.refresh_carList(op_obj.list_size, num);
                            }
                        })
                    }
                    }
            );
                 var _v = new Date().getTime();
                $.ajax({
                    url:_defautBiz.api("cost")+"?_v="+_v+"&bikeId="+$("#list-id").val()+var_city+var_state,
                    //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
                    dataType: "json",
                    method: 'get',
                    success: function(resp) {
                        $("#list-earn").text(resp.data);
                    }});
            //}
            //else{
            //        $("#s_info").text("请输入车辆编号");
            //        $("#search_rslt").modal('show');
            //}
        });
        $("#alert_filter a").on("click",function(){
            $(".select-panel").removeClass("active");
            $(this).closest(".select-panel").addClass("active");
            switch($(this).attr("id")){
                case 'car_list':
                    op_obj.render_carList(op_obj.list_size);
                    $("#car_list_row").show();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").hide();
                    break;
                case 'car_warn':
                    op_obj.render_carWarn(op_obj.warn_size);
                    $("#car_list_row").hide();
                    $("#car_warn_row").show();
                    $("#car_detail_row").hide();
                    break;
                case 'car_detail':
                    $("#car_list_row").hide();
                    $("#car_warn_row").hide();
                    $("#car_detail_row").show();
                    op_obj.render_cardetail();
                    break;
            }
        })
        $("#bike-searching").on("click",function(){
            op_obj.bike_id=$("#search-panel").val();
            op_obj.render_cardetail();
        });
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
anal_obj.init();


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

