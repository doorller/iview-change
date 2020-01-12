<template>
    <div class="vue-modal">
        <transition name="modal-animate">
            <div v-if="show" :style="css"  class="modal-container">
                <div class="modal-header">
                    <i v-if="icon" :class="['iconfont', icon]"></i>
                    <i v-if="!icon && type==='warning'" class="iconfont icon-jinggao1- modal-warning"></i>
                    <i v-else-if="!icon && type==='success'" class="iconfont icon-chenggong- modal-success"></i>
                    <i v-else-if="!icon && type==='error'" class="iconfont icon-cuowuguanbi- modal-error"></i>
                    <i v-else-if="!icon && type==='info'" class="iconfont icon-jinggao- modal-info"></i>
                    <i v-else-if="icon" :class="['iconfont', icon ? icon : '']"></i>
                    <span>{{title}}</span>
                    <i v-if="closeable" @click="close" class="iconfont icon-guanbi"></i>
                </div>
                <div :class="{'modal-body': true, 'modal-visible': visible}">
                    <div class="modal-content" v-html="content"></div>
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button v-if="cancelFn || cancelable" class="cancel" @click="cancel">取消</button>
                    <button class="confirm" @click="confirm">确认</button>
                </div>
            </div>
        </transition>
        <div class="modal-mask" v-if="source===2 && show"></div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'Modal',
        props: {
            title: {    // 弹框标题
                type: String,
                default: () => "温馨提示"
            },
            content: String,    //内容
            icon: String,
            cancelable: {   // 是否显示取消按钮
                type: Boolean,
                default: () => true
            },
            cancelFn:Function,  // 取消需要执行的函数
            confirmFn: Function,    // 确认后需要执行的函数
            closeable: {    // 是否显示取消icon
                type: Boolean,
                default: () => true
            },
            type: { // 弹框的类型 success info warning error
                type: String
            },
            show: {
                type: Boolean,
                default: () => false
            },
            css: { // 设置样式
                type: Object
            },
            source: { // Modal 来源, 组件还是方法调用
                type: Number,
                default: () => 1
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            ...mapActions(['updateShowMask']),
            close() {
                if(this.source === 1) {
                    this.updateShowMask(false)
                    this.$emit('update:show', false)
                }else{
                    document.body.style.overflow = 'visible'
                    this.removeAfterHandle && this.removeAfterHandle()
                }
                this.$emit('close')
            },
            cancel() {
                this.cancelFn && this.cancelFn()
                this.close()
                this.$emit('cancel')
            },
            confirm() {
                if(this.confirmFn && this.confirmFn()){
                    return
                }
                this.close()
                this.$emit('confirm')
            },
        },
        mounted() {
            if(this.show) {
                document.body.style.overflow = 'hidden'
            }
        },
        watch: {
            show(val) {
                if(this.source===1) {
                    this.updateShowMask(val)
                }
            }
        }
    }
</script>

<style scoped>
    /* .modal-animate-enter-to,
    .modal-animate-leave{
        opacity: 1;
    }
    .modal-animate-enter,
    .modal-animate-leave-to{
        opacity: 0;
    }
    .modal-animate-enter-active,
    .modal-animate-leave-active {
        transition: all .2s ease;
    } */
    .modal-mask{
        position: fixed;
        z-index: 20;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55,55,55,.6);
    }
    .vue-modal .modal-container{
        width: 5.2rem;
        position: fixed;
        top: 50%;
        z-index: 21;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 8px;
    }
    .vue-modal .modal-header{
        padding: 14px 16px;
        font-size: 14px;
        color: #17233d;
        text-align: left;
        position: relative;
        border-bottom: 1px solid #e8eaec;
    }
    .vue-modal .modal-header span{
        font-weight: 700;
    }
    .vue-modal .modal-header i:first-child{
        margin-right: 5px;
    }
    .vue-modal .modal-header i:last-child{
        cursor: pointer;
        position: absolute;
        right: 16px;
    }
    .vue-modal .modal-body {
        padding: 16px;
        font-size: 12px;
        line-height: 1.5;
        font-size: 14px;
        color: #515a6e;
        text-align: left;
        word-wrap:break-word;
        max-height: 80vh;
        overflow: scroll;
    }
    .vue-modal .modal-body.modal-visible{
        overflow: visible;
    }
    .vue-modal .modal-body .modal-content{
        word-wrap:break-word;
        text-align: center;
    }
    .vue-modal .modal-footer{
        padding: 12px 18px;
        border-top: 1px solid #e8eaec;
        display: flex;
        justify-content: flex-end;
    }
    .vue-modal .modal-footer button{
        padding: 6px 15px;
        font-size: 14px;
        border-radius: 4px;
        outline: none;
        border-width: 1px;
        border-style: solid;
        border-color: #2d8cf0;
    }
    .vue-modal .modal-footer .cancel{
        border-color: #2d8cf0;
        background: #fff;
        color: #2d8cf0;
    }
    .vue-modal .modal-footer .confirm{
        background-color: #2d8cf0;
        color: #fff;
        margin-left: 8px;
    }
    .vue-modal i{
		margin-right: 5px;
	}
	.vue-modal .modal-success{
		color:#19be6b;
	}
	.vue-modal .modal-warning{
		color: #f90;
	}
	.vue-modal .modal-info{
		color: #2d8cf0;
	}
	.vue-modal .modal-error{
		color: #ed4014;
	}
</style>

