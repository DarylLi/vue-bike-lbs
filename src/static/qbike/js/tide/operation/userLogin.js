/**
 * Created by wangxuechen on 2017/7/10.
 */
(function(){
    $('#codeImg').on('click',function(){
        $("#codeImg").attr("src", "/code.do?t=" + genTimestamp());
    })

    $('.login-button').on('click',function(){
        severCheck();
    })
    function genTimestamp() {
        var time = new Date();
        return time.getTime();
    }

    //服务器校验
    function severCheck(){
        if(check()){

            var loginName = $("#loginName").val();
            var password = $("#password").val();
            var code = "qq313596790fh"+loginName+",fh,"+password+"QQ978336446fh"+",fh,"+$("#code").val();
            $.ajax({
                type: "POST",
                url: '/login_login.do?',
                data: {KEYDATA:code,tm:new Date().getTime()},
                dataType:'json',
                cache: false,
                success: function(data){
                    $(".jq_tips_info").hide();
                    if("success" == data.result){
                        window.location.href="/tide/operation/task.html";
                    }else if("usererror" == data.result){
                        $("#loginName").tips({
                            side : 1,
                            msg : "用户名或密码有误",
                            bg : '#FF5080',
                            time : 15
                        });
                        $("#loginName").focus();
                    }else if("codeerror" == data.result){
                        $("#code").tips({
                            side : 1,
                            msg : "验证码输入有误",
                            bg : '#FF5080',
                            time : 15
                        });
                        $("#code").focus();
                    }else{
                        $("#loginName").tips({
                            side : 1,
                            msg : "用户名或密码有误",
                            bg : '#FF5080',
                            time : 15
                        });
                        $("#loginName").focus();
                    }
                }
            });
        }
    }

    //客户端校验
    function check() {

        if ($("#loginName").val() == "") {

            $("#loginName").tips({
                side : 2,
                msg : '用户名不得为空',
                bg : '#AE81FF',
                time : 3
            });

            $("#loginName").focus();
            return false;
        } else {
            $("#loginName").val(jQuery.trim($('#loginName').val()));
        }

        if ($("#password").val() == "") {

            $("#password").tips({
                side : 2,
                msg : '密码不得为空',
                bg : '#AE81FF',
                time : 3
            });

            $("#password").focus();
            return false;
        }
        if ($("#code").val() == "") {

            $("#code").tips({
                side : 1,
                msg : '验证码不得为空',
                bg : '#AE81FF',
                time : 3
            });

            $("#code").focus();
            return false;
        }

        $("#loginbox").tips({
            side : 1,
            msg : '正在登录 , 请稍后 ...',
            bg : '#68B500',
            time : 10
        });

        return true;
    }
})();