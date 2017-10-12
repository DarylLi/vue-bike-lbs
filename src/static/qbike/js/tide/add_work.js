/**
 * Created by Administrator on 2017/7/7.
 */
var $mPart = $('.main-part');

var $Icon = $mPart.find('span').find('.icon');

    $Icon.on('click', function () {
        if ($Icon.hasClass('icon_radio')){
            $(this).addClass('icon_radio_active');
            $(this).parent('span')
                    .siblings('span')
                    .find('i')
                    .removeClass('icon_radio_active')
                    .addClass('icon_radio');

        }
    });
