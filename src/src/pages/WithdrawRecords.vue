<template>
    <div>
        <PageHeader
            showTimeFilter
            :name="'提现记录'"
            :startTime.sync="searchItems.start_date"
            :endTime.sync="searchItems.end_date"
        >
            <Tooltip
                slot="icon"
                maxWidth="180"
            >
                <a class="iconfont icon-zhuyi"></a>
                <span slot="content">提现记录的团队记录默认列出<span class="green">直属下级</span>的记录，如欲查询<span class="green">间接下级</span>的记录，请输入其ID进行查询</span>
            </Tooltip>
        </PageHeader>
        <div class="page-content">
            <div class="search-items">
                <div>
                    <Button :active="searchItems.team_type===1" @click="changeRecordType(1)">个人记录</Button>
                    <label></label>
                    <Button :active="searchItems.team_type===2" @click="changeRecordType(2)">团队记录</Button>
                    <label></label>
                </div>
                <div>
                    <label>开始</label>
                    <DatePicker v-model="searchItems.start_date" :clearable="false"/>
                </div>
                <div class="end-time">
                    <label>结束</label>
                    <DatePicker v-model="searchItems.end_date" :clearable="false"/>
                </div>
                <div>
                    <label>状态：</label>
                    <Select :options="statusOptions" v-model="searchItems.status"/>
                </div>
                <div v-if="searchItems.team_type===2">
                    <label>ID：</label>
                    <Input limit="en-num" v-model="searchItems.acc_id" @enter="search"/>
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
           <div>
               <div v-show="searchItems.team_type===1">
                    <Table :columns="columns_sole" :data="sole_list" :loading="sole_loading"/>
                    <div class="table-pages">
                        <Page
                            @updateSize="updatePageSize(1)"
                            @updateNo="updatePageNo(1)"
                            :total="total"
                            :pageSize.sync="pageSize"
                            :pageNo.sync="pageNo"
                        />
                    </div>
               </div>
                <div v-show="searchItems.team_type===2">
                    <Table :columns="columns_team" :data="team_list" :loading="team_loading" />
                    <div class="table-pages">
                        <Page
                            @updateSize="updatePageSize(2)"
                            @updateNo="updatePageNo(2)"
                            :total="total2"
                            :pageSize.sync="pageSize2"
                            :pageNo.sync="pageNo2"
                        />
                    </div>
                </div>
           </div>
           
        </div>
        <div class="foot-charge">
            <div class="statistics-data bg-pink">
                <p>总计: </p>
                <ul v-if="searchItems.team_type===1">
                    <li>提现金额：<span v-formatNumber="item_sumt_amount"></span></li>
                    <li>余额：<span v-formatNumber="item_sumt_rebase"></span></li>
                </ul>
                <ul v-else>
                    <li>提现金额：<span v-formatNumber="item_sumt_amount2"></span></li>
                    <li>余额：<span v-formatNumber="item_sumt_rebase2"></span></li>
                </ul>
            </div>
        </div>  
    </div>
</template>

<script>
    export default {
        name: 'WithdrawRecords',
        props: {
            par:Object
        },
        data() {
            const self = this;
            return {
                /* 个人记录 */
                pageSize: 25,
                pageNo: 1,
                total: 100,
                sole_loading: false,
                /* 团队记录 */
                pageSize2: 25,
                pageNo2: 1,
                total2: 100,
                team_loading: false,
                isRequest: true,
                searchItems: {
                    team_type: 1,
                    start_date: '',
                    end_date: '',
                    status: '',
                    acc_id: ''
                },
                statusOptions: [
                    {
                        label: '全部',
                        value: ''
                    }
                ],
                columns_sole: [
                    {
                        title: '订单号',
                        key: 'OrderID'
                    },
                     {
                        title: '提现时间',
                        key: 'CreatorTime',
                        render(h, params) {
                            // let time = tools.getDate(params.row.CreatorTime,true)
                            // let text = time.slice(0,4)+'-'+ time.slice(4,6)+'-'+time.slice(6)
                            let time=tools.getDate(params.row.CreatorTime*1000)
                            return h('span', time)
                        }
                    }, {
                        title: '提现金额',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'formatNumber',
                                    value: params.row.Amount
                                }]
                            })
                        }
                    }, {
                        title: '余额',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'formatNumber',
                                    value: params.row.AmountLeft
                                }]
                            })
                        }
                    }, {
                        title: '类型',
                        // key: 'PayType'
                        render(h, params){
                            return h('span', params.row.PayType)
                        }
                    }, {
                        title: '状态',
                        render(h, params) {
                            let color = ''
                            switch(params.row.OrderStatus) {
                                case '已通过':
                                    color = 'green'
                                    break
                                case '未审核':
                                    color = 'blue'
                                    break
                                case '已拒绝':
                                    color = 'red'
                                    break
                                case '支付失败':
                                    color = 'red'
                                    break
                                default:
                            }
                            return h('span', {
                                class: color
                            }, params.row.OrderStatus)
                        }
                    }
                ],
                columns_team: [
                    {
                        title: '订单号',
                        key: 'OrderID'
                    },
                    {
                        title: 'ID',
                        key: 't_accountID'
                    },
                    {
                        title: '昵称',
                        key: 't_nickName'
                    },
                    // {
                    //     title: '账号',
                    //     render(h, params) {
                    //         return h('span', {
                    //             directives: [{
                    //                 name: 'hidePhoneNo',
                    //                 value: params.row.phonenumber
                    //             }]
                    //         })
                    //     }
                    // },
                 
                     {
                        title: '提现时间',
                        // key: 'CreatorTime',
                        render(h, params) {
                            let time = tools.getDate(params.row.CreatorTime*1000)
                            // let text = time.slice(0,4)+'-'+ time.slice(4,6)+'-'+time.slice(6)
                            return h('span', time)
                        }
                    }, {
                        title: '提现金额',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'formatNumber',
                                    value: params.row.Amount
                                }]
                            })
                        }
                    }, {
                        title: '余额',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'formatNumber',
                                    value: params.row.AmountLeft
                                }]
                            })
                        }
                    }, {
                        title: '类型',
                        key: 'PayType'
                    }, {
                        title: '状态',
                        render(h, params) {
                            let color = ''
                            switch(params.row.OrderStatus) {
                                case '已通过':
                                    color = 'green'
                                    break
                                case '未审核':
                                    color = 'blue'
                                    break
                                case '已拒绝':
                                    color = 'red'
                                    break
                                case '支付失败':
                                    color = 'red'
                                    break
                                default:
                            }
                            return h('span', {
                                class: color
                            }, params.row.OrderStatus)
                        }
                    }
                ],
                // list: self.sole_list,
                sole_list: [],
                team_list: [],
                item_sumt_amount: '',
                item_sumt_rebase: '',
                item_sumt_amount2: '',
                item_sumt_rebase2: ''
            }
        },
        methods: {
            changeRecordType(type) {
                // if(this.team_type===type) return
                this.searchItems.team_type = type
                // if(type===1){
                //     this.list =this.sole_list
                // } else{
                //     this.list =this.team_list;
                // }
            },
            search(){
                this.pageNo = 1
                this.pageNo2 = 1
                this.getList(1);
                this.getList(2);
            },
            updatePageSize(val) {
                val===1 ? this.pageNo=1 :this.pageNo2 =1
                this.getList(val)
            },
            updatePageNo(val) {
                this.getList(val)
            },
            getList(val) {
                let params = Object.assign({},this.searchItems)
                params.team_type = val ? val : this.searchItems.team_type
                if(params.team_type === 1){
                    this.sole_loading = true
                    params.page_index = this.pageNo
                    params.page_limit = this.pageSize
                } else {
                    this.team_loading = true
                    params.page_index = this.pageNo2
                    params.page_limit = this.pageSize2
                }
                this.$http.get('/get_payout_list' + tools.toQueryString(params))
                .then(data => {
                    if(!data.no) {
                        this.isRequest = false
                        // this.list = data.data && data.data.list ? data.data.list : []
                        if(data.data) {
                            // this.list = data.data.list
                            if( params.team_type === 1 ){
                                this.sole_loading = false
                                this.sole_list = data.data.list || []
                                this.total = data.data.total
                                this.item_sumt_amount = data.data.item_sumt_amount
                                this.item_sumt_rebase = data.data.item_sumt_rebase
                            } else if(params.team_type === 2){
                                this.team_loading = false
                                this.team_list = data.data.list || []
                                this.total2 = data.data.total
                                this.item_sumt_amount2 = data.data.item_sumt_amount
                                this.item_sumt_rebase2 = data.data.item_sumt_rebase
                            }
                            
                        }else{
                            // this.list = []
                            this.total = 0
                        }
                        setTimeout(() => {
                            this.isRequest = true
                        })
                    }
                    this.sole_loading = false
                    this.team_loading = false
                })
            },
            get_status_array() {
                this.$http.get('/optionlist?type=drawing_status').then(res => {
                    this.statusOptions = res.data.drawing_status
                })
            }
        },
        mounted() {
            //组件prop获取的值
            if(this.par && this.par.acc_id) {
                this.searchItems = this.par
            }
            // this.searchItems.start_date = '2015-01-01'
            this.getList(1);
            this.getList(2);
            this.get_status_array()
        },
        beforeRouteUpdate(to, from, next) {
            if(this.isRequest) {
                this.searchItems.acc_id = to.query.id
                this.getList()
            }
            next()
        },
        watch: {
            'searchItems.start_date': function(newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'start_date')
            },
            'searchItems.end_date': function(newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'end_date')
            }
        }
    }
</script>

<style scoped>
    .v-tooltip{
        margin-left: 10px;
    }
</style>
