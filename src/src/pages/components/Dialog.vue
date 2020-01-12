<template>
    <div class="dialog" v-if="status">
        <div class="dialog-mask" v-if="inner"></div>
        <div class="dialog-container">
            <div class="dialog-title" v-if="title">
                <span>
                    <span v-for="(item, index) in title" :key="index">{{index > 0 ? '&nbsp;/&nbsp;' + item : item}}</span>
                </span>
                <span>
                    <i @click="close" class="iconfont icon-guanbi"></i>
                </span>
            </div>
            <div class="dialog-content" :style="style">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: 'Dialog',
        props: {
            title: {
                type: Array
            },
            status: {
                type: [Boolean, Number, String],
                default: () => 0
            },
            inner: {
                type: Boolean,
                default: () => false
            },
            css: {
                type: Object,
                default:() => {}
            }
        },
        data() {
            return {
                style: {
                    'maxHeight': '80vh'
                }
            }
        },
        methods: {
            ...mapActions(['updateShowMask']),
            close() {
                let backStatus,
                    type = typeof this.status;
                switch(type) {
                    case 'string':
                        backStatus = ''
                        break
                    case 'number':
                        backStatus = 0
                        break
                    case 'boolean':
                        backStatus = false
                        break
                    default:
                }
                this.$emit('close')
                this.$emit('update:status', backStatus)
                !this.inner && this.updateShowMask(false)
            }
        },
        mounted() {
            this.style = Object.assign(this.style, this.css)
        },
        watch: {
            status(newVal) {
                if(!newVal && !this.inner){
                     this.updateShowMask(false)
                }else{
                    this.updateShowMask(true)
                }
            }
        }
    }
</script>

<style scoped>
    .dialog{
        /* position: absolute; */
    }
    .dialog-container{
        width: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 6px;
        z-index: 6;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        overflow: hidden;
    }
    .dialog-mask{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55,55,55,.6);
        border-radius: 6px;
    }
    .dialog .dialog-title{
        padding: .2rem .2rem .1rem .4rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: rgb(153, 153, 153);
        font-size: .18rem;
    }
    .dialog .dialog-title>span:first-child{
        padding-right: 20px;
    }
    .dialog .dialog-title i{
        font-size: 16px;
        cursor: pointer;
    }
    .dialog .dialog-title i:hover{
        color: #19a9d5;
    }
    .dialog .dialog-content{
        font-size: .16rem;
        padding: .2rem .2rem 0;
        color: #2c3e50;
        overflow: scroll;
    }
</style>
