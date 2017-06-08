<template>
    <div class="searchhistory">
        <nv-head :userInfo="userInfo"></nv-head>
        <div class="htopcenter">
            <span>{{'一共' + totalRow + '条结果，当前显示第' + (pageNo * pageSize-5) + '至' + (pageNo * pageSize)+ '条结果。'}}</span>
            <span class="rspan">
                <span>起始时间</span>
                <label>清空</label>
                <input type="date" class="sectime"/>
                <span>结束时间</span>
                <label>清空</label>
                <input type="date" class="sectime"/>
            </span>
            <div class="imgpic">
                <img src="../assets/images/glass_green.png"/>
            </div>
        </div>
        <div class="hcenter">
            <table class="">
                <thead>
                    <tr class="theadtr">
                        <th class="topnone pic">用户</th>
                        <th class="topnone pic">图像</th>
                        <th class="topnone content">内容</th>
                        <th class="topnone time">时间</th>
                        <th class="noneright topnone operator">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in items" :index="index">
                        <td>{{item.username}}</td>
                        <td>
                            <img v-if="item.a_face_image_uri!==null && item.a_face_image_uri!==''" :src="getPictureA(item.a_face_image_uri)"/>
                            <div v-else>
                                <img v-if="item.b_face_image_uri!==null && item.b_face_image_uri!=='' " :src="getPictureB(item.b_face_image_uri)"/>
                            </div>
                        </td>
                        <td class="content">
                            <div v-if="item.name!==null && item.name!=='' "><span>姓名：</span><span>{{item.name}}</span></div>
                            <div v-if="item.idnumber!==null && item.idnumber!=='' "><span>身份证号：</span><span>{{item.idnumber}}</span></div>
                            <div v-if="item.sex!==null && item.sex!=='' "><span>性别：</span><span>{{item.sex}}</span></div>
                            <div v-if="item.liba!==null && item.liba!=='' "><span>依图库：</span><span v-for="(it,ik) in item.liba" :index="ik">{{' ' + it.name + ' '}}</span></div>
                            <div v-if="item.libb!==null && item.libb!=='' "><span>耐思捷库:</span><span v-for="(it,ik) in item.libb" :index="ik">{{' ' + it.name + ' '}}</span></div>
                        </td>
                        <td>
                            {{item.create_time}}
                        </td>
                        <td class="noneright">
                            <button @click="goTo(item.query)">查看结果</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-loading.body="!showStatus" element-loading-text="拼命加载中"></div>
        </div>
        <div class="page">
            <span v-if="pageNo>1" @click="pageChange('up')">上一页</span>
            <span>{{'第' + pageNo + '页'}}</span>
            <span v-if="maxPage>pageNo" @click="pageChange('down')">下一页</span>
        </div>
        <div class="cleardiv"></div>
        <nv-footer :userInfo="userInfo"></nv-footer>
    </div>
</template>

<script>
    require('../assets/styl/common.styl');
    require('../assets/styl/searchhistory.styl');
    import nvHead from '../components/header.vue';
    import nvFooter from '../components/footer.vue';
    import $ from 'webpack-zepto';
    import store from '../vuex/user';
    import utils from '../libs/utils.js';
    export default {
        data() {
            return {
                totalRow: '',
                info: '',
                items: [],
                maxPage: 1,
                pageNo: 1,
                pageSize: 6,
                userInfo: store.state.userInfo, // 用户信息
                server: utils.getServer(),
                showStatus: false
            };
        },
        created() {
            var self = this;
            self.getResult(1);
            setInterval(function() {
                self.keepStatus();
            }, 1000 * 60 * 3);
        },
        methods: {
            // 每隔一段时间调用
            keepStatus() {
                // 依图引擎获取人像库
                utils.ajaxPayloadA($, {
                    type: 'get',
                    url: this.server.query.api + '/face/v1/framework/face_image/repository',
                    // url: this.server.query.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                    }
                });
                // 耐思捷引擎获取人像库
                utils.ajaxPayloadB($, {
                    type: 'get',
                    url: this.server.doubleQuery.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                    }
                });
            },
            // 获取检索历史
            getResult(pageNo) {
                var self = this;
                var user = sessionStorage.getItem('user');
                user = JSON.parse(user);
                utils.ajax($, {
                    type: 'post',
                    url: self.server.otherQuery.api + '/NSJApi/NSJ/findSearchHistoryByPage',
                    data: {
                        'pageSize': self.pageSize,
                        'pageNo': pageNo,
                        'username': user.name
                    },
                    success: (res) => {
                        if(res.result === 'SUCCESS') {
                            self.info = res.info;
                            self.items = res.info.list;
                            self.maxPage = res.info.totalPage;
                            self.totalRow = res.info.totalRow;
                            for(var i = 0; i < self.items.length; i++) {
                                if((self.items[i].liba !== null) && (self.items[i].liba !== '')) {
                                    self.items[i].liba = JSON.parse(self.items[i].liba);
                                } else {
                                    self.items[i].liba = '';
                                }
                                if((self.items[i].libb !== null) && (self.items[i].libb !== '')) {
                                    self.items[i].libb = JSON.parse(self.items[i].libb);
                                } else {
                                    self.items[i].libb = '';
                                }
                                // 处理性别
                                if((self.items[i].sex !== null) && (self.items[i].sex !== '')) {
                                    self.items[i].sex = self.items[i].sex.replace(1, '男');
                                    self.items[i].sex = self.items[i].sex.replace(2, '女');
                                    self.items[i].sex = self.items[i].sex.replace(0, '未知');
                                } else {
                                    self.items[i].sex = '';
                                }
                            }
                            self.showStatus = true;
                        }
                    },
                    error: (res) => {
                        self.$notify.error({
                            title: '错误',
                            message: '服务器请求异常'
                        });
                    }
                });
            },
            pageChange(type) {
                var self = this;
                var pageNo = self.pageNo;
                if(type === 'up') {
                    pageNo--;
                }else if(type === 'down') {
                    pageNo++;
                }
                self.pageNo = pageNo;
                self.getResult(pageNo);
            },
            // 获取图片
            getPictureA(pictureUri) {
                var self = this;
                return utils.convertBase64(self.server.query.api, pictureUri);
            },
            // 获取图片
            getPictureB(pictureUri) {
                var self = this;
                return utils.convertBase64(self.server.doubleQuery.api, pictureUri);
            },
            // 获取时间年月日
            getDate(time) {
                time = time + '000';
                return utils.getDate(time);
            },
            // 获取时间时分
            getTime(time) {
                time = time + '000';
                return utils.getTime(time);
            },
            // 查看检索结果
            goTo(query) {
                var redirect = decodeURIComponent(this.$route.query.redirect || '/result');
                query = JSON.parse(query);
                this.$router.push({
                    path: redirect,
                    query: query
                });
            }
        },
        components: {
            nvHead,
            nvFooter
        }
    };
</script>
