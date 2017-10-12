/**
 * Created by zhao on 2016/7/11.
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
                getTodayMission: _base_url +'/groundTaskCount.json'

            },
            product: {
            	getTodayMission:'/task/groundTaskCount',
            }
        }
    }
}

var page={
	unfinishedTxt: null,
	finishedTxt: null,
	
    init:function(){
        this.componentInit();
        this.initData()
    },
    
    componentInit:function(){
    	$(".btn-add-mission").on("click", function(){
    		window.location.href = "./addMission.html";
    	})
    	
    	$(".btn-loginout").on("click", function(){
    		window.location.href = "/logout";
    	})
    	
        var _obj = this;
    	_obj.unfinishedTxt = $(".unfinished-count");
    	_obj.finishedTxt = $(".finished-count");
    },
    
    initData:function(){
        var self = this;
        var url = _defautBiz.api("getTodayMission")
        this.sendData(url, {}, "GET", function(data){
        	if(data.returnCode == 0) {
        		self.render(data.data)
        	}
        })
    },
    
    render:function(data){
        this.unfinishedTxt.html(data.notDoneNumber);
        this.finishedTxt.html(data.doneNumber)
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
