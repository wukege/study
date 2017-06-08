import Vue from 'vue';
import $ from 'webpack-zepto';
import filters from './filters';
import router from './routers';
import store from './vuex/user';
import FastClick from 'fastclick';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);

$.ajaxSettings.crossDomain = true;

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

FastClick.attach(document.body);

// 处理刷新的时候vuex被清空但是用户已经登录的情况
if (window.sessionStorage.user) {
    store.dispatch('setUserInfo', JSON.parse(window.sessionStorage.user));
}

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.userInfo.session_id) {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
});

new Vue({
    router,
    store
}).$mount('#app');
