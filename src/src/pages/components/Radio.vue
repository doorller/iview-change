<template>
    <div :class="['v-radio', arrange=='row'?'flex-row':'flex-col' ,]" :value="value"  >
        <div v-for="(item ,i) in options" :key="i" class="option flex-row align-items-center">
            <span
                class="icon"
                :class="[val == item.val && (!disabled) ?'active':'',disabled ? 'disabled' : '']"
            >
                <input
                    type="radio"
                    :name="radio_key"
                    @change="update(item.val)"
                    :disabled="disabled"
                    :id="bindLabel?radio_key+item.val:''"
                >
            </span>
            <label v-if="item.label" :for="bindLabel?radio_key+item.val:''">{{item.label}}</label>
        </div>
    </div>
</template>
<script>
/**
 * value  默认值
 * disabled 是否可选
 * arrange 排列方式 array  row 行，rank列
 * radio_key : 字段
 * options 选项
 * options.label 描述文字
 * options.val 选项的值
 */
export default {
    name: "Radio",
    props: {
        value: {
            default: () => null
        },
        disabled: {
            type: Boolean,
            default: () => false
        },
        radio_key: {
            type: String,
            default: () => "radio"
        },
        arrange: {
            type: String,
            default: () => "row" //rank
        },
        options: {
            type: Array
        },
        bindLabel: {
            type: Boolean,
            default: () => false
        }
    },
    model: {
        prop: "value",
        event: "update"
    },
    data() {
        return {
            val: null
        };
    },
    methods: {
        update(val) {
            this.val = val;
            this.$emit("update", this.val);
        }
    },
    mounted() {
        if (this.value === null) {
            this.val = this.options[0].val;
        }
        if( this.value ) this.val = this.value;
    }
};
</script>

<style scoped>
.v-radio {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    min-height: 32px;
}
.v-radio .option {
    position: relative;
    margin-right: 1vw
}
.v-radio .option input[type="radio"] {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
}
.v-radio .option label {
position: relative;
    top: -1px;
    margin: 0 0.5vw 0 0;
    line-height: 32px;
}
.v-radio .option .icon {
    position: relative;
    width: 14px;
    height: 14px;
    margin-right: 0.3vw;
    box-sizing: border-box;
    background: #fff;
    border-radius: 50;
    border: 1px solid #000;
    display: inline-block;
    border-radius: 50%;
    position: relative;
}
.v-radio .option .icon.disabled {
    border: 1px solid rgb(146, 146, 146);
}
.v-radio .option .icon.active {
    border: 1px solid #2b85e4;
}
.v-radio .option .icon.active::after {
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 3px;
    border: 1px solid #2b85e4;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1);
    transform: rotate(45deg) scale(1);
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
}
</style>
