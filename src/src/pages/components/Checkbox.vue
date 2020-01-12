<template>
    <label :class="['v-checkbox', size, disabled ? 'disabled' : '']">
        <span class="icon">
            <span :class="result ? 'active' : ''"></span>
            <input type="checkbox" v-model="result" @change="update" :disabled="disabled">
        </span>
        <span class="item-label" v-if="label">{{label}}</span>
    </label>
</template>

<script>
    export default {
        name: 'Checkbox',
        props: {
            value: {
                type: [Boolean, String, Number],
                default: false
            },
            label: {
                type: String
            },
            size: {
                type: String,
                default: () => 'normal'
            },
            disabled: {
                type: Boolean,
                default: () => false
            },
            val: {
                type: [Boolean, String, Number],
                default: true
            }
        },
        model: {
            prop: 'value',
            event: 'update'
        },
        data() {
            return {
                result: false,
                trueVal: undefined,
                falseVal: undefined
            }
        },
        methods: {
            update() {
                this.$emit('update', this.result ? this.trueVal : this.falseVal)
            }
        },
        mounted() {
            this.result = !!this.value
            this.trueVal = this.val
            switch(typeof this.val) {
                case 'boolean':
                    this.falseVal = false
                    break
                case 'string':
                    this.falseVal = ''
                    break
                case 'number':
                    this.falseVal = 0
                    break
                default:
            }
        },
        watch: {
            value(val) {
                if(val !== this.falseVal && val !== this.trueVal) {
                    this.result = false
                }else{
                    this.result = val
                }
            }
        }
    }
</script>

<style scoped>
    .v-checkbox {
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
        justify-content: center;
        align-items: center;
        line-height: 1;
    }
    .v-checkbox.disabled{
        cursor: not-allowed;
    }
    .v-checkbox.disabled input{
        cursor: not-allowed;
    }
    .v-checkbox .icon {
        position: relative;
        display: inline-block;
        cursor: pointer;
        width: 14px;
        height: 14px;
    }
    .v-checkbox .item-label{
        margin-left: 5px;
    }
    .v-checkbox .icon span{
        display: inline-block;
        width: 14px;
        height: 14px;
        box-sizing: border-box;
        border: 1px solid #dcdee2;
        border-radius: 2px;
        position: relative;
        transition: all .2s ease-in-out;
    }
    .v-checkbox.large .icon,
    .v-checkbox.large .icon span{
        width: 16px;
        height: 16px;
    }
    .v-checkbox.small .icon,
    .v-checkbox.small .icon span{
        width: 12px;
        height: 12px;
    }
    .v-checkbox .icon span.active{
        border-color: #2d8cf0;
        background-color: #2d8cf0;
    }
    .v-checkbox .icon span.active:after{
        content: "";
        display: table;
        width: 4px;
        height: 8px;
        position: absolute;
        top: 1px;
        left: 4px;
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
        -webkit-transform: rotate(45deg) scale(1);
        transform: rotate(45deg) scale(1);
        transition: all .2s ease-in-out;
        box-sizing: border-box;
    }
    .v-checkbox input{
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
    .v-checkbox.large .icon span.active:after{
        width: 5px;
        height: 9px;
    }
    .v-checkbox.small .icon span.active:after {
        top: 0px;
        left: 3px;
    }
</style>
