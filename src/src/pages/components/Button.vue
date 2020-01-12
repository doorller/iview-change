<template>
    <button 
        type="button"
        :class="[active ? 'active' : '', disabled ? 'disabled' : '', size, select ? 'select' : '',color]"
        @click="onclick">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: 'Button',
        props: {
            active: {
                type: Boolean,
                default: () => false
            },
            disabled: {
                type: Boolean,
                default: () => false
            },
            size: {
                type: String,
                default: () => 'normal'
            },
            color: {
                type: String,
                default: () => ''
            },
            select: {
                type: Boolean,
                default: () => false
            }
        },
        methods: {
            onclick() {
                if(this.disabled) return
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
    button {
        border: 1px solid #c4cfd4;
        color: #647a92;
        background-color: rgb(231, 237, 241);
        border-radius: 4px;
        padding: 0 15px;
        transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
        white-space:nowrap;
        box-shadow: 1px 2px 2px 0 rgb(241, 244, 247);
    }
    button:hover{
        color: #57a3f3;
        background-color: #fff;
        border-color: #57a3f3;
        box-shadow: 1px 2px 2px 0 rgb(224, 224, 224);
    }
    button.active{
        color: #fff;
        background-color: #2b85e4;
        border-color: #2b85e4
    }
    button.active:hover{
        color: #fff;
        background-color: #57a3f3;
        border-color: #57a3f3
    }
    button.active:active{
        color: #f2f2f2;
        background-color: #2b85e4;
        border-color: #2b85e4
    }
    button:active{
        color: #2b85e4;
        background-color: rgb(221, 239, 250);
        border-color: #2b85e4
    }
    button.disabled,
    button.active.disabled,
    button.red.disabled,
    button.green.disabled,
    button.blue.disabled
    {
        color: #c5c8ce;
        background-color: #f7f7f7;
        border: 1px solid #dcdee2;
        cursor: not-allowed;
        box-shadow: none;
    }
    button.large{
        height: 36px;
        line-height: 34px;
        padding: 0 25px;
        font-size: .16rem;
    }
    button.normal{
        height: 32px;
        line-height: 30px;
        font-size: .16rem;
    }
    button.small{
        height: 24px;
        line-height: 22px;
        padding: 0 5px;
    }
    button.select{
        border-color: #2b85e4;
        color: #2b85e4;
    }
    .red{
        color: rgb(245, 234, 234);
        background: rgb(233, 101, 101);
        border: none;
        box-shadow: 1px 2px 2px 0 rgb(231, 196, 196);
    }
    .green{
        color: rgb(235, 245, 240);
        background: rgb(74, 185, 148);
        border: none;
        box-shadow: 1px 2px 2px 0 rgb(189, 240, 206);
    }
    .blue{
        color: rgb(236, 245, 247);
        background: rgb(82, 157, 219);
        border: none;
        box-shadow: 1px 2px 2px 0 rgb(184, 231, 250);
    }
</style>

