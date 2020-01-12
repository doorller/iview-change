<template>
    <div>
        <PageHeader showTimeFilter :name="'游戏记录'" :startTime.sync="searchItems.start_date"
            :endTime.sync="searchItems.end_date" :activeName="activeName">
            <Tooltip slot="icon" maxWidth="180">
                <a class="iconfont icon-zhuyi"></a>
                <span slot="content">游戏记录的团队记录默认列出<span class="green">直属下级</span>的记录，如欲查询<span
                        class="green">间接下级</span>的记录，请输入其ID进行查询</span>
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
                    <DatePicker v-model="searchItems.start_date" :clearable="false" />
                </div>
                <div class="end-time">
                    <label>结束</label>
                    <DatePicker v-model="searchItems.end_date" :clearable="false" />
                </div>
                <div>
                    <label>游戏类型：</label>
                    <Select :options="gameTypeOptions" v-model="searchItems.game_type" />
                </div>
                <div v-if="searchItems.team_type===2">
                    <label>ID：</label>
                    <Input limit="en-num" v-model="searchItems.acc_id" @enter="updatePageSize" />
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <!--  个人记录 -->
            <div v-show="searchItems.team_type===1">
                <Table :columns="columns.slice(2)" :data="sole_list" :loading="sole_loading" @sort="sortList" :sortMethod="true" />
                <div class="table-pages">
                    <Page @updateSize="updatePageSize(1)" 
                        @updateNo="updatePageNo(1)" 
                        :total="total"
                        :pageSize.sync="pageSize" 
                        :pageNo.sync="pageNo" />
                </div>
                <div class="statistics-data" v-show="searchItems.team_type===1">
                    <ul>
                        <li>总盈亏：<span v-formatNumber="sumScore"></span></li>
                        <li>总下注额：<span v-formatNumber="sumStake"></span></li>
                        <li>总税收: <span v-formatNumber="sumRevenue"></span></li>
                        <li>总返利：<span v-formatNumber="sumRebate"></span></li>
                    </ul>
                </div>
            </div>

            <!--  团队记录 -->
            <div v-show="searchItems.team_type===2">
                <Table :columns="columns" :data="team_list" :loading="team_loading" @sort="sortList2" :sortMethod="true" />
                <div class="table-pages">
                    <Page @updateSize="updatePageSize(2)" 
                        @updateNo="updatePageNo(2)" 
                        :total="total2"
                        :pageSize.sync="pageSize2" 
                        :pageNo.sync="pageNo2" />
                </div>
            </div>
            <div class="statistics-data" v-show="searchItems.team_type===2">
                <ul>
                    <li>总盈亏：<span v-formatNumber="sumScore2"></span></li>
                    <li>总下注额：<span v-formatNumber="sumStake2"></span></li>
                    <li>总税收: <span v-formatNumber="sumRevenue2"></span></li>
                    <li>总返利：<span v-formatNumber="sumRebate2"></span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GameRecords',
        props: {
            par: Object
        },
        data() {
            return {
                activeName: '',
                pageSize: 25,
                pageNo: 1,
                total: 0,
                pageSize2: 25,
                pageNo2: 1,
                total2: 0,
                isRequest: true,
                searchItems: {
                    team_type: 1,
                    start_date: '',
                    end_date: '',
                    game_type: '',
                    acc_id: '',
                    order_desc_asc: '',
                    order_by: ''
                },
                gameTypeOptions: [{
                    label: '全部',
                    value: ''
                }],
                columns: [
                    // {
                    //     title: '#',
                    //     render(h, params) {
                    //         return h('span', (self.pageNo-1) * self.pageSize + params.index + 1)
                    //     }
                    // },
                    {
                        title: 'ID',
                        key: 'UserID'
                    },
                    {
                        title: '昵称',
                        key: 't_nickName'
                    },
                    {
                        title: '游戏类型',
                        key: 'GameTypeID'
                    },
                    {
                        title: '游戏房间',
                        key: 'RoomTypeID'
                    }, {
                        title: '进入房间时间',
                        key: 'StartTime',
                        sortable: true,
                        sortType: 'desc',
                        render(h, params) {
                            return h('span', tools.getDate(params.row.StartTime * 1000))
                        }
                    }, {
                        title: '离开房间时间',
                        // key: 'EndTime'.
                        render(h, params) {
                            return h('span', tools.getDate(params.row.EndTime * 1000))
                        }
                    }, {
                        title: '币种',
                        key: 'ScoreTypeID'
                    }, {
                        title: '开始金额',
                        key: 'BeforeScore'
                    }, {
                        title: '盈亏',
                        key: 'Score'
                    }, {
                        title: '结束金额',
                        key: 'AfterScore'
                    }, {
                        title: '下注额',
                        key: 'Stake'
                    }, {
                        title: '税收',
                        key: 'Revenue'
                    }, {
                        title: '返利',
                        key: 'Period'
                    }
                ],
                list: [
                    // {a:'a',b:'a',c:'a',d:'a',e:'a',f:'a',g:'a',h:'a',i:'a',j:'a',k:'a'},
                    // {a:'a',b:'a',c:'a',d:'a',e:'a',f:'a',h:'a',i:'a',j:'a',k:'a'},
                ],
                sole_list: [],
                team_list: [],
                game_room_array: [],
                sole_loading:false,
                team_loading:false,
               /*  个人记录总计 */
                sumScore: '',
                sumStake: '',
                sumRevenue: '',
                sumRebate: '',
              /*   团队总计 */
                sumScore2: '',
                sumStake2: '',
                sumRevenue2: '',
                sumRebate2: '',
            }
        },
        methods: {
            changeRecordType(type) {
                if (this.team_type === type) return
                this.searchItems.team_type = type
                if (type == 1) {} else {
                    // this.columns = this.columns_all.slice(1)
                }
            },
            search() {
                this.pageNo = 1
                this.pageNo2 = 1
                this.getList(1)
                this.getList(2)
            },
            updatePageSize(val) {
                val == 1 ? this.pageNo = 1 : this.pageNo2 = 1
                this.getList(val)
            },
            updatePageNo(val) {
                this.getList(val)
            },
            get_gameArray() {
                this.$http.get('/optionlist?type=game_type,room_type').then(res => {
                    this.gameTypeOptions = res.data.game_type
                    // this.game_room_array = res.data.room_type
                })
            },
            /* 排序 */
            sortList(type, key) {
                    this.searchItems.order_desc_asc = type
                    // this.searchItems.order_by = key  // 默认字段_进入房间,
                    this.getList(1)
            },
            sortList2(type, key) {
                    this.searchItems.order_desc_asc = type
                    // this.searchItems.order_by = key  // 默认字段_进入房间,
                    this.getList(2)
            },
            getList(val) {
                let params = Object.assign({}, this.searchItems)
                // params.team_type = 1
                if (val) {
                    params.team_type = val
                }
                // params.acc_id = ''
                // params.page_limit = this.pageSize
                if (val === 1) {
                    params.page_index = this.pageNo
                    params.page_limit = this.pageSize
                    this.sole_loading = true
                } else if (val === 2) {
                    params.page_index = this.pageNo2
                    params.page_limit = this.pageSize2
                    this.team_loading = true
                }
                this.$http.get('/get_gamerecords_list' + tools.toQueryString(params))
                    .then(res => {
                        if (res.no === 0) {
                            this.isRequest = false
                            if (params.team_type === 1) {
                                this.sole_loading = false
                                this.sole_list = res.data.list
                                this.total = res.data.total
                                this.sumScore = res.data.Score
                                this.sumStake = res.data.Stake
                                this.sumRevenue = res.data.Revenue
                                this.sumRebate = res.data.Period
                            } else if (params.team_type === 2) {
                                this.team_loading = false
                                this.team_list = res.data.list
                                this.total2 = res.data.total
                                this.sumScore2 = res.data.Score
                                this.sumStake2 = res.data.Stake
                                this.sumRevenue2 = res.data.Revenue
                                this.sumRebate2 = res.data.Period
                            }
                            setTimeout(() => {
                                this.isRequest = true
                            })
                        }

                    })
            },
        },
        mounted() {
            if(this.$route.query.acc_id) {
                this.searchItems.acc_id = this.$route.query.acc_id
                this.searchItems.start_date = this.$route.query.start_date || tools.formatDate(new Date(),false)
                this.searchItems.end_date = this.$route.query.end_date  || tools.formatDate(new Date(),false)
                this.searchItems.team_type = this.$route.query.team_type || 2
            }
            // 组件时获取的值
            if (this.par && this.par.acc_id) {
                this.searchItems = this.par
                this.activeName = "最近七天"
            }
            // this.searchItems.start_date ='2018-01-01'
            this.get_gameArray()
            // this.getList()
            this.search()

        },
        beforeRouteUpdate(to, from, next) {
            if (this.isRequest) {
                this.searchItems.acc_id = to.query.id
                this.getPerson_list()
                // this.getTeam_list()
            }
            next()
        },
        watch: {
            'searchItems.start_date': function (newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems, this.$toast, 'start_date')
            },
            'searchItems.end_date': function (newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems, this.$toast, 'end_date')
            }
        }
    }
</script>

<style scoped>
    .v-tooltip {
        margin-left: 10px;
    }
    .statistics-data{
        margin-top: 20px;
    }
</style>