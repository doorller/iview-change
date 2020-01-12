<template>
    <!-- <transition name="act"> -->
        <div class="v-table" v-show="show">
            <div :class="[loading?'loading':'']"></div>
            <table>      
                <thead>
                    <tr>
                        <th v-for="(column, index) in columns"
                            :key="index"
                            class="center"
                            :style="{'width': typeof column.width === 'number' ? column.width  + 'px' : column.width}"
                        >
                            <div>
                                <Checkbox
                                    @update="selectAll"
                                    v-if="column.type==='selection'"
                                    v-model="isAllSelected"
                                />
                                <span v-else>{{column.title}}
                                    <span @click="changeSort(column.key)" class="pointer" v-if="column.sortable">
                                        <i v-if="sortKey===column.key && sortType==='asc'"
                                            class="iconfont icon-paixu-shengxu">
                                        </i>
                                        <i v-else-if="sortKey===column.key && sortType==='desc'"
                                            class="iconfont icon-paixu-jiangxu">
                                        </i>
                                        <i v-else class="iconfont icon-paixu unsort"></i>
                                    </span>
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!data.length">
                        <td colspan="100">暂无数据</td>
                    </tr>
                    <tr v-for="(item, index) in data" :key="index">
                        <td @click="onclick(index)" 
                            v-for="(column, i) in columns" :key="i" 
                            :class="[
                                column.align ? column.align: 'center' || '',
                                column.ellipsis ? 'ellipsis' : '',
                                column.render ? 'table-render' : '',
                                column.column ? 'direction-column' : ''
                            ]"
                        >
                            <Checkbox
                                @update="select(index)"
                                v-if="column.type==='selection'"
                                v-model="result[index]"
                            />
                            <TableRender
                                v-if="column.render"
                                :column="column"
                                :render="column.render"
                                :row="item"
                                :index="index"
                            />
                            <!-- 如果需要格式显示，格式化后显示 -->
                            <span v-else-if="column.formatNumber" v-formatNumber="item[column.key]"></span>
                            <span v-else :title="column.ellipsis ? item[column.key] : ''">{{item[column.key]}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>          
        </div>
    <!-- </transition> -->
</template>

<script>
/* 
    columns: [{
        type: ['selection' | 'index'], // 该列类型
        title: String,  // 表头的中文描述
        key: String, //展示的数据的key
        width: Num, // 该列的宽度
        align: ['center' | 'left' | 'right'], // 对齐方式 默认居中
        ellipsis: Boolean,  // 是否超出隐藏,
        style: Object
    }]

    事件
        select: 单选触发    返回当前选中的值
        selectAll: 全选触发 返回当前选中的项目
        click: 点击第几项   返回下标
*/
import TableRender from './TableRender.js' 
import Checkbox from './Checkbox'

export default {
    name: 'Table',
    components: {
        TableRender,
        Checkbox
    },
    props: {
        columns:  Array,
        data:  Array,
        pageSize: Number,
        pageNo: Number,
        sortMethod: { // false 前端排序，true 后端排序
            type: Boolean,
            default: false
        },
        loading: Boolean
    },
    data() {
        return {
            show: true,
            showIndex: false,
            showSelection: false,
            isAllSelected: false,
            result: {},
            sortKey: '',
            sortType: 'desc', // desc 降序, asc 升序
        }
    },
    mounted(){
        this.columns.every(item => {
            if(item.sortable && item.sortType) {
                this.sortType = item.sortType
                this.sortKey = item.key
            }
            return (!item.sortable || !item.sortType)
        })
    },
    methods: {
        select(index) {
            let arr = [],
                count = 0; 
            for(let key in this.result) {
                if(this.result[key]) {
                    arr.push(this.data[key])
                    count++
                }
            }
            this.isAllSelected = count === this.data.length ? true : false
            this.$emit('select', arr, this.data[index])
        },
        selectAll() {
            if(this.isAllSelected) {
                this.data.forEach((item, index) => {
                    this.$set(this.result, index, true)
                })
                this.$emit('select-all', this.data)
            }else{
                this.$set(this, 'result', {})
                this.$emit('select-all', [])
            }
        },
        changeSort(key) {
            if(key != this.sortKey) {
                this.sortKey = key
                this.sortType = 'desc'
            }else{
                this.sortType = this.sortType === 'asc' ? 'desc' : 'asc'
            }

            this.sortMethod ? this.$emit('sort', this.sortType, this.sortKey) : this.data.sort(tools.compare(key, this.sortType, this.data))
        },
        onclick(index) {
            this.$emit('click', index)
        }
    },
    watch: {
        data() {
            this.$set(this, 'result', {})
            this.show=false
            setTimeout( ()=>{
                this.show = true
            },100)
        }
    }
}
</script>

<style scoped>
    .v-table{
        position: relative;
        width: 100%;
        overflow-x: scroll;
        box-sizing: border-box;
    }
    table{
        min-width: 100%;
        table-layout:fixed;
        margin-bottom: 15px;
    }
    thead{
        background-color: #F5F5F6;
    }
    thead>tr th>div{
        margin: 0 auto;
    }
    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    tbody tr:hover{
        background-color: #f5f5f5;
    }
    td, th{
        border: 1px solid #e7eaec;
        padding: 8px;
        box-sizing: border-box;
        white-space:nowrap;
    }
    input{
        vertical-align: middle;
    }
    th.center,
    td.center{
        text-align: center;
        float: none;
    }
    th.left,
    td.left{
        text-align: left;
        float: none;
    }
    th.right,
    td.right{
        text-align: right;
        float: none;
    }
    td.left>div{
        justify-content: flex-start;
    }
    .ellipsis{
        position: relative;
    }
    .ellipsis span{
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 10px;
    }
    .unsort{
        color: rgba(50, 50, 50, 0.5);
    }
    .table-render>div{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .table-render.direction-column>div{
        flex-direction: column;
    }
    .v-table table a{
        color: #2b85e4;
        text-decoration: underline;
    }
</style>
