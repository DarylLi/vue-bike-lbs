/**
 * Created by lihaotian on 2017/06/26.
 */
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
                    ListPage:_base_url +'/listPage.json',
                    StatusNumber:_base_url +'/Allstatus.json',
                    taskTypeList: _base_url +'/typeList.json',
                    taskStatusList: _base_url +'/statusList.json',
                    export:'/task/exportTodayTask',
                    save:_base_url+'/success.json',
                    del:_base_url+'/success.json',
                    userList:_base_url+'/userList.json',
                    updateTask:_base_url+'/success.json'
                },
                product: {
                    ListPage:"/task/listPage",
                    StatusNumber:"/task/toDayTaskStatusNumber",
                    taskTypeList:'/task/taskTypeList',
                    taskStatusList:'/task/taskStatusList',
                    export:'/task/exportTaskDetailList',
                    save:'/task/saveTask',
                    del:'/task/delTasks',
                    userList:'/ground/list',
                    updateTask:'/task/updateTask'
                }
            }
        }
    };
var totalData = '';
var pageSize = '';
var totArea=[];
var WarnArea=[];
var Manager = {
    pageSize:10,
    mission_type:"",
    mission_state:"",
    bikeNum:"",
    user:getUrlParam("userId"),
    init: function () {
        $("#userName").text(getUrlParam("userName"))
        $("#userName").attr("href","/tide/ownMission.html?userName="+getUrlParam("userName")+"&userId="+getUrlParam("userId"))
        $("#mapMode").attr("href","/tide/mapMode.html?userName="+getUrlParam("userName")+"&userId="+getUrlParam("userId"))
        $.ajax({
            url: _defautBiz.api("StatusNumber"),
            dataType: "json",
            method: 'get',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
                //xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function (data) {
                if(data.success){
                    for(var i in data.data){
                        if(data.data[i].taskType==3){
                            $("#offLine").text(data.data[i].planNumber);
                            $("#offLine_tot").text(data.data[i].planNumber);
                            $("#offLine_done").text(data.data[i].doneNumber);
                        }
                        else if(data.data[i].taskType==1){
                            $("#free").text(data.data[i].planNumber);
                            $("#free_tot").text(data.data[i].planNumber);
                            $("#free_done").text(data.data[i].doneNumber);
                        }
                        else if(data.data[i].taskType==2){
                            $("#trouble").text(data.data[i].planNumber);
                            $("#trouble_tot").text(data.data[i].planNumber);
                            $("#trouble_done").text(data.data[i].doneNumber);
                        }
                    }
                }
            }
        })

        var params = {
            pageSize: this.pageSize,
            currPage: 1,
            mission_type:this.mission_type,
            mission_state:this.mission_state,
            bikeNum:this.bikeNum,
            user:this.user
        };
        this.initData(params);
        $("#Pagination a").off().on("click", function () {
            $("#s_info").text("无搜索结果噢");
            $("#area_list").modal('show');
            $("#save_confirm").on("click", function () {
                $("#f_info").text("确定对该智能锁进行修改？");
                $("#judge_alert").modal('show');
            });
            $("#save_judge").on("click", function () {
                $("#m_info").text("设置成功");
                setTimeout(function () {
                    $('#judge_alert').modal('hide');
                    $("#m_info").text("")
                }, 1500);
            });
        });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        $(top.hangge());
        var listObj=document.getElementById('list-type');
        var taskObj=document.getElementById('task-type');
        var optObj=document.getElementById('option-type');
        $.ajax({
            url: _defautBiz.api("taskTypeList"),
            dataType: "json",
            method: 'get',
            success: function(data) {
                if(data.success && data.data){
                    var listType = data.data;
                    listObj.options.length = 0;
                    listObj.options.add(new Option("全部",""),"");
                    taskObj.options.length = 0;
                    optObj.options.length = 0;
                    for(var i = 0; i < listType.length;i++){
                        listObj.options.add(new Option(listType[i].name,listType[i].value),""); //这个兼容IE与firefox
                        taskObj.options.add(new Option(listType[i].name,listType[i].value),""); //这个兼容IE与firefox
                        optObj.options.add(new Option(listType[i].name,listType[i].value),""); //这个兼容IE与firefox
                    }
                }
            }});
        var stateObj=document.getElementById('list-state');
        var optstObj=document.getElementById('option-state');
        $.ajax({
            url: _defautBiz.api("taskStatusList"),
            dataType: "json",
            method: 'get',
            success: function(data) {
                if(data.success && data.data){
                    var stateList = data.data;
                    stateObj.options.length = 0;
                    stateObj.options.add(new Option("全部",""),"");
                    optstObj.options.length = 0;
                    for(var i = 0; i < stateList.length;i++){
                        stateObj.options.add(new Option(stateList[i].name,stateList[i].value),""); //这个兼容IE与firefox
                        optstObj.options.add(new Option(stateList[i].name,stateList[i].value),""); //这个兼容IE与firefox
                    }
                }
            }});
        var userObj=document.getElementById('option-user');
        $.ajax({
            url: _defautBiz.api("userList"),
            dataType: "json",
            method: 'get',
            success: function(data) {
                if(data.success && data.data){
                    var userList = data.data;
                    userObj.options.length = 0;
                    for(var i = 0; i < userList.length;i++){
                        userObj.options.add(new Option(userList[i].majorUserName,userList[i].majorUserId),""); //这个兼容IE与firefox
                    }
                }
            }});
        this.componentInit();
    },
    initData: function (params) {
        pageSize = params.pageSize;
        $.ajax({
            url: _defautBiz.api("ListPage"),
            dataType: "json",
            method: 'get',
            data: {
                pageSize: params.pageSize,
                currPage: params.currPage,
                userId: params.user,
                bikeId: params.bikeNum,
                taskStatus: params.mission_state,
                taskType: params.mission_type,
            },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data.data.datas && Manager.parseData(data.data.data);
            }
        });
    },

    initNextPageData: function (params) {
        pageSize = params.pageSize;
        $.ajax({
            url: _defautBiz.api("ListPage"),
            dataType: "json",
            method: 'get',
            data: {
                pageSize: params.pageSize,
                currPage: params.currPage,
                userId: params.user,
                bikeId: params.bikeNum,
                taskStatus: params.mission_state,
                taskType: params.mission_type,
            },
            // beforeSend: function(xhr) {
            //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            // },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data.data && Manager.parseNextPageData(data.data.data);
            }
        });
    },
    parseNextPageData: function (data) {
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        for (var i = 0; i < pageSize && i < data.datas.length; i++)
            data_append += "<tr><td>"+(i+1)+"</td><td><span data-toggle='tooltip' data-original-title='"+data.datas[i].remark+"'>" + data.datas[i].bikeId + "</span></td><td>" + data.datas[i].userName + "</td><td>" + data.datas[i].taskTypeStr + "</td><td>" + data.datas[i].taskStatusStr + "</td><td>" + data.datas[i].lastUser + "</td><td>" + data.datas[i].lastUseStartTime + "</td><td>" + data.datas[i].lockUploadTime +"</td><td>" + data.datas[i].power + "</td>" +"<td>" + data.datas[i].fixedType + "</td>"+ "<td>" + data.datas[i].fixedTime + "</td>" +"<td><a href='/tide/mapMode.html?userId="+data.datas[i].userId+"&userName="+data.datas[i].userName+"&lng="+data.datas[i].fixedLng+"&lat="+data.datas[i].fixedLat+"'>" + data.datas[i].fixedLocStreet + "</a></td><td><a href='/tide/mapMode.html?userId="+data.datas[i].userId+"&userName="+data.datas[i].userName+"&lng="+data.datas[i].fixedLng+"&lat="+data.datas[i].fixedLat+"'>"+ (data.datas[i].locStreet?data.datas[i].locStreet:'添加') + "</a></td></tr>";
        $("#Pagination tbody").append(data_append);
        $("[data-toggle='tooltip']").tooltip();
        $(".task_option").on("click",function(){
            $("#option_panel").animate({"opacity":1});
            $("#option_panel").show();
            $("#option_num").val($(this).attr("bike_num"));
            $("#option_save").attr("task_id",$(this).attr("task-id"));
        });
    },
    parseData: function (data) {
        var _obj=this;
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        for (var i = 0; i < pageSize && i < data.datas.length; i++)
            data_append += "<tr><td>"+(i+1)+"</td><td><span data-toggle='tooltip' data-original-title='"+data.datas[i].remark+"'>" + data.datas[i].bikeId + "</span></td><td>" + data.datas[i].userName + "</td><td>" + data.datas[i].taskTypeStr + "</td><td>" + data.datas[i].taskStatusStr + "</td><td>" + data.datas[i].lastUser + "</td><td>" + data.datas[i].lastUseStartTime + "</td><td>" + data.datas[i].lockUploadTime +"</td><td>" + data.datas[i].power + "</td>" +"<td>" + data.datas[i].fixedType + "</td>"+ "<td>" + data.datas[i].fixedTime + "</td>" +"<td><a href='/tide/mapMode.html?userId="+data.datas[i].userId+"&userName="+data.datas[i].userName+"&lng="+data.datas[i].fixedLng+"&lat="+data.datas[i].fixedLat+"'>" + data.datas[i].fixedLocStreet + "</a></td><td><a href='/tide/mapMode.html?userId="+data.datas[i].userId+"&userName="+data.datas[i].userName+"&lng="+data.datas[i].fixedLng+"&lat="+data.datas[i].fixedLat+"'>"+ (data.datas[i].locStreet?data.datas[i].locStreet:'添加') + "</a></td></tr>";
        $("#Pagination tbody").append(data_append);
        $("[data-toggle='tooltip']").tooltip();
        $(".task_option").on("click",function(){
            $("#option_panel").animate({"opacity":1});
            $("#option_panel").show();
            $("#option_num").val($(this).attr("bike_num"));
            $("#option_save").attr("task_id",$(this).attr("task-id"));
        });
        $('.M-box1').pagination({
            totalData: totalData,
            showData: pageSize,
            jump: true,
            coping: true,
            callback: function (index) {
                var num = index.getCurrent();
                var params = {
                    pageSize: _obj.pageSize,
                    currPage: num,
                    mission_type:_obj.mission_type,
                    mission_state:_obj.mission_state,
                    bikeNum:_obj.bikeNum,
                    user:_obj.user
                };
                Manager.initNextPageData(params);
            }
        });
    },
    parseNumberData: function (data) {
        $(".device-number-txt").html(data[0]);
        $(".online-number-txt").html(data[1]);
        $(".offline-number-txt").html(data[2]);
    },
    remove: function () {
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        }
    },
    updateList: function (indx) {
        $("#Pagination tbody").html("");
        var data_append = "";
        for (var i = 0; i < indx; i++)
            data_append += "<tr><td>" + ("Misc" + i) + "</td><td>I1</td><td>3 1 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_" + i + " style='margin-right:5px '>设置</a></td></tr>";
        $("#Pagination tbody").append(data_append);
        $('.M-box1').pagination({
            totalData: 100,
            showData: indx,
            jump: true,
            coping: true,
            callback: function (index) {
                var num = index.getCurrent();
                $("#Pagination tbody").html("");
                data_append = "";
                for (var i = 0; i < indx; i++)
                    data_append += "<tr><td>" + ("Misc" + i + num) + "</td><td>IE Mobile</td><td>Windows Mobile 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td><a href='javascript:void(0)' id=opt_" + num + " style='margin-right:5px '>设置</a></td></tr>";
                $("#Pagination tbody").append(data_append);
            }
        });

    },
    componentInit: function () {
        localStorage.c_city_name = "全国";
        var click_flag = true;
        var _obj = this;
        $(".pag_list button").on("click", function () {
            $(".pag_list button").removeClass("active");
            $(this).addClass("active");
            var indx = $(this).text();
            _obj.pageSize=indx;
            // _obj.updateList(indx)
            var params = {
                pageSize: _obj.pageSize,
                currPage: 1,
                mission_type:_obj.mission_type,
                mission_state:_obj.mission_state,
                bikeNum:_obj.bikeNum,
                user:_obj.user
            };
            Manager.initData(params);

        });
        $(".btn-search").on("click",function(){
            _obj.mission_type=$("#list-type").val();
            _obj.mission_state=$("#list-state").val();
            _obj.bikeNum= $("#bike_num").val();
            var params = {
                pageSize: _obj.pageSize,
                currPage: 1,
                mission_type:_obj.mission_type,
                mission_state:_obj.mission_state,
                bikeNum:_obj.bikeNum,
                user:_obj.user
            };
            _obj.initData(params);
        });
        $("#show_area").off().on("click",function(){
            $("#bike_detail").show();
            area_obj.init();
            $("#bike_detail").animate({"opacity":1});
        });
        $("#detail_goBack").on("click",function(){
            $("#bike_detail").animate({"opacity":0});
            $("#bike_detail").hide();
            //window.history.go(-1);
        });
        $("#show_iArea").off().on("click",function(){
            $("#issue_detail").show();
            iArea_obj.init();
            $("#issue_detail").animate({"opacity":1});
        });
        $("#issue_goBack").on("click",function(){
            $("#issue_detail").animate({"opacity":0});
            $("#issue_detail").hide();
            //window.history.go(-1);
        })
        $(".btn-add").on("click",function(){
            $("#add_panel").animate({"opacity":1});
            $("#add_panel").show();
        })
        $("#add_goBack").off().on("click",function(){
            $("#add_panel").animate({"opacity":0});
            $("#add_panel").hide();
        })
        $("#close").off().on("click",function(){
            $("#option_panel").animate({"opacity":0});
            $("#option_panel").hide();
        });
        $("#save_Tarea").off().on("click",function(){
            var bike_num=$("#bike_id").val();
            var task_type=$("#task-type").val();
            if(bike_num)
            $.ajax({
                url: _defautBiz.api("save"),
                dataType: "json",
                method: 'get',
                data: {
                    bikeId:bike_num,
                    taskType:task_type
                },
                success: function (data) {
                    //data.success && data.returnCode == 0 && data.data.data.datas && Manager.parseData(data.data.data);
                    $("#add_panel").animate({"opacity":0});
                    $("#add_panel").hide();
                    var params = {
                        pageSize: _obj.pageSize,
                        currPage: 1,
                        mission_type:"",
                        mission_state:"",
                        bikeNum:"",
                        user:""
                    };
                    _obj.initData(params);
                }
            });

        });
        $("#option_save").off().on("click",function(){
            var userId=$("#option-user").val();
            var status=$("#option-state").val();
            var taskType=$("#option-type").val();
            var taskId=$(this).attr("task_id");
            var remark=$("#area_msg").val();
            $.ajax({
                url: _defautBiz.api("save"),
                dataType: "json",
                method: 'get',
                data: {
                    userId:userId,
                    status:status,
                    taskType:taskType,
                    taskId:taskId,
                    remark:remark
                },
                success: function (data) {
                    //data.success && data.returnCode == 0 && data.data.data.datas && Manager.parseData(data.data.data);
                    $("#option_panel").animate({"opacity":0});
                    $("#option_panel").hide();
                    var params = {
                        pageSize: _obj.pageSize,
                        currPage: 1,
                        mission_type:"",
                        mission_state:"",
                        bikeNum:"",
                        user:""
                    };
                    _obj.initData(params);
                }
            });

        });

        $(".btn-remove").off().on("click",function(){
            var selected=$("input[name='lockId']:checkbox:checked");
            var idList=[];
            selected.each(function(){
                idList.push($(this).val());
                //console.log($(this).val())
            })
            if(idList.length>0){
                $.ajax({
                    url: _defautBiz.api("del"),
                    dataType: "json",
                    data: {
                        ids: idList.toString()
                    },
                    method: "GET",
                    success: function (resp) {
                        var params = {
                            pageSize: _obj.pageSize,
                            currPage: 1,
                            mission_type:_obj.mission_type,
                            mission_state:_obj.mission_state,
                            bikeNum:_obj.bikeNum,
                            user:_obj.user
                        };
                        _obj.initData(params);
                    }
                })
            }
        })
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
var area_obj={
    map:"",
    polygonList:[],
    init:function(){
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();
    },
    drawMap:function(){
        var map=this.map=new AMap.Map('dt_mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 12,
            center: [116.403322,39.920255]
        });
        this.drawPolygon();
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
                        console.log(AreaItem[j]);
                        var polygon = new AMap.Polygon({
                            path: AreaItem[j], //设置多边形边界路径
                            // path: polygonArr,//设置多边形边界路径
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
    }
};
Manager.init();



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
    //pageSize: _obj.pageSize,
    //    currPage: 1,
    //    mission_type:_obj.mission_type,
    //    mission_state:_obj.mission_state,
    //    bikeNum:_obj.bikeNum,
    //    user:_obj.user
    var url="?taskType="+Manager.mission_type+"&taskStatus="+Manager.mission_state+"&bikeId="+Manager.bikeNum+"&userId="+Manager.user;
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
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}