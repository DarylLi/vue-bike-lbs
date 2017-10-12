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
                    add: _base_url +'/IA_add.json',
                    list:_base_url +'/IM_list.json',
                    del:_base_url +'/IA_del.json',
                    save:_base_url +'/IM_save.json',
                    get:_base_url +'/IM_get.json',
                    view:_base_url +'/IM_view.json'
                },
                product: {
                    add:'/illegal/add',
                    list:'/ground/list',
                    view:'/ground/view',
                    del:'/illegal/del',
                    save:'/ground/save',
                    get:'/ground/getList'
                }
            }
        }
    };
var clickListener="";
var totalData = '';
var pageSize = '';
var totArea=[];
var member = {
    init: function () {
        var params = {
            pageSize: 10,
            currPage: 1
        };
        this.initData();
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
    initData: function () {
        //pageSize = params.pageSize;
        $.ajax({
            url: _defautBiz.api("list"),
            dataType: "json",
            method: 'get',
            //data: {
            //    lockId: params.lockId && params.lockId,
            //    status: params.hasOwnProperty("status") ? params.status : "",
            //    pow: params.hasOwnProperty("pow") ? params.pow : "",
            //    pageSize: params.pageSize,
            //    currPage: params.currPage,
            //    producer: params.producer,
            //    channel: params.channel
            //},
            success: function (data) {
                member.parseData(data.data);
            }
        });
    },

    //initNextPageData: function (params) {
    //    pageSize = params.pageSize;
    //    $.ajax({
    //        url: _defautBiz.api("list"),
    //        dataType: "json",
    //        method: 'get',
    //        data: {
    //            pageSize: params.pageSize,
    //            currPage: params.currPage,
    //            lockId: params.lockId && params.lockId,
    //            status: params.hasOwnProperty("status") ? params.status : "",
    //            pow: params.hasOwnProperty("pow") ? params.pow : "",
    //            producer: params.producer,
    //            channel: params.channel
    //        },
    //        // beforeSend: function(xhr) {
    //        //     xhr.setRequestHeader("area",$("#citySelect").attr("areacode")?$("#citySelect").attr("areacode"):"0");
    //        // },
    //        success: function (data) {
    //            data.success && data.returnCode == 0 && data.data.data && member.parseNextPageData(data.data);
    //        }
    //    });
    //},
    //parseNextPageData: function (data) {
    //    totalData = data.total;
    //    $("#Pagination tbody").html("");
    //    var data_append = "";
    //    for (var i = 0; i < pageSize && i < data.datas.length; i++){
    //        data_append += "<tr><td><input type='checkbox' name='lockId' value='"+data.datas[i].lockId+"'/></td><td>"+data.datas[i].lockId+"</td><td><a href='javascript:void(0)' class='AreaOption' id='"+data.datas[i].lockId+"'>设置</a></td><td>"+data.datas[i].lockId+"</td></tr>";
    //    }
    //    $("#Pagination tbody").append(data_append);
    //    $(".AreaOption").off().on("click",function(){
    //        $("#option_panel").show();
    //        //area_obj.init();
    //        $("#option_panel").animate({"opacity":1});
    //    });
    //},
    parseData: function (data) {
        //totalData = data.total;
        $("#Pagination tbody").html("");
        var data_append = "";
        //for (var i = 0; i < pageSize && i < data.datas.length; i++){
        for (var i in data){
            //totArea.push(data[i].region);
            data_append += "<tr><td>"+data[i].majorUserName+"</td><td><a href='javascript:void(0)' class='AreaOption' id='"+data[i].majorUserId+"'>设置</a></td></tr>";
        }
        $("#Pagination tbody").append(data_append);
        $(".AreaOption").off().on("click",function(){
            $("#option_panel").show();
            area_option.init($(this).attr("id"));
            $("#option_panel").animate({"opacity":1});
        })
        //$('.M-box1').pagination({
        //    totalData: totalData,
        //    showData: pageSize,
        //    jump: true,
        //    coping: true,
        //    callback: function (index) {
        //        var num = index.getCurrent();
        //        var params = {
        //            lockId: member.lockId,
        //            status: member.status,
        //            pow: member.pow,
        //            producer: member.producer,
        //            channel: member.channel,
        //            pageSize: pageSize,
        //            currPage: num
        //        };
        //        member.initNextPageData(params);
        //    }
        //});
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
            // _obj.updateList(indx)
            var params = {
                lockId: member.lockId,
                status: member.status,
                pow: member.pow,
                producer: member.producer,
                channel: member.channel,
                pageSize: indx,
                currPage: 1
            };
            member.initData(params);

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
        })
        $("#option_goBack").on("click",function(){
            $("#option_panel").animate({"opacity":0});
            $("#option_panel").hide();
            //window.history.go(-1);
        })
        $("#add").off().on("click",function(){
            $("#add_panel").animate({"opacity":1});
            $("#add_panel").show();
        });
        $("#add_goBack").off().on("click",function(){
            $("#add_panel").animate({"opacity":0});
            $("#add_panel").hide();
        })
        $("#save_Tarea").off().on("click",function(){
            var name=$("#list-name").val();
            if(name)
            $.ajax({
                url: _defautBiz.api("add"),
                dataType: "json",
                data: {
                    name: name
                },
                method: "GET",
                success: function (resp) {
                    _obj.init();
                    $("#add_panel").animate({"opacity":0});
                    $("#add_panel").hide();
                }
            })
        });
        $("#delete").off().on("click",function(){
            var selected=$("input[name='lockId']:checkbox:checked");
            var idList=[];
            selected.each(function(){
                idList.push($(this).val());
            })
            if(idList.length>0){
                $.ajax({
                    url: _defautBiz.api("del"),
                    dataType: "json",
                    data: {
                        ids: "["+idList.toString()+"]"
                    },
                    method: "GET",
                    success: function (resp) {
                        _obj.init();
                        $("#add_panel").animate({"opacity":0});
                        $("#add_panel").hide();
                    }
                })
            }
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
var area_obj={
    map:"",
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
            zoom: 12
        });
        this.drawPolygon();
    },
    drawPolygon:function(){
        var _obj=this;
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
                        //console.log(eval(AreaItem[j]));
                        var polygon = new AMap.Polygon({
                            path: AreaItem[j], //设置多边形边界路径
                            // path: polygonArr,//设置多边形边界路径
                            strokeColor: "#ff9600", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线宽
                            fillOpacity: 0.5 //填充透明度
                        });
                        polygon.setMap(_obj.map);
                        if(j==0)_obj.map.setZoomAndCenter(10,polygon.getPath()[0]);
                    }
                }
            }
        })
    }
};
var area_option={
    draw_line:[],
    polygonList:[],
    polygonLineList:[],
    AllpolygonLineList:[],
    drawingPolygon:"",
    map:"",
    id:"",
    massBuild:false,
    areaList: [],
    map_massList:[],
    iu_Mass: null,
    it_Mass: null,
    ip_Mass: null,
    majorUserIdList:[],
    out_Mass: null,
    init:function(id){
        $(".switch-container a").removeClass("active");
        $(".switch-container a:first-child").addClass("active");
        this.id=id;
        $("#citySelect").val(localStorage.alert_city);
        $("#citySelect").attr("areacode",localStorage.alert_code!="undefined"?localStorage.alert_code:"0");
        $("#c_city").text(localStorage.alert_city);
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $("body").addClass("hold-transition").addClass("skin-blue").addClass("layout-top-nav");
        this.drawMap();

    },
    drawMap:function(){
        var map=this.map=new AMap.Map('option_mapDiv', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            zoom: 12
        });
        var _obj=this;
        var rightClickListener = AMap.event.addListener(_obj.map, "rightclick", function(e) {
            endLine();
            function endLine() {
                var _v = new Date().getTime();
                _obj.polygonLineList.push({"pId":_v,"lineArry":_obj.save_line});
                _obj.drawingPolygon.drawId=_v;
                if(_obj.drawingPolygon.getPath().length>2){
                    _obj.drawingPolygon.show=true;
                    _obj.polygonList.push(_obj.drawingPolygon);
                }
                else{_obj.drawingPolygon.show=false;_obj.map.remove(_obj.drawingPolygon);}
                _obj.draw_line = [];
                _obj.save_line = [];
                if (clickListener) {
                    AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
                }
                if (moveListener) {
                    AMap.event.removeListener(moveListener); //移除事件，以绑定时返回的对象作为参数
                }
            }
            if($(".switch-container a.active").attr("id")=="add_area")
                _obj.linePolygon();
            else _obj.removePolygon();
        });

        this.componentInit();
        this.drawPolygon();
        //this.drawMass();
    },
    componentInit:function(){
        this.linePolygon();
        var _obj=this;
        $(".switch-container a").off().on("click",function(){
            $(".switch-container a").removeClass("active");
            $(this).addClass("active");
            if($(this).attr("id")=="add_area")
                _obj.linePolygon();
            else _obj.removePolygon();
        });
        $("#save_area").off().on("click",function(){
            var param=$.grep(_obj.polygonList,function(e){
                return e.show==true;
            })
            var paramList=[];
            for(var i in _obj.majorUserIdList){
                var paramJudge=$.grep(param,function(e){
                    return _obj.majorUserIdList[i]== e.majorUserId;
                });
                var strList="";
                for(var num in paramJudge){
                    var points=paramJudge[num].getPath();
                    var str="";
                    for(var j in points){
                        str+="["+points[j].toString()+"]"+(j==(points.length-1)?"":",");
                    }
                    strList+="["+str+"]"+(num==(paramJudge.length-1)?"":",");
                }
                paramList.push(
                    {
                        majorUserId:_obj.majorUserIdList[i],
                        region:"["+strList+"]"
                    }
                );
            }
            //var strList="";
            //for(var i in param){
            //    var points=param[i].getPath();
            //    var str="";
            //    for(var j in points){
            //        str+="["+points[j].toString()+"]"+(j==(points.length-1)?"":",");
            //    }
            //    strList+="["+str+"]"+(i==(param.length-1)?"":",");
            //}
            $.ajax({
                url: _defautBiz.api("save"),
                dataType: "json",
                method: 'post',
                data: {
                    //majorUserId: _obj.id,
                    //region:"["+strList+"]"
                    userMajorRegions:JSON.stringify(paramList)
                },
                success: function (data) {
                    $("#option_panel").animate({"opacity":0});
                    $("#option_panel").hide();
                    $("#action_false").modal('show');
                    //alert("保存成功")
                }
            });
        });
        //document.onkeydown=function(event) {
        //    var e = event || window.event || arguments.callee.caller.arguments[0];
        //    if (e && e.keyCode == 27) {
        //        endLine();
        //        function endLine() {
        //            var _v = new Date().getTime();
        //            _obj.polygonLineList.push({"pId":_v,"lineArry":_obj.save_line});
        //            _obj.drawingPolygon.drawId=_v;
        //            _obj.drawingPolygon.show=true;
        //            _obj.polygonList.push(_obj.drawingPolygon);
        //            console.log(_obj.polygonList);
        //            console.log(_obj.polygonLineList);
        //            _obj.draw_line = [];
        //            _obj.save_line = [];
        //            if (clickListener) {
        //                AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        //            }
        //            if (moveListener) {
        //                AMap.event.removeListener(moveListener); //移除事件，以绑定时返回的对象作为参数
        //            }
        //        }
        //        _obj.linePolygon();
        //    }
        //};
    },
    refreshPolygon:function(){
        if(this.polygonList.length>0){
            for(var i in this.polygonList){
                this.polygonList[i].remove();
            }
        }
    },
    drawPolygon:function(){
        var _obj=this;
        _obj.polygonList=[];
        $.ajax({
            url: _defautBiz.api("get"),
            dataType: "json",
            method: 'get',
            data: {
                majorUserId: _obj.id
            },
            success: function (data) {
                for(var i in data.data){
                _obj.majorUserIdList.push(data.data[i].majorUserId);
                if(data.data[i].majorUserId==_obj.id){
                    var AreaItem=eval(data.data[i].region);
                    var majorUserId=data.data[i].majorUserId;
                    for(var i in AreaItem){
                        _obj.polygonLineList.push({"pId":1,"lineArry":AreaItem[i]})
                        var polygon = new AMap.Polygon({
                            path: AreaItem[i], //设置多边形边界路径
                            strokeColor: "#ff9600", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线宽
                            fillColor: "#ff9600",
                            fillOpacity: 0.5 //填充透明度
                        });
                        polygon.drawId=1;
                        polygon.show=true;
                        polygon.majorUserId=majorUserId;
                        _obj.polygonList.push(polygon);
                        polygon.setMap(_obj.map);
                        if(i==0)_obj.map.setZoomAndCenter(10,polygon.getPath()[0]);
                    }
                }
                }
                var itemList= $.grep(data.data,function(e){
                    return e.majorUserId!=_obj.id;
                });
                for(var i in itemList){
                    var majorUserId=itemList[i].majorUserId;
                    var AreaItem=eval(itemList[i].region);
                    for(var i in AreaItem){
                        _obj.AllpolygonLineList.push({"pId":1,"lineArry":AreaItem[i]})
                        var polygon = new AMap.Polygon({
                            path: AreaItem[i], //设置多边形边界路径
                            strokeColor: "#b74635", //线颜色
                            fillColor: "#b74635",
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线宽
                            fillOpacity: 0.5 //填充透明度
                        });
                        polygon.drawId=1;
                        polygon.majorUserId=majorUserId;
                        polygon.show=true;
                        _obj.polygonList.push(polygon);
                        polygon.setMap(_obj.map);
                        if(i==0)_obj.map.setZoomAndCenter(10,polygon.getPath()[0]);
                    }

                }
            }
        });
    },
    removePolygon:function(){
        var _obj=this;
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        }
        if (moveListener) {
            AMap.event.removeListener(moveListener); //移除事件，以绑定时返回的对象作为参数
        }
        if(this.polygonList.length>0){
            for(var i in this.polygonList){
                (function(num){
                    _obj.polygonList[num].off().on('click',function(){
                        //console.log(num+"judge");
                        //_obj.polygonList.splice(num,1);
                        //_obj.polygonLineList.splice(num,1);
                        //console.log(_obj.polygonList);
                        //console.log(_obj.polygonLineList);
                        _obj.polygonList[num].show=false;
                        //_obj.polygonLineList[num].
                        console.log(_obj.polygonList);
                        _obj.map.remove(this);
                        //_obj.removePolygon();
                    })
                })(i)
            }
        }
    },
    linePolygon:function(){
        var _obj=this;
        _obj.remove();
        var polygon =this.drawingPolygon= new AMap.Polygon({
            path: _obj.draw_line, //设置多边形边界路径
            strokeColor: "#ff9600",
            strokeOpacity: 1,
            strokeWeight: 3,
            bubble:true,
            fillColor: "#ff9600",
            fillOpacity: 0.35
        });
        polygon.majorUserId=_obj.id;
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
        });
        moveListener = AMap.event.addListener(_obj.map, "mousemove", function(e) {
            if (polygon) {
                var p_stg = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat());
                if (_obj.draw_line.length != 0)
                    _obj.draw_line[_obj.draw_line.length - 1] = p_stg;
                else _obj.draw_line[_obj.draw_line.length] = p_stg;
                polygon.setPath(_obj.draw_line);
            }
        });
    },
    drawMass: function() {
        var _obj=this;
        $.ajax({
            url:_defautBiz.api("listBikes"),
            dataType: "json",
            method: 'get',
            success: function(resp) {
                for (var i in resp.data.data) {
                    _obj.areaList.push({
                        "lnglat": [resp.data.data[i].lngRaw,resp.data.data[i].latRaw],
                        "name": resp.data.data[i].bid,
                        "status": resp.data.data[i].status,
                        "addressGps":resp.data.data[i].addressGps,
                        "address":resp.data.data[i].address,
                        "pos":resp.data.data[i].pos,
                        "posCurr":resp.data.data[i].posCurr,
                        "timeCurrStr":resp.data.data[i].timeCurrStr,
                        "timeGpsStr":resp.data.data[i].timeGpsStr,
                        "lockNumber":resp.data.data[i].lockNumber,
                        "power":resp.data.data[i].power,
                        "warnInfo":resp.data.warnInfo

                    })
                }
            if(_obj.areaList.length>0){_obj.massBuild = true;}
            var mass = _obj.mapMass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
                return e.status == "空闲"
            }), {
                url: '/static/qbike/img/enable.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
            //this.map_massList.push(this.mapMass);
            var mass_inuse = _obj.iu_Mass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
                return e.status == "骑行"
            }), {
                url: '/static/qbike/img/in_use.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
            //this.map_massList.push(this.iu_Mass);
            var mass_intouble = _obj.it_Mass = new AMap.MassMarks($.grep(_obj.areaList, function(e) {
                return e.status == "离线";
            }), {
                url: '/static/qbike/img/in_trouble.png',
                anchor: new AMap.Pixel(23, 42),
                size: new AMap.Size(48, 51),
                opacity: 1,
                cursor: 'pointer',
                zIndex: 5000
            });
                _obj.map_massList.push(_obj.it_Mass);
                _obj.it_Mass.setMap(_obj.map);
                _obj.map_massList.push(_obj.iu_Mass);
                _obj.iu_Mass.setMap(_obj.map);
                _obj.map_massList.push(_obj.mapMass);
                _obj.mapMass.setMap(_obj.map);
            }})
    },
    remove:function(){
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        }
    },
};

member.init();



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
    var url=member.status!=undefined?("lockId="+lockId+"&status="+member.status+"&pow="+member.pow+"&channel="+member.channel+"&producer="+member.producer):("lockId="+lockId);
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