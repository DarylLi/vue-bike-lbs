<template>
	<div class="map_panel">
        <div class="modal-full" v-if="!locFinish" style="position: absolute;top:0px;z-index: 100;width:100%;height:100%;background: rgba(0, 0, 0, 0.41);text-align: center;color:#fff;padding-top: 50%;;">定位中。。。</div>
        <div class="wrapper full-page bike_detail" id="bike_detail">
		<div class="detail_panel">
			<div class="row" style="border:1px solid #e1e1e1;background: #fff;height:100%;">
            <div class="row" id="bike_filter" style="position:absolute;width:100%;top:0px;z-index:1;border-bottom: 1px solid #dedede;padding-top:10px;padding-bottom: 8px;margin:0px 0">
                <div class="navbar-header col-md-12">
                    <a href="javascript:void(0)" @click="typeFilter()" :class="{active:!bikeType}">
                    <div class="col-md-3 col-sm-3 col-xs-3 nav-item">
                        <span>全部</span>
                    </div>
                    </a>
                    <a href="javascript:void(0)" @click="typeFilter(1)" :class="{active:bikeType==1}">
                    <div class="col-md-3 col-sm-3 col-xs-3 nav-item">
                        <span>闲置</span>
                    </div>
                    </a>
                    <a href="javascript:void(0)" @click="typeFilter(2)" :class="{active:bikeType==2}">
                    <div class="col-md-3 col-sm-3 col-xs-3 nav-item">
                        <span>故障</span>
                    </div>
                    </a>
                    <a href="javascript:void(0)" @click="typeFilter(3)" :class="{active:bikeType==3}">
                    <div class="col-md-3 col-sm-3 col-xs-3 nav-item" style="border-right: 0px;">
                        <span>离线</span>
                    </div>
                    </a>
                </div>
            </div>
            <div class="row" style="height:100%;">
                <div class="col-md-12 col-sm-12 col-xs-12" style="padding: 0px;height: 100%;">
                    <div class="list_ctrl" @click="toLoc"><img src="../../static/qbike/img/tide/list.png" alt=""></div>
                    <div class="box box-default map" style="margin-bottom: 0px!important;height:100%;border-top:0px!important;">
                        <div id="dt_mapDiv" class="map" tabindex="0"></div>
                        <div class="ctrl_status" style="width: 100%;position: absolute;bottom: 20px;padding: 0 30%;"><button type="button" :class="{'ctrl_status':true,'all-stat':taskStatus==0}" @click="statusCtrl" id="ctrl_status" class="btn btn-outline"style="border-radius:20px;float:right;width:100%;color:#fff;background: rgba(0, 0, 0, 0.6)">{{currentStatus}}</button></div>
                        <div class="select-panel">
                            <div class="poiList">
                                <div class="requestNum">
                                    <input type="text" value="10" onkeyup="if(event.keyCode !=37 && event.keyCode != 39){if (!/^[\d]+$/ig.test(this.value)){this.value='';}}"/>
                                    <div class="poiContainer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		</div>
        </div>
        <transition name="router-fade" mode="out-in">
        <div class="wrapper full-page mission_detail" id="mission_panel" v-if="showMission">
        <div class="detail_panel" style="width: 100%;border-radius: 0px;background: #fff;margin-top:15%;height: auto">
            <!-- gaod map-->
            <div class="row" style="background: #fff">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="row" style="padding: 10px 20px;line-height:15px;margin-left:-5px;border-radius:0px">
                            <div class="detail-panel">
                                <div class="detail-title">任务详情</div>
                                <div>任务编号:<span id="mission_id">{{mission_id}}</span></div>
                                <div>车辆编号:<span id="car_id">{{car_id}}</span></div>
                                <div>锁上报时间:<span id="upload_time">{{upload_time}}</span></div>
                                <div>定位修正时间:<span id="fixed_time">{{fixed_time}}</span></div>
                                <div>定位修正方式:<span id="fixed_type">{{fixed_type}}</span></div>
                                <div>最新未位置:<span id="new_pos">{{new_pos}}</span></div>
                                <div>最后骑行用户(手机):<span id="last_phone">{{last_phone}}</span></div>
                                <div>最后骑行时间:<span id="last_time">{{last_time}}</span></div>
                                <div class="col-md-12 col-sm-12 col-xs-12 detail-state">
                                    <div class="col-md-2 col-sm-2 col-xs-2">状态:</div>
                                    <div class="col-md-10 col-sm-10 col-xs-10">
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chkStatus" type="radio" value="1" />已完成</div>
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chkStatus" type="radio" value="2" />进行中</div>
                                    </div>
                                    <div class="col-md-2 col-sm-2 col-xs-2"></div>
                                    <div class="col-md-10 col-sm-10 col-xs-10">
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chkStatus" type="radio" value="3"/>未找到</div>
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chkStatus" type="radio" value="4" />其他</div>
                                    </div>
                                </div>
                                <div>
                                    <textarea id="area_msg" placeholder="请输入备注信息" v-model="area_msg" style="width:100%;border: 1px solid #dedede;height: 120px;" rows="5" cols="25"></textarea>
                                </div>
                                <div style="float:left;width: 100%;text-align: center">
                                    <button type="button" class="btn btn-outline" data-dismiss="modal" id="go_pos" @click="goPos" style="border-radius:20px;float:left;width:45%;color:#fff;background: #ff9600">去最新位置</button>
                                    <button type="button" class="btn btn-outline" data-dismiss="modal" id="save_Tarea" @click="saveMission" style="border-radius:20px;float:right;width:45%;color:#ff9600;border:1px solid #ff9600;background: #fff">保存</button></div>
                                <a class="map-ctrl-goBack" @click='hideMission' id="add_goBack"><img src="../../static/qbike/img/modal_close.png" alt=""></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </transition>
	</div>
</template>
<script>
    import ajax from '../../config/ajax'
    import ApiControl from '../../config/envConfig.home'
    import utils from '../../config/utils'
    import groundList from './api/groundTaskList'
    import illegalList from './api/showIllegal'
    import hotList from './api/showHot'
    var env = 'product'
    export default {
        name: 'login',
        data() {
            return {
                map: null,
                areaList: [],
                map_massList: [],
                first_load: true,
                isdown: false,
                taskStatus: 2,
                bikeType: '',
                missionType: '',
                targetList: [],
                lineList: [],
                showMission: false,
                mission_id: '',
                car_id: '',
                upload_time: '',
                fixed_time: '',
                fixed_type: '',
                new_pos: '',
                last_phone: '',
                last_time: '',
                chkStatus: 1,
                area_msg: '',
                polygonList: [],
                currPos: [],
                mkPos: [],
                locFinish: false,
                currentStatus: '不显示已完成任务'
            }
        },
        created() {
            var _vue = this;

        },
        mounted() {
            this.map = new AMap.Map('dt_mapDiv', {
                center: [116.397428, 39.90923],
                resizeEnable: true,
                zoom: 10
            });
            this.locPosition();
            this.drawMass();
            this.drawPolygon();
        },
        methods: {
            changeAngle: function() {
                this.isdown = !this.isdown;
            },
            typeFilter: function(num) {
                this.bikeType = num;
                this.drawMass();
            },
            drawMass: function() {
                var _vue = this;
                _vue.areaList = [];
                //移除当前地图上所有车辆
                for (var i in _vue.map_massList) _vue.map.remove(_vue.map_massList[i]);
                _vue.map_massList = [];
                // _vue.$ajax.get(ApiControl.getApi(env, "groundTaskList"), {
                //     params: {
                //         status: _vue.taskStatus,
                //         type: _vue.bikeType
                //     }
                // }).
                // then(res => {
                if (groundList.data.length > 0) {
                    var resp = groundList;
                    for (var i in groundList.data) {
                        _vue.areaList.push({
                            "lnglat": [resp.data[i].fixedLng, resp.data[i].fixedLat],
                            "targetlnglat": resp.data[i].centerPointLng && resp.data[i].centerPointLat ? [resp.data[i].centerPointLng, resp.data[i].centerPointLat] : "",
                            "hotpointId": resp.data[i].hotpointId,
                            "taskId": resp.data[i].id,
                            "bikeId": resp.data[i].bikeId,
                            "taskSeq": resp.data[i].taskSeq,
                            "status": resp.data[i].bikeType,
                            "lockUploadTime": resp.data[i].lockUploadTime,
                            "fixedTime": resp.data[i].fixedTime,
                            "fixedType": resp.data[i].fixedType,
                            "fixedLocStreet": resp.data[i].fixedLocStreet,
                            "taskStatusStr": resp.data[i].taskStatusStr,
                            "lastPhone": resp.data[i].lastUser,
                            "lastTime": resp.data[i].lastUseStartTime
                        })
                    }
                    // if (_vue.first_load && resp.data[0]) _vue.map.setZoomAndCenter(16, [resp.data[0].fixedLng, resp.data[0].fixedLat]);
                    _vue.first_load = false;
                    // if (this.$route.query.lng && this.$route.query.lat) _vue.map.setZoomAndCenter(16, [this.$route.query.lng, this.$route.query.lat])
                    //重构地图车辆坐标点
                    for (var i in _vue.areaList) {
                        //坐标点图片加载
                        var img_url = (function(status, flag) {
                            var url = "";
                            if (flag == "进行中") url = "_dark";
                            switch (status) {
                                case 1:
                                    return require('../../static/images/map/free_marker' + url + '.png')
                                    break;
                                case 2:
                                    return require('../../static/images/map/issue_marker' + url + '.png')
                                    break;
                                case 3:
                                    return require('../../static/images/map/off_marker' + url + '.png')
                                    break;
                            }
                        })(_vue.areaList[i].status, _vue.areaList[i].taskStatusStr);
                        var pos = _vue.areaList[i].lnglat;
                        var marker = new AMap.Marker({
                            position: pos,
                            content: '<div class="marker-route marker-marker-bus-from" style="background: url(' + img_url + ');background-size:cover;width: 55px;height: 61px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 59px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center;color:#fff;">' + _vue.areaList[i].taskSeq + '</div></div>',
                            offset: {
                                x: -30,
                                y: -55
                            }
                        });
                        marker.taskId = _vue.areaList[i].taskId;
                        marker.bikeId = _vue.areaList[i].bikeId;
                        marker.lockUploadTime = _vue.areaList[i].lockUploadTime;
                        marker.fixedTime = _vue.areaList[i].fixedTime;
                        marker.fixedType = _vue.areaList[i].fixedType;
                        marker.fixedLocStreet = _vue.areaList[i].fixedLocStreet;
                        marker.bikeType = _vue.areaList[i].status;
                        marker.loc = pos;
                        marker.setMap(_vue.map);
                        marker.on('click', function(e) {
                            console.log(this)
                            var _mk = this;
                            _vue.showMission = true;
                            _vue.mission_id = _mk.taskId;
                            _vue.car_id = _mk.bikeId;
                            _vue.mkPos = _mk.loc;
                            _vue.upload_time = _mk.lockUploadTime;
                            _vue.fixed_time = _mk.fixedTime;
                            _vue.fixed_type = _mk.fixedType;
                            _vue.new_pos = _mk.fixedLocStreet;
                            _vue.last_phone = _mk.lastPhone;
                            _vue.last_time = _mk.lastTime;
                            _vue.missionType = _mk.bikeType;
                        });
                        _vue.map_massList.push(marker);
                    }
                }
                _vue.drawMission();
                // })
            },
            drawPolygon: function() {
                var _vue = this;
                //违停区域移除
                _vue.map.remove(_vue.polygonList);
                _vue.polygonList = [];
                var totArea = [];
                //违停区域加载
                // _vue.$ajax.get(ApiControl.getApi(env, "view")).
                // then(res => {
                var data = illegalList;
                for (var indx in data.data) {
                    totArea.push(data.data[indx].region);
                }
                for (var i in totArea) {
                    var AreaItem = eval(totArea[i]);
                    for (var j in AreaItem) {
                        var polygon = new AMap.Polygon({
                            path: AreaItem[j], //设置多边形边界路径
                            strokeColor: "#ff9600", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线宽
                            fillOpacity: 0.5 //填充透明度
                        });
                        polygon.setMap(_vue.map);
                        _vue.polygonList.push(polygon);
                    }
                }

                // });
            },
            locPosition: function() {
                var _vue = this;
                //高德地图定位插件初始化
                this.map.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition: 'RB'
                    });
                    _vue.map.addControl(geolocation);
                    //获取当前用户位置
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', _vue.onComplete); //返回定位信息
                    AMap.event.addListener(geolocation, 'error', _vue.onError); //返回定位出错信息
                });
            },
            onComplete: function(data) {
                var lng = data.position.getLng();
                var lat = data.position.getLat();
                //当前位置
                this.currPos = [lng, lat];
                //_obj.initList(lng,lat);
                //判断是否通过单击详情列表内某一车辆进入
                if (this.$route.query.lng && this.$route.query.lat) this.map.setZoomAndCenter(16, [this.$route.query.lng, this.$route.query.lat]);
                // $(".modal-full").hide();
                this.locFinish = true;
            },
            //解析定位错误信息
            onError: function(data) {
                //document.getElementById('tip').innerHTML = '定位失败';
            },
            toLoc: function() {
                this.$router.push('pending');
            },
            drawMission: function() {
                var _vue = this;
                //移除当前目的地坐标以及位置连线
                _vue.map.remove(_vue.targetList);
                _vue.map.remove(_vue.lineList);
                this.areaBuild = true;
                //加载目的地热点坐标
                // _vue.$ajax.get(ApiControl.getApi(env, "showHot")).then(res => {
                var MarkerList = hotList.data;
                for (var i in MarkerList) {
                    if (MarkerList[i].centerPointLng && MarkerList[i].centerPointLat) {
                        var buble_url = (function(type) {
                            switch (type) {
                                case 1:
                                    return require('../../static/qbike/img/tide/hot.png')
                                    break;
                                case 2:
                                    return require('../../static/qbike/img/tide/loc.png')
                                    break;
                            }
                        })(parseInt(MarkerList[i].hotpointType));
                        var targetMark = new AMap.Marker({
                            position: [MarkerList[i].centerPointLng, MarkerList[i].centerPointLat],
                            content: '<div class="marker-route marker-marker-bus-from" style="background: url(' + buble_url + ');background-size:cover;width: 78px;height: 78px;color:#666;"><div class="area_name" style="padding:0 10px;padding-top:25px;font-size:16px;width: 75px;height:47px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align: center"><span id="' + MarkerList[i].needNumber + '"style="border:0px solid #fff;width:40px;color:#fff;text-align: center">' + MarkerList[i].needNumber + '</span></div><div class="area_num" style="padding-top:2px;width: 100%;text-align: center;color: #ff9600;font-size: 14px"></div></div>',
                            offset: {
                                x: -34,
                                y: -66
                            }
                        });
                        targetMark.display = true;
                        targetMark.requestNum = MarkerList[i].needNumber;
                        targetMark.targetId = MarkerList[i].id;
                        targetMark.setMap(_vue.map);
                        _vue.targetList.push(targetMark);
                    }
                }
                // });
                //加载车辆调度路线
                for (var i in _vue.areaList) {
                    if (_vue.areaList[i].targetlnglat) {
                        var polyline = new AMap.Polyline({
                            path: [_vue.areaList[i].lnglat, _vue.areaList[i].targetlnglat], //设置线覆盖物路径
                            strokeColor: "#ff4133", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 5, //线宽
                            strokeStyle: "solid", //线样式
                            zIndex: -1,
                            strokeDasharray: [10, 5] //补充线样式
                        });
                        _vue.lineList.push(polyline);
                        polyline.setMap(_vue.map);
                    }
                }
            },
            hideMission: function() {
                this.showMission = false;
            },
            saveMission: function() {
                var _vue = this;
                var params = {
                    taskId: this.mission_id,
                    bikeType: this.missionType,
                    status: parseInt(this.chkStatus),
                    remark: this.area_msg

                };
                // _vue.$ajax.get(ApiControl.getApi(env, "saveMission"), {
                //     params: {
                //         taskId: params.taskId,
                //         taskType: params.bikeType,
                //         status: params.status,
                //         remark: params.remark
                //     }
                // }).
                // then(res => {
                    _vue.drawMass();
                    // _vue.drawMission();
                    _vue.showMission = false;
                    this.chkStatus = 1;
                    this.area_msg = '';
                // })
            },
            goPos: function() {
                var drivingOption = {
                    policy: AMap.DrivingPolicy.LEAST_TIME,
                    map: this.map
                };
                //初始化高德导航插件
                var driving = new AMap.Driving(drivingOption);
                driving.searchOnAMAP({
                    origin: this.currPos,
                    destination: [this.mkPos[0], this.mkPos[1]]
                });

            },
            statusCtrl: function() {
                var _vue = this;
                if (this.currentStatus == '不显示已完成任务') {
                    this.currentStatus = '显示已完成任务';
                    _vue.taskStatus = 0;
                    _vue.drawMass();
                } else {
                    this.currentStatus = '不显示已完成任务';
                    _vue.taskStatus = 2;
                    _vue.drawMass();
                }
            },
            //将对象元素转换成字符串以作比较
            obj2key: function(obj, keys) {
                var n = keys.length,
                    key = [];
                while (n--) {
                    key.push(obj[keys[n]]);
                }
                return key.join('|');
            }
        },
        computed: {}
    }
</script>
<style lang="less" scoped>
    .map_panel {
        height: 100%;
        .icon {
            background-image: url(../../static/images/icon_rt.jpg);
            background-repeat: no-repeat;
            background-size: contain;
            display: block;
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 5;
            -webkit-transition-duration: 0.3s;
            -webkit-transition-timing-function: ease;
        }
        .right {
            transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            /* Internet Explorer */
            -moz-transform: rotate(0deg);
            /* Firefox */
            -webkit-transform: rotate(0deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(0deg);
        }
        .down {
            transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            /* Internet Explorer */
            -moz-transform: rotate(90deg);
            /* Firefox */
            -webkit-transform: rotate(90deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(90deg);
        }
    }
    
    html {
        height: 100%;
    }
    
    body {
        height: 100%;
    }
    
    .detail_panel {
        height: 100%;
    }
    
    .detail-title .detail_panel {
        background: #f3f6fc;
        width: 100%;
    }
    
    .bike_detail {
        height: 100%;
    }
    
    .bike_detail .row {
        margin-left: 0px!important;
        margin-right: 0px!important;
        background: #fff;
    }
    
    .bike_detail .content-wrapper {
        border-radius: 10px;
    }
    
    .map-ctrl-goBack {
        top: -15px;
        position: absolute;
        right: 15px;
    }
    
    .right-line {
        left: 45%;
        position: absolute;
        height: 145px;
        border: 1px solid #e1e1e1;
        top: 18px;
    }
    
    td {
        border-top: 0px solid #fff!important;
    }
    
    td.thead {
        color: #adadad;
    }
    
    .mp-period {
        border-radius: 5px;
        font-size: 14px;
        color: rgb(173, 173, 173)!important;
        padding: 0px;
        width: 60px;
        background: #f3f3f3;
        border: 1px solid rgb(173, 173, 173);
    }
    
    .mp-period.active {
        box-shadow: none;
        font-size: 14px;
        color: #fff!important;
        padding: 0px;
        width: 60px;
        background: #ff9600;
        border: 1px solid #ff9600;
    }
    
    .mp-line {
        width: 60px;
        float: left;
        height: 12px;
    }
    
    .line-desc {
        margin-left: 5px;
        line-height: 11px;
        font-size: 12px;
    }
    
    #line-min {
        background-color: #87fb97;
        border: #87fb97;
    }
    
    #line-med {
        background-color: #08e528;
        border: #08e528;
    }
    
    #line-max {
        background-color: #05ac1c;
        border: #05ac1c;
    }
    
    #bike_filter .pull-right {
        margin-right: 10px;
    }
    
    .button_list button {
        margin-top: 10px;
        color: #999;
        margin-right: 5px;
        background: #f3f3f3;
        border: 1px solid #e1e1e1;
        width: 60px;
        border-radius: 5px;
    }
    
    .button_list button.active {
        color: #fff;
        background: #ff9600;
        border: 1px solid #ff9600;
    }
    
    .button_list .front-btn.active {
        color: #ff9600;
        background: #fff;
    }
    
    .form-control {
        padding: 6px 12px;
        padding-left: 20px;
        border: 1px solid #dedede;
    }
    
    .input-group {
        width: 200px;
    }
    
    select.form-control {
        width: 40%!important;
        padding: 0px!important;
    }
    
    .select-panel {
        display: none;
        height: 100%;
        top: 0px;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
    }
    
    .poiList {
        background: #fff;
        padding: 20px;
        position: absolute;
        top: 40%;
        left: 40%;
        width: 230px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
    }
    
    .poiList .list-item {
        max-width: 230px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
    }
    
    .nav-item {
        text-align: center;
        border-right: 1px solid #dedede;
    }
    
    .nav-item:last-child {}
    
    .nav-item span {
        color: #333 !important;
        padding-bottom: 8px;
    }
    
    a.active span {
        color: #ff9600!important;
        border-bottom: 2px solid #ff9600;
    }
    
    .navbar-header {
        padding: 0px;
    }
    
    .full-page.mission_detail {
        padding: 30px;
        background: rgba(34, 34, 34, 0.75)!important;
        position: fixed;
        width: 100%!important;
        height: 100%;
        z-index: 100000;
        top: 0%;
        padding: 28px;
        background: #f3f6fc;
        width: 100%;
    }
    
    .detail-panel {
        position: relative;
    }
    
    .detail-panel div {
        margin-bottom: 10px;
    }
    
    .detail-panel span {
        margin-left: 5px;
    }
    
    .detail-title {
        text-align: center;
        width: 100%;
        font-size: 16px;
        margin: 20px 0px;
        margin-bottom: 20px!important;
    }
    
    .detail-state {
        padding: 0px!important;
    }
    
    .detail-state div {
        padding: 0px!important;
    }
    
    .list_ctrl {
        position: absolute;
        right: 10px;
        top: 50px;
        z-index: 1;
        box-shadow: 1px 2px 1px #888;
    }
    
    .amap-controls {
        display: none;
    }
    
    .ctrl_status button.all-stat {
        background: rgba(255, 150, 0, 0.79)!important;
        bolder-color: rgba(255, 150, 0, 0.79);
    }
    
    #dt_mapDiv {
        height: 100%;
    }
</style>