<template>
    <div>
        <PageHeader
            showTimeFilter
            :name="'返利记录'"
            :startTime.sync="searchItems.start_date"
            :endTime.sync="searchItems.end_date"
        />
        <div class="page-content">
            <div class="search-items">
                <div>
                    <label>开始</label>
                    <DatePicker v-model="searchItems.start_date" :clearable="false"/>
                </div>
                <div class="end-time">
                    <label>结束</label>
                    <DatePicker v-model="searchItems.end_date" :clearable="false"/>
                </div>
                <div>
                    <label>ID</label>
                    <Input limit="en-num" v-model="searchItems.acc_id"/>
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <transition name="upfold">
                <ul class="levels-catche" v-show="levelsCatche.length">
                    <li v-for="(value, index) in levelsCatche" :key="index">
                        <a href="javascript:;" @click="searchChild(value)">{{value}}</a>
                        <span>&nbsp;&nbsp;的下级明细></span>
                    </li>
                </ul>
            </transition>
            <Table :columns="columns" :data="list" :loading="loading"/>
            <div class="table-pages">
                <Page
                    @updateSize="updatePageSize"
                    @updateNo="updatePageNo"
                    :total="total"
                    :pageSize.sync="pageSize"
                    :pageNo.sync="pageNo"
                />
            </div>
        </div>
        <div class="statistics-data bg-pink">
            <p>小计: </p>
            <ul>
                <li>盈亏：<span v-formatNumber="subtotal.PageCount"></span></li>
                <li>下注额：<span v-formatNumber="subtotal.PageStake"></span></li>
                <li>税收: <span v-formatNumber="subtotal.PageRevenue"></span></li>
                <li>返利：<span v-formatNumber="subtotal.Pagerebate"></span></li>
            </ul>
        </div>
        <div class="statistics-data">
            <p>总计: </p>
            <ul>
                <li>总盈亏：<span v-formatNumber="AllCount"></span></li>
                <li>总下注额：<span v-formatNumber="AllStake"></span></li>
                <li>总税收: <span v-formatNumber="AllRevenue"></span></li>
                <li>总返利：<span v-formatNumber="Allrebate"></span></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'RebateRecords',
        props: {
            par:Object
        },
        data() {
            const self = this
            return {
                pageSize: 25,
                pageNo: 1,
                total: 0,
                searchItems: {
                    start_date: '',
                    end_date: '',
                    team_type: '',
                    acc_id: ''
                },
                children_id : '',
                levelsCatche: [ ],
                isRequest: true,
                loading: false,
                columns: [
                    {
                        title: 'ID',
                        render(h, params) {
                            return h('span', {
                            }, params.row.t_accountID)
                        }
                    }, {
                        title: '下级人数',
                        key: 'subcount'
                        // render(h, params) {
                        //     return h(params.row.subcount.toString()!='0' ?'a':'span', {
                        //         on: {
                        //             click() {
                        //                 self.children_id = params.row.t_accountID
                        //                 self.searchItems.acc_id = ''
                        //                 params.row.subcount!='0' && self.getList()
                        //             }
                        //         }
                        //     }, params.row.subcount)
                        // }
                    }, {
                        title: '昵称',
                        key: 'nickName'
                    }, {
                        title: '盈亏',
                        key: 'Count'
                    }, {
                        title: '下注额',
                        key: 'Stake'
                    }, {
                        title: '税收',
                        key: 'Revenue'
                    }, {
                        title: '返利',
                        key: 'Rebate'
                    }, {
                        title: '操作',
                        render(h, params) {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click() {
                                        //跳转到游戏记录
                                        let queryObj = Object.assign({}, self.searchItems)
                                        queryObj.team_type = 2
                                        queryObj.acc_id = params.row.t_accountID
                                        self.$router.push({
                                            name: 'GameRecords', 
                                            // query: {
                                            //     id: params.row.t_accountID,
                                            //     start_date: self.searchItems,
                                            //     end_date: '',
                                            //     team_type: ''
                                            // }
                                            query: queryObj
                                        })
                                    }
                                }
                            }, '返利明细')
                        }
                    }
                ],
                list: [],

                AllCount: '',
                AllStake: '',
                AllRevenue: '',
                Allrebate: '',
                subtotal:{
                    PageCount:'1',
                    PageStake:'1',
                    PageRevenue: '1',
                    Pagerebate: '1'
                }
            }
        },

        methods: {
            // changeRecordType(type) {
            //     if(this.record_type===type) return
            //     this.searchItems.record_type = type
            // },
            updatePageSize() {
                this.pageNo = 1
                this.getList()
            },
            search() {
                this.children_id = ''
                this.pageNo = 1
                this.getList()
            },
            updatePageNo() {
                this.getList()
            },
            searchChild(id) {
                this.pageNo = 1
                this.children_id = id
                this.searchItems.acc_id = ''
                this.getList()
            },

            getList() {
                this.loading = true
                // let params = Object.assign({},this.searchItems)
                let params =this.searchItems
                params.page_index = this.pageNo
                params.page_limit = this.pageSize
                params.children_id =this.children_id
                this.$http.get('/get_rebaterecords_list' + tools.toQueryString(params))
                .then(data => {
                    this.loading = false
                    if(data.no===0) {
                        let index = this.levelsCatche.indexOf(this.searchItems.children_id)
                        this.isRequest = false
                        this.list = data.data.list || []
                        this.total = data.data.total
                        let {PageCount, PageStake,PageRevenue, Pagerebate} = data.data;
                        this.subtotal= {PageCount, PageStake,PageRevenue, Pagerebate}
                      let { AllCount, AllRevenue, AllStake, Allrebate } = data.data
                        this.AllCount = AllCount
                        this.AllRevenue = AllRevenue
                        this.AllStake = AllStake
                        this.Allrebate = Allrebate
                        if(params.children_id) {
                            if(index > -1) {
                                for(let i=this.levelsCatche.length-1; i>=0; i--) {
                                    if(i<=index) {
                                        break
                                    }else{
                                        this.levelsCatche.pop()
                                    }
                                }
                            }else{
                                this.levelsCatche.push(params.children_id)
                            }
                            this.$router.push({name: this.$route.name, query: {id: params.children_id}})
                        }else{
                            this.levelsCatche.length && (this.levelsCatche = [])
                            this.$router.push({name: this.$route.name})
                        }
                        // if(this.self){
                        //     this.searchItems.children_id =''
                        //     this.self = ''
                        // }
                        setTimeout(() => {
                            this.isRequest = true
                        })
                    }else{
                        this.levelsCatche.length && (this.levelsCatche = [])
                    }
                })
            },
            
        },
    
        mounted() {
            if(this.par && this.par.acc_id) {
                this.searchItems.acc_id = this.par.acc_id
            }
            this.getList()
        },
        beforeRouteUpdate(to, from, next) {
            if(this.isRequest) {
                this.searchItems.children_id = to.query.id
                this.getList()
            }
            next()
        },
        watch: {
            'searchItems.start_date': function(newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'start_date')
                // if(new Date(newVal).valueOf() > new Date(this.searchItems.end_date)) {
                //     this.$toast('开始时间不能大于于结束时间')
                //     setTimeout(() => {
                //         this.searchItems.start_date = oldVal
                //     }, 0)
                // }
                
            },
            'searchItems.end_date': function(newVal, oldVal) {
                // if(new Date(newVal) < new Date(this.searchItems.start_date)) {
                //     this.$toast('结束时间不能小于开始时间')
                //     setTimeout(() => {
                //         this.searchItems.end_date = oldVal
                //     }, 0)
                // }
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'end_date')
            }
        }
    }
</script>

<style scoped>
    .upfold-enter,
    .upfold-leave-to{
        max-height: 0;
    }
    .upfold-leave,
    .upfold-enter-to{
        max-height: 30px;
    }
    .upfold-enter-active,
    .upfold-leave-active{
        transition: all .1s ease-in;
    }
    .levels-catche{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }
    .levels-catche li{
        margin-left: 10px;
    }
    .levels-catche a{
        color: #2b85e4;
        text-decoration: underline;
    }
    .levels-catche span{
        color: #666;
    }
    /* .statistics-data{  //公共样式里
        box-sizing: border-box;
        padding: 10px .15rem;
        background-color: #EF5AA1;
    }
    .statistics-data ul {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .statistics-data ul li{
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #D0E17D;
        margin-right: 10px;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    } */
    .bg-pink{
        background-color: rgba(255, 153, 255, 1);
    }
   
</style>