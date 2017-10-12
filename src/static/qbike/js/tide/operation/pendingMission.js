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
                    groundTaskList:_base_url +'/ground_tasks.json'

                },
                product: {
                    groundTaskList:'/task/groundTaskList',
                }
            }
        }
    };
var isloading=0;
var pending={
    itemList:[],
    currentPage:1,
    init:function(){
        var _obj=this;
        var map = this.map = new AMap.Map('map_cmpt', {
            layers: [new AMap.TileLayer({
                textIndex: 2
            })],
            resizeEnable: true,
            zoom: 13,
            center: [116.291035,39.907899]
        });
        this.componentInit();
        _obj.initList(getUrlParam("lng"),getUrlParam("lat"));
        var geolocation;
        //map.plugin('AMap.Geolocation', function() {
        //    geolocation = new AMap.Geolocation({
        //        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        //        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        //        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        //        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        //        buttonPosition:'RB'
        //    });
        //    map.addControl(geolocation);
        //    geolocation.getCurrentPosition();
        //    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        //    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        //});
        function onComplete(data) {
            var lng=data.position.getLng();
            var lat=data.position.getLat();
            //当前位置
            _obj.currPos=[lng,lat];
            _obj.initList(lng,lat);
        }
        //解析定位错误信息
        function onError(data) {
            //document.getElementById('tip').innerHTML = '定位失败';
        }
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);
        return;
    },
    componentInit:function(){
        var _obj=this;
        $(window).scroll(function() {
        if($(window).scrollTop()+$(window).height()+5>$(document).height())
        {
            if(isloading==0) {
                isloading=1;
                _obj.renderList(_obj.currentPage)
                //$.getScript("http://*******/getUsersLimited?offset=" + list.length);
            }
        }
    });
    },
    initList:function(lng,lat){
        var _obj=this;
        $.ajax({
            //lng=121.479711&lat=31.264772
            url: _defautBiz.api("groundTaskList"),
            dataType: "json",
            data: {
                lng: lng,
                lat: lat,
                status:0
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
            if(i<_obj.itemList.length)
            $("#mission_list").append('<a href="/tide/operation/pendingMap.html?lng='+_obj.itemList[i].fixedLng+'&lat='+_obj.itemList[i].fixedLat+'" loc="'+_obj.itemList[i].fixedLng+','+_obj.itemList[i].fixedLat+'"><ul><li>任务编号: '+_obj.itemList[i].id+'</li><li>车辆编号: '+_obj.itemList[i].bikeId+'</li><div class="dis">'+_obj.itemList[i].distanceStr+'</div></ul></a>');
            else{$("#mission_list").append('<div class="info">—— 数据已全部加载 ——</div>');isloading=1;return;}
        }
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
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

pending.init();
