<template>
    <div class="v-tooltip" @mouseenter="onmouseover" @mouseleave="onmouseleave">
        <slot></slot>
        <transition name="fade">
            <span v-show="isShow" :class="[position, maxWidth ? 'word-wrap' : '']" :style="{width: maxWidth+'px'}">
                <slot name="content"></slot>
                {{content}}
            </span>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'Tooltip',
        props: {
            content: String,
            icon: String,
            position: {
                type: String,
                default: 'bottom'
            },
            maxWidth: {
                type: [Number, String],
            }
        },
        data() {
            return {
                isShow: false
            }
        },
        methods: {
            onmouseover() {
                this.isShow = true
            },
            onmouseleave() {
                this.isShow = false
            }
        }
    }
</script>

<style scoped>
    .fade-enter,
    .fade-leave-to{
        opacity: 0;
    }
    .fade-leave,
    .fade-enter-to{
        opacity: 1;
    }
    .fade-enter-active,
    .fade-leave-active{
        transition: opacity .2s ease-in-out;
    }
    .v-tooltip{
        position: relative;
        display: inline-block;
        padding: 0;
    }
    .v-tooltip span{
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #fff;
        position: absolute;
        white-space: nowrap;
        line-height: 1.5;
        font-weight: normal;
        z-index: 10;
        border-color: hsla(0,0%,85%,.5);
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    }
    .v-tooltip span:after{
        content: "";
        width: 0;
        height: 0;
        display: inline-block;
        border-width: 20px 6px 6px 6px;
        border-style: solid;
        position: absolute;
    }
    .v-tooltip span.word-wrap{
        white-space: normal;
    }
    .v-tooltip span.bottom{
        top: 12px;
        left: 50%;
        margin-top: 100%;
        transform: translateX(-50%);
    }
    .v-tooltip span.bottom:after{
        top: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        border-color:  transparent  transparent hsla(0,0%,85%,.5) transparent;
    }
</style>