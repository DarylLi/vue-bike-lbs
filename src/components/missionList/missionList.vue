<template>
    <div id="mission_list" v-load-more="loaderMore" type="1">
        <!--待处理任务列表模板-->
        <transition-group name="router-fade" mode="out-in" v-if="hist==undefined">
             <router-link v-for="item in currItems" :to='"map?lng="+item.fixedLng+"&lat="+item.fixedLat' :loc="item.fixedLng+','+item.fixedLat" :key="item.id">
             <ul>
                 <li>任务编号: {{item.id}}</li>
                 <li>车辆编号: {{item.bikeId}}</li>
                 <div class="dis">{{item.distanceStr}}</div>
                 </ul>
             </router-link>
         </transition-group>             
         <!--完成任务列表模板-->
         <transition-group name="router-fade" mode="out-in" v-if="hist!=undefined">
             <a v-for="item in currItems" @click="showDetail(item.id)" :loc="item.fixedLng+','+item.fixedLat" :key="item.id">
             <ul>
                 <li>任务编号: {{item.id}}</li>
                 <li>车辆编号: {{item.bikeId}}</li>
                 <div class="dis">{{item.distanceStr}}</div>
                 </ul>
             </a>
         </transition-group>  
         <!--今日完成列表详情编辑页-->
        <transition name="router-fade" mode="out-in" v-if="hist==0">
        <div class="wrapper full-page mission_detail" id="mission_panel" v-if="showMission">
        <div class="detail_panel" style="width: 100%;border-radius: 0px;background: #fff;margin-top:15%;height: auto">
            <!-- gaod map-->
            <div class="row" style="background: #fff">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="row" style="padding: 10px 20px;line-height:15px;margin-left:-5px;border-radius:0px">
                            <div class="detail-panel">
                                <div class="detail-title">任务详情</div>
                                <div>任务编号:<span id="mission_id">{{currItem.id}}</span></div>
                                <div>车辆编号:<span id="car_id">{{currItem.bikeId}}</span></div>
                                <div>锁上报时间:<span id="upload_time">{{currItem.lockUploadTime}}</span></div>
                                <div>定位修正时间:<span id="fixed_time">{{currItem.fixedTime}}</span></div>
                                <div>定位修正方式:<span id="fixed_type">{{currItem.fixedType}}</span></div>
                                <div>最新未位置:<span id="new_pos">{{currItem.fixedLocStreet}}</span></div>
                                <div>最后骑行用户(手机):<span id="last_phone">{{currItem.lastUser}}</span></div>
                                <div>最后骑行时间:<span id="last_time">{{currItem.lastUseStartTime}}</span></div>
                                <div class="col-md-12 col-sm-12 col-xs-12 detail-state">
                                    <div class="col-md-2 col-sm-2 col-xs-2">状态:</div>
                                    <div class="col-md-10 col-sm-10 col-xs-10">
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chooseStatus" type="radio" value="1" />已完成</div>
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chooseStatus" type="radio" value="2" />进行中</div>
                                    </div>
                                    <div class="col-md-2 col-sm-2 col-xs-2"></div>
                                    <div class="col-md-10 col-sm-10 col-xs-10">
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chooseStatus" type="radio" value="3"/>未找到</div>
                                    <div class="col-md-6 col-sm-6 col-xs-6"><input name="state" v-model="chooseStatus" type="radio" value="4" />其他</div>
                                    </div>
                                </div>
                                <div>
                                    <textarea id="area_msg" placeholder="请输入备注信息" v-model="area_msg" style="width:100%;border: 1px solid #dedede;height: 120px;" rows="5" cols="25"></textarea>
                                </div>
                                <div style="float:left;width: 100%;text-align: center">
                                    <button type="button" class="btn btn-outline" data-dismiss="modal" id="save_Tarea" @click="saveMission" style="border-radius:20px;width:45%;color:#ff9600;border:1px solid #ff9600;background: #fff">保存</button></div>
                                <a class="map-ctrl-goBack" @click='hideMission' id="add_goBack"><img src="../../static/qbike/img/modal_close.png" alt=""></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </transition>
    <!--历史完成列表详情页-->
      <transition name="router-fade" mode="out-in" v-if="hist==1">
        <div class="wrapper full-page mission_detail" id="mission_panel" v-if="showMission">
        <div class="detail_panel" style="width: 100%;border-radius: 0px;background: #fff;margin-top:15%;height: auto">
            <!-- gaod map-->
            <div class="row" style="background: #fff">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="row" style="padding: 10px 20px;line-height:15px;margin-left:-5px;border-radius:0px">
                            <div class="detail-panel">
                                <div class="detail-title">任务详情</div>
                                <div>任务编号:<span id="mission_id">{{currItem.id}}</span></div>
                                <div>车辆编号:<span id="car_id">{{currItem.bikeId}}</span></div>
                                <div>锁上报时间:<span id="upload_time">{{currItem.lockUploadTime}}</span></div>
                                <div>定位修正时间:<span id="fixed_time">{{currItem.fixedTime}}</span></div>
                                <div>定位修正方式:<span id="fixed_type">{{currItem.fixedType}}</span></div>
                                <div>状态:<span id="fixed_type">{{currItem.taskStatusStr}}</span></div>
                                <div>最后骑行用户(手机):<span id="last_phone">{{currItem.lastUser}}</span></div>
                                <div>最后骑行时间:<span id="last_time">{{currItem.lastUseStartTime}}</span></div>
                                <div>备注:<span id="remark">{{currItem.lastUseStartTime}}</span></div>
                                <div style="float:left;width: 100%;text-align: center">
                                <a class="map-ctrl-goBack" @click='hideMission' id="add_goBack"><img src="../../static/qbike/img/modal_close.png" alt=""></a>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
    </transition>
    <p v-if="loading" class="empty_data">—— 加载中 ——</p>  
    <p v-if="touchend" class="empty_data">—— 数据已全部加载 ——</p>  
    </div>
</template>

<script>
    // import dialogList from '../../components/dialogContainer'
    var env = 'product'; // set env type for debug or product
    import ajax from '../../config/ajax'
    import utils from '../../config/utils'
    import ApiControl from '../../config/envConfig.home'
    import groundList from './api/groundTaskList'
    import {
        loadMore,
        getImgPath
    } from '../mixin'
    export default {
        name: 'goodsList',
        props: ['hist'],
        data() {
            return {
                allItems: [],
                keyword: '',
                category: '',
                categoryName: '',
                sortfield: '',
                ad: '',
                page: 1,
                loading: false,
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载,
                touchend: false, //没有更多数据
                currItems: [],
                taskStatus: 0,
                showMission: false,
                currItem: {},
                chooseStatus: 1,
                area_msg: ''
            }
        },
        mixins: [loadMore, getImgPath],
        methods: {
            //到达底部加载更多数据
            async loaderMore() {
                //防止重复请求
                if (this.touchend || this.preventRepeatReuqest) {
                    return
                }
                this.loading = true;
                // this.refreshItems();
                this.renderList(this.page)
            },
            renderList: function(num) {
                var _vue = this;
                _vue.page += 1;
                for (var i = 15 * (num - 1); i < 15 * num; i++) {
                    // _vue.currItems.push(_vue.allItems(i));
                    // _vue.allItems(i)
                    if (i < _vue.allItems.length) {
                        _vue.currItems.push(_vue.allItems[i]);
                        setTimeout(function() {
                            _vue.loading = false;
                            _vue.preventRepeatReuqest = false;
                        }, 500);
                    } else {
                        setTimeout(function() {
                            _vue.touchend = true;
                        }, 500);
                        return;
                    }
                }
            },
            createdList: function() {
                let _vue = this;
                _vue.currItems = [];
                _vue.page = 1;
                _vue.loading = false;
                _vue.preventRepeatReuqest = false;
                _vue.touchend = false;
                let params = this.hist == undefined ? {
                    status: _vue.taskStatus,
                } : {
                    status: 1,
                    history: this.hist
                };
                // _vue.$ajax.get(ApiControl.getApi(env, "groundTaskList"), {
                //     params: params
                // }).
                // then(res => {
                _vue.allItems = groundList.data;
                _vue.renderList(_vue.page);
                _vue.$emit("loadsuccess", true);
                // })
            },
            showDetail: function(id) {
                this.currItem = this.allItems.filter(function(e) {
                    return e.id == id
                })[0]
                this.showMission = true;
            },
            hideMission: function() {
                this.showMission = false;
            },
            saveMission: function() {
                var _vue = this;
                var params = {
                    taskId: this.currItem.id,
                    bikeType: this.currItem.bikeType,
                    status: parseInt(this.chooseStatus),
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
                    _vue.chooseStatus = 1;
                    _vue.area_msg = '';
                    _vue.showMission = false;
                // })
            },
        },
        created() {
            this.createdList();
        },
        watch: {
            //查看全部任务切换tag
            hist: function() {
                this.createdList();
            }
        },
        mounted() {}
    }
</script>

<style lang="less" scoped>
    @highlightColor: #fd472b;
    html {
        height: 100%;
    }
    
    body {
        height: 100%;
    }
    
    .detail-title .detail_panel {
        background: #f3f6fc;
        width: 100%;
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
        top: -20px;
        position: absolute;
        right: -20px;
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
        border-right: 1px solid #333;
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
    
    #mission_list {
        margin: 10px 0;
    }
    
    #mission_list a {
        color: #000!important;
    }
    
    #mission_list ul {
        border-bottom: 1px solid #dedede;
        padding: 10px;
        position: relative;
    }
    
    #mission_list .dis {
        position: absolute;
        top: 18px;
        right: 10px;
        font-size: 16px;
        color: #ff9600!important
    }
    
    #mission_list .info {
        color: #dedede;
        text-align: center;
    }
    
    ul {
        margin-bottom: 10px;
    }
    
    .empty_data {
        color: #dedede;
        text-align: center;
    }
</style>