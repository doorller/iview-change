<template>
    <div class="v-upload" :style="css">
        <div>
            <input @change="change" :value="fileData" v-if="count===1" type="file" :accept="acceptFileType" class="v-upload-input test" ref="upload-input">
            <input @change="change" :value="fileData" v-else type="file" multiple="multiple" :accept="acceptFileType" class="v-upload-input" ref="upload-input">
            <button type="button" @click="chooseFile">
                <i class="iconfont icon-shangchuan"></i>
                <span>上传文件</span>
            </button>
        </div>
        <ul v-if="showRecord && uploadFilesCompleted.length">
            <li v-for="(file, index) in uploadFilesCompleted" :key="index">
                <span>{{file}}</span>
                <i @click="removeRecord" class="iconfont icon-guanbi"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Upload',
        props: {
            type: String, // 文件类型 img | excel
            count: {
                type: Number,
                default: () => 1
            },
            css: Object,
            size: { // 图片的大小限制， 默认500kb
                type: Number,
                default: () => 500
            },
            bigness: { // 图片尺寸大小
                type: String
            },
            showRecord: {
                type: Boolean,
                default: () => true
            }
        },
        data() {
            return {
                acceptFileType: '*',
                uploadFilesCompleted: [],
                fileData: ''
            }
        },
        methods: {
            chooseFile() {
               this.$refs['upload-input'].click()
            },
            change(e) {
                let files = e.target.files,
                    self = this;

                if(!files[0]) return

                if(files.length > this.count) {
                    this.$modal.warning(`最多上传 ${this.count} 个，请重新选择`)
                    return
                }

                if(self.count === 1) {
                    let file = files[0]

                    if(!this.checkFile(file)) return

                    let reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onerror = function(e) {
                        self.$toast.error('文件读取失败，请重新尝试')
                        self.$emit('error')
                    }
                    reader.onload = function() {
                        // 验证文件的宽和高
                        if(self.type==='img' && self.bigness) {
                            self.checkImgSize(this.result)
                            .then(data => {
                                let arr = self.bigness.split('*'),
                                    width = parseInt(arr[0]),
                                    height = parseInt(arr[1]);
                                if(data.width > width || data.height > height) {
                                    self.$modal(`图片尺寸不符合${self.bigness}的要求，请重新选择`)
                                }else{
                                    self.uploadFilesCompleted = [file.name]
                                    self.$emit('load', this.result)
                                }
                            })
                            .catch(err => {
                                self.$modal('图片读取失败，请重新导入')
                                self.$emit('error')
                            })
                        } else {
                            self.uploadFilesCompleted = [file.name]
                            self.$emit('load', this.result)
                        }
                    }
                }else{
                    // 待补充多文件上传
                    return
                }
            },
            removeRecord(index) {
                this.uploadFilesCompleted.splice(index, 1)
                this.fileData = ''
            },
            checkFile(file) {
                let format = file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase()
                if(this.type=== 'img' && this.size && file.size > this.size * 1024) {
                    this.$modal.warning('文件不能大于' + this.size + 'kb')
                    return false
                }else if(this.type==='excel' && format !="xls" && format !="xlsx") {
                    this.$modal.warning('请选择xls、xlsx格式的文件上传')
                    return false
                }else if(this.type==='img' && format !="jpg" && format !="png") {
                    this.$modal.warning('请选择(jpg,png)格式文件上传')
                    return false
                }
                return true
            },
            checkImgSize(dataUrl) {
                return new Promise((resolve, reject) => {
                    let img = new Image()
                    img.src = dataUrl
                    img.onload = function() {
                        resolve({
                            width: this.width,
                            height: this.height
                        })
                    }
                    img.onerror = function() {
                        reject('Could not load image！')
                    }
                })
            }
        },
        mounted() {
            switch(this.type) {
                case 'img':
                    this.acceptFileType = 'image/png,image/jpg'
                    break
                case 'excel':
                    this.acceptFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    break
                default:
            }
        }
    }
</script>

<style scoped>
    .v-upload{
        width: 160px;
    }
    .v-upload>div{
        width: 100%;
    }
    .v-upload .v-upload-input{
        display: none;
    }
    .v-upload button{
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        border: 1px solid rgb(220, 222, 226);
        border-radius: 4px;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        line-height: 30px;
        outline: none;
    }
    .v-upload button:hover{
        border-color: #2d8cf0;
        color: #2d8cf0;
    }
    .v-upload ul{
        margin-top: 5px;
        width: 100%;
    }
    .v-upload ul li{
        padding: 4px;
        color: #515a6e;
        border-radius: 4px;
        line-height: 18px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
    }
    .v-upload ul li span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        word-break: break-all;
        word-wrap:break-word;
        width: 80%;
        text-align: left;
    }
    .v-upload ul li i{
        font-size: 13px;
        cursor: pointer;
    }
    .v-upload ul li:hover {
        color: #2d8cf0;
        background-color:rgb(238, 238, 238);
    }
</style>

