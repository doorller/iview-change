<template>
    <div>
        <PageHeader showTimeFilter :name="'注册日志'" :startTime.sync="searchItems.start_date"
            :endTime.sync="searchItems.end_date" />
        <div class="page-content">
            <div class="search-items">
                <div>
                    <label>时间类型:</label>
                    <Select v-model="searchItems.time_type" :options="time_type_array"></Select>
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
                    <label>账号类型:</label>
                    <Select v-model="searchItems.acc_type" :options="acc_type_array"></Select>
                </div>
                <div>
                    <label>注册终端:</label>
                    <Select v-model="searchItems.reg_type" :options="reg_type_array"></Select>
                </div>
                <div>
                    <label>ID</label>
                    <Input limit="en-num" v-model="searchItems.acc_id" />
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <Table :columns="columns" :data="list" :loading="loading" />
            <div class="table-pages">
                <Page @updateSize="updatePageSize" 
                    @updateNo="updatePageNo" 
                    :total="total" 
                    :pageSize.sync="pageSize"
                    :pageNo.sync="pageNo" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'RegistLog',
        data() {
            const self = this
            return {
                pageSize: 25,
                pageNo: 1,
                total: 0,
                searchItems: {
                    time_type: 'V_v_1', 
                    start_date: '',
                    end_date: '',
                    acc_type: '',
                    reg_type: '',
                    acc_id: '',
                },
                loading: false,
                time_type_array: [],
                acc_type_array: [{label:'全部',value:''}],
                reg_type_array: [{label:'全部',value:''}],
                columns: [
                    // {
                    //     title: '序号',
                    //     render(h, params) {
                    //         return h('span', (self.pageNo-1) * self.pageSize + params.index + 1)
                    //     }
                    // },
                    {
                        title: 'ID',
                        render(h, params) {
                            return h('span', {}, params.row.t_accountID)
                        }
                    },
                    {
                        title: '账号',
                        key: 't_accountName'
                    },
                    {
                        title: '昵称',
                        key: 't_nickName'
                    },
                    {
                        title: '所属上级',
                        key: 'father'
                    },
                    {
                        title: '账号类型',
                        key: 't_bIsRegularAccount'
                    },
                    {
                        title: '注册时间',
                        // key: 't_regTime'
                        render(h, params) {
                            let time = tools.getDate(params.row.t_regTime * 1000)
                            return h('span', time)
                        }
                    },
                    {
                        title: '注册IP',
                        key: 't_regIP'
                    },
                    {
                        title: '转正时间',
                        // key: 't_RecordTime'
                        render(h, params) {
                            let time = params.row.t_RecordTime !== '-'? tools.getDate(params.row.t_RecordTime * 1000) : '-'
                            return h('span', time)
                        }
                    },
                    {
                        title: '注册终端',
                        key: 't_regTerminalType'
                    }

                ],
                list: [],
            }
        },

        methods: {
            updatePageSize() {
                this.pageNo = 1
                this.getList()
            },
            search() {
                this.pageNo = 1
                this.getList()
            },
            updatePageNo() {
                this.getList()
            },
            getAllOption() {
                this.$http.get('/optionlist?type=time_type,acc_type,reg_type').then(res => {
                    this.time_type_array = res.data.time_type
                    this.acc_type_array = res.data.acc_type
                    this.reg_type_array = res.data.reg_type
                })
            },
            getList() {
                this.loading = true
                let params = this.searchItems
                params.page_index = this.pageNo
                params.page_limit = this.pageSize
                let para = {}
                // 如果有id 则忽略其他条件
                if(params.acc_id){
                    para.acc_id = params.acc_id
                    para.page_index = params.page_index
                    para.page_limit = params.page_limit
                } else {
                    para = Object.assign({},params)
                }
                this.$http.get('/get_registlog_list' + tools.toQueryString(para))
                    .then(res => {
                        this.loading = false
                        if (res.no === 0) {
                            this.list = res.data.list
                            this.total = res.data.total
                        }
                    })
            }
        },

        mounted() {
            if (this.par && this.par.acc_id) {
                this.searchItems = this.par
            }
            // this.searchItems.start_date = '2018-01-01'
            this.getList()
            this.getAllOption() //获取下拉框内容
        },
        beforeRouteUpdate(to, from, next) {
            if (this.isRequest) {
                this.searchItems.acc_id = to.query.id
                this.getList()
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


</style>