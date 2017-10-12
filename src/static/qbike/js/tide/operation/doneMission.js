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
                    groundTaskList:_base_url +'/ground_tasks.json',
                    saveMission:_base_url +'/success.json'
                },
                product: {
                    groundTaskList:'/task/groundTaskList',
                    saveMission: '/task/updateTask'
                }
            }
        }
    };
var isloading=0;
var hist=0;
var save_param={};
var pending={
    itemList:[],
    currentPage:1,
    init:function(){
        var _obj=this;
        this.componentInit();
        this.initList(0);
    },
    componentInit:function(){
        $(".navbar-header a").on("click",function(){
            hist=$(this).attr("type");
            $(".navbar-header a").removeClass("active");
            $(this).addClass("active");
            _obj.initList(hist);
        })
        $("#add_goBack").off().on("click",function(){
            $("#mission_detail").animate({"opacity":0});
            $("#mission_detail").hide();
        });
        $("#prev_goBack").off().on("click",function(){
            $("#mission_prev").animate({"opacity":0});
            $("#mission_prev").hide();
        });
        $("#save_Tarea").off().on("click",function(){
            save_param.status=$("input[name='state']:checked").val();
            save_param.remark=$("#area_msg").val();
            $.ajax({
                //lng=121.479711&lat=31.264772
                url: _defautBiz.api("saveMission"),
                dataType: "json",
                data: {
                    taskId:save_param.taskId,
                    taskType:save_param.bikeType,
                    status:save_param.status,
                    remark:save_param.remark
                },
                method: 'get',
                success: function(resp) {
                    $("#mission_detail").animate({"opacity":0});
                    $("#mission_detail").hide();
                    _obj.initList(hist)
                }})
        });
        var _obj=this;
        $(window).scroll(function() {
        if($(window).scrollTop()+$(window).height()+5>$(document).height())
        {
            if(isloading==0) {
                isloading=1;
                _obj.renderList(_obj.currentPage)
            }
        }
    });
    },
    initList:function(hist){
        isloading=0;
        var _obj=this;
        _obj.currentPage=1;
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("groundTaskList"),
            dataType: "json",
            data: {
                status:1,
                history:hist
            },
            method: 'get',
            success: function(resp) {
                $("#mission_list").html("");
                if(resp.success){
                    _obj.itemList=resp.data;
                    _obj.renderList(_obj.currentPage);
                }
            }})
    },
    renderList:function(num){
        console.log(num);
        var _obj=this;
        _obj.currentPage+=1;
        isloading=0;
        console.log(_obj.itemList.length);
        for(var i=15*(num-1);i<15*num;i++){
            console.log(i);
            if(i<_obj.itemList.length){
                if(hist==0)
                $("#mission_list").append('<a href="javascript:void(0)" class="show_detail" bikeType="'+_obj.itemList[i].bikeType+'" task_id="'+_obj.itemList[i].id+'" bike_id="'+_obj.itemList[i].bikeId+'" upload_time="'+_obj.itemList[i].lockUploadTime+'" fixed_time="'+_obj.itemList[i].fixedTime+'" fixed_type="'+_obj.itemList[i].fixedType+'" loc_street="'+_obj.itemList[i].fixedLocStreet+'" task_status_str="'+_obj.itemList[i].taskStatusStr+'" remark="'+_obj.itemList[i].remark+'" lastPhone="'+_obj.itemList[i].lastUser+'" lastTime="'+_obj.itemList[i].lastUseStartTime+'"><ul><li>任务编号: '+_obj.itemList[i].id+'</li><li>车辆编号: '+_obj.itemList[i].bikeId+'</li><li>完成时间: '+_obj.itemList[i].updatedDateStr+'</li></ul></a>');
                else
                    $("#mission_list").append('<a href="javascript:void(0)" class="show_prev" bikeType="'+_obj.itemList[i].bikeType+'" task_id="'+_obj.itemList[i].id+'" bike_id="'+_obj.itemList[i].bikeId+'" upload_time="'+_obj.itemList[i].lockUploadTime+'" fixed_time="'+_obj.itemList[i].fixedTime+'" fixed_type="'+_obj.itemList[i].fixedType+'" loc_street="'+_obj.itemList[i].fixedLocStreet+'" task_status_str="'+_obj.itemList[i].taskStatusStr+'" remark="'+_obj.itemList[i].remark+'" lastPhone="'+_obj.itemList[i].lastUser+'" lastTime="'+_obj.itemList[i].lastUseStartTime+'"><ul><li>任务编号: '+_obj.itemList[i].id+'</li><li>车辆编号: '+_obj.itemList[i].bikeId+'</li><li>完成时间: '+_obj.itemList[i].updatedDateStr+'</li></ul></a>');
            }
            else{$("#mission_list").append('<div class="info">—— 数据已全部加载 ——</div>');isloading=1;return;}
            $(".show_detail").off().on("click",function(){
                $("#mission_detail").show();
                $("#mission_detail").animate({"opacity":1});
                $("#mission_id").text($(this).attr("task_id"));
                $("#car_id").text($(this).attr("bike_id"));
                $("#upload_time").text($(this).attr("upload_time"));
                $("#fixed_time").text($(this).attr("fixed_time"));
                $("#fixed_type").text($(this).attr("fixed_type"));
                $("#new_pos").text($(this).attr("loc_street"));
                $("#last_phone").text($(this).attr("lastPhone"));
                $("#last_time").text($(this).attr("lastTime"));
                save_param={
                    taskId:$(this).attr("task_id"),
                    bikeType:$(this).attr("bikeType"),
                    status:"",
                    remark:""
                }
            })
            $(".show_prev").off().on("click",function(){
                $("#mission_prev").show();
                $("#mission_prev").animate({"opacity":1});
                $("#mission_id_prev").text($(this).attr("task_id"));
                $("#car_id_prev").text($(this).attr("bike_id"));
                $("#upload_time_prev").text($(this).attr("upload_time"));
                $("#fixed_time_prev").text($(this).attr("fixed_time"));
                $("#fixed_type_prev").text($(this).attr("fixed_type"));
                $("#new_pos_prev").text($(this).attr("loc_street"));
                $("#status_prev").text($(this).attr("task_status_str"));
                $("#remark_prev").text($(this).attr("remark"));
                $("#last_phone_prev").text($(this).attr("lastPhone"));
                $("#last_time_prev").text($(this).attr("lastTime"));
            })
        }
;

    }
};
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
pending.init();
