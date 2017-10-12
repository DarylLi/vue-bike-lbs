<template>
<div class="wrapper full-page bike_detail" id="todayMission-container">
       <router-link style="color:#fff!important;" to='pending'>
        <div class="unfinished-div">
            <div class="unfinished-txt">未完成: <span class="unfinished-count">{{notDoneNumber}}</span></div>
   		</div>
       </router-link>
        <router-link style="color:#fff!important;" to='all'>
   		<div class="finished-div">
            <div class="finished-txt">已完成: <span class="finished-count">{{doneNumber}}</span></div>
   		</div>
        </router-link>
   		<div class="button-div">
   			<div class="button-item">
            <router-link style="color:#fff!important;" to='add'>
   				<div class="btn-add-mission"></div>
            </router-link>
   				<span class="txt-add-mission">添加任务</span>
   			</div>
			<div class="button-item">
                <!--<a href="/logout">-->
                <a href="/">
   				<div class="btn-loginout"></div>
                </a>
   				<span class="txt-add-mission">注销</span>
   			</div>
   		</div>
    </div>
</template>
<script>
    import ajax from '../../config/ajax'
    import ApiControl from '../../config/envConfig.home'
    import utils from '../../config/utils'
    import constData from './api/getTodayMission'
    var env = 'product'
    export default {
        data() {
                return {
                    notDoneNumber: 0,
                    doneNumber: 0
                }
            },
            components: {},
            created() {
                var _vue = this;
                document.title = "今日任务";
                // _vue.$ajax.get(ApiControl.getApi(env, "getTodayMission"), {}).
                // then(res => {
                console.log(constData.data.doneNumber)
                _vue.notDoneNumber = constData.data.notDoneNumber;
                _vue.doneNumber = constData.data.doneNumber;
                // });
            },
            mounted() {},
            methods: {},
            computed: {}
    }
</script>
<style lang="less" scoped>
    body,
    div,
    span,
    header,
    footer,
    nav,
    section,
    aside,
    article,
    ul,
    dl,
    dt,
    dd,
    li,
    a,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    i,
    b,
    textarea,
    button,
    input,
    select,
    figure,
    figcaption {
        color: #fff
    }
    
    #todayMission-container {
        width: 100%;
        height: 100%;
        background: #fff;
    }
    
    div.unfinished-div {
        width: 190px;
        height: 190px;
        background: url(../../static/qbike/img/tide/missionunfinished_bg.png) no-repeat center;
        background-size: 190px;
        margin: 0 auto;
        margin-top: 44px;
        font-size: 18px;
        color: #fff!important;
        text-align: center;
        padding-top: 124px;
    }
    
    div.finished-div {
        width: 190px;
        height: 190px;
        background: url(../../static/qbike/img/tide/missionfinished_bg.png) no-repeat center;
        background-size: 190px;
        margin: 0 auto;
        margin-top: 20px;
        font-size: 18px;
        color: #fff!important;
        text-align: center;
        padding-top: 124px;
    }
    
    .button-div {
        padding: 0 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
    }
    
    .button-div .button-item {
        display: inline-block;
        text-align: center;
    }
    
    .btn-add-mission {
        width: 60px;
        height: 60px;
        background: url(../../static/qbike/img/tide/addIcon.png) no-repeat center;
        background-size: 60px;
        margin-bottom: 12px;
    }
    
    .btn-add-mission:active {
        opacity: 0.5;
    }
    
    .txt-add-mission {
        font-size: 14px;
        color: #ff9600;
    }
    
    .btn-loginout {
        width: 60px;
        height: 60px;
        background: url(../../static/qbike/img/tide/loginOut.png) no-repeat center;
        background-size: 60px;
        margin-bottom: 12px;
    }
    
    .btn-loginout:active {
        opacity: 0.5;
    }
    
    .txt-loginout {
        font-size: 14px;
        color: #fd472b;
    }
</style>