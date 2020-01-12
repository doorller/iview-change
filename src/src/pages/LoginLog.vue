<template>
    <div :class="[wait ? 'wait' : '']">
        <PageHeader showTimeFilter :name="'登录日志'" :startTime.sync="searchItems.start_date" :endTime.sync="searchItems.end_date">
            <Tooltip slot="icon" maxWidth="180">
                <a class="iconfont icon-zhuyi"></a>
                <span slot="content">登录日志的团队记录默认列出<span class="green">直属下级</span>的记录，如欲查询<span class="green">间接下级</span>的记录，请输入其ID进行查询</span>
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
                    <label>登录终端：</label>
                    <Select :options="terminalOptions" v-model="searchItems.login_type" />
                </div>
                <div v-if="searchItems.team_type===2">
                    <label>ID：</label>
                    <Input limit="en-num" v-model="searchItems.acc_id" @enter="search" />
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <div class="table">
                <div v-show="searchItems.team_type===1">
                    <Table :columns="columns_sole" :data="sole_list" :loading="sole_loading" />
                    <div class="table-pages">
                        <Page @updateSize="updatePageSize(1)" @updateNo="updatePageNo(1)" :total="total" :pageSize.sync="pageSize"
                            :pageNo.sync="pageNo" />
                    </div>
                </div>

                <div v-show="searchItems.team_type===2">
                    <Table :columns="columns_team" :data="team_list" :loading="team_loading" />
                    <div class="table-pages">
                        <Page @updateSize="updatePageSize(2)" @updateNo="updatePageNo(2)" :total="total2"
                            :pageSize.sync="pageSize2" :pageNo.sync="pageNo2" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LoginLog',
        props: {
            par: Object
        },
        data() {
            let self = this
            return {
                wait: false,
                searchItems: {
                    start_date: '',
                    end_date: '',
                    team_type: 1,
                    login_type: '',
                    acc_id: ''
                },
                terminalOptions:[
                    {
                        label: '全部',
                        value: ''
                    }
                ],
                msgList: {

                },
                columns_sole: [
                    {
                        title: '登录时间',
                        // key: 'LoginTime',
                        render(h, params) {
                            return h('span', params.row.LoginTime ? tools.getDate(params.row.LoginTime * 1000) : '')
                        }
                    },
                    {
                        title: '讯息',
                        key: 'LoginMsg'
                        // render(h, params) {
                        //     // var msgList = {
                        //     //     '0': '失败 (其他错误)',
                        //     //     1: '失败 (账号不存在)',
                        //     //     2: '失败 (密码错误)',
                        //     //     3: '失败 (验证码错误)',
                        //     //     4: '正常登录',
                        //     //     5: '失败 (重连)'
                        //     // }
                        //     return h('span', msgList[params.row.LoginMsg])
                        // }
                    },
                    {
                        title: '登录IP',
                        key: 'LoginIP',
                    },
                    {
                        title: '登录终端',
                        key: 'TerminalType'
                        // render(h, params) {
                        //     let terminal = {
                        //         '0': 'PC端',
                        //         '1': '安卓端',
                        //         '2': '苹果端',
                        //         '3': 'H5'
                        //     }
                        //     return h('span', terminal[params.row.TerminalType])
                        // }
                    },
                ],

                //   logininfo['t_accountID'] = user.t_accountID;     //用户id
                //     logininfo['t_phoneNumber'] = user.t_phoneNumber;  //用户账号
                //     logininfo['t_nickName'] = user.t_nickName;         昵称
                //     logininfo['LoginTime'] = logintable.results[m].LoginTime;    登录时间
                //     logininfo['LoginMsg'] = logintable.results[m].LoginMsg;      返回信息
                //     logininfo['LoginIP'] = logintable.results[m].LoginIP;        登录ip
                //     logininfo['TerminalType'] = logintable.results[m].TerminalType;   登录终端
                columns_team: [{
                        title: 'ID',
                        key: 't_accountID',
                    },
                    {
                        title: '账号',
                        key: 't_accountName',
                    },
                    {
                        title: '昵称',
                        key: 't_nickName',
                    },
                    {
                        title: '登录时间',
                        // key: 'LoginTime',
                        render(h, params) {
                            return h('span', params.row.LoginTime ? tools.getDate(params.row.LoginTime * 1000) : '')
                        } 
                    },
                    {
                        title: '讯息',
                        key: 'LoginMsg'
                       
                    },
                    {
                        title: '登录IP',
                        key: 'LoginIP',
                    },
                    {
                        title: '登录终端',
                        key: 'TerminalType',
                    },
                ],

                
                sole_list: [{
                    id: '23432',
                    account: '34424',
                    nickname: '张三',
                    message: '内容',
                    IP: '135.15.121',
                    terminal: 'ios'
                }],
                team_list: [],
                /* 个人 */
                total: 1,
                pageSize: 25,
                pageNo: 1,
                sole_loading: false,
                /* 团队 */
                total2: 1,
                pageSize2: 25,
                pageNo2: 1,
                team_loading: false
            }
        },
        methods: {
            search() {
                this.pageNo = 1
                this.pageNo2 = 1
                this.getList(1)
                this.getList(2)
            },
            
            changeRecordType(type) {
                this.searchItems.team_type = type
            },
            updatePageSize(val) {
                if (val === 1) {
                    this.pageNo = 1
                } else {
                    this.pageNo2 = 1
                }
                this.getList(val)
            },
            updatePageNo(val) {
                this.getList(val)
            },
            get_terminal_array() {
                this.$http.get('/optionlist?type=login_type').then ( res=>{
                    this.terminalOptions = res.data.login_type
                })
            },
            getList(teamType) {
                this.wait = true
                let params = Object.assign({}, this.searchItems)
                params.team_type = teamType ? teamType : this.searchItems.team_type
                if (params.team_type === 1) {
                    this.sole_loading = true
                    params.page_index = this.pageNo.toString()
                    params.page_limit = this.pageSize
                } else {
                    this.team_loading = true
                    params.page_index = this.pageNo2.toString()
                    params.page_limit = this.pageSize2
                }
                //等待接口
                this.$http.get(`/get_loginlog_list${window.tools.toQueryString(params)}`).then(res => {
                    this.wait =false
                    if (res && res.no === 0) {
                        // console.log(res)
                        if (params.team_type === 1) {
                            this.sole_loading = false
                            this.sole_list = res.data.list ? res.data.list : []
                            this.total = res.data.total ? res.data.total : 0
                        } else if (params.team_type === 2) {
                            this.team_loading = false
                            this.team_list = res.data.list || []
                            this.total2 = res.data.total || 0
                        }
                    }
                })
            }
        },
        mounted() {
            if (this.par && this.par.acc_id) {
                this.searchItems = this.par
            }
            this.get_terminal_array()
           
            // this.searchItems.start_date = '2019-01-01'
            this.getList(1)
            this.getList(2)
        },
        watch: {
            'searchItems.start_date': function (newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'start_date')
            },
            'searchItems.end_date': function (newVal, oldVal) {
                tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'end_date')
            }
        }
    }
</script>

<style>
    .wait:hover{
        cursor: wait;
    }
    
</style>