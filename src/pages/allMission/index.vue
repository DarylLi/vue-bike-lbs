<template>
	<div class="wrapper full-page bike_detail" id="bike_detail">
    <div id="map_cmpt" style="display: none"></div>
    <div class="detail_panel">
        <div class="row" style="background: #fff">
            <div class="row" id="bike_filter" style="border-bottom: 1px solid #dedede;margin:10px 0;padding-bottom: 8px;margin:10px 0">
                <div class="navbar-header col-md-12">
                    <a href="javascript:void(0)" @click="changeTag(0)" :class="{'active':hist==0}" type="0">
                        <div class="col-md-6 col-sm-6 col-xs-6 nav-item">
                            <span>今日</span>
                        </div>
                    </a>
                    <a href="javascript:void(0)" @click="changeTag(1)" :class="{'active':hist==1}" type="1">
                        <div class="col-md-6 col-sm-6 col-xs-6 nav-item" style="border-right: 0px;">
                            <span>历史</span>
                        </div>
                    </a>
                    <!--<div class="input-group">-->
                    <!--<span style="font-size:14px;margin:0 18px;padding-top:8px;float: left">智能锁名称</span>-->
                    <!--<input type="text" name="q" id="lock_name" style="float: left;display: inline-block" class="form-control" placeholder="Search...">-->
                    <!--</div>-->
                </div>
            </div>
            <div class="row" id="mission_list" v-if="!hideFlag" style="margin:10px 0">
                定位中...
            </div>
            <mission-list ref="missionList" :hist="hist" @loadsuccess="hidePos"></mission-list>
        </div>
    </div>
    </div>
</template>
<script>
    import ajax from '../../config/ajax'
    import ApiControl from '../../config/envConfig.home'
    import utils from '../../config/utils'
    import missionList from '../../components/missionList/missionList'
    var env = 'product'
    export default {
        data() {
                return {
                    itemList: [],
                    hideFlag: false,
                    hist: 0
                }
            },
            components: {
                missionList
            },
            created() {
                var _vue = this;
                document.title = "待完成任务";
            },
            mounted() {},
            methods: {
                hidePos: function() {
                    this.hideFlag = true;
                },
                changeTag: function(num) {
                    this.hist = num;
                }
            },
            computed: {}
    }
</script>
<style lang="less" scoped>
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
        display: none;
        padding: 30px;
        background: rgba(34, 34, 34, 0.75)!important;
        opacity: 0;
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
</style>