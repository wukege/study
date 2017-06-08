<template>
    <div class="user">
        <nv-head :userInfo="userInfo"></nv-head>
        <div class="footer">
            <div class="imgfot">
                <label for="file"><img v-if="imgBase!==''" :src="'data:image/jpeg;base64,'+imgBase"/></label>
                <label for="file"><img v-if="imgBase==''" src="../assets/images/pic.png"/></label>
                <input type="file" id="file" class="file" @change="fileChange"/>
            </div>
            <button class="filepic">
                <span class="jia">+</span>
                <!--<input type="file" id="file" class="file" @change="fileChange"/>-->
                <label for="file">上传图片</label>
            </button>
            <div class="reset"><button class="resetbtn" @click="clearImg">重置</button></div>
            <img src="../assets/images/sousuo.png" class="sousuo" @click="submitQuery"/>
        </div>
        <div class="center">
            <div class="cen">
                <div class="leftcen">
                    <div class="title">依图引擎</div>
                    <div class="chose">
                        <span>已选</span>
                        <span class="inlinespan">
                            <span v-if="item.select" v-for="(item, index) in dataA" :index="index">
                                {{' '+item.name+','}}
                            </span>
                        </span>
                    </div>
                    <div class="chioce">
                        <div class="addchi">
                            <p v-for="(item, index) in dataA" :index="index">
                                <input :checked="[item.select==true?true:false]"
                                       v-model="item.select" type="checkbox" :id="'A'+index"/>
                                <label :for="'A'+index">{{item.name}}</label>
                            </p>
                        </div>
                    </div>
                    <div class="ope">
                        <span @click="choose('A')">全选</span>
                        <span @click="unChoose('A')" class="clear">反选</span>
                    </div>
                </div>
            </div>
            <div class="cen">
                <div class="leftcen cencen">
                    <div class="title">耐思捷引擎</div>
                    <div class="chose chose1">
                        <span>已选</span>
                        <span class="inlinespan">
                            <span v-if="item.select" v-for="(item, index) in dataB" :index="index">
                                {{' '+item.name+','}}
                            </span></span>
                    </div>
                    <div class="chioce chioce1">
                        <div class="addchi">
                            <p v-for="(item, index) in dataB" :index="index">
                                <input :checked="[item.select==true?true:false]"
                                       v-model="item.select" type="checkbox" :id="'B'+index"/>
                                <label :for="'B'+index">{{item.name}}</label>
                            </p>
                        </div>
                    </div>
                    <div class="ope">
                        <span @click="choose('B')">全选</span>
                        <span @click="unChoose('B')" class="clear">反选</span>
                    </div>
                </div>
            </div>
            <div class="cen">
                <div class="leftcen cencen cencen1">
                    <div class="title">多引擎</div>
                    <div class="all">
                        <button :class="[queryType==1?'radius1 active':'radius1']" @click="chooseType(1)">双引擎对比</button>
                        <button :class="[queryType==2?'sex active':'sex']" @click="chooseType(2)">依图引擎</button>
                        <button :class="[queryType==3?'sex radius active':'sex radius']" @click="chooseType(3)">耐思捷引擎
                        </button>
                    </div>
                    <div class="all">
                        <p class="posicss">姓名</p>
                        <input type="text" class="alin" v-model="name"/>
                    </div>
                    <div class="all">
                        <p class="posicss">身份证号</p>
                        <input type="text" class="alin" v-model="personId"/>
                    </div>
                    <div class="all">
                        <button :class="[sexM==1?'radius1 active':'radius1']" @click="chooseSex(1, 'sexM')">男</button>
                        <button :class="[sexW==2?'sex active':'sex']" @click="chooseSex(2, 'sexW')">女</button>
                        <button :class="[sexN==0?'sex radius active':'sex radius']" @click="chooseSex(0, 'sexN')">未知</button>
                    </div>
                    <div class="all bot">
                        <span class="inlinediv">
                            <input type="number" class="other" v-model="minAge"/>
                            <p class="first">岁</p>
                        </span>
                        <span class="inlinediv colordiv">至</span>
                        <span class="inlinediv">
                            <input type="number" class="other" v-model="maxAge"/>
                            <p class="second">岁</p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <nv-footer></nv-footer>
    </div>
</template>

<script>
    require('../assets/styl/common.styl');
    require('../assets/styl/index.styl');
    import nvHead from '../components/header.vue';
    import nvFooter from '../components/footer.vue';
    import $ from 'webpack-zepto';
    import store from '../vuex/user';
    import utils from '../libs/utils.js';

    export default {
        data() {
            return {
                dataA: [], // 库A列表
                dataB: [], // 库B列表
                fileA: {}, // 上传图片A库生成信息
                fileB: {}, // 上传图片B库生成信息
                libraryA: '', // A库选中列表
                libraryB: '', // B库选中列表
                userInfo: store.state.userInfo, // 用户信息
                server: utils.getServer(), // 请求信息
                name: '', // 用户名
                personId: '', // 身份证
                minAge: '', // 最小年龄
                maxAge: '', // 最大年龄
                sexM: 3, // 性别男1
                sexW: 3, // 性别女2
                sexN: 3, // 性别未知0
                queryType: 1, // 查询方式
                imgBase: ''
            };
        },
        created() {
            var self = this;
            self.getLibrary();
            setInterval(function() {
                self.keepStatus();
            }, 1000 * 60 * 3);
        },
        methods: {
            // 每隔一段时间调用
            keepStatus() {
                var self = this;
                // 依图引擎获取人像库
                utils.ajaxPayloadA($, {
                    type: 'get',
                    url: self.server.query.api + '/face/v1/framework/face_image/repository',
                    // url: self.server.query.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                    }
                });
                // 耐思捷引擎获取人像库
                utils.ajaxPayloadB($, {
                    type: 'get',
                    url: self.server.doubleQuery.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                    }
                });
            },
            // 获取人像库
            getLibrary() {
                var self = this;
                // 依图引擎获取人像库
                utils.ajaxPayloadA($, {
                    type: 'get',
                    url: self.server.query.api + '/face/v1/framework/face_image/repository',
                    // url: self.server.query.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                        if(res.rtn === 0) {
                            var dataA = [];
                            for(var i = 0; i < res.results.length; i++) {
                                if(res.results[i].type === 1) {
                                    res.results[i].select = true;
                                    dataA.push(res.results[i]);
                                }
                            }
                            self.dataA = dataA;
                        }
                    },
                    error: (res) => {
                        self.$notify.error({
                            title: '错误',
                            message: '服务器请求异常'
                        });
                    }
                });
                // 耐思捷引擎获取人像库
                utils.ajaxPayloadB($, {
                    type: 'get',
                    url: self.server.doubleQuery.api + '/face/v1/framework/face_image/repository/global',
                    success: (res) => {
                        if(res.rtn === 0) {
                            var dataB = [];
                            for(var i = 0; i < res.results.length; i++) {
                                if(res.results[i].type === 1) {
                                    res.results[i].select = true;
                                    dataB.push(res.results[i]);
                                }
                            }
                            self.dataB = dataB;
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
            // 全选人像库
            choose(type) {
                var self = this;
                if(type === 'A') {
                    for(var i = 0; i < self.dataA.length; i++) {
                        self.dataA[i].select = true;
                    }
                }else {
                    for(var x = 0; x < self.dataB.length; x++) {
                        self.dataB[x].select = true;
                    }
                }
            },
            // 取消全选人像库
            unChoose(type) {
                var self = this;
                if(type === 'A') {
                    for(var i = 0; i < self.dataA.length; i++) {
                        self.dataA[i].select = false;
                    }
                }else {
                    for(var x = 0; x < self.dataB.length; x++) {
                        self.dataB[x].select = false;
                    }
                }
            },
            // 选择性别
            chooseSex(num, sexType) {
                if(this[sexType] === 3) {
                    this[sexType] = num;
                }else {
                    this[sexType] = 3;
                }
            },
            // 选择搜索方式
            chooseType(num) {
                this.queryType = num;
            },
            // 上传图片
            fileChange() {
                var self = this;
                var file = $('#file')[0].files[0];
                if(!/image\/\w+/.test(file.type)) {
                    self.$alert('请上传图片文件', '消息', {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    self.imgBase = this.result.substring(this.result.indexOf(',') + 1);
                    // 耐思捷引擎图片上传
                    utils.ajaxPayload($, {
                        type: 'post',
                        url: self.server.doubleQuery.api + '/face/v1/framework/face_image/repository/picture/synchronized',
                        data: {
                            'picture_image_content_base64': self.imgBase,
                            'options': {
                                'max_faces_allowed': -1
                            }
                        },
                        success: (res) => {
                            if(res.rtn === 0) {
                                self.fileB = res.results[0];
                                // 依图引擎图片上传
                                utils.ajaxPayload($, {
                                    type: 'post',
                                    url: self.server.query.api + '/face/v1/framework/face_image/repository/picture/synchronized',
                                    data: {
                                        'picture_image_content_base64': self.imgBase,
                                        'options': {
                                            'max_faces_allowed': -1
                                        }
                                    },
                                    success: (res2) => {
                                        if(res2.rtn === 0) {
                                            self.fileA = res2.results[0];
                                        }else{
                                            self.$alert('依图引擎无法识别该图片', '消息', {
                                                confirmButtonText: '确定'
                                            });
                                            self.imgBase = '';
                                        }
                                    },
                                    error: (res) => {
                                        self.$notify.error({
                                            title: '错误',
                                            message: '服务器请求异常'
                                        });
                                    }
                                });
                            }else {
                                // 依图引擎图片上传
                                utils.ajaxPayload($, {
                                    type: 'post',
                                    url: self.server.query.api + '/face/v1/framework/face_image/repository/picture/synchronized',
                                    data: {
                                        'picture_image_content_base64': self.imgBase,
                                        'options': {
                                            'max_faces_allowed': -1
                                        }
                                    },
                                    success: (res2) => {
                                        if(res2.rtn === 0) {
                                            self.fileA = res2.results[0];
                                            self.$alert('耐思捷引擎无法识别该图片', '消息', {
                                                confirmButtonText: '确定'
                                            });
                                        }else{
                                            self.$alert('耐思捷引擎与依图引擎都无法识别该图片', '消息', {
                                                confirmButtonText: '确定'
                                            });
                                            self.imgBase = '';
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
                        error: (res) => {
                            self.$notify.error({
                                title: '错误',
                                message: '服务器请求异常'
                            });
                        }
                    });
                };
            },
            // 重置图片
            clearImg() {
                this.imgBase = '';
            },
            // 按钮状态
            submitQueryShow() {
                var self = this;
                self.$alert('请上传图片或填写身份信息', '消息', {
                    confirmButtonText: '确定'
                });
            },
            // 查询
            submitQuery() {
                var self = this;
                var status = true;
                var ajaxParameters = {};
                var myDate = new Date();
                // 初始化跳转参数
                var redirect = decodeURIComponent(self.$route.query.redirect || '/result');
                var query = {};
                // 判断搜索方式
                query.queryType = self.queryType;
                ajaxParameters.engine_type = self.queryType;
                if((self.name !== '') || (self.personId !== '') || ((typeof self.fileA.face_image_url !== 'undefined') && (typeof self.fileB.face_image_uri !== 'undefined'))) {
                } else{
                    self.$alert('图片在上传中，请稍等', '消息', {
                        confirmButtonText: '确定'
                    });
                    status = false;
                }
                // 判断是图片搜索还是文本搜索
                if(((self.name !== '') || (self.personId !== '')) && (self.imgBase !== '')) {
                    self.$alert('图片搜索和身份搜索只能选择一种', '消息', {
                        confirmButtonText: '确定'
                    });
                    status = false;
                } else if((self.name !== '') || (self.personId !== '')) {
                    // 身份搜索
                    if(self.name !== '') {
                        query.name = self.name;
                        ajaxParameters.name = self.name;
                    }
                    if(self.personId !== '') {
                        query.personId = self.personId;
                        ajaxParameters.idnumber = self.personId;
                    }
                    if(self.minAge !== '') {
                        query.minAge = self.minAge;
                        ajaxParameters.age_end = myDate.getFullYear() - self.minAge;
                    }
                    if(self.maxAge !== '') {
                        query.maxAge = self.maxAge;
                        ajaxParameters.age_begin = myDate.getFullYear() - self.maxAge;
                    }
                    if(self.sexM !== 3) {
                        query.sexM = self.sexM;
                        ajaxParameters.sex = self.sexM;
                    }
                    if(self.sexW !== 3) {
                        query.sexW = self.sexW;
                        if(typeof ajaxParameters.sex !== 'undefined') {
                            ajaxParameters.sex = ajaxParameters.sex + ',' + self.sexW;
                        }else {
                            ajaxParameters.sex = self.sexW;
                        }
                    }
                    if(self.sexN !== 3) {
                        query.sexN = self.sexN;
                        if(typeof ajaxParameters.sex !== 'undefined') {
                            ajaxParameters.sex = ajaxParameters.sex + ',' + self.sexN;
                        }else {
                            ajaxParameters.sex = self.sexN;
                        }
                    }
                } else if(self.imgBase !== '') {
                    // 图片搜索
                    if(self.minAge !== '') {
                        query.minAge = self.minAge;
                        ajaxParameters.age_end = myDate.getFullYear() - self.minAge;
                    }
                    if(self.maxAge !== '') {
                        query.maxAge = self.maxAge;
                        ajaxParameters.age_begin = myDate.getFullYear() - self.maxAge;
                    }
                    if(self.sexM !== 3) {
                        query.sexM = self.sexM;
                        ajaxParameters.sex = self.sexM;
                    }
                    if(self.sexW !== 3) {
                        query.sexW = self.sexW;
                        if(typeof ajaxParameters.sex !== 'undefined') {
                            ajaxParameters.sex = ajaxParameters.sex + ',' + self.sexW;
                        }else {
                            ajaxParameters.sex = self.sexW;
                        }
                    }
                    if(self.sexN !== 3) {
                        query.sexN = self.sexN;
                        if(typeof ajaxParameters.sex !== 'undefined') {
                            ajaxParameters.sex = ajaxParameters.sex + ',' + self.sexN;
                        }else {
                            ajaxParameters.sex = self.sexN;
                        }
                    }
                    if(self.queryType === 1) {
                        query.fileA = self.fileA.face_image_id_str;
                        query.fileB = self.fileB.face_image_id_str;
                        ajaxParameters.a_face_image_id = self.fileA.face_image_id_str;
                        ajaxParameters.a_face_image_uri = self.fileA.face_image_uri;
                        ajaxParameters.b_face_image_id = self.fileB.face_image_id_str;
                        ajaxParameters.b_face_image_uri = self.fileB.face_image_uri;
                    } else if(self.queryType === 2) {
                        query.fileA = self.fileA.face_image_id_str;
                        ajaxParameters.a_face_image_id = self.fileA.face_image_id_str;
                        ajaxParameters.a_face_image_uri = self.fileA.face_image_uri;
                    } else if(self.queryType === 3) {
                        query.fileB = self.fileB.face_image_id_str;
                        ajaxParameters.b_face_image_id = self.fileB.face_image_id_str;
                        ajaxParameters.b_face_image_uri = self.fileB.face_image_uri;
                    }
                } else {
                    self.$alert('请添加搜索信息', '消息', {
                        confirmButtonText: '确定'
                    });
                    status = false;
                }

                // 获取选中人像库
                var libraryA = self.libraryA,
                    libraryB = self.libraryB;
                var libA = [];
                var libB = [];
                var obj = {};
                libraryA = '';
                libraryB = '';
                for(var i = 0; i < self.dataA.length; i++) {
                    if(self.dataA[i].select) {
                        obj = {};
                        obj.id = self.dataA[i].id;
                        obj.name = self.dataA[i].name;
                        if(libraryA === '') {
                            libraryA = self.dataA[i].id;
                        }else {
                            libraryA = libraryA + ',' + self.dataA[i].id;
                        }
                        libA.push(obj);
                    }
                }
                for(var x = 0; x < self.dataB.length; x++) {
                    if(self.dataB[x].select) {
                        obj = {};
                        obj.id = self.dataB[x].id;
                        obj.name = self.dataB[x].name;
                        if(libraryB === '') {
                            libraryB = self.dataB[x].id;
                        }else {
                            libraryB = libraryB + ',' + self.dataB[x].id;
                        }
                        libB.push(obj);
                    }
                }
                self.libraryA = libraryA;
                self.libraryB = libraryB;
                if(self.queryType === 1) {
                    if((self.libraryA !== '') && (self.libraryB !== '')) {
                        query.libraryA = self.libraryA;
                        query.libraryB = self.libraryB;
                        ajaxParameters.a_rxk_ids = self.libraryA;
                        ajaxParameters.b_rxk_ids = self.libraryB;
                        ajaxParameters.liba = JSON.stringify(libA);
                        ajaxParameters.libb = JSON.stringify(libB);
                    }else if(self.libraryA === '') {
                        self.$alert('请选择依图引擎人像库', '消息', {
                            confirmButtonText: '确定'
                        });
                        status = false;
                    }else if(self.libraryB === '') {
                        self.$alert('请选择耐思捷人像库', '消息', {
                            confirmButtonText: '确定'
                        });
                        status = false;
                    }
                } else if(self.queryType === 2) {
                    if(self.libraryA !== '') {
                        query.libraryA = self.libraryA;
                        ajaxParameters.a_rxk_ids = self.libraryA;
                        ajaxParameters.liba = JSON.stringify(libA);
                    }else {
                        self.$alert('请选择依图引擎人像库', '消息', {
                            confirmButtonText: '确定'
                        });
                        status = false;
                    }
                } else if(self.queryType === 3) {
                    if(self.libraryB !== '') {
                        query.libraryB = self.libraryB;
                        ajaxParameters.b_rxk_ids = self.libraryB;
                        ajaxParameters.libb = JSON.stringify(libB);
                    }else {
                        self.$alert('请选择耐思捷人像库', '消息', {
                            confirmButtonText: '确定'
                        });
                        status = false;
                    }
                }
                var user = sessionStorage.getItem('user');
                user = JSON.parse(user);
                ajaxParameters.username = user.name;
                if(status) {
                    ajaxParameters.query = JSON.stringify(query);
                    utils.ajax($, {
                        type: 'post',
                        url: self.server.otherQuery.api + '/NSJApi/NSJ/addSearchHistoryInfo',
                        data: ajaxParameters,
                        success: (res) => {
                            if((res.rtn === 0) && (res.results.length > 0)) {
                                self.pictureUri = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                            }
                        },
                        error: (res) => {
                            self.$notify.error({
                                title: '错误',
                                message: '服务器请求异常'
                            });
                        }
                    });
                    self.$router.push({
                        path: redirect,
                        query: query
                    });
                }
            }
        },
        components: {
            nvHead,
            nvFooter
        }
    };
</script>
