<template>
    <div class="page-header">
        <h3 class="page-title" v-if="!name">{{$route.meta.desc}}<slot name="icon"></slot></h3>
        <h3 class="page-title" v-else>{{name}}<slot name="icon"></slot></h3>
        <ul v-if="showTimeFilter">
            <li>
                <span>快捷选时：</span>
            </li>
            <li v-for="(item, index) in timeFilterArr" :key="index">
                <Button :active="activeIndex===index" @click="update(index)">{{item.name}}</Button>
            </li>
        </ul>
        <slot></slot>
    </div>
</template>

<script>
    import Button from './Button'

    export default {
        name: 'PageHeader',
        props: {
            showTimeFilter: {
                type: Boolean,
                default: () => false
            },
            value: {
                type: String
            },
            startTime: {
                type: String
            },
            endTime: {
                type: String
            },
            name: {
                type: String
            },
            activeName:String
        },
        data() {
           return {
               activeIndex: -1,
               filter: 'today',
               start: '',
               end: '',
               timeFilterArr: [
                    {
                        name: '今天',
                        key: 'today'
                    }, {
                        name: '昨天',
                        key: 'yesterday'
                    }, {
                        name: '最近七天',
                        key: '7days'
                    }, {
                        name: '最近十五天',
                        key: '15days'
                    }
                ]
           }
        },
        methods: {
            update(index) {
                this.activeIndex = index
                this.filter = this.timeFilterArr[index].key
                this.getTimeRange(this.filter, true)
            },
            getTimeRange(type, isUpdate) {
                let date = new Date(),
                    timestamp,
                    day,
                    start,
                    end;

                switch(type) {
                    case 'today':
                        start = end = date
                        break
                    case 'yesterday':
                        start = end = date.setDate(date.getDate() - 1)
                        break
                    case '7days':
                        end = timestamp = new Date(tools.formatDate(new Date())).valueOf()
                        start = timestamp - 3600 * 24 * 1000 * 6
                        break
                    case '15days':
                        end = timestamp = new Date(tools.formatDate(new Date())).valueOf()
                        start = timestamp - 3600 * 24 * 1000 * 14
                        break
                    default:
                }
                this.start = tools.formatDate(start, false)
                this.end = tools.formatDate(end, false)
                if(isUpdate) {
                    this.$emit('update:startTime', this.start)
                    this.$emit('update:endTime', this.end)
                }
            },
            setActIndex(){
                let date = new Date()
                let yestoday_str = tools.formatDate(date.setDate(date.getDate() - 1),false)
                let today_str = tools.formatDate(new Date(),false)
                let start = new Date(this.startTime.replace('-','/')).valueOf()
                let end = new Date(this.endTime.replace('-','/')).valueOf()
                if(start===end && this.endTime==today_str) {
                    this.activeIndex = 0
                } else if (start == end && this.endTime ==yestoday_str) {
                    this.activeIndex = 1
                } else if (end-start == 3600*24*1000*6 && this.endTime==today_str) {
                    this.activeIndex = 2
                } else if (end-start == 3600*24*1000*14 && this.endTime==today_str) {
                    this.activeIndex = 3
                }else {
                    
                }            
            }
        },
        mounted() {
            this.getTimeRange('today', false)
            this.activeIndex = 0
        },
        watch: {
            startTime(val) {
                if(this.start !==  val) {
                    this.start = val
                    this.activeIndex = -1
                }
                this.setActIndex()
            },
            endTime(val) {
                if(this.end !== val) {
                    this.start = val
                    this.activeIndex = -1
                }
                this.setActIndex()
            },
        }
    }
</script>

<style scoped>
    .page-header{
        height: 50px;
        box-sizing: border-box;
        padding: 0 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 2px solid #333;
    }
    .page-header .page-title{
        width: 160px;
        text-align: left;
        font-size: 20px;
    }
    .page-header ul{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .page-header ul li{
        margin-right: 15px;
    }
    .page-header li span{
        font-weight: bold;
    }
    .page-header p{
        line-height: 35px;
    }
</style>

