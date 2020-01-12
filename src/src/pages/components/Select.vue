<template>
    <div class="v-select" :style="css" v-clickoutside="closeSections">
        <div
            :class="['val-box', isShow ? 'val-box-active' : '']"
            @click.stop="showOptions"
            @mouseover="updateClearState(true)"
            @mouseout="updateClearState(false)"
        >
            <input v-model="selectedValue" type="hidden">
            <span>{{selectedLabel || '&nbsp;&nbsp;&nbsp;'}}</span>
            <i  v-if="clearable && isClear"
                @click.stop="clear"
                class="iconfont icon-icon-test"
            ></i>
            <i v-else :class="['iconfont', 'icon-xia', isShow ? 'icon-rotate' : '']"></i>
        </div>
        <transition name="upfold">
            <ul :class="['sections', sectionsDir]"
                v-show="isShow"
                ref="sections"
            >
                <li
                    v-for="(item, index) in optionsList"
                    :key="index"
                    :class="[selectedValue===item.value ? 'active' : '']"
                    @click="select(item, index)"
                >{{item.label}}</li>
            </ul>
        </transition>
    </div>
</template>

<script>
    /* 
        evnet
            update: 数据改变触发 返回(value, item)

        可绑定 v-model
     */
    export default {
        name: 'Select',
        props: {
            options: {  // 可选选项
                type: [Array, Object]
            },
            css: Object, // 自定义css
            value: [Number, String],  // 默认值
            clearable: {  // 是否可清空
                type: Boolean,
                default: () => false
            }
        },
        model: {
            prop: 'value',
            event: 'update'
        },
        data() {
            return {
                optionsList: {},
                selectedValue: '',
                selectedLabel: '',
                index: 0,
                isShow: false,
                isClear: false,
                sectionsDir: 'bottom-upfold'
            }
        },
        methods: {
            showOptions(e) {
                this.isShow = !this.isShow
                if(this.isShow) {
                    let y = document.body.offsetHeight - e.target.getBoundingClientRect().bottom,
                        len;
                    len = Object.keys(this.optionsList).length
                    len = len > 7 ? 7 : len
                    this.sectionsDir = y < 30*len ? 'top-upfold' : 'bottom-upfold'
                }
            },
            select(item, index) {
                this.isShow = false
                if(item.value === this.selectedValue) return
                this.selectedValue = item.value
                this.selectedLabel = item.label
                this.$emit('update', item.value, {label: item.label, value: item.value}, index)
            },
            clear() {
                this.selectedValue = ''
                this.selectedLabel = ''
                this.$emit('update', undefined, undefined)
            },
            closeSections() {
                this.isShow = false
            },
            updateClearState(bool) {
                this.isClear = bool
            },
            focusActive(value) {
                this.selectedValue = value
                this.optionsList.some(item => {
                    if(item.value === value) {
                        this.selectedLabel = item.label
                    }
                    return item.value === value
                })
            },
            initOptionsList(obj) {
                 let arr = []
                for(let key in obj) {
                    arr.push({
                        label: obj[key],
                        value: key
                    })
                }
                this.optionsList = arr
                this.focusActive(this.value)
            }
        },
        mounted() {
            if(this.options instanceof Array) {
                this.optionsList = this.options
                this.focusActive(this.value)
            }else if(this.options instanceof Object) {
                this.selectedValue = this.value
                this.selectedLabel = this.options[this.value]
                this.initOptionsList(this.options)
            }
        },
        watch: {
            value(val) {
                this.focusActive(val)
            },
            options(val) {
                if(val instanceof Array) {
                    this.optionsList = val
                    this.focusActive(this.value)
                }else if(val instanceof Object) {
                    this.initOptionsList(val)
                }
            }
        }
    }
</script>

<style>
    .v-select{
        max-width: 200px;
        position: relative;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    .val-box{
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        cursor: pointer;
    }
    .val-box>span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .val-box:hover{
        border-color: #57a3f3;
    }
    .val-box:hover>span{
        color: #57a3f3;
    }
    .v-select .val-box-active{
        border-color: #57a3f3;
    }
    .v-select .val-box-active>span{
        color: #57a3f3;
    }
    .val-box .icon-icon-test{
        display: none;
        cursor: pointer;
    }
    .val-box .icon-rotate {
        transform: rotate(180deg);
    }
    .val-box:hover .icon-icon-test{
        display: inline-block;
    }
    .val-box i{
        display: inline-block;
        margin: 0 10px;
        transition: all .2s ease;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
    .val-box span{
        display: inline-block;
        width:100%;
        height: 100%;
        text-align: left;
        text-indent: 10px;
    }
    .upfold-enter,
    .upfold-leave-active{
        opacity: 0;
    }
    .upfold-enter-active,
    .upfold-leave-active{
        transition: all .2s ease-in-out;
    }
    .sections {
        min-width: 100%;
        max-height: 180px;
        position: absolute;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        border-radius: 4px;
        background-color: #fff;
        overflow-y: scroll;
        margin: 0!important;
        z-index: 3;
    }
    .bottom-upfold{
        bottom: -5px;
        transform: translateY(100%);
    }
    .top-upfold{
        top: -5px;
        transform: translateY(-100%);
    }
    .sections li{
        width: 100%;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: left;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
    }
    .sections .active{
        background-color: rgb(243, 243, 243);
        color: #2d8cf0;
    }
    .sections li:hover{
        background-color: rgb(243, 243, 243);
    }
</style>


