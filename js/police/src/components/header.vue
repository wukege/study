<template>
    <header>
        <div class="header">
            <div class="innerhead">
                <img src="../assets/images/logo.png"/>
                <span class="loginuser">
                    <span class="fontcolor">欢迎，{{userInfo.name}}</span>
                    <span @click="loginOut"  class="cupointer">登出</span>
                </span>
                <div class="centerdiv">
                    <span class="fontbig">苏州市公安局静态人像比对系统</span>
                </div>
                <div class="desc">
                    <span class="imgright">
                        <router-link class="astyle" :to="{name:'searchhistory'}">
                            检索历史
                        </router-link>

                    </span>
                    <span class="imgright">
                        <router-link class="astyle" :to="{name:'home'}">
                            人像检索
                        </router-link>
                    </span>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import utils from '../libs/utils.js';

    export default {
        props: ['userInfo'],
        data() {
            return {
                name: '',
                password: ''
            };
        },
        methods: {
            loginOut() {
                sessionStorage.clear();
                utils.delCookie('session_id');
                utils.delCookie('session_id_double');
                let redirect = decodeURIComponent(this.$route.query.redirect || '/login');
                this.$router.push({
                    path: redirect
                });
            }
        }
    };
</script>
