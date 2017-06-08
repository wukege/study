<template>
    <div class="login-page">
        <div class="head">
            <img src="../assets/images/logo.png" class="logopic"/>
            <div class="adddesc">静态人像比对系统</div>
        </div>
        <section class="page-body">
            <form @submit.prevent="login">
                <div class="label">
                    <input class="txt" type="text" placeholder="用户名" v-model="name" maxlength="36">
                </div>
                <div class="label">
                    <input class="txt" type="password" placeholder="密码" v-model="password" maxlength="36">
                </div>
                <div class="label">
                    <button class="abtn">登录</button>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
    require('../assets/styl/common.styl');
    require('../assets/styl/login.styl');
    import $ from 'webpack-zepto';
    import utils from '../libs/utils.js';

    export default {
        data() {
            return {
                name: '',
                password: '',
                server: utils.getServer()
            };
        },
        created() {
            var self = this;
            var username = self.$route.query.username;
            if((typeof username !== 'undefined') && (username !== '')) {
                // 引擎A登陆
                utils.ajaxPayload($, {
                    type: 'POST',
                    url: self.server.query.api + '/face/v1/framework/user/login',
                    // url: this.server.query.api + '/resource_manager/user/login',
                    data: {
                        name: 'admin',
                        password: utils.md5('admin')
                    },
                    success: (res) => {
                        if(res.rtn === 0) {
                            // 引擎B登陆
                            utils.ajaxPayload($, {
                                type: 'POST',
                                url: self.server.doubleQuery.api + '/resource_manager/user/login',
                                data: {
                                    name: 'admin',
                                    password: utils.md5('admin')
                                },
                                success: (doubleRres) => {
                                    if(doubleRres.rtn === 0) {
                                        let user = {
                                            name: username,
                                            session_id: res.face_platform_session_id,
                                            session_id_double: doubleRres.session_id
                                        };
                                        window.window.sessionStorage.user = JSON.stringify(user);
                                        self.$store.dispatch('setUserInfo', user);
                                        let redirect = decodeURIComponent(self.$route.query.redirect || '/home');
                                        self.$router.push({
                                            path: redirect
                                        });
                                    } else {
                                        self.$alert('用户名与密码不匹配', '消息', {
                                            confirmButtonText: '确定'
                                        });
                                    }
                                },
                                error: (res) => {
                                    var error = JSON.parse(res.responseText);
                                    self.$alert(error.error_msg);
                                }
                            });
                        } else {
                            self.$alert('用户名与密码不匹配', '消息', {
                                confirmButtonText: '确定'
                            });
                        }
                    },
                    error: (res) => {
                        self.$notify.error({
                            title: '错误',
                            message: '服务器请求异常'
                        });
                    }
                });
            }
        },
        methods: {
            login(event) {
                var self = this;
                event.preventDefault();
                if (self.name === '') {
                    self.$alert('请输入用户名', '消息', {
                        confirmButtonText: '确定'
                    });
                    return false;
                } else if (self.password === '') {
                    self.$alert('请输入密码', '消息', {
                        confirmButtonText: '确定'
                    });
                    return false;
                }

                // 引擎A登陆
                utils.ajaxPayload($, {
                    type: 'POST',
                    url: self.server.query.api + '/face/v1/framework/user/login',
                    // url: this.server.query.api + '/resource_manager/user/login',
                    data: {
                        name: self.name,
                        password: utils.md5(self.password)
                    },
                    success: (res) => {
                        if(res.rtn === 0) {
                            // 引擎B登陆
                            utils.ajaxPayload($, {
                                type: 'POST',
                                url: self.server.doubleQuery.api + '/resource_manager/user/login',
                                data: {
                                    name: self.name,
                                    password: utils.md5(self.password)
                                },
                                success: (doubleRres) => {
                                    if(doubleRres.rtn === 0) {
                                        let user = {
                                            name: self.name,
                                            session_id: res.face_platform_session_id,
                                            session_id_double: doubleRres.session_id
                                        };
                                        window.window.sessionStorage.user = JSON.stringify(user);
                                        self.$store.dispatch('setUserInfo', user);
                                        let redirect = decodeURIComponent(self.$route.query.redirect || '/home');
                                        self.$router.push({
                                            path: redirect
                                        });
                                    } else {
                                        self.$alert('用户名与密码不匹配', '消息', {
                                            confirmButtonText: '确定'
                                        });
                                    }
                                },
                                error: (res) => {
                                    var error = JSON.parse(res.responseText);
                                    self.$alert(error.error_msg);
                                }
                            });
                        } else {
                            self.$alert('用户名与密码不匹配', '消息', {
                                confirmButtonText: '确定'
                            });
                        }
                    },
                    error: (res) => {
                        self.$notify.error({
                            title: '错误',
                            message: '服务器请求异常'
                        });
                    }
                });
            }
        }
    };
</script>
