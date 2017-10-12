/**
 * Created by lihaotian on 2017/2/27.
 */
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
                    warnlist: _base_url + '/warnlist.json' + "?" + _v
                },
                product: {
                    daily:"/report/daily",
                    week:"/report/week",
                    kpi:"/report/kpi",
                    cityList:"/bike/putArea/list",
                    export:"/report/dailyExport",
                    weekExport:"/report/weekExport"
                }
            }
        }
    };
var summary_obj = {
    daily_storage:[],
    showFlag:false,
    type:1,
    init:function(){
        var sum_obj=this;
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        $("#all_control").text("查看全部");
        $("#city_select").val("全部");
        sum_obj.showFlag=false;
        $("#person").html("");
        $("#bike").html("");
        $.ajax({
            url:_defautBiz.api("cityList"),
            //url:_defautBiz.api("warningDigestPage")+"?currentPage="+$(this).attr("data-dt-idx")+($("#citySelect").val()=="全国"?"":("&area="+$("#citySelect").val()+"市")),
            dataType: "json",
            method: 'get',
            success: function(resp1) {
                $("#city_select").html("");
                $("#city_select").append('<option value="0">全部</option>');
                for(var i in resp1.data){
                    $("#city_select").append('<option value="'+resp1.data[i].areacode+'">'+resp1.data[i].areaname+'</option>');
                }
            }});
        $.ajax({
                    url: _defautBiz.api("kpi"),
                    dataType: "json",
                    method: 'get',
                    data: {
                        //lockId: lockId,
                        //status: status
                    },
                    success: function(resp) {
                        if(resp.success){
                            $("#dead_line").text((new Date().getMonth()+1)+"月"+new Date().getDate()+"日");
                            $("#allCost").text(resp.data.allCost);
                            $("#authUserCompletionRate").text(resp.data.authUserCompletionRate);
                            $("#allAuthUserCount").text(resp.data.allAuthUserCount);
                            $("#costCompletionRate").text(resp.data.costCompletionRate);
                            $("#dayRemain").text(resp.data.dayRemain>0?resp.data.dayRemain:0);
                        }
                    }});
        $.ajax({
            url:(sum_obj.type==1?_defautBiz.api("daily"):_defautBiz.api("week")),
            dataType: "json",
            method: 'get',
            data: {
                //lockId: lockId,
                //status: status
            },
            success: function(resp) {
                if(resp.success){
                    var appendStr="";
                    var appendStr_bike="";
                    $("#person").html("");
                    $("#bike").html("");
                    sum_obj.daily_storage=resp.data;
                    //for(var i in resp.data){
                    //for(var i=resp.data.length-2;i>(resp.data.length-12);i--){
                    var start=sum_obj.type==1?(resp.data.length-11):(resp.data.length-10);
                    for(var i=start;i<resp.data.length;i++){
                        if(i>0){
                        date=resp.data[i].date?resp.data[i].date:"-"
                        date=date=="total"?"合计":date;
                            appendStr+="<tr><td>"+date+"</td><td>"+(resp.data[i].userSum!=undefined?resp.data[i].userSum:"-")+"</td><td>"+(resp.data[i].userCount!=undefined?resp.data[i].userCount:"-")+"<br/>"+(resp.data[i].userCountDtd!=undefined?resp.data[i].userCountDtd:"-")+"</td><td>"+(resp.data[i].authUserCount!=undefined?resp.data[i].authUserCount:"-")+"</td><td>"+(resp.data[i].authUserPercent!=undefined?resp.data[i].authUserPercent:"-")+"</td><td>"+(resp.data[i].rechargeTotal!=undefined?resp.data[i].rechargeTotal:"-")+"<br/>"+(resp.data[i].rechargeTotalDtd !=undefined?resp.data[i].rechargeTotalDtd :"-")+"</td><td>"+(resp.data[i].rechargeUserCount!=undefined?resp.data[i].rechargeUserCount:"-")+"</td><td>"+(resp.data[i].rechargeAvg!=undefined?resp.data[i].rechargeAvg:"-")+"</td><td>"+(resp.data[i].refund!=undefined?resp.data[i].refund:"-")+"<br/>"+(resp.data[i].refundDtd !=undefined?resp.data[i].refundDtd :"-")+"</td>"+"<td>"+(resp.data[i].refundUserCount!=undefined?resp.data[i].refundUserCount:"-")+"</td><td>"+(resp.data[i].refundSum!=undefined?resp.data[i].refundSum:"-")+"</td><td>"+(resp.data[i].totalBalance!=undefined?resp.data[i].totalBalance:"-")+"</td>"+"</tr>";
                            //rideUserCount rerideUserCount rerideUserPercent
                            appendStr_bike+="<tr><td>"+date+"</td><td>"+(resp.data[i].rideUserCount!=undefined?resp.data[i].rideUserCount:"-")+"<br/>"+(resp.data[i].rideUserCountDtd !=undefined?resp.data[i].rideUserCountDtd :"-")+"</td><td>"+(resp.data[i].rerideUserCount!=undefined?resp.data[i].rerideUserCount:"-")+"<br/>"+(resp.data[i].rerideUserCountDtd !=undefined?resp.data[i].rerideUserCountDtd :"-")+"</td><td>"+(resp.data[i].rerideUserPercent!=undefined?resp.data[i].rerideUserPercent:"-")+"</td><td>"+(resp.data[i].orderCount!=undefined?resp.data[i].orderCount:"-")+"</td><td>"+(resp.data[i].cost!=undefined?resp.data[i].cost:"-")+"<br/>"+(resp.data[i].costDtd !=undefined?resp.data[i].costDtd :"-")+"</td><td>"+(resp.data[i].paid!=undefined?resp.data[i].paid:"-")+"</td><td>"+(resp.data[i].subsidy!=undefined?resp.data[i].subsidy:"-")+"</td><td>"+(resp.data[i].bikeCount!=undefined?resp.data[i].bikeCount:"-")+"</td>"+"<td>"+(resp.data[i].bikeRideCount!=undefined?resp.data[i].bikeRideCount:"-")+"<br/>"+(resp.data[i].bikeRideCountDtd !=undefined?resp.data[i].bikeRideCountDtd :"-")+"</td>"+"<td>"+(resp.data[i].bikeRidePercent!=undefined?resp.data[i].bikeRidePercent:"-")+"</td>"+"<td>"+(resp.data[i].maxHour!=undefined?resp.data[i].maxHour:"-")+"</td>"+"<td>"+(resp.data[i].maxBikeRideHourCount!=undefined?resp.data[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].minHour!=undefined?resp.data[i].minHour:"-")+"</td>"+"<td>"+(resp.data[i].minBikeRideHourCount!=undefined?resp.data[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].rideTimesPerBike!=undefined?resp.data[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                            //rechargeTotal rechargeUserCount rechargeAvg
                        }
                    }
                    $("#person").html(appendStr);
                    $("#bike").html(appendStr_bike);
                }
            }});
        this.componentInit();
    },
    componentInit:function(){
        var sum_obj=this;
        var url="";
            $("#city_select").off().on("change",function(){
            url=$(this).val()==0?"":("?areaCode="+$(this).val());
                $.ajax({
                    url: (sum_obj.type==1?_defautBiz.api("daily"):_defautBiz.api("week"))+url,
                    dataType: "json",
                    method: 'get',
                    data: {
                        //lockId: lockId,
                        //status: status
                    },
                    success: function(resp) {
                        if(resp.success){
                            var appendStr="";
                            var appendStr_bike="";
                            $("#all_control").text("查看全部");
                            $("#person").html("");
                            $("#bike").html("");
                            sum_obj.daily_storage=resp.data;
                            //for(var i in resp.data){
                            var start=sum_obj.type==1?(resp.data.length-11):(resp.data.length-10);
                            for(var i=start;i<resp.data.length;i++){
                                if(i>0) {
                                    date = resp.data[i].date ? resp.data[i].date : "-"
                                    date = date == "total" ? "合计" : date;
                                    appendStr+="<tr><td>"+date+"</td><td>"+(resp.data[i].userSum!=undefined?resp.data[i].userSum:"-")+"</td><td>"+(resp.data[i].userCount!=undefined?resp.data[i].userCount:"-")+"<br/>"+(resp.data[i].userCountDtd!=undefined?resp.data[i].userCountDtd:"-")+"</td><td>"+(resp.data[i].authUserCount!=undefined?resp.data[i].authUserCount:"-")+"</td><td>"+(resp.data[i].authUserPercent!=undefined?resp.data[i].authUserPercent:"-")+"</td><td>"+(resp.data[i].rechargeTotal!=undefined?resp.data[i].rechargeTotal:"-")+"<br/>"+(resp.data[i].rechargeTotalDtd !=undefined?resp.data[i].rechargeTotalDtd :"-")+"</td><td>"+(resp.data[i].rechargeUserCount!=undefined?resp.data[i].rechargeUserCount:"-")+"</td><td>"+(resp.data[i].rechargeAvg!=undefined?resp.data[i].rechargeAvg:"-")+"</td><td>"+(resp.data[i].refund!=undefined?resp.data[i].refund:"-")+"<br/>"+(resp.data[i].refundDtd !=undefined?resp.data[i].refundDtd :"-")+"</td>"+"<td>"+(resp.data[i].refundUserCount!=undefined?resp.data[i].refundUserCount:"-")+"</td><td>"+(resp.data[i].refundSum!=undefined?resp.data[i].refundSum:"-")+"</td><td>"+(resp.data[i].totalBalance!=undefined?resp.data[i].totalBalance:"-")+"</td>"+"</tr>";
                                    //rideUserCount rerideUserCount rerideUserPercent
                                    appendStr_bike+="<tr><td>"+date+"</td><td>"+(resp.data[i].rideUserCount!=undefined?resp.data[i].rideUserCount:"-")+"<br/>"+(resp.data[i].rideUserCountDtd !=undefined?resp.data[i].rideUserCountDtd :"-")+"</td><td>"+(resp.data[i].rerideUserCount!=undefined?resp.data[i].rerideUserCount:"-")+"<br/>"+(resp.data[i].rerideUserCountDtd !=undefined?resp.data[i].rerideUserCountDtd :"-")+"</td><td>"+(resp.data[i].rerideUserPercent!=undefined?resp.data[i].rerideUserPercent:"-")+"</td><td>"+(resp.data[i].orderCount!=undefined?resp.data[i].orderCount:"-")+"</td><td>"+(resp.data[i].cost!=undefined?resp.data[i].cost:"-")+"<br/>"+(resp.data[i].costDtd !=undefined?resp.data[i].costDtd :"-")+"</td><td>"+(resp.data[i].paid!=undefined?resp.data[i].paid:"-")+"</td><td>"+(resp.data[i].subsidy!=undefined?resp.data[i].subsidy:"-")+"</td><td>"+(resp.data[i].bikeCount!=undefined?resp.data[i].bikeCount:"-")+"</td>"+"<td>"+(resp.data[i].bikeRideCount!=undefined?resp.data[i].bikeRideCount:"-")+"<br/>"+(resp.data[i].bikeRideCountDtd !=undefined?resp.data[i].bikeRideCountDtd :"-")+"</td>"+"<td>"+(resp.data[i].bikeRidePercent!=undefined?resp.data[i].bikeRidePercent:"-")+"</td>"+"<td>"+(resp.data[i].maxHour!=undefined?resp.data[i].maxHour:"-")+"</td>"+"<td>"+(resp.data[i].maxBikeRideHourCount!=undefined?resp.data[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].minHour!=undefined?resp.data[i].minHour:"-")+"</td>"+"<td>"+(resp.data[i].minBikeRideHourCount!=undefined?resp.data[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].rideTimesPerBike!=undefined?resp.data[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                                    //appendStr+="<tr><td>"+date+"</td><td>"+(resp.data[i].userSum!=undefined?resp.data[i].userSum:"-")+"</td><td>"+(resp.data[i].userCount!=undefined?resp.data[i].userCount:"-")+"</td><td>"+(resp.data[i].authUserCount!=undefined?resp.data[i].authUserCount:"-")+"</td><td>"+(resp.data[i].authUserPercent!=undefined?resp.data[i].authUserPercent:"-")+"</td><td>"+(resp.data[i].rechargeTotal!=undefined?resp.data[i].rechargeTotal:"-")+"</td><td>"+(resp.data[i].rechargeUserCount!=undefined?resp.data[i].rechargeUserCount:"-")+"</td><td>"+(resp.data[i].rechargeAvg!=undefined?resp.data[i].rechargeAvg:"-")+"</td><td>"+(resp.data[i].refundDtd!=undefined?resp.data[i].refundDtd:"-")+"</td>"+"<td>"+(resp.data[i].refundUserCount!=undefined?resp.data[i].refundUserCount:"-")+"</td><td>"+(resp.data[i].refundSum!=undefined?resp.data[i].refundSum:"-")+"</td><td>"+(resp.data[i].totalBalance!=undefined?resp.data[i].totalBalance:"-")+"</td>"+"</tr>";
                                    //rideUserCount rerideUserCount rerideUserPercent
                                    //appendStr_bike+="<tr><td>"+date+"</td><td>"+(resp.data[i].rideUserCount!=undefined?resp.data[i].rideUserCount:"-")+"</td><td>"+(resp.data[i].rerideUserCount!=undefined?resp.data[i].rerideUserCount:"-")+"</td><td>"+(resp.data[i].rerideUserPercent!=undefined?resp.data[i].rerideUserPercent:"-")+"</td><td>"+(resp.data[i].orderCount!=undefined?resp.data[i].orderCount:"-")+"</td><td>"+(resp.data[i].cost!=undefined?resp.data[i].cost:"-")+"</td><td>"+(resp.data[i].paid!=undefined?resp.data[i].paid:"-")+"</td><td>"+(resp.data[i].subsidy!=undefined?resp.data[i].subsidy:"-")+"</td><td>"+(resp.data[i].bikeCount!=undefined?resp.data[i].bikeCount:"-")+"</td>"+"<td>"+(resp.data[i].bikeRideCount!=undefined?resp.data[i].bikeRideCount:"-")+"</td>"+"<td>"+(resp.data[i].bikeRidePercent!=undefined?resp.data[i].bikeRidePercent:"-")+"</td>"+"<td>"+(resp.data[i].maxHour!=undefined?resp.data[i].maxHour:"-")+"</td>"+"<td>"+(resp.data[i].maxBikeRideHourCount!=undefined?resp.data[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].minHour!=undefined?resp.data[i].minHour:"-")+"</td>"+"<td>"+(resp.data[i].minBikeRideHourCount!=undefined?resp.data[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(resp.data[i].rideTimesPerBike!=undefined?resp.data[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                                    //rechargeTotal rechargeUserCount rechargeAvg
                                }
                            }
                            $("#person").html(appendStr);
                            $("#bike").html(appendStr_bike);
                        }
                    }});
        });
        $("#all_control").off().on("click",function(){
            sum_obj.showFlag=!sum_obj.showFlag;
            if(sum_obj.showFlag){
            $(this).text("查看最近");
            var appendStr="";
            var appendStr_bike="";
            $("#person").html("");
            $("#bike").html("");
            var daily_storage=sum_obj.daily_storage;
            for(var i in daily_storage){
                date=daily_storage[i].date?daily_storage[i].date:"-"
                date=date=="total"?"合计":date;
                appendStr+="<tr><td>"+date+"</td><td>"+(daily_storage[i].userSum!=undefined?daily_storage[i].userSum:"-")+"</td><td>"+(daily_storage[i].userCount!=undefined?daily_storage[i].userCount:"-")+"<br/>"+(daily_storage[i].userCountDtd!=undefined?daily_storage[i].userCountDtd:"-")+"</td><td>"+(daily_storage[i].authUserCount!=undefined?daily_storage[i].authUserCount:"-")+"</td><td>"+(daily_storage[i].authUserPercent!=undefined?daily_storage[i].authUserPercent:"-")+"</td><td>"+(daily_storage[i].rechargeTotal!=undefined?daily_storage[i].rechargeTotal:"-")+"<br/>"+(daily_storage[i].rechargeTotalDtd !=undefined?daily_storage[i].rechargeTotalDtd :"-")+"</td><td>"+(daily_storage[i].rechargeUserCount!=undefined?daily_storage[i].rechargeUserCount:"-")+"</td><td>"+(daily_storage[i].rechargeAvg!=undefined?daily_storage[i].rechargeAvg:"-")+"</td><td>"+(daily_storage[i].refund!=undefined?daily_storage[i].refund:"-")+"<br/>"+(daily_storage[i].refundDtd !=undefined?daily_storage[i].refundDtd :"-")+"</td>"+"<td>"+(daily_storage[i].refundUserCount!=undefined?daily_storage[i].refundUserCount:"-")+"</td><td>"+(daily_storage[i].refundSum!=undefined?daily_storage[i].refundSum:"-")+"</td><td>"+(daily_storage[i].totalBalance!=undefined?daily_storage[i].totalBalance:"-")+"</td>"+"</tr>";
                //rideUserCount rerideUserCount rerideUserPercent
                appendStr_bike+="<tr><td>"+date+"</td><td>"+(daily_storage[i].rideUserCount!=undefined?daily_storage[i].rideUserCount:"-")+"<br/>"+(daily_storage[i].rideUserCountDtd !=undefined?daily_storage[i].rideUserCountDtd :"-")+"</td><td>"+(daily_storage[i].rerideUserCount!=undefined?daily_storage[i].rerideUserCount:"-")+"<br/>"+(daily_storage[i].rerideUserCountDtd !=undefined?daily_storage[i].rerideUserCountDtd :"-")+"</td><td>"+(daily_storage[i].rerideUserPercent!=undefined?daily_storage[i].rerideUserPercent:"-")+"</td><td>"+(daily_storage[i].orderCount!=undefined?daily_storage[i].orderCount:"-")+"</td><td>"+(daily_storage[i].cost!=undefined?daily_storage[i].cost:"-")+"<br/>"+(daily_storage[i].costDtd !=undefined?daily_storage[i].costDtd :"-")+"</td><td>"+(daily_storage[i].paid!=undefined?daily_storage[i].paid:"-")+"</td><td>"+(daily_storage[i].subsidy!=undefined?daily_storage[i].subsidy:"-")+"</td><td>"+(daily_storage[i].bikeCount!=undefined?daily_storage[i].bikeCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRideCount!=undefined?daily_storage[i].bikeRideCount:"-")+"<br/>"+(daily_storage[i].bikeRideCountDtd !=undefined?daily_storage[i].bikeRideCountDtd :"-")+"</td>"+"<td>"+(daily_storage[i].bikeRidePercent!=undefined?daily_storage[i].bikeRidePercent:"-")+"</td>"+"<td>"+(daily_storage[i].maxHour!=undefined?daily_storage[i].maxHour:"-")+"</td>"+"<td>"+(daily_storage[i].maxBikeRideHourCount!=undefined?daily_storage[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].minHour!=undefined?daily_storage[i].minHour:"-")+"</td>"+"<td>"+(daily_storage[i].minBikeRideHourCount!=undefined?daily_storage[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].rideTimesPerBike!=undefined?daily_storage[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                //appendStr+="<tr><td>"+date+"</td><td>"+(daily_storage[i].userSum!=undefined?daily_storage[i].userSum:"-")+"</td><td>"+(daily_storage[i].userCount!=undefined?daily_storage[i].userCount:"-")+"</td><td>"+(daily_storage[i].authUserCount!=undefined?daily_storage[i].authUserCount:"-")+"</td><td>"+(daily_storage[i].authUserPercent!=undefined?daily_storage[i].authUserPercent:"-")+"</td><td>"+(daily_storage[i].rechargeTotal!=undefined?daily_storage[i].rechargeTotal:"-")+"</td><td>"+(daily_storage[i].rechargeUserCount!=undefined?daily_storage[i].rechargeUserCount:"-")+"</td><td>"+(daily_storage[i].rechargeAvg!=undefined?daily_storage[i].rechargeAvg:"-")+"</td><td>"+(daily_storage[i].refundDtd!=undefined?daily_storage[i].refundDtd:"-")+"</td>"+"<td>"+(daily_storage[i].refundUserCount!=undefined?daily_storage[i].refundUserCount:"-")+"</td><td>"+(daily_storage[i].refundSum!=undefined?daily_storage[i].refundSum:"-")+"</td><td>"+(daily_storage[i].totalBalance!=undefined?daily_storage[i].totalBalance:"-")+"</td>"+"</tr>";
                ////rideUserCount rerideUserCount rerideUserPercent
                //appendStr_bike+="<tr><td>"+date+"</td><td>"+(daily_storage[i].rideUserCount!=undefined?daily_storage[i].rideUserCount:"-")+"</td><td>"+(daily_storage[i].rerideUserCount!=undefined?daily_storage[i].rerideUserCount:"-")+"</td><td>"+(daily_storage[i].rerideUserPercent!=undefined?daily_storage[i].rerideUserPercent:"-")+"</td><td>"+(daily_storage[i].orderCount!=undefined?daily_storage[i].orderCount:"-")+"</td><td>"+(daily_storage[i].cost!=undefined?daily_storage[i].cost:"-")+"</td><td>"+(daily_storage[i].paid!=undefined?daily_storage[i].paid:"-")+"</td><td>"+(daily_storage[i].subsidy!=undefined?daily_storage[i].subsidy:"-")+"</td><td>"+(daily_storage[i].bikeCount!=undefined?daily_storage[i].bikeCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRideCount!=undefined?daily_storage[i].bikeRideCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRidePercent!=undefined?daily_storage[i].bikeRidePercent:"-")+"</td>"+"<td>"+(daily_storage[i].maxHour!=undefined?daily_storage[i].maxHour:"-")+"</td>"+"<td>"+(daily_storage[i].maxBikeRideHourCount!=undefined?daily_storage[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].minHour!=undefined?daily_storage[i].minHour:"-")+"</td>"+"<td>"+(daily_storage[i].minBikeRideHourCount!=undefined?daily_storage[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].rideTimesPerBike!=undefined?daily_storage[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                //rechargeTotal rechargeUserCount rechargeAvg
            }
            $("#person").html(appendStr);
            $("#bike").html(appendStr_bike);
            }
            else{
                    $(this).text("查看全部");
                    var appendStr="";
                    var appendStr_bike="";
                    $("#person").html("");
                    $("#bike").html("");
                    var daily_storage=sum_obj.daily_storage;
                    var start=sum_obj.type==1?(daily_storage.length-11):(daily_storage.length-10);
                    for(var i=start;i<daily_storage.length;i++){
                        date=daily_storage[i].date?daily_storage[i].date:"-"
                        date=date=="total"?"合计":date;
                        appendStr+="<tr><td>"+date+"</td><td>"+(daily_storage[i].userSum!=undefined?daily_storage[i].userSum:"-")+"</td><td>"+(daily_storage[i].userCount!=undefined?daily_storage[i].userCount:"-")+"<br/>"+(daily_storage[i].userCountDtd!=undefined?daily_storage[i].userCountDtd:"-")+"</td><td>"+(daily_storage[i].authUserCount!=undefined?daily_storage[i].authUserCount:"-")+"</td><td>"+(daily_storage[i].authUserPercent!=undefined?daily_storage[i].authUserPercent:"-")+"</td><td>"+(daily_storage[i].rechargeTotal!=undefined?daily_storage[i].rechargeTotal:"-")+"<br/>"+(daily_storage[i].rechargeTotalDtd !=undefined?daily_storage[i].rechargeTotalDtd :"-")+"</td><td>"+(daily_storage[i].rechargeUserCount!=undefined?daily_storage[i].rechargeUserCount:"-")+"</td><td>"+(daily_storage[i].rechargeAvg!=undefined?daily_storage[i].rechargeAvg:"-")+"</td><td>"+(daily_storage[i].refund!=undefined?daily_storage[i].refund:"-")+"<br/>"+(daily_storage[i].refundDtd !=undefined?daily_storage[i].refundDtd :"-")+"</td>"+"<td>"+(daily_storage[i].refundUserCount!=undefined?daily_storage[i].refundUserCount:"-")+"</td><td>"+(daily_storage[i].refundSum!=undefined?daily_storage[i].refundSum:"-")+"</td><td>"+(daily_storage[i].totalBalance!=undefined?daily_storage[i].totalBalance:"-")+"</td>"+"</tr>";
                        //rideUserCount rerideUserCount rerideUserPercent
                        appendStr_bike+="<tr><td>"+date+"</td><td>"+(daily_storage[i].rideUserCount!=undefined?daily_storage[i].rideUserCount:"-")+"<br/>"+(daily_storage[i].rideUserCountDtd !=undefined?daily_storage[i].rideUserCountDtd :"-")+"</td><td>"+(daily_storage[i].rerideUserCount!=undefined?daily_storage[i].rerideUserCount:"-")+"<br/>"+(daily_storage[i].rerideUserCountDtd !=undefined?daily_storage[i].rerideUserCountDtd :"-")+"</td><td>"+(daily_storage[i].rerideUserPercent!=undefined?daily_storage[i].rerideUserPercent:"-")+"</td><td>"+(daily_storage[i].orderCount!=undefined?daily_storage[i].orderCount:"-")+"</td><td>"+(daily_storage[i].cost!=undefined?daily_storage[i].cost:"-")+"<br/>"+(daily_storage[i].costDtd !=undefined?daily_storage[i].costDtd :"-")+"</td><td>"+(daily_storage[i].paid!=undefined?daily_storage[i].paid:"-")+"</td><td>"+(daily_storage[i].subsidy!=undefined?daily_storage[i].subsidy:"-")+"</td><td>"+(daily_storage[i].bikeCount!=undefined?daily_storage[i].bikeCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRideCount!=undefined?daily_storage[i].bikeRideCount:"-")+"<br/>"+(daily_storage[i].bikeRideCountDtd !=undefined?daily_storage[i].bikeRideCountDtd :"-")+"</td>"+"<td>"+(daily_storage[i].bikeRidePercent!=undefined?daily_storage[i].bikeRidePercent:"-")+"</td>"+"<td>"+(daily_storage[i].maxHour!=undefined?daily_storage[i].maxHour:"-")+"</td>"+"<td>"+(daily_storage[i].maxBikeRideHourCount!=undefined?daily_storage[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].minHour!=undefined?daily_storage[i].minHour:"-")+"</td>"+"<td>"+(daily_storage[i].minBikeRideHourCount!=undefined?daily_storage[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].rideTimesPerBike!=undefined?daily_storage[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                        //appendStr+="<tr><td>"+date+"</td><td>"+(daily_storage[i].userSum!=undefined?daily_storage[i].userSum:"-")+"</td><td>"+(daily_storage[i].userCount!=undefined?daily_storage[i].userCount:"-")+"</td><td>"+(daily_storage[i].authUserCount!=undefined?daily_storage[i].authUserCount:"-")+"</td><td>"+(daily_storage[i].authUserPercent!=undefined?daily_storage[i].authUserPercent:"-")+"</td><td>"+(daily_storage[i].rechargeTotal!=undefined?daily_storage[i].rechargeTotal:"-")+"</td><td>"+(daily_storage[i].rechargeUserCount!=undefined?daily_storage[i].rechargeUserCount:"-")+"</td><td>"+(daily_storage[i].rechargeAvg!=undefined?daily_storage[i].rechargeAvg:"-")+"</td><td>"+(daily_storage[i].refundDtd!=undefined?daily_storage[i].refundDtd:"-")+"</td>"+"<td>"+(daily_storage[i].refundUserCount!=undefined?daily_storage[i].refundUserCount:"-")+"</td><td>"+(daily_storage[i].refundSum!=undefined?daily_storage[i].refundSum:"-")+"</td><td>"+(daily_storage[i].totalBalance!=undefined?daily_storage[i].totalBalance:"-")+"</td>"+"</tr>";
                        ////rideUserCount rerideUserCount rerideUserPercent
                        //appendStr_bike+="<tr><td>"+date+"</td><td>"+(daily_storage[i].rideUserCount!=undefined?daily_storage[i].rideUserCount:"-")+"</td><td>"+(daily_storage[i].rerideUserCount!=undefined?daily_storage[i].rerideUserCount:"-")+"</td><td>"+(daily_storage[i].rerideUserPercent!=undefined?daily_storage[i].rerideUserPercent:"-")+"</td><td>"+(daily_storage[i].orderCount!=undefined?daily_storage[i].orderCount:"-")+"</td><td>"+(daily_storage[i].cost!=undefined?daily_storage[i].cost:"-")+"</td><td>"+(daily_storage[i].paid!=undefined?daily_storage[i].paid:"-")+"</td><td>"+(daily_storage[i].subsidy!=undefined?daily_storage[i].subsidy:"-")+"</td><td>"+(daily_storage[i].bikeCount!=undefined?daily_storage[i].bikeCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRideCount!=undefined?daily_storage[i].bikeRideCount:"-")+"</td>"+"<td>"+(daily_storage[i].bikeRidePercent!=undefined?daily_storage[i].bikeRidePercent:"-")+"</td>"+"<td>"+(daily_storage[i].maxHour!=undefined?daily_storage[i].maxHour:"-")+"</td>"+"<td>"+(daily_storage[i].maxBikeRideHourCount!=undefined?daily_storage[i].maxBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].minHour!=undefined?daily_storage[i].minHour:"-")+"</td>"+"<td>"+(daily_storage[i].minBikeRideHourCount!=undefined?daily_storage[i].minBikeRideHourCount:"-")+"</td>"+"<td>"+(daily_storage[i].rideTimesPerBike!=undefined?daily_storage[i].rideTimesPerBike:"-")+"</td>"+"</tr>";
                        //rechargeTotal rechargeUserCount rechargeAvg
                    }
                    $("#person").html(appendStr);
                    $("#bike").html(appendStr_bike);
            }
        });
        $("#export_control").off().on("click",function(){
                var url=$("#city_select").val()==0?"":("?areaCode="+$("#city_select").val());

                window.open((sum_obj.type==1?_defautBiz.api("export"):_defautBiz.api("weekExport"))+url)
        });
        $("#tit_control").off().on("click",function(){
            //$(this).attr("type")==0?$(this).attr("type",1):$(this).attr("type",0);
            var type=$(this).attr("type");
            function showTit(sign) {
                sum_obj.type=parseInt(sign);
                switch (parseInt(sign)) {
                    case 0:
                        $("#summary_tit").text("Qbike运营周报");
                        $("#tit_control").text("Qbike运营日报");
                        break;
                    case 1:
                        $("#summary_tit").text("Qbike运营日报");
                        $("#tit_control").text("Qbike运营周报")
                        break;

                }
            }
            showTit(type);
            sum_obj.init();
            type==0?$(this).attr("type",1):$(this).attr("type",0);
            //type==0?$("#summary_tit").text("Qbike运营日报"):$("#summary_tit").text("Qbike运营周报");
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
summary_obj.init();


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

