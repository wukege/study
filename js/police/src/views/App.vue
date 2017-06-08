<template>
    <transition>
        <router-view class="child-view"/>
    </transition>
</template>
<script>
    import store from '../vuex/user';
    export default {
        data() {
            return {
                userInfo: store.state.userInfo
            };
        },
        created: function() {
            if(this.$route.name === undefined) {
                return this.$router.push('home');
            }
        }
    };
</script>
