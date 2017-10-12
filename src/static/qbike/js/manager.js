/**
 * Created by lihaotian on 2016/12/12.
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
                    transportation: _base_url + '/batchInstruction/transportation' + "?_v=" + _v,
                    versionQuery: _base_url + '/batchInstruction/lockVersionQuery' + "?_v=" + _v,
                    updateVersion: _base_url + '/batchInstruction/updateVersion' + "?_v=" + _v,
                    openTraceMode: _base_url + '/batchInstruction/openTraceMode' + "?_v=" + _v,
                    getParaMessage: _base_url + '/batchInstruction/getParaMessage' + "?_v=" + _v,
                    setCloseTime: _base_url + '/batchInstruction/setCloseTime' + "?_v=" + _v,
                    setOpenTime: _base_url + '/batchInstruction/setOpenTime' + "?_v=" + _v,
                },
                product: {
                    transportation: _base_url + '/batchInstruction/transportation' + "?_v=" + _v,
                    versionQuery: _base_url + '/batchInstruction/lockVersionQuery' + "?_v=" + _v,
                    updateVersion: _base_url + '/batchInstruction/updateVersion' + "?_v=" + _v,
                    openTraceMode: _base_url + '/batchInstruction/openTraceMode' + "?_v=" + _v,
                    getParaMessage: _base_url + '/batchInstruction/getParaMessage' + "?_v=" + _v,
                    setCloseTime: _base_url + '/batchInstruction/setCloseTime' + "?_v=" + _v,
                    setOpenTime: _base_url + '/batchInstruction/setOpenTime' + "?_v=" + _v,
//                    // 导出表格
//                    http://localhost:8080/bike/viewSetting/export
//// 表格查询
//                    http://localhost:8080/bike/viewSetting/search?currentPage=1
//// 隐藏车辆
//            http://localhost:8080/bike/viewSetting/hide?bikeNumbers=310100003004,310100003002
//// 显示车辆
//                http://localhost:8080/bike/viewSetting/show?bikeNumbers=310100003001,310100003005
                    export:"/bike/viewSetting/export",
                    search:"/bike/viewSetting/search",
                    hide:"/bike/viewSetting/hide",
                    show:"/bike/viewSetting/show"
                }
            }
        }
    };

var manager_obj = {
    currPage:1,
    pageSize:10,
    init: function() {
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        var data_append="";
        for(var i=0;i<10;i++)
            data_append+="<tr><td><input type='checkbox' name='bikeNum' value='"+(310000+i)+"'/></td><td>"+("310000"+i)+"</td><td>"+("621000000"+i)+"</td><td>可用</td><td>2017-11-11 20:00:00</td></tr>";
        $("#Pagination tbody").append(data_append);
        function selectCheck(){
            if($("#AllSelect").prop("checked"))$('input[name="bikeNum"]').prop("checked",true);
        }

        //$('.M-box1').pagination({
        //    totalData:100,
        //    showData:5,
        //    jump:true,
        //    coping:true,
        //    callback:function(index){
        //        var num=index.getCurrent();
        //        $("#Pagination tbody").html("");
        //        data_append="";
        //        for(var i=0;i<10;i++)
        //            data_append+="<tr><td><input type='checkbox' name='bikeNum' value='"+(310000+num)+"'/></td><td>"+("310000"+num)+"</td><td>"+("621000000"+num)+"</td><td>可用</td><td>2017-11-11 20:00:00</td></tr>";
        //        $("#Pagination tbody").append(data_append);
        //        selectCheck();
        //    }
        //});
        var params = {
            pageSize: 10,
            currPage: 1
        };
        //this.initData(params);
        this.refreshData();
        this.componentInit();
    },
    refreshData:function(params){
        _obj=this;
        _obj.lockId=$("#lockId").val();
        //_obj.startTime=($("#createTime_from").val()).split("/")[2]+"-"+($("#createTime_from").val()).split("/")[0]+"-"+($("#createTime_from").val()).split("/")[1];
        //_obj.endTime=($("#createTime_to").val()).split("/")[2]+"-"+($("#createTime_to").val()).split("/")[0]+"-"+($("#createTime_to").val()).split("/")[1];
        _obj.currPage=1;
        $.ajax({
            url: _defautBiz.api("search")+"?pageSize="+_obj.pageSize+"&currentPage="+1,
            dataType: "json",
            method: "GET",
            success: function(resp) {
                $("#Pagination tbody").html("");
                var data_append="";
                if(resp.data.data.length==0){
                    $("#show_opt").hide();
                    $("#export_opt").hide();
                    $(".pag_list").hide();
                }
                else {
                    $(".pag_list").show();
                    $("#show_opt").show();
                    $("#export_opt").show();
                    for(var i in resp.data.data)
                        data_append+="<tr><td><input type='checkbox' name='bikeNum' value='"+(resp.data.data[i].bikeNumber?resp.data.data[i].bikeNumber:"")+"'/></td><td>"+(resp.data.data[i].bikeNumber?resp.data.data[i].bikeNumber:"")+"</td><td>"+(resp.data.data[i].lockNumber?resp.data.data[i].lockNumber:"")+"</td><td>"+(resp.data.data[i].bikeStatus?resp.data.data[i].bikeStatus:"")+"</td><td>"+(resp.data.data[i].createTime?new Date(resp.data.data[i].createTime).format('MM.dd hh:mm:ss'):"")+"</td></tr>";
                    $("#Pagination tbody").append(data_append);
                    $('.M-box1').pagination({
                        totalData:resp.data.page.totalResult,
                        showData:resp.data.page.showCount,
                        jump:true,
                        coping:true,
                        callback:function(index){
                            var num=index.getCurrent();
                            _obj.refreshPagination(num);
                            //$("#Pagination tbody").html("");
                            //data_append="";
                            //for(var i=0;i<indx;i++)
                            //    data_append+="<tr><td>"+("Misc"+i+num)+"</td><td>IE Mobile</td><td>Windows Mobile 6</td><td>-</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>122</td></tr>";
                            //$("#Pagination tbody").append(data_append);
                        }
                    });
                }
            }});
    },
    refreshPagination:function(indx){
        _obj.currPage=indx;
        $.ajax({
            url: _defautBiz.api("search")+"?pageSize="+_obj.pageSize+"&currentPage="+indx,
            dataType: "json",
            method: "GET",
            success: function(resp) {
                $("#Pagination tbody").html("");
                var data_append="";
                for(var i in resp.data.data)
                    data_append+="<tr><td><input type='checkbox' name='bikeNum' value='"+(resp.data.data[i].bikeNumber?resp.data.data[i].bikeNumber:"")+"'/></td><td>"+(resp.data.data[i].bikeNumber?resp.data.data[i].bikeNumber:"")+"</td><td>"+(resp.data.data[i].lockNumber?resp.data.data[i].lockNumber:"")+"</td><td>"+(resp.data.data[i].bikeStatus?resp.data.data[i].bikeStatus:"")+"</td><td>"+(resp.data.data[i].createTime?new Date(resp.data.data[i].createTime).format('MM.dd hh:mm:ss'):"")+"</td></tr>";
                $("#Pagination tbody").append(data_append);
            }
        });
    },
    componentInit: function() {
        var _obj=this;
        $("#AllSelect").on("click",function(){
            if($(this).prop("checked"))$('input[name="bikeNum"]').prop("checked",true);
            else $('input[name="bikeNum"]').removeAttr("checked");
        })
        $(".pag_list button").on("click",function () {
            $(".pag_list button").removeClass("active");
            $(this).addClass("active");
            var indx=$(this).text();
            _obj.pageSize=indx;
            _obj.refreshData();
            //_obj.refreshHistory();
        })
        $("#hide_opt").on("click",function(){
            var str=$("#lock-ids").val();
            $.ajax({
                url: _defautBiz.api("hide")+"?bikeNumbers="+str,
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    _obj.refreshData();
                }})

        })
        $("#show_opt").on("click",function(){
            var str="";
            $('input[name="bikeNum"]:checked').each(function() {
                str+=($(this).val()!="all"?($(this).val()+","):"");
            });
            $.ajax({
                url: _defautBiz.api("show")+"?bikeNumbers="+str,
                dataType: "json",
                method: 'get',
                success: function(resp) {
                    _obj.refreshPagination(_obj.currPage);
                }})
        })
        $("#export_opt").on("click",function(){
            window.open(_defautBiz.api("export"));
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
manager_obj.init();
//var refresh_data=setInterval(function(){
//    dispatch_obj.refreshData();
//dispatch_obj.map.setMapStyle('normal');
//},10000);
//function Data_refresh(){
//    dispatch_obj.refreshData();
//    setTimeout(function(){Data_refresh()},10000)
//


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
//批量操作s
var mul_dispose_ids = '';
function mul_dispose(){
    var lockids = $('#lock-ids').val();
    if(lockids == ""){
        $("#e_info").html('请输入12位设备编号,多个设备请用英文小写逗号隔开');
        $("#error_commend").modal('show');
        return;
    }
    //获取批量操作的id列表,赋值给全局变量mul_dispose_ids,同时计算出要批量操作的数量,赋值给lock-number
    mul_dispose_ids = lockids;
    var lockNum = lockids.split(',').length;
    var type = $('.act-type').val(),
        ip = $('.ip-address').val(),
        port = $('.port-num').val(),
        time = $('.time-num').val(),
        version = $('.version-number').val(),
        upgradeType = $('.upgrade-type-select').val();
    var errMsg = ""
    switch (type){
        case '5':
            if(ip == "" || port == "") errMsg = '修改服务器地址时,ip地址和端口号为必填项';
            break;
        case '11':
            if(version == "") errMsg = "升级版本时,版本号为必填项"
            break;
    }
    if(errMsg){
        $("#e_info").html(errMsg);
        $("#error_commend").modal('show');
        return;
    }

    $('.lock-number').html(lockNum);
    $('#save_judge').attr({
        'data-type':type,
        'data-ip': ip,
        'data-port':port,
        'data-time': time,
        'data-version': version,
        'data-upgradeType': upgradeType,
        'data-ids':lockids
    });
    $("#judge_alert").modal('show');
}

function sendMsg(url, opts){
    $.ajax({
        url: url,
        dataType: "json",
        method: 'get',
        data: opts,
        success: function(data) {
            if(data.success){
                $('#action_success').modal('show');
            }
            else{
                $('#action_false').modal('show');
            }
        }
    });
}


$(".act-type").off().on("change", function(){
    var ipGroup = $('.ip-group'),
        timeGroup = $('.time-group'),
        versionGroup = $('.version-group');
    ipGroup.hide();
    timeGroup.hide();
    versionGroup.hide();
    switch (this.value){
        case '5':
            ipGroup.show()
            break;
        case '7':
        case '8':
            timeGroup.show()
            break;
        case '11':
            versionGroup.show()
            break;
    }
})


