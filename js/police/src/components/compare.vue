<template>
    <div class="compare-dialog">
        <div class="compare-content">
            <div class="compare-header">
                <h4 class="compare-title">详细信息</h4>
                <button type="button" class="close" @click="myClose"><span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="compare-body">
                <div class="integrate-panel">
                    <div class="compare-left">
                        <div class="compare-img">
                            <div class="compare-similarity">
                                <p>相似度{{compareList.compareObj.similarity}}</p>
                            </div>
                            <br />
                            <div class="compare-left compare-upload">
                                <div>
                                    <div class="canvas-image" @click="lookUpload">
                                        <img v-if="compareList.compareUpload.pictureUri!==''" :src="compareList.compareUpload.pictureUri" />
                                    </div>
                                    <p>姓名:{{compareList.compareUpload.name}}</p>
                                    <p>来源:{{compareList.compareUpload.library}}</p>
                                    <p>年龄:{{compareList.compareUpload.age}}</p>
                                    <p>性别:{{compareList.compareUpload.sex}}</p>
                                    <p>时间:{{compareList.compareUpload.time}}</p>
                                    <p>身份证号:{{compareList.compareUpload.personId}}</p>
                                </div>
                            </div>
                            <div class="compare-right compare-obj">
                                <div>
                                    <div class="canvas-image" @click="lookObj">
                                        <img v-if="compareList.compareObj.pictureUri!==''" :src="compareList.compareObj.pictureUri" />
                                    </div>
                                    <p>姓名:{{compareList.compareObj.name}}</p>
                                    <p>来源:{{compareList.compareObj.library}}</p>
                                    <p>年龄:{{compareList.compareObj.age}}</p>
                                    <p>性别:{{compareList.compareObj.sex}}</p>
                                    <p>时间:{{compareList.compareObj.time}}</p>
                                    <p v-if="compareList.showType==='A'">身份证号:{{compareList.compareObj.personId}}</p>
                                    <p v-else>身份证号:{{personId}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="compare-right">
                        <div class="compare-focu">
                            <img v-if="pictureUri!==''" :src="pictureUri">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '../libs/utils.js';
    import $ from 'webpack-zepto';

    export default {
        props: ['close', 'compareList'],
        data() {
            return {
                server: utils.getServer(), // 请求信息
                'pictureUri': this.compareList.compareUpload.pictureUri,
                'personId': ''
            };
        },
        created() {
            var self = this;
            self.getPersonId(self.compareList.compareObj.personId);
        },
        methods: {
            lookUpload() {
                this.pictureUri = this.compareList.compareUpload.pictureUri;
            },
            lookObj() {
                this.pictureUri = this.compareList.compareObj.pictureUri;
            },
            myClose() {
                this.close();
            },
            getPersonId(personId) {
                var self = this;
                if((typeof personId !== 'undefined') && (personId !== '') && (self.compareList.showType === 'B')) {
                    utils.ajaxPayloadB($, {
                        type: 'get',
                        url: self.server.personId + '/face/id/decryption?ryid=' + personId,
                        success: (res) => {
                            if(res.status === 'success') {
                                self.personId = res.data.SFZH;
                            }
                        },
                        error: (res) => {

                        }
                    });
                }
            }
        }
    };
</script>
