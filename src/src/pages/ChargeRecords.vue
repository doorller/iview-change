<template>
    <div>
        <PageHeader
            showTimeFilter
            :name="'充值记录'"
            :startTime.sync="searchItems.start_date"
            :endTime.sync="searchItems.end_date"
        >
            <Tooltip
                slot="icon"
                maxWidth="180"
            >
                <a class="iconfont icon-zhuyi"></a>
                <span slot="content">充值记录的团队记录默认列出<span class="green">直属下级</span>的记录，如欲查询<span class="green">间接下级</span>的记录，请输入其ID进行查询</span>
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
                    <Input limit="en-num" v-model="searchItems.acc_id" @enter="updatePageSize"/>
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <!-- 个人记录 -->
            <div  v-show="searchItems.team_type===1">
                <Table :columns="columns_sole" :data="person_list" :loading="sole_loading" />
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
           <!--  团队记录 -->
            <div v-show="searchItems.team_type===2">
                <Table :columns="columns" :data="team_list" :loading="team_loading" />
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
       <!--  个人记录 -->
        <div class="foot-charge" v-if="searchItems.team_type===1">
            <div class="statistics-data bg-pink">
                <p>总计: </p>
                <ul>
                    <li>充值金额：<span v-formatNumber="item_sumt_amount"></span></li>
                </ul>
            </div>
        </div>
            <!-- 团队记录 -->
        <div class="foot-charge" v-else>
            <div class="statistics-data bg-pink">
                <p>总计: </p>
                <ul>
                    <li>充值金额：<span v-formatNumber="item_sumt_amount2"></span></li>
                </ul>
            </div>
        </div>  
    </div>
</template>

<script>
    export default {
        name: 'ChargeRecords',
        props: {
            par:Object
        },
        data() {
            const self = this
            return {
                /* 个人 */
                pageSize: 25,
                pageNo: 1,
                total: 0,
                sole_loading: false,
                /* 团队 */
                pageSize2: 25,
                pageNo2: 1,
                total2: 0,
                team_loading: false,
                isRequest: true,
                searchItems: {
                    team_type: 1,
                    start_date: '',
                    end_date: '',
                    status: 0,
                    acc_id: ''
                },
                typeOptions: {
                    2000001: '手工',
                    2000002: '第三方'
                },
                statusOptions: [
                    {
                        label: '全部',
                        value: 0
                    }, {
                        label: '审核中',
                        value: 1
                    },{
                        label:  '成功',
                        value: 2
                    },{
                        label: '失败',
                        value: 3
                    }
                  
                ],
                columns_sole: [
                    {
                        title: '订单号',
                        key: 't_orderID'
                    }, 
                    {
                        title: '充值时间',
                        render(h, params) {
                            return h('span', tools.getDate(params.row.t_createtime * 1000))
                        }
                    }, {
                        title: '充值金额',
                        key: 't_amount'
                        // render(h, params) {
                        //     return h('span', {
                        //         directives: [{
                        //             name: 'formatNumber',
                        //             value: params.row.t_amount
                        //         }]
                        //     })
                        // }
                    }, {
                        title: '类型',
                        key: 't_type',
                    }, {
                        title: '状态',
                        render(h, params) {
                            let color = ''
                            switch(params.row.t_status) {
                                case '已通过':
                                    color = 'green'
                                    break
                                case '未审核':
                                    color = 'blue'
                                    break
                                // case '已解决':
                                //     color = 'gray'
                                //     break
                                case '已拒绝':
                                    color = 'red'
                                default:
                            }
                            return h('span', {
                                class: color
                            } ,params.row.t_status)
                        }
                    }
                ],
                columns: [
                    {
                        title: '订单号',
                        key: 't_orderID'
                    }, 
                
                        {
                        title: 'ID',
                        key: 't_accountid'
                    },
                    {
                        title: '昵称',
                        key: 't_nickName'
                    },
                    {
                        title: '充值时间',
                        render(h, params) {
                            return h('span', tools.getDate(params.row.t_createtime * 1000))
                        }
                    }, {
                        title: '充值金额',
                        key: 't_amount'
                        // render(h, params) {
                        //     return h('span', {
                        //         directives: [{
                        //             name: 'formatNumber',
                        //             value: params.row.t_amount
                        //         }]
                        //     })
                        // }
                    }, {
                        title: '类型',
                        key: 't_type'
                       
                    }, {
                        title: '状态',
                        render(h, params) {
                            let color = ''
                            switch(params.row.t_status) {
                                case '已通过':
                                    color = 'green'
                                    break
                                case '未审核':
                                    color = 'blue'
                                    break
                                // case '已解决':
                                //     color = 'gray'
                                //     break
                                case '已拒绝':
                                    color = 'red'
                                default:
                            }
                            return h('span', {
                                class: color
                            } ,params.row.t_status)
                        }
                    }
                ],

                person_list: [],
                team_list: [],
                item_sumt_amount: '',
                item_sumt_amount2: '',
            }
        },
        methods: {
            changeRecordType(type) {
                if(this.team_type===type) return
                this.searchItems.team_type = type
            },
            search() {
                this.pageNo = 1
                this.pageNo2= 1
                this.getPerson_list();
                this.getTeam_list();
            },
            updatePageSize(val) {
                val==1 ? this.pageNo = 1 :this.pageNo2 = 1
                this.searchItems.team_type == 1 ? this.getPerson_list() : this.getTeam_list()
            },
            updatePageNo() {
                this.searchItems.team_type == 1 ? this.getPerson_list() : this.getTeam_list()
            },
            getPerson_list() {
                this.sole_loading = true
                let params = Object.assign({}, this.searchItems)
                params.team_type = 1
                params.acc_id = ''
                params.page_index = this.pageNo
                // params.page_limit = this.pageSize
                params.page_limit = this.pageSize
                this.$http.get('/get_payin_list' + tools.toQueryString(params))
                .then(data => {
                    this.sole_loading = false
                    if(data && data.no===0) {
                        this.isRequest = false
                        this.person_list = data.data.list || []
                        this.total = data.data.total
                        this.item_sumt_amount = data.data.item_sumt_amount
                        setTimeout(() => {
                            this.isRequest = true
                        })
                    }
                })
            },
            getTeam_list() {
                this.team_loading = true
                let params = Object.assign({}, this.searchItems)
                params.team_type = 2
                params.page_index = this.pageNo2
                params.page_limit = this.pageSize2
                this.$http.get('/get_payin_list' + tools.toQueryString(params))
                .then(data => {
                    this.team_loading = false
                    if(data && data.no===0) {
                        this.isRequest = false
                        this.team_list = data.data.list || []
                        this.total2 = data.data.total
                        this.item_sumt_amount2 = data.data.item_sumt_amount
                        setTimeout(() => {
                            this.isRequest = true
                        })
                    }
                })
            },
            get_status_array() {
                this.$http.get('/optionlist?type=pay_status').then ( res=>{
                    this.statusOptions = res.data.pay_status
                })
            }
        },
        mounted() {
            if(this.$route.query.id) { this.searchItems.acc_id = this.$route.query.id }
            if(this.par && this.par.acc_id) { this.searchItems = this.par }
            this.getPerson_list()
            this.getTeam_list()
            this.get_status_array()
        },

        beforeRouteUpdate(to, from, next) {
            if(this.isRequest) {
                this.searchItems.acc_id = to.query.id
                this.getPerson_list()
                this.getTeam_list()
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
