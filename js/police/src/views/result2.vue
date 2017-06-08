<template>
    <div class="result">
        <nv-head :userInfo="userInfo"></nv-head>
        <div class="rcenter">
            <div class="rleft">
                <div class="pictop">
                    <label for="file"><img v-if="pictureUri!==''" :src="pictureUri" class="imgclass"/></label>
                    <label for="file"><img v-if="pictureUri===''" src="../assets/images/pic.png" class="imgclass"/></label>
                    <input type="file" id="file" class="file" @change="fileChange"/>
                    <div class="posicss">
                        <button class="btnfile">
                            <span class="colorjia">+</span>
                            <!--<input type="file" id="file" class="file" @change="fileChange"/>-->
                            <label for="file">上传图片</label>
                        </button>
                        <div class="reset"><button class="resetbtn" @click="clearImg">重置</button></div>
                    </div>
                </div>
                <div class="mes" @click="messhow">双引擎对比</div>
                <div class="mesdetail">
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
                    <div class="all">
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
                <div v-if="yiStatus" class="mes" @click="ashow">依图引擎</div>
                <div v-if="yiStatus" class="adetail">
                    <div class="chioce">
                        <div class="addchi">
                            <p v-for="(item, index) in dataA" :index="index">
                                <input :checked="[item.select==true?true:false]" v-model="item.select" type="checkbox" :id="'A'+index"/>
                                <label :for="'A'+index">{{item.name}}</label>
                            </p>
                        </div>
                    </div>
                    <span @click="choose('A')" class="allchice">全选</span>
                    <span @click="unChoose('A')" class="clear">反选</span>
                </div>
                <div v-if="jieStatus" class="mes" @click="bshow">耐思捷引擎</div>
                <div v-if="jieStatus" class="bdetail">
                    <div class="chioce">
                        <div class="addchi">
                            <p v-for="(item, index) in dataB" :index="index">
                                <input :checked="[item.select==true?true:false]" v-model="item.select" type="checkbox" :id="'B'+index"/>
                                <label :for="'B'+index">{{item.name}}</label>
                            </p>
                        </div>
                    </div>
                    <span @click="choose('B')" class="allchice">全选</span>
                    <span @click="unChoose('B')" class="clear">反选</span>
                </div>
                <div class="imgdiv">
                    <img src="../assets/images/sousuo.png" class="sou" @click="submitQuery"/>
                </div>
            </div>
            <div class="rright">
                <div class="innerright">
                    <div class="topright">
                        <button :class="[showType=='1'?'active':'']" v-if="query.queryType==='1'" @click="engineQuery(1)">双引擎对比</button>
                        <button :class="[showType=='2'?'button1 active':'button1']" v-if="query.queryType!=='3'" @click="engineQuery(2)">依图引擎</button>
                        <button :class="[showType=='3'?'button1 active':'button1']" v-if="query.queryType!=='2'" @click="engineQuery(3)">耐思捷引擎</button>
                    </div>
                    <div class="fotright">
                        <div class="engine-a" v-if="showType!=='3'">
                            <div class="add" v-if="showType!=='3'&& showType!=='2'">依图引擎</div>
                            <div class="topall" v-for="(item, index) in dataAList" :index="index">
                                <div class="innertop">
                                    <div class="picdiv" @click="showCompare('A', item)">
                                        <img :src="getPictureA(item.face_image_uri)"/>
                                    </div>
                                    <div class="desc">
                                        <span class="sample">{{getSimilarity(item.similarity)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="alldesc alldesc1">
                                <div class="posi">
                                    <span class="record">{{'共' + dataAinfo.total + '条记录'}}</span>
                                    <span v-if="pageIndexA>1" @click="pageChange('A', 'up')" class="pre">上一页</span>
                                    <span span="page">{{'第' + pageIndexA + '页'}}</span>
                                    <span v-if="maxPageA>=pageIndexA" @click="pageChange('A', 'down')" class="next">下一页</span>
                                </div>
                            </div>
                            <div class="cleardiv"></div>
                        </div>
                        <div v-loading.body="!showStatusA" element-loading-text="拼命加载中" class="aloading"></div>
                    </div>
                    <div class="fotright">
                        <div class="engine-b" v-if="showType!=='2'">
                            <div class="add"  v-if="showType!=='3'&& showType!=='2'">耐思捷引擎</div>
                            <div class="topall" v-for="(item, index) in dataBList" :index="index">
                                <div class="innertop">
                                    <div class="picdiv" @click="showCompare('B', item)">
                                        <img :src="getPictureB(item.face_image_uri)"/>
                                    </div>
                                    <div class="desc">
                                        <span class="sample">{{getSimilarity(item.similarity)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="alldesc alldesc2">
                                <div class="posi">
                                    <span class="record">{{'共' + dataBinfo.total + '条记录'}}</span>
                                    <span v-if="pageIndexB>1" @click="pageChange('B', 'up')" class="pre">上一页</span>
                                    <span class="page">{{'第' + pageIndexB + '页'}}</span>
                                    <span v-if="maxPageB>=pageIndexB" @click="pageChange('B', 'down')" class="next">下一页</span>
                                </div>
                            </div>
                        </div>
                        <div class="clearcss">
                        </div>
                    </div>
                    <div v-loading.body="!showStatusB" element-loading-text="拼命加载中" class="bloading"></div>
                </div>
            </div>
            <div class="clearboth">
            </div>
        </div>
        <nv-footer ></nv-footer>
        <nv-compare v-if='compareStatus' :close="close" :compareList="compareList"></nv-compare>
    </div>
</template>

<script>
    require('../assets/styl/common.styl');
    require('../assets/styl/result.styl');
    import nvHead from '../components/header.vue';
    import nvFooter from '../components/footer.vue';
    import nvCompare from '../components/compare.vue';
    import $ from 'webpack-zepto';
    import store from '../vuex/user';
    import utils from '../libs/utils.js';

    export default {
        data() {
            var limt = 12,
                showType = String(this.$route.query.queryType),
                query = this.$route.query,
                yiStatus = true,
                jieStatus = true;
            if(showType !== '1') {
                limt = 24;
            }
            if(showType === '3') {
                yiStatus = false;
            }
            if(showType === '2') {
                jieStatus = false;
            }

            var p;
            for(p in query) {
                query[p] = String(query[p]);
            }

            return {
                compareStatus: false,
                compareList: {
                    'compareUpload': {},
                    'compareObj': {}
                },
                yiStatus: yiStatus,
                jieStatus: jieStatus,
                showStatusA: false,
                showStatusB: false,
                query: query,
                showType: showType,
                userInfo: store.state.userInfo,
                server: utils.getServer(),
                pictureUri: '',
                timestamp: '',
                dataAinfo: {
                    total: 0
                },
                dataBinfo: {
                    total: 0
                },
                dataAList: [],
                dataBList: [],
                limt: limt,
                pageIndexA: 1,
                pageIndexB: 1,
                maxPageA: 1,
                maxPageB: 1,
                dataA: [], // 库A列表
                dataB: [], // 库B列表
                fileA: {}, // 上传图片A库生成信息
                fileB: {}, // 上传图片B库生成信息
                libraryA: '', // A库选中列表
                libraryB: '', // B库选中列表
                name: query.name || '', // 用户名
                personId: query.personId || '', // 身份证
                minAge: query.minAge || '', // 最小年龄
                maxAge: query.maxAge || '', // 最大年龄
                sexM: query.sexM || 3, // 性别男1
                sexW: query.sexW || 3, // 性别女2
                sexN: query.sexN || 3, // 性别未知0
                queryType: parseInt(query.queryType), // 查询方式
                imgBase: '' // 上传图片的base64
            };
        },
        created() {
            // 初始化出检索查询内容
            var self = this;
            // 判断是图片查询还是身份证用户名查询
            if((typeof self.query.fileA !== 'undefined') || (typeof self.query.fileB !== 'undefined')) {
                // 判断是获取当前检索的图片
                var pictureUri;
                var pictureUriB;
                if(self.query.queryType === '1') {
                    pictureUri = self.query.fileA;
                    self.queryUriA(pictureUri);
                    pictureUriB = self.query.fileB;
                    self.queryUriB(pictureUriB);
                }else if(self.query.queryType === '2') {
                    pictureUri = self.query.fileA;
                    self.queryUriA(pictureUri);
                } else if(self.query.queryType === '3') {
                    pictureUriB = self.query.fileB;
                    self.queryUriB(pictureUriB);
                }
                if(self.query.queryType === '1') {
                    self.queryListA();
                    self.queryListB();
                } else if(self.query.queryType === '2') {
                    self.queryListA();
                } else if(self.query.queryType === '3') {
                    self.queryListB();
                }
            }else {
                if(self.query.queryType === '1') {
                    self.queryCardA();
                    self.queryCardB();
                } else if(self.query.queryType === '2') {
                    self.queryCardA();
                } else if(self.query.queryType === '3') {
                    self.queryCardB();
                }
            }
            // 初始化查询库
            self.getLibrary();
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
            messhow() {
                var sta = true;
                if (sta) {
                    $('.mesdetail').css('display', 'block');
                    $('.adetail').css('display', 'none');
                    $('.bdetail').css('display', 'none');
                    sta = false;
                }
            },
            ashow() {
                var sta = true;
                if (sta) {
                    $('.adetail').css('display', 'block');
                    $('.mesdetail').css('display', 'none');
                    $('.bdetail').css('display', 'none');
                    sta = false;
                }
            },
            bshow() {
                var sta = true;
                if (sta) {
                    $('.bdetail').css('display', 'block');
                    $('.mesdetail').css('display', 'none');
                    $('.adetail').css('display', 'none');
                    sta = false;
                } else if (sta === false) {
                    $('.bdetail').css('display', 'none');
                }
            },
            // 通过图片id获取A引擎图片uri
            queryUriA(pictureUri) {
                var self = this;
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'picture_url',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {
                        'face_image_id_str': pictureUri
                    },
                    'order': {
                        'timestamp': -1
                    },
                    'start': 0,
                    'limit': 1
                };
                utils.ajaxPayloadA($, {
                    type: 'post',
                    url: self.server.query.api + '/face/v1/framework/face/query',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.results.length > 0)) {
                            self.pictureUri = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                            self.timestamp = res.results[0].timestamp;
                            self.fileA = res.results[0];
                            self.imgBase = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                        }
                    }
                });
            },
            // 通过图片id获取B引擎图片uri
            queryUriB(pictureUriB) {
                var self = this;
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'picture_url',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {
                        'face_image_id_str': pictureUriB
                    },
                    'order': {
                        'timestamp': -1
                    },
                    'start': 0,
                    'limit': 1
                };
                utils.ajaxPayloadB($, {
                    type: 'post',
                    url: self.server.doubleQuery.api + '/face/v1/framework/face/query',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.results.length > 0)) {
                            self.pictureUri = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                            self.timestamp = res.results[0].timestamp;
                            self.fileB = res.results[0];
                            self.imgBase = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                        }
                    }
                });
            },
            // 通过图片信息查询A引擎信息
            queryListA() {
                var self = this;
                if(self.query.queryType !== '1') {
                    self.showStatusB = true;
                }
                // 初始化查询参数
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'similarity',
                        'annotation',
                        'picture_uri',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {},
                    'retrieval': {
                        'threshold': 0,
                        'face_image_id_str': '',
                        'repository_ids': []
                    },
                    'order': {
                        'similarity': -1
                    },
                    'start': 0,
                    'limit': 2000
                };

                // 图片查询参数插值
                if(typeof self.query.fileA !== 'undefined') {
                    posParameters.retrieval.face_image_id_str = self.query.fileA;
                    var libraryA = self.query.libraryA;
                    libraryA = libraryA.split(',');
                    for(var i = 0; i < libraryA.length; i++) {
                        libraryA[i] = parseInt(libraryA[i]);
                    }
                    posParameters.retrieval.repository_ids = libraryA;
                }
                 // 设置性别
                var sexStatus = true;
                if(typeof self.query.sexM !== 'undefined') {
                    sexStatus = false;
                    posParameters.condition.gender = {
                        '$in': []
                    };
                    posParameters.condition.gender['$in'].push(parseInt(self.query.sexM));
                }
                if(typeof self.query.sexW !== 'undefined') {
                    if(sexStatus) {
                        sexStatus = false;
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }
                }
                if(typeof self.query.sexN !== 'undefined') {
                    if(sexStatus) {
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }
                }
                // 设置年龄
                var myDate = new Date();
                myDate = myDate.getFullYear();
                if(self.minAge !== '' || self.maxAge !== '') {
                    posParameters.condition.born_year = {};
                }
                if(self.minAge !== '') {
                    posParameters.condition.born_year['$lte'] = parseInt(myDate - self.minAge);
                }
                if(self.maxAge !== '') {
                    posParameters.condition.born_year['$gte'] = parseInt(myDate - self.maxAge);
                }
                utils.ajaxPayloadA($, {
                    type: 'post',
                    url: self.server.query.api + '/face/v1/framework/face/retrieval',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.total > 0)) {
                            var dataAList = [];
                            var max = self.limt;
                            if(max > res.total) {
                                max = res.total;
                            }
                            for(var y = 0; y < max; y++) {
                                dataAList.push(res.results[y]);
                            }
                            self.dataAinfo = res;
                            self.dataAList = dataAList;
                            self.maxPageA = parseInt(res.total / self.limt);
                        }else {
                            self.dataAinfo = res;
                            self.dataAList = [];
                            self.maxPageA = 1;
                        }
                        self.showStatusA = true;
                    }
                });
            },
            // 通过图片信息查询B引擎信息
            queryListB() {
                var self = this;
                if(self.query.queryType !== '1') {
                    self.showStatusA = true;
                }
                // 初始化查询参数
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'similarity',
                        'annotation',
                        'picture_uri',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {},
                    'retrieval': {
                        'threshold': 0,
                        'face_image_id_str': '',
                        'repository_ids': []
                    },
                    'order': {
                        'similarity': -1
                    },
                    'start': 0,
                    'limit': 2000
                };
                // 图片查询参数插值
                if(typeof self.query.fileB !== 'undefined') {
                    posParameters.retrieval.face_image_id_str = self.query.fileB;
                    var libraryB = self.query.libraryB;
                    libraryB = libraryB.split(',');
                    for(var i = 0; i < libraryB.length; i++) {
                        libraryB[i] = parseInt(libraryB[i]);
                    }
                    posParameters.retrieval.repository_ids = libraryB;
                }
                 // 设置性别
                var sexStatus = true;
                if(typeof self.query.sexM !== 'undefined') {
                    sexStatus = false;
                    posParameters.condition.gender = {
                        '$in': []
                    };
                    posParameters.condition.gender['$in'].push(parseInt(self.query.sexM));
                }
                if(typeof self.query.sexW !== 'undefined') {
                    if(sexStatus) {
                        sexStatus = false;
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }
                }
                if(typeof self.query.sexN !== 'undefined') {
                    if(sexStatus) {
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }
                }
                // 设置年龄
                var myDate = new Date();
                myDate = myDate.getFullYear();
                if(self.minAge !== '' || self.maxAge !== '') {
                    posParameters.condition.born_year = {};
                }
                if(self.minAge !== '') {
                    posParameters.condition.born_year['$lte'] = parseInt(myDate - self.minAge);
                }
                if(self.maxAge !== '') {
                    posParameters.condition.born_year['$gte'] = parseInt(myDate - self.maxAge);
                }
                utils.ajaxPayloadB($, {
                    type: 'post',
                    url: self.server.doubleQuery.api + '/face/v1/framework/face/retrieval',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.total > 0)) {
                            var dataBList = [];
                            var max = self.limt;
                            if(max > res.total) {
                                max = res.total;
                            }
                            for(var y = 0; y < max; y++) {
                                dataBList.push(res.results[y]);
                            }
                            self.dataBinfo = res;
                            self.dataBList = dataBList;
                            self.maxPageB = parseInt(res.total / self.limt);
                        }else {
                            self.dataBinfo = res;
                            self.dataBList = [];
                            self.maxPageB = 1;
                        }
                        self.showStatusB = true;
                    }
                });
            },
            // 通过输入身份信息查询A引擎信息
            queryCardA() {
                var self = this;
                if(self.query.queryType !== '1') {
                    self.showStatusB = true;
                }
                // 初始化查询参数
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'picture_url',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {
                        'repository_id': {
                            '$in': [
                            ]
                        }
                    },
                    'order': {
                        'timestamp': -1
                    },
                    'start': 0,
                    'limit': 2000
                };
                // 设置查询库
                var libraryA = self.query.libraryA;
                libraryA = libraryA.split(',');
                for(var i = 0; i < libraryA.length; i++) {
                    libraryA[i] = parseInt(libraryA[i]);
                }
                posParameters.condition.repository_id['$in'] = libraryA;
                // 设置姓名
                if(typeof self.query.name !== 'undefined') {
                    posParameters.condition.name = self.query.name;
                }
                // 设置身份
                if(typeof self.query.personId !== 'undefined') {
                    posParameters.condition.person_id = {
                        '$regex': ''
                    };
                    posParameters.condition.person_id['$regex'] = '^' + self.query.personId.substring(0, 6) + '.*';
                }
                // 设置性别
                var sexStatus = true;
                if(typeof self.query.sexM !== 'undefined') {
                    sexStatus = false;
                    posParameters.condition.gender = {
                        '$in': []
                    };
                    posParameters.condition.gender['$in'].push(parseInt(self.query.sexM));
                }
                if(typeof self.query.sexW !== 'undefined') {
                    if(sexStatus) {
                        sexStatus = false;
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }
                }
                if(typeof self.query.sexN !== 'undefined') {
                    if(sexStatus) {
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }
                }
                // 设置年龄
                var myDate = new Date();
                myDate = myDate.getFullYear();
                if(self.minAge !== '' || self.maxAge !== '') {
                    posParameters.condition.born_year = {};
                }
                if(self.minAge !== '') {
                    posParameters.condition.born_year['$lte'] = parseInt(myDate - self.minAge);
                }
                if(self.maxAge !== '') {
                    posParameters.condition.born_year['$gte'] = parseInt(myDate - self.maxAge);
                }
                utils.ajaxPayloadA($, {
                    type: 'post',
                    url: self.server.query.api + '/face/v1/framework/face/query',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.total > 0)) {
                            var dataAList = [];
                            var max = self.limt;
                            if(max > res.total) {
                                max = res.total;
                            }
                            for(var y = 0; y < max; y++) {
                                dataAList.push(res.results[y]);
                            }
                            self.dataAinfo = res;
                            self.dataAList = dataAList;
                            self.maxPageA = parseInt(res.total / self.limt);
                        }else {
                            self.dataAinfo = res;
                            self.dataAList = [];
                            self.maxPageA = 1;
                        }
                        self.showStatusA = true;
                    }
                });
            },
            // 通过输入身份信息查询B引擎信息
            queryCardB() {
                var self = this;
                if(self.query.queryType !== '1') {
                    self.showStatusA = true;
                }
                // 初始化查询参数
                var posParameters = {
                    'fields': [
                        'face_image_id',
                        'repository_id',
                        'timestamp',
                        'person_id',
                        'name',
                        'gender',
                        'nation',
                        'camera_id',
                        'is_hit',
                        'born_year',
                        'picture_url',
                        'face_image_uri',
                        'face_rect',
                        'rec_glasses',
                        'rec_fringe',
                        'rec_uygur',
                        'rec_gender',
                        'rec_age'
                    ],
                    'condition': {
                        'repository_id': {
                            '$in': [
                            ]
                        }
                    },
                    'order': {
                        'timestamp': -1
                    },
                    'start': 0,
                    'limit': 2000
                };
                // 设置查询库
                var libraryB = self.query.libraryB;
                libraryB = libraryB.split(',');
                for(var i = 0; i < libraryB.length; i++) {
                    libraryB[i] = parseInt(libraryB[i]);
                }
                posParameters.condition.repository_id['$in'] = libraryB;
                // 设置姓名
                if(typeof self.query.name !== 'undefined') {
                    posParameters.condition.name = self.query.name;
                }
                // 设置身份
                if(typeof self.query.personId !== 'undefined') {
                    posParameters.condition.person_id = {
                        '$regex': ''
                    };
                    posParameters.condition.person_id['$regex'] = '^' + self.query.personId.substring(0, 6) + '.*';
                }
                // 设置性别
                var sexStatus = true;
                if(typeof self.query.sexM !== 'undefined') {
                    sexStatus = false;
                    posParameters.condition.gender = {
                        '$in': []
                    };
                    posParameters.condition.gender['$in'].push(parseInt(self.query.sexM));
                }
                if(typeof self.query.sexW !== 'undefined') {
                    if(sexStatus) {
                        sexStatus = false;
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexW));
                    }
                }
                if(typeof self.query.sexN !== 'undefined') {
                    if(sexStatus) {
                        posParameters.condition.gender = {
                            '$in': []
                        };
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }else {
                        posParameters.condition.gender['$in'].push(parseInt(self.query.sexN));
                    }
                }
                // 设置年龄
                var myDate = new Date();
                myDate = myDate.getFullYear();
                if(self.minAge !== '' || self.maxAge !== '') {
                    posParameters.condition.born_year = {};
                }
                if(self.minAge !== '') {
                    posParameters.condition.born_year['$lte'] = parseInt(myDate - self.minAge);
                }
                if(self.maxAge !== '') {
                    posParameters.condition.born_year['$gte'] = parseInt(myDate - self.maxAge);
                }
                utils.ajaxPayloadB($, {
                    type: 'post',
                    url: self.server.doubleQuery.api + '/face/v1/framework/face/query',
                    data: posParameters,
                    success: (res) => {
                        if((res.rtn === 0) && (res.total > 0)) {
                            var dataBList = [];
                            var max = self.limt;
                            if(max > res.total) {
                                max = res.total;
                            }
                            for(var y = 0; y < max; y++) {
                                dataBList.push(res.results[y]);
                            }
                            self.dataBinfo = res;
                            self.dataBList = dataBList;
                            self.maxPageB = parseInt(res.total / self.limt);
                        }else {
                            self.dataBinfo = res;
                            self.dataBList = [];
                            self.maxPageB = 1;
                        }
                        self.showStatusB = true;
                    }
                });
            },
            // 获取时间年月日
            getDate(time) {
                if(typeof time !== 'undefined') {
                    time = time + '000';
                    return utils.getDate(time);
                }else {
                    return '';
                }
            },
            // 获取时间时分
            getTime(time) {
                if(typeof time !== 'undefined') {
                    time = time + '000';
                    return utils.getTime(time);
                }else {
                    return '';
                }
            },
            // 格式化百分比
            getSimilarity(similarity) {
                if(typeof similarity !== 'undefined') {
                    return parseFloat(similarity).toFixed(2) + '%';
                }else {
                    return '';
                }
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
            // 引擎过滤
            engineQuery(num) {
                var self = this;
                if(num === 1) {
                    self.limt = 12;
                    self.pageIndexA = 1;
                    self.pageIndexB = 1;
                    self.showType = '1';
                    self.engineChangeA(1);
                    self.engineChangeB(1);
                    self.maxPageA = parseInt(self.dataAinfo.total / 5);
                    self.maxPageB = parseInt(self.dataBinfo.total / 5);
                }else if(num === 2) {
                    self.limt = 24;
                    self.pageIndexA = 1;
                    self.showType = '2';
                    self.engineChangeA(1);
                    self.maxPageA = parseInt(self.dataAinfo.total / 10);
                }else if(num === 3) {
                    self.limt = 24;
                    self.pageIndexB = 1;
                    self.showType = '3';
                    self.engineChangeB(1);
                    self.maxPageB = parseInt(self.dataBinfo.total / 10);
                }
            },
            // B引擎过滤
            pageChange(engine, type) {
                var self = this;
                if(engine === 'A') {
                    var pageIndexA = self.pageIndexA;
                    if(type === 'up') {
                        pageIndexA--;
                        self.engineChangeA(pageIndexA);
                    }else if(type === 'down') {
                        pageIndexA++;
                        self.engineChangeA(pageIndexA);
                    }
                    self.pageIndexA = pageIndexA;
                }else if(engine === 'B') {
                    var pageIndexB = self.pageIndexB;
                    if(type === 'up') {
                        pageIndexB--;
                        self.engineChangeB(pageIndexB);
                    }else if(type === 'down') {
                        pageIndexB++;
                        self.engineChangeB(pageIndexB);
                    }
                    self.pageIndexB = pageIndexB;
                }
            },
            // A引擎过滤
            engineChangeA(page) {
                var self = this,
                    dataAinfo = self.dataAinfo,
                    dataAList = [],
                    max = page * self.limt,
                    min = (page - 1) * self.limt;
                if(max > dataAinfo.total) {
                    max = dataAinfo.total;
                }
                for(min; min < max; min++) {
                    dataAList.push(dataAinfo.results[min]);
                }
                self.dataAList = dataAList;
            },
            // B引擎过滤
            engineChangeB(page) {
                var self = this,
                    dataBinfo = self.dataBinfo,
                    dataBList = [],
                    max = page * self.limt,
                    min = (page - 1) * self.limt;
                if(max > dataBinfo.total) {
                    max = dataBinfo.total;
                }
                for(min; min < max; min++) {
                    dataBList.push(dataBinfo.results[min]);
                }
                self.dataBList = dataBList;
            },
            // 选择性别
            chooseSex(num, sexType) {
                if(this[sexType] === 3) {
                    this[sexType] = num;
                }else {
                    this[sexType] = 3;
                }
            },
            // 获取人像库
            getLibrary() {
                var self = this;
                if(self.query.queryType !== '2') {
                    // B引擎获取人像库
                    var libraryB = self.query.libraryB;
                    libraryB = libraryB.split(',');
                    utils.ajaxPayloadB($, {
                        type: 'get',
                        url: this.server.doubleQuery.api + '/face/v1/framework/face_image/repository/global',
                        success: (res) => {
                            var dataB = [];
                            if(res.rtn === 0) {
                                for(var i = 0; i < res.results.length; i++) {
                                    for(var x = 0; x < libraryB.length; x++) {
                                        if(parseInt(libraryB[x]) === parseInt(res.results[i].id)) {
                                            res.results[i].select = true;
                                        }
                                    }
                                    if(res.results[i].type === 1) {
                                        dataB.push(res.results[i]);
                                    }
                                }
                                this.dataB = dataB;
                            }
                        }
                    });
                }
                if(self.query.queryType !== '3') {
                    // A引擎获取人像库
                    var libraryA = self.query.libraryA;
                    libraryA = libraryA.split(',');
                    utils.ajaxPayloadA($, {
                        type: 'get',
                        url: this.server.query.api + '/face/v1/framework/face_image/repository',
                        // url: this.server.query.api + '/face/v1/framework/face_image/repository/global',
                        success: (res) => {
                            var dataA = [];
                            if(res.rtn === 0) {
                                for(var i = 0; i < res.results.length; i++) {
                                    for(var x = 0; x < libraryA.length; x++) {
                                        if(parseInt(libraryA[x]) === parseInt(res.results[i].id)) {
                                            res.results[i].select = true;
                                        }
                                    }
                                    if(res.results[i].type === 1) {
                                        dataA.push(res.results[i]);
                                    }
                                }
                                this.dataA = dataA;
                            }
                        }
                    });
                }
            },
            // 查询
            submitQuery() {
                var self = this;
                var status = true;
                var ajaxParameters = {};
                var myDate = new Date();
                // self.imgBase = utils.convertBase64(self.server.query.api, res.results[0].picture_uri);
                // 初始化跳转参数
                var redirect = decodeURIComponent(self.$route.query.redirect || '/result');
                var query = {};
                // 判断搜索方式
                query.queryType = self.queryType;
                ajaxParameters.engine_type = self.queryType;
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
                        }
                    });
                    self.$router.push({
                        path: redirect,
                        query: query
                    });
                }
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
                    // A引擎图片上传
                    utils.ajaxPayload($, {
                        type: 'post',
                        url: self.server.query.api + '/face/v1/framework/face_image/repository/picture/synchronized',
                        data: {
                            'picture_image_content_base64': self.imgBase,
                            'options': {
                                'max_faces_allowed': -1
                            }
                        },
                        success: (res) => {
                            if(res.rtn === 0) {
                                self.fileA = res.results[0];
                                self.pictureUri = self.getPictureA(res.results[0].face_image_uri);
                            }else{
                                self.$alert('无法识别该图片', '消息', {
                                    confirmButtonText: '确定'
                                });
                                self.imgBase = '';
                            }
                        }
                    });
                    // B引擎图片上传
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
                            }else{
                                self.imgBase = '';
                            }
                        }
                    });
                };
            },
            // 显示对比结果
            showCompare(showType, showItem) {
                var self = this;
                // 对比左边数据
                var compareUpload = {
                    'name': '未知',
                    'personId': '未知',
                    'sex': '未知',
                    'age': '未知',
                    'library': '未知',
                    'time': '未知',
                    'pictureUri': ''
                };

                if(self.name !== '') {
                    compareUpload.name = self.name;
                }

                if(self.personId !== '') {
                    compareUpload.personId = self.personId;
                }

                if(self.timestamp !== '') {
                    compareUpload.time = self.getDate(self.timestamp) + ' ' + self.getTime(self.timestamp);
                }
                if((self.minAge !== '') && (self.maxAge !== '')) {
                    compareUpload.age = self.minAge + ' 至 ' + self.maxAge;
                }else if(self.minAge !== '') {
                    compareUpload.age = self.minAge;
                }else if(self.maxAge !== '') {
                    compareUpload.age = self.maxAge;
                }

                if(self.pictureUri !== '') {
                    compareUpload.pictureUri = self.pictureUri;
                    compareUpload.library = '上传照片';
                }

                // 对比右边数据
                var compareObj = {
                    'name': '未知',
                    'personId': '未知',
                    'sex': '未知',
                    'age': '未知',
                    'library': '未知',
                    'time': '未知',
                    'pictureUri': ''
                };
                if((showType === 'A') && (showItem.picture_uri !== '')) {
                    compareObj.pictureUri = self.getPictureA(showItem.face_image_uri);
                }else if((showType === 'B') && (showItem.picture_uri !== '')) {
                    compareObj.pictureUri = self.getPictureB(showItem.face_image_uri);
                }

                if(showItem.name !== '') {
                    compareObj.name = showItem.name;
                }

                if(showItem.person_id !== '') {
                    compareObj.personId = showItem.person_id;
                }

                if(showItem.timestamp !== '') {
                    compareObj.time = self.getDate(showItem.timestamp) + ' ' + self.getTime(showItem.timestamp);
                }
                if(showItem.similarity !== '') {
                    compareObj.similarity = self.getSimilarity(showItem.similarity);
                }

                if((showType === 'A') && (showItem.repository_id !== '')) {
                    for(var i = 0; i < self.dataA.length; i++) {
                        if(self.dataA[i].id === showItem.repository_id) {
                            compareObj.library = self.dataA[i].name;
                        }
                    }
                }else if((showType === 'B') && (showItem.repository_id !== '')) {
                    for(var y = 0; y < self.dataB.length; y++) {
                        if(self.dataB[y].id === showItem.repository_id) {
                            compareObj.library = self.dataB[y].name;
                        }
                    }
                }
                self.compareList.showType = showType;
                self.compareList.compareObj = compareObj;
                self.compareList.compareUpload = compareUpload;
                self.compareStatus = true;
            },
            close() {
                this.compareStatus = false;
            },
            // 全选人像库
            choose(type) {
                var self = this;
                if(type === 'A') {
                    for(var i = 0; i < self.dataA.length; i++) {
                        self.dataA[i].select = false;
                        self.dataA[i].select = true;
                    }
                }else {
                    for(var x = 0; x < self.dataB.length; x++) {
                        self.dataB[x].select = false;
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
             // 重置图片
            clearImg() {
                this.imgBase = '';
                this.pictureUri = '';
            }
        },
        components: {
            nvHead,
            nvFooter,
            nvCompare
        }
    };
</script>
