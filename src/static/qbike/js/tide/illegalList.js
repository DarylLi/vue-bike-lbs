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
                    ListPage:_base_url +'/listIllegal.json',
                    export:'/illegal/infoExport'
                },
                product: {
                    ListPage:"/illegal/info",
                    export:'/illegal/infoExport'
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
    startDate:"",
    endDate:"",
    user:getUrlParam("userId"),
    init: function () {
        $('#createTime_from').datepicker({
            autoclose: true,
            format: 'yyyy/mm/dd'
        });
        $('#createTime_to').datepicker({
            autoclose: true,
            format: 'yyyy/mm/dd'
        });
        //$('#createTime_from').val(new Date().format("yyyy/MM/dd"));
        //$('#createTime_to').val(new Date().format("yyyy/MM/dd"));
        var params = {
            pageSize: this.pageSize,
            currPage: 1,
            startDate:this.startDate,
            endDate:this.endDate
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
                startDate: params.startDate,
                endDate: params.endDate
            },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data.datas && Manager.parseData(data.data);
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
                startDate: params.startDate,
                endDate: params.endDate
            },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data && Manager.parseNextPageData(data.data);
            }
        });
    },
    parseNextPageData: function (data) {
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        for (var i = 0; i < pageSize && i < data.datas.length; i++)
            data_append += "<tr><td>"+data.datas[i].parkDateStr+"</td><td>" + data.datas[i].cityUserName + "</td><td>" + data.datas[i].groundUserName + "</td><td>" + data.datas[i].bikeId + "</td><td>" + data.datas[i].power + "%</td><td>" + data.datas[i].timeCurrStr + "</td><td>" + data.datas[i].fixTypeStr +"</td><td>" + data.datas[i].timeFixStr + "</td><td>" + (data.datas[i].addressFix?data.datas[i].addressFix:"") + "</td></tr>";
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
            data_append += "<tr><td>"+data.datas[i].parkDateStr+"</td><td>" + data.datas[i].cityUserName + "</td><td>" + data.datas[i].groundUserName + "</td><td>" + data.datas[i].bikeId + "</td><td>" + data.datas[i].power + "%</td><td>" + data.datas[i].timeCurrStr + "</td><td>" + data.datas[i].fixTypeStr +"</td><td>" + data.datas[i].timeFixStr + "</td><td>" + (data.datas[i].addressFix?data.datas[i].addressFix:"") + "</td></tr>";
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
                    startDate:_obj.startDate,
                    endDate:_obj.endDate
                };
                Manager.initNextPageData(params);
            }
        });
    },
    remove: function () {
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        }
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
                startDate:_obj.startDate,
                endDate:_obj.endDate
            };
            Manager.initData(params);

        });
        $("#query-list").on("click",function(){
            _obj.startDate=$("#createTime_from").val()?$("#createTime_from").val().split("/")[0]+$("#createTime_from").val().split("/")[1]+$("#createTime_from").val().split("/")[2]:"";
            _obj.endDate=$("#createTime_to").val()?$("#createTime_to").val().split("/")[0]+$("#createTime_to").val().split("/")[1]+$("#createTime_to").val().split("/")[2]:"";
            var params = {
                pageSize: _obj.pageSize,
                currPage: 1,
                startDate:_obj.startDate,
                endDate:_obj.endDate
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
    var url="?startDate="+Manager.startDate+"&endDate="+Manager.endDate;
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