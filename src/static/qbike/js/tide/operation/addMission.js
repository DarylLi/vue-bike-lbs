/**
 * Created by zhao on 2016/7/12.
 */
var _defautBiz = _defautBiz || {
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
                saveTask: _base_url +'/h5SaveTask.json',
                taskType: _base_url +'/taskTypeList.json',
                taskStatus: _base_url + '/taskStatusList.json'

            },
            product: {
            	saveTask: '/task/h5SaveTask',
            	taskType: '/task/taskTypeList',
            	taskStatus: '/task/taskStatusList'
            }
        }
    }
}

var page = {
	
	modalContainer: $(".modal-container"),
	
    init:function(){
        this.componentInit();
        this.initData()
    },
    
    componentInit:function(){
    	var self = this;
    	$(".btnSave").on("click", function(){
    		self.onSaveHandler()
    	})
    	
    	self.modalContainer.hide()
    },
    
    initData: function(){
    	var self = this;
    	self.sendData(_defautBiz.api("taskType"), {}, "GET", function(result){
    		if(result.returnCode === 0){
    			self.initRadioList(result.data, "mission-type")
    		}
    	})
    	
    	this.sendData(_defautBiz.api("taskStatus"), {}, "GET", function(result){
    		if(result.returnCode === 0){
    			self.initRadioList(result.data, "mission-status")
    		}
    	})
    },
    
    initRadioList: function(list, type){
    	var html = "", i = 0, len = list.length;
    	for(i = 0; i < len; i++){
    		var id = type + i, obj = list[i];
    		var checked = i === 0 ? "checked" : "";
    		html += '<div class="radio-item"><input type="radio" class="regular-radio" id="'+ id + '" name="' + type + '" value="'+obj.value+'" '+checked+' /><label for="'+id+'"></label><label class="txt" for="'+id+'">'+obj.name+'</label></div>'
    	}
    	
    	$("."+type).html(html)
    },
    
    onSaveHandler: function(){
    	var self = this;
    	var bikeId = $(".bike-id").val();
    	var taskType = $("input[name='mission-type']:checked").val();
    	var taskStatus = $("input[name='mission-status']:checked").val();
    	var remark = $(".remark").val();
    	
    	if(bikeId === ""){
    		this.showModal("车辆编号不能为空!");
    		return
    	}
    	
    	var opt = {
    		bikeId: bikeId,
    		taskType: taskType,
    		status: taskStatus,
    		remark: remark
    	}
    	var url = _defautBiz.api("saveTask")
    	this.sendData(url, opt, "GET", function(result){
    		if(result.returnCode === 0){
    			self.showModal("成功添加任务", function(){
    				window.history.back()
    			})
    		}else{
    			self.showModal(result.message)
    		}
    	})
    },
    
    showModal: function(msg, cb_ok){
    	var self = this;
    	self.modalContainer.find(".mask_bg").html(msg)
    	self.modalContainer.css({opacity: 1});
    	self.modalContainer.show()
    	setTimeout(function(){
    		self.modalContainer.css({opacity: 0});
    		setTimeout(function(){
    			self.modalContainer.hide()
    			cb_ok&&cb_ok()
    		}, 500)
    	}, 1000)
    },
    
    sendData: function(url, data, method, cb_ok){
    	$.ajax({
            url: url,
            dataType: "json",
            data: data,
            method: method || "GET",
            success: cb_ok
    	})
    },
};

page.init();
