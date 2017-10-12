/**
 * Created by Administrator on 2017/7/4.
 */
/**
 * Created by Administrator on 2017/7/4.
 */
$('.select-content > #today').on('click', function () {
    $(this).parents('.select-content').addClass('active').siblings('div').removeClass('active');
    $('#today_list').show();
    $('#history_list').hide();
});

$('.select-content > #history').on('click', function () {
    $(this).parent('.select-content').addClass('active').siblings('div').removeClass('active');
    $('#history_list').show();
    $('#today_list').hide();
});
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
                    ShowNumber:_base_url +'/showNumber.json',
                    TaskTypeList:_base_url + 'taskTypeList.json'
                },
                product: {
                    ShowNumber:"/task/groundTaskList",
                    TaskTypeList:"/task/taskTypeList"
                }
            }
        }
    };
//数据展示
var NumMain = {
    init: function () {
        //获取任务类型的值
        var type;
        $.ajax({
            url:_defautBiz.api('TaskTypeList'),
            dataType:"json",
            method:'get',
            success: function (data) {
                if (data.success){
                    for(var i in data.data){
                        if(data.data[i].name == '闲置'){
                            getBikeType(1);
                        }if(data.data[i].name == '故障'){
                            getBikeType(2);
                        }if(data.data[i].name == '离线'){
                            getBikeType(3);
                        }
                    }
                }
            }
        });
        function getBikeType(type){
            $.ajax({
                url :_defautBiz.api("ShowNumber")+"?status=0&type=" + type,
                dataType:"json",
                method:'get',
                success: function (data) {
                    if(data.success){
                        for(var i in  data.data){
                            $('.row > ul >li').find('.id').text(data.data[i].id);
                            $('.row > ul >li ').find('.bikeId').text(data.data[i].bikeId);
                            $('.row > ul >li').find('.lockUploadTime').text(data.data[i].lockUploadTime);

                        }
                    }
                }
            })
        }

    }


};
NumMain.init();
