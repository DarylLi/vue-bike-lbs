<template>
<div class="wrapper full-page bike_detail" id="add-mission-container">
		<div class="bikeNo-div">
			<div class="bick-icon"></div>
			<input class="bike-id" v-model="bikeId" type="text" placeholder="请输入车辆编号" />
		</div>
		
		<div class="radio-div">
			<span class="radio-title">任务类型：</span>
			<div class="radio-list mission-type">
                <div class="radio-item" v-for="(type,i) in typeList">
                    <input type="radio" class="regular-radio" v-model="taskType" :id="'mission-type'+i" name="mission-type" :value="type.value"/>
                    <label :for="'mission-type'+i"></label>
                    <label class="txt" :for="type.id">{{type.name}}</label>
                </div>
            </div>
		</div>
		
		<div class="radio-div">
			<span class="radio-title">任务状态：</span>
			<div class="radio-list mission-status">
                <div class="radio-item" v-for="(status,i) in statusList">
                    <input type="radio" class="regular-radio" v-model="taskStatus" :id="'mission-status'+i" name="mission-status" :value="status.value" />
                    <label :for="'mission-status'+i"></label>
                    <label class="txt" :for="status.id">{{status.name}}</label>
                </div>
            </div>
		</div>
		
		<div class="textarea-div">
			<textarea class="remark" v-model="remark" placeholder="请输入备注信息"></textarea>
		</div>
		
		<div class="btn-div">
			<button class="btnSave" @click="saveAdd">保存</button>
		</div>
		<error-message v-bind="{pastle: pastle,message: message}"></error-message>
    </div>
</template>
<script>
    import ajax from '../../config/ajax'
    import ApiControl from '../../config/envConfig.home'
    import utils from '../../config/utils'
    import statusTask from './api/taskStatus'
    import typeTask from './api/taskType'
    var env = 'product'
    export default {
        data() {
                return {
                    itemList: [],
                    hideFlag: false,
                    hist: 0,
                    typeList: [],
                    statusList: [],
                    bikeId: '',
                    taskType: 1,
                    taskStatus: 1,
                    remark: '',
                    pastle: false,
                    message: ''
                }
            },
            components: {},
            created() {
                var _vue = this;
                document.title = "添加任务";
                // _vue.$ajax.get(ApiControl.getApi(env, "taskType"), {}).
                // then(res => {
                this.typeList = typeTask.data;
                // });
                // _vue.$ajax.get(ApiControl.getApi(env, "taskStatus"), {}).
                // then(res => {
                this.statusList = statusTask.data;
                // });
            },
            mounted() {},
            methods: {
                //保存任务
                saveAdd: function() {
                    if (this.bikeId === "") {
                        this.setErrorMessage("车辆编号不能为空!");
                        return
                    }
                    let opt = {
                        bikeId: this.bikeId,
                        taskType: this.taskType,
                        status: this.taskStatus,
                        remark: this.remark
                    }
                    // this.$ajax.get(ApiControl.getApi(env, "saveTask"), {
                    //     params: opt
                    // }).
                    // then(res => {
                        // if (res.data.returnCode === 0) {
                            window.history.back()
                        // } else {
                        //     this.setErrorMessage(res.data.message);
                        // }
                    // });
                },
                //提示信息
                setErrorMessage: function(message) {
                    var _vue = this;
                    this.pastle = true;
                    this.message = message;
                    setTimeout(function() {
                        _vue.pastle = false;
                        _vue.message = '';
                    }, 2000)
                },
            },
            computed: {}
    }
</script>
<style lang="less" scoped>
    #add-mission-container {
        width: 100%;
        height: 100%;
        background: #fff;
        padding: 28px 20px 0 20px;
    }
    
    .bikeNo-div {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
    }
    
    .bikeNo-div .bick-icon {
        width: 40px;
        height: 100%;
        background: url(../../static/qbike/img/tide/bikeIcon.png) no-repeat center;
        background-size: 23px 15px;
    }
    
    .bikeNo-div input {
        width: calc(~"100% - 40px");
        border: 0;
        font-size: 15px;
        color: #35353f;
        padding: 0 5px;
    }
    
    .bikeNo-div input::-webkit-input-placeholder {
        color: #c2c2d0;
    }
    
    .bikeNo-div input:focus {
        outline: 0;
    }
    
    .radio-div {
        width: 100%;
        display: flex;
        align-items: flex-start;
        margin-top: 24px;
    }
    
    .radio-div .radio-title {
        font-size: 16px;
        color: #35353f;
        width: 90px;
    }
    
    .radio-div .radio-list {
        width: calc(~"100% - 90px");
    }
    
    .radio-list.mission-type {
        display: flex;
    }
    
    .radio-list.mission-type .radio-item {
        width: 33%;
    }
    
    .radio-list.mission-status .radio-item {
        width: 50%;
        float: left;
        margin-bottom: 20px;
    }
    
    .radio-div .radio-item {
        display: flex;
        align-items: center;
    }
    
    .radio-div .radio-item .txt {
        font-size: 16px;
        color: #90909b !important;
        font-weight: normal;
        padding-left: 5px;
        margin: 0;
    }
    
    .textarea-div {
        width: 100%;
        margin-top: 20px;
    }
    
    .textarea-div > textarea {
        width: 100%;
        height: 150px;
        border: 1px solid #dedede;
        border-radius: 5px;
        outline: 0;
        resize: none;
        background: #f5f3f3;
        padding: 10px;
        font-size: 16px;
        color: #35353f;
    }
    
    .textarea-div > textarea::-webkit-input-placeholder {
        color: #c2c2d0;
    }
    
    .btn-div {
        margin-top: 24px;
        width: 100%;
        height: 45px;
        text-align: center;
    }
    
    .btn-div > button {
        border-radius: 45px;
        height: 100%;
        width: 290px;
        margin: 0 auto;
        background: #ff9600;
        color: #fff;
        font-size: 17px;
        border: 0;
        outline: 0;
    }
    
    .btn-div > button:active {
        opacity: 0.5;
    }
    /* RADIO */
    
    .regular-radio {
        display: none;
    }
    
    .regular-radio + label {
        -webkit-appearance: none;
        background-color: #ffffff;
        border: 1px solid #cacece;
        border-radius: 20px;
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        margin: 0;
    }
    
    .regular-radio:checked + label:after {
        content: ' ';
        width: 10px;
        height: 10px;
        border-radius: 10px;
        position: absolute;
        background: #75d249;
        top: 4px;
        left: 4px;
    }
</style>