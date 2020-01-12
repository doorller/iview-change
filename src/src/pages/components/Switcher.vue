<template>
    <div
        @click="update" 
        :class="['v-switch', size, switchValue ? 'v-switch-active' : '',  disabled ? 'disabled' : '']">
            <div>
                <span :class="[switchValue ? 'active' : 'normal']"></span>
            </div>
    </div>
</template>

<script>
    export default {
        name: 'Switcher',
        props: {
            size: {
                type: String,
                default: () => 'normal'
            },
            value: {
                type: Boolean,
                default: () => false
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
                switchValue: false
            }
        },
        methods: {
            update() {
                if(this.disabled) return
                this.switchValue = !this.switchValue
                this.$emit('update', this.switchValue)
            }
        },
        mounted() {
            this.switchValue = this.value
        },
        watch: {
            value(val) {
                this.switchValue = val
            }
        }
    }
</script>

<style scoped>
    .v-switch{
        background-color: #ccc;
        cursor: pointer;
        box-sizing: border-box;
        padding: 1px;
        transition: all ease-in-out .2s;
    }
    .v-switch-active {
        background-color: #2d8cf0;
    }
    .v-switch>div{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .disabled{
        cursor: not-allowed;
    }
    .v-switch span{
        display: block;
        position: absolute;
        background-color: #fff;
        transition: all ease-in-out .2s;
    }
    .v-switch .normal{
        left: 0;
    }
    .v-switch .active{
        right: 0;
    }
    .v-switch:active span{
        width: 60%;
    }
    .large{
        width: 56px;
        height: 22px;
        border-radius: 16px;
    }
    .normal{
        width: 44px;
        height: 22px;
        border-radius: 16px;
    }
    .small{
        width: 28px;
        height: 16px;
        border-radius: 8px;
    }
    .large span,
    .normal span{
        width: 20px;
        height: 20px;
        border-radius: 10px;
    }
    .small span{
        width: 14px;
        height: 14px;
        border-radius: 7px;
    }
</style>

