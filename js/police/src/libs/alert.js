import Vue from 'vue';
import $ from 'webpack-zepto';

/**
 * 全局注册弱提示
 */
export default {
    install() {
        let timer = null;
        Vue.prototype.$alert = (msg) => {
            $('#alertWeek').remove();
            let $alert = $('<div class="week-alert" id="alertWeek"><div class="alert-box"><div class="alert-title">提示</div><div class="alert-con"></div></div></div>');

            $('body').append($alert);
            $alert.find('.alert-con').html(msg);
            $alert.addClass('alert-show');
            clearTimeout(timer);
            timer = setTimeout(() => {
                $alert.remove();
            }, 2000);
        };
    }
};
