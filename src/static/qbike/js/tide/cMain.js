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
                    ListPage:_base_url +'/Alllist.json',
                    StatusNumber:_base_url +'/Allstatus.json',
                    view:_base_url +'/IM_view.json',
                    issue:_base_url +'/IA_list.json',
                    export:'/task/exportTodayTask'
                },
                product: {
                    ListPage:"/task/toDayTaskListPage",
                    StatusNumber:"/task/toDayTaskStatusNumber",
                    view:"/ground/view",
                    issue:"/illegal/list",
                    export:'/task/exportTodayTask'
                }
            }
        }
    };
var totalData = '';
var pageSize = '';
var area_pos="";
var totArea=[];
var WarnArea=[];
var cMain = {
    init: function () {
        $.ajax({
            url: _defautBiz.api("StatusNumber"),
            dataType: "json",
            method: 'get',
            //beforeSend: function(xhr) {
            //    xhr.setRequestHeader("cityCode",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            //    //xhr.setRequestHeader("User-Agent", "headertest");
            //},
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
            pageSize: 10,
            currPage: 1
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
            },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data.data && cMain.parseData(data.data.data);
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
            },
            // beforeSend: function(xhr) {
            //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
            // },
            success: function (data) {
                data.success && data.returnCode == 0 && data.data.data && cMain.parseNextPageData(data.data.data);
            }
        });
    },
    parseNextPageData: function (data) {
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        for (var i = 0; i < pageSize && i < data.datas.length; i++)
            data_append += "<tr><td>" + (data.datas[i].areaName) + "</td><td>" + data.datas[i].cityManager + "</td><td><a href='/tide/work_manager.html?userName="+data.datas[i].userName+"&userId="+data.datas[i].userId+"'>" + data.datas[i].userName + "</a></td><td>" + data.datas[i].todayPlanNumber + "</td><td>" + data.datas[i].todayDoneNumber + "</td><td>" + data.datas[i].todayDoneRatioStr + "</td><td>" + data.datas[i].currentMonthPlanNumber + "</td><td>" + data.datas[i].currentMonthDoneNumber + "</td><td>" + data.datas[i].currentMonthDoneRatioStr + "</td></tr>";
        $("#Pagination tbody").append(data_append);
    },
    parseData: function (data) {
        totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        if(data.datas.length>0){area_pos=data.datas[0].areaName};
        for (var i = 0; i < pageSize && i < data.datas.length; i++)
            data_append += "<tr><td>" + (data.datas[i].areaName) + "</td><td>" + data.datas[i].cityManager + "</td><td><a href='/tide/work_manager.html?userName="+data.datas[i].userName+"&userId="+data.datas[i].userId+"'>" + data.datas[i].userName + "</a></td><td>" + data.datas[i].todayPlanNumber + "</td><td>" + data.datas[i].todayDoneNumber + "</td><td>" + data.datas[i].todayDoneRatioStr + "</td><td>" + data.datas[i].currentMonthPlanNumber + "</td><td>" + data.datas[i].currentMonthDoneNumber + "</td><td>" + data.datas[i].currentMonthDoneRatioStr + "</td></tr>";
        $("#Pagination tbody").append(data_append);
        $('.M-box1').pagination({
            totalData: totalData,
            showData: pageSize,
            jump: true,
            coping: true,
            callback: function (index) {
                var num = index.getCurrent();
                var params = {
                    lockId: cMain.lockId,
                    status: cMain.status,
                    pow: cMain.pow,
                    producer: cMain.producer,
                    channel: cMain.channel,
                    pageSize: pageSize,
                    currPage: num
                };
                cMain.initNextPageData(params);
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
        _obj = this;
        $(".pag_list button").on("click", function () {
            $(".pag_list button").removeClass("active");
            $(this).addClass("active");
            var indx = $(this).text();
            // _obj.updateList(indx)
            var params = {
                lockId: cMain.lockId,
                status: cMain.status,
                pow: cMain.pow,
                producer: cMain.producer,
                channel: cMain.channel,
                pageSize: indx,
                currPage: 1
            };
            cMain.initData(params);

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
        });
        if(area_pos)map.setCity(area_pos);
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
var iArea_obj={
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
        var map=this.map=new AMap.Map('issue_mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 12,
        });
        if(area_pos)map.setCity(area_pos);
        this.drawPolygon();
    },
    drawPolygon:function(){
        var _obj=this;
        _obj.map.remove(_obj.polygonList);
        _obj.polygonList=[];
        WarnArea=[];
        $.ajax({
            url: _defautBiz.api("issue"),
            dataType: "json",
            method: 'get',
            success: function (data) {
                for(var indx in data.data){
                    WarnArea.push(data.data[indx].region);
                }
                for(var i in WarnArea){
                    var AreaItem=eval(WarnArea[i]);
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

cMain.init();



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
    var url="?cityCode="+($("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
    window.open(_defautBiz.api("export")+url);
    $("#judge_alert").modal('hide');
});
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}