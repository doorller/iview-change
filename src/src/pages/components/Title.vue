<template>
    <div class="title">
        <div
            class="inquireList flex-row"
            :class="inquireListPlace ? inquireListPlace :'left'"
            v-if="inquireList && inquireList.length > 0"
        >
            <div v-for="(item , i ) in inquireList " :key="i" class="flex-row title-td">
                <span
                    v-if="item.title && item.type != 'button'"
                    class="title-span"
                    :style="{width : item.title.length +'em'}"
                >{{item.title}}</span>
                <!-- 输入框 -->
                <Input
                    v-if="item.type == 'input'"
                    placeholder="item.placeholder"
                    limit="item.limit"
                    class="margin-top"
                    :css="item.style"
                    :disabled="item.disabled"
                    @update="upDataFunc(item,$event)"
                />
                <!-- 按钮 -->
                <Button
                    v-else-if="item.type == 'button'"
                    class="margin-top temp-btn"
                    :disabled="item.disabled"
                    @click="upDataFunc(item,$event)"
                    :style="item.style"
                >{{item.title}}</Button>
                <!-- 时间选择框 -->
                <DatePicker
                    v-else-if="item.type == 'datePicker'"
                    class="margin-top"
                    :disabled="item.disabled"
                    :value="item.value"
                    :css="item.style"
                    :type="item.dateType||'date'"
                    @update="upDataFunc(item,$event)"
                />
                <!-- 下拉选择 -->
                <Select
                    v-else-if="item.type == 'select'"
                    :options="item.options"
                    :value="item.value"
                    class="margin-top"
                    :css="item.style"
                    :disabled="item.disabled"
                    @update="upDataFunc(item,$event )"
                />
            </div>
            <Button v-if="hasFindBtn" @click="findFunc" class="margin-top find-btn">查询</Button>
        </div>
        <div class="eventBtnList" :class="eventBtnListPlace ? eventBtnListPlace :'right'">
            <Button
                v-for="(item , i ) in eventBtnList"
                :key="i"
                class="margin-top"
                @click="item.clickFunc( item.arg , i)"
            >{{item.title}}</Button>
        </div>
    </div>
</template>
<script>
/* 
    hasFindBtn // 是否含有查找按钮， 如果没有的话，点击条件列表，即会发送事件
    查询列表
    inquireList: [{
        type: ['select' | 'input' | 'datePicker' | 'button' ], // 该列类型
        placeholder: String,  // 占位符，
        key:'',必填 标识，传入对应的服务端字段 即可
        title : 条件标题
        value : //对应的值，button填，其他不必
        limit : '',//input输入条件，看inputdemo
        disabled : boolean,
        options : [ 
            {
                value: 内容id ,
                label : '内容文本'
            }
        ]
        style: Object
    }]
    inquireListPlace : 'left' | 'center' | 'right' ,查询列表显示位置，左中右 , 默认是左
    // 事件按钮，
    eventBtnList : [{
            title :'string',显示文本
            clickFunc ：'function'点击事件,
            arg:{},执行参数
            disable:'boolean'是否禁用，禁用传true
    }],
    // 事件按钮显示位置
    eventBtnListPlace : 'left' | 'center' | 'right' , 事件按钮显示位置，左中右 默认是右

    事件
    emitInquire ( {
            parameter : 'inquire',//参数：内容
    })
*/
import Select from "./Select";
import Input from "./Input";
import DatePicker from "./DatePicker";
import Button from "./Button";
export default {
    name: "Title",
    props: {
        hasFindBtn: {
            type: Boolean,
            default: () => true
        },
        inquireList: Array,
        inquireListPlace: {
            type: String,
            default: () => "left"
        },
        eventBtnList: Array,
        eventBtnListPlace: {
            type: String,
            default: () => "right"
        }
    },
    components: {
        Select,
        Input,
        DatePicker,
        Button
    },
    data() {
        return {
            inquire: {}
        };
    },
    methods: {
        // 是否显示查询按钮
        isShowFindButton() {
            return this.hasFindBtn || typeof this.hasFindBtn != "boolean";
        },
        // 数据更新函数
        upDataFunc(item, enevt) {
            this.addFindInquire(item, enevt);
            if (this.hasFindBtn) {
                return;
            }
            this.findFunc();
        },
        addFindInquire(item, enevt) {
            if (item.type == "button") {
                this.inquire[item.key] = item.value;
                return;
            }
            this.inquire[item.key] = enevt;
            if (this.inquire[item.key] === undefined) {
                delete this.inquire[item.key];
            }
        },
        // 查询函数
        findFunc() {
            // if( Object.keys(this.inquire).length == 0 ) this.fail();
            this.$emit("inquire-find", this.inquire);
        }
    }
};
</script>
<style>
.left {
    /* left: 0; */
    float: left;
}
.right {
    float: right;
    /* right: 0; */
}
.title {
    width: 100%;
    /* height: 4vw; */
    position: relative;
    /* background: rgba(28, 43, 54,255);
        color: #869fb1; */
    min-width: 620px;
    min-height: 32px;
}

.title .left,
.title .right {
    /* position: absolute; */
    /* top: 0; */
    min-height: 40px;
}
.title .inquireList {
    flex-wrap: wrap;
}
.title .title-td {
    line-height: 46px;
    box-sizing: border-box;
    margin-left: 0.7vw;
}

.title .margin-top {
    margin-left: 0.4vw;
    margin-top: 7px;
}
.title .right .margin-top {
    margin-right: 0.4vw;
}
.title .temp-btn {
    margin-left: 0;
}
.title .find-btn {
    margin-left: 1vw;
}
.title .title-span {
    font-size: 1vw;
}
.eventBtnList {
    padding-bottom: 6px;
}
</style>
