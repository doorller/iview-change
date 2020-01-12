<template>
    <span :class="['v-input', size]" :style="css">
        <input
            :type="type==='password' ? type : 'text'"
            ref="int" :placeholder="holder"
            v-model="val"
            @keyup="update"
            @blur="onblur"
            @keydown.enter="pressEnter"
            :disabled="disabled"
            :autocomplete="autocomplete ? 'on' : 'new-password'"
        />
        <i v-if="icon && !val" :class="['iconfont', icon]"></i>
        <i v-else-if="clearable && val" class="iconfont icon-icon-test" @click="clear"></i>
    </span>
</template>

<script>
    /* 
        Event
            enter: 按下Enter触发
            update: change的时候触发 返回当前输入内容
    */

    export default {
        name: 'Input',
        props: {
            disabled: {
                type: Boolean,
                default: () => false
            },
            type: {// type [text|password]
                type: String,
                default: () => 'text'
            },
            icon: String,
            clearable: {    // 是否可清空
                type: Boolean,
                default: () => false
            },
            size: {     // input 框的大小
                type: String,
                default: () => 'normal'
            },
            limit: {    // v-inputLimit 限制输入的类别
                type: String,
                default: () => ''
            },
            holder: String, // placeholder
            value: [String, Number],
            autocomplete: {
                type: Boolean,
                default: () => false
            },
            css: {
                type: Object
            }
        },
        model: {
            prop: 'value',
            event: 'update'
        },
        data() {
            return {
                val: '',
                regs: {
                    'number': /[^\-?\d.]/g,
                    'p-number': /[^\d.]/g,
                    'integer': /[^\-?\d]/g,
                    'p-integer': /\D/g,
                    'no-zh-cn': /[\u4E00-\u9FA5]*/g,
                    'en-num' : /[\W_]/g
                }
            }
        },
        methods: {
            clear(e) {
                this.val = undefined
                this.$refs.int.focus()
                this.$emit('update', undefined)
            },
            update() {
                this.regs[this.limit] && (this.val = this.val.toString().replace(this.regs[this.limit], ''))
                this.$emit('update', this.val)
            },
            pressEnter() {
                this.$emit('enter', this.val)
            },
            onblur(e) {
                this.regs[this.limit] && (this.val = this.val.toString().replace(this.regs[this.limit], ''))
                this.$emit('blur', this.val)
            }
        },
        mounted() {
            this.value && (this.val = this.value)
        },
        watch: {
            value(val) {
                this.val = val
            }
        }
    }
</script>

<style scoped>
    .v-input{
        display: inline-block;
        width: 2rem;
        max-height: 200px;
        position: relative;
    }
    .large{
        height: 36px;
        line-height: 34px;
    }
    .normal{
        height: 32px;
        line-height: 30px;
    }
    .small{
        height: 24px;
        line-height: 22px;
    }
    .v-input input{
        width: 100%;
        height: 100%;
        outline: none;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        padding: 0 10px;
    }
    .v-input input:disabled{
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }
    .v-input span {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .v-input input:focus{
        border-color:#2d8cf0;
    }
    .v-input i{
        position: absolute;
        right: 10px;
        color: #808695;
    }
    .v-input .icon-icon-test{
        cursor: pointer; 
    }
    .large .iconfont{
        font-size: 20px;
    }
    .normal .iconfont{
        font-size: 18px;
    }
</style>
