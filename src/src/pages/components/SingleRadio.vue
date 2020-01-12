<template>
    <label 
        :class="['v-radio', size, disabled ? 'disabled' : '']"
        @click="update"
    >
        <span class="icon">
            <span :class="value === val ? 'active' : ''"></span>
            <input
                type="radio"
                v-model="result"
                :value="val"
                :disabled="disabled"
            />
        </span>
        <span class="item-label" v-if="label">{{label}}</span>
    </label>
</template>

<script>
    export default {
        name: 'Radio',
        props: {
            val: {
                type: [ String, Number ],
                required: true
            },
            label: {
                type: String
            },
            value: {
                type: [String, Number]
            },
            size: {
                type: String,
                default: () => 'normal'
            },
            disabled: {
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
                result:  undefined               
            }
        },
        methods: {
            update() {
                if(this.disabled) return
                this.result = this.val
                this.$emit('update', this.result)
            }
        }
    }
</script>

<style scoped>
    .v-radio {
        display: inline-block;
        cursor: pointer;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 1;
    }
    .v-radio.disabled{
        cursor: not-allowed;
    }
    .v-radio.disabled input{
        cursor: not-allowed;
    }
    .v-radio .icon {
        position: relative;
        display: inline-block;
        cursor: pointer;
        line-height: 1;
        width: 14px;
        height: 14px;
    }
    .v-radio .item-label{
        margin-left: 5px;
    }
    .v-radio .icon span{
        display: inline-block;
        width: 14px;
        height: 14px;
        position: relative;
        background-color: #fff;
        border: 1px solid #dcdee2;
        border-radius: 50%;
        transition: all .2s ease-in-out;
        box-sizing: border-box;
    }
    .v-radio.large .icon,
    .v-radio.large .icon span{
        width: 16px;
        height: 16px;
    }
    .v-radio.small .icon
    .v-radio.small .icon span{
        width: 12px;
        height: 12px;
    }
    .v-radio .icon span.active{
        border-color: #2d8cf0;
        background-color: #fff;
    }
    .v-radio .icon span.active:after{
        content: "";
        display: table;
        width: 8px;
        height: 8px;
        position: absolute;
        right: 2px;
        top: 2px;
        border-radius: 50%;
        background-color: #2d8cf0;
    }
    .v-radio input{
        width: 0;
        height: 0;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        margin: 0;
        padding: 0;
        cursor: pointer;
    }
    .v-radio.large .icon span.active:after{
        width: 10px;
        height: 10px;
    }
    .v-radio.small .icon span.active:after {
        top: 1px;
        left: 1px;
    }
</style>
