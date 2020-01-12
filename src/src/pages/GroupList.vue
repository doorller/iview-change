<template>
    <div>
        <PageHeader
            
        />
        <div class="page-content">
            <div class="search-items">
                <!-- <div>
                    <label>时间类型：</label>
                    <Select :options="timeTypeOptions" v-model="searchItems.time_type"/>
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
                    <label>账号类型：</label>
                    <Select :options="accountOptions" v-model="searchItems.acc_type"></Select>
                </div> -->
                <div>
                    <label>ID：</label>
                    <Input limit="en-num" v-model="searchItems.acc_id" @enter="search"/>
                </div>
                <div>
                    <label></label>
                    <Button active @click="search">查询</Button>
                </div>
            </div>
            <transition name="upfold">
                <ul class="levels-catche" v-show="levelsCatche.length">
                    <li>
                        <a class="home-id" href="javascript:;" @click="clearAll">{{adminInfo.id}}</a>
                        <span></span>
                    </li>
                    <li v-for="(value, index) in levelsCatche" :key="index">
                        <span> > </span>
                        <a href="javascript:;" @click="searchChild(value)"> {{value}}</a>
                        <span v-show="index==levelsCatche.length-1">&nbsp;&nbsp;的下级 </span>
                    </li>
                </ul>
            </transition>
           
            <Table :columns="columns" :data="list" :loading="loading" />
            <div class="table-pages">
                <Page
                    @updateSize="updatePageSize"
                    @updateNo="updatePageNo"
                    :total="total"
                    :pageSize.sync="pageSize"
                    :pageNo.sync="pageNo"
                />
            </div>
            <div class="statistics-data bg-pink mt-25">
                <p class="stat-title">小计:</p>
                <ul>
                    <li>下级人数: <span v-formatNumber="page_subcount"></span></li>
                    <li>个人余额: <span v-formatNumber="page_goldCoin"></span></li>
                    <li>保险箱余额: <span v-formatNumber="page_bankGoldCoin"></span></li>
                </ul>
            </div>
            <div class="statistics-data">
                <p class="stat-title">总计:</p>
                <ul>
                    <li>下级人数: <span v-formatNumber="all_subcount"></span></li>
                    <li>个人余额: <span v-formatNumber="all_goldCoin"></span></li>
                    <li>保险箱余额: <span v-formatNumber="all_bankGoldCoin"></span></li>
                </ul>
            </div>
            
        </div>
        <div class="pop" id="pop" v-if="popShow">
            <div id="popContain">
                <div class="pop-head" style="textAlign:right">
                    <span class="delete" @click="popShow=false">X</span>
                </div>
                <component v-bind:is="currentComponent" :par="par"></component>
            </div>
        </div>
    </div>
</template>

<script>
    import LoginLog from './LoginLog'
    import GameRecords from './GameRecords'
    import ChargeRecords from './ChargeRecords'
    import WithdrawRecords from './WithdrawRecords'
    import RebateRecords from './RebateRecords'
    import axios from 'axios'
    export default {
        name: 'GroupList',
        components: {
            LoginLog,
            GameRecords,
            ChargeRecords,
            WithdrawRecords,
            RebateRecords
        },
        data() {
            const self = this
            return {
                pageSize: 25,
                pageNo: 1,
                total: 0,
                isRequest: true,
                popShow:false,
                currentComponent:'',
                loading: false,
               
                par: {},
                searchItems: {
                    start_date: '',
                    end_date: '',
                    // acc_type: '',
                    acc_id: '',
                    // time_type: 'no_time',
                },
                levelsCatche: [],
                timeTypeOptions: [
                    {
                        label: '不搜寻时间',
                        value: 'no_time'
                    }, 
                    {
                        label: '注册时间',
                        value: 'reg_time'
                    }, 
                    {
                        label: '登录时间',
                        value: 'login_time'
                    }
                ],
                accountOptions: [
                    {
                        label: '全部',
                        value: ''
                    }, {
                        label: '正式',
                        value: '1'
                    }, {
                        label: '游客',
                        value: '0'
                    }
                ],
                accountTypes: {
                    '1': '正式',
                    '0': '游客'
                },
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
                            return h('span', {
                            }, params.row.t_accountID)
                        }
                    }, {
                        title: '下级人数',
                        // key: 'acccount',
                        render(h, params) {
                            return h(params.row.subcount===0 ? 'span':'a', {
                                on: {
                                    click() {
                                        if(params.row.subcount===0) return
                                        let id = params.row.t_accountID
                                        // self.search_children_id = id
                                        // self.searchItems.acc_id = ''
                                        // self.getList()  //搜索下级
                                        
                                        self.searchChild(id)
                                        
                                    }
                                }
                            }, params.row.subcount)
                        }
                    }, {
                        title: '账号',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'hidePhoneNo',
                                    value: params.row.t_accountName
                                }]
                            })
                        }
                    }, {
                        title: '昵称',
                        key: 't_NickName'
                    }, {
                        title: '账号类型',
                        key: 't_bIsRegularAccount'
                        
                    }, {
                        title: '个人余额',
                        render(h, params) {
                            return h('span', {
                                directives: [{
                                    name: 'formatNumber',
                                    value: params.row.t_goldCoin
                                }]
                            })
                        }
                    }, {
                        title: '保险箱余额',
                        render(h, params) {
                            return h('p', [
                                h('div',params.row.t_bankGoldCoin),
                            ])
                        }
                    }, {
                        title: '游戏中余额',
                        render(h, params) {
                            return h('p', 
                                {
                                    on:{
                                        click(e) {
                                            params.row.t_roomname ='....'
                                            params.row.score ='....'
                                            setTimeout( ()=>{self.getRoomApi(params.row.t_accountID,'solo')}, 300)

                                        }
                                    },
                                    style:{
                                        cursor: 'pointer',
                                        color: '#0e70ec',
                                        minWidth: '75px'
                                    }
                                }, 
                                [
                                    h('span', params.row.t_roomname||'errow'),
                                    h('br'),
                                    h('span', {
                                    directives: [{
                                        name: 'formatNumber',
                                        // value: params.row.t_gameBal
                                        value: params.row.score
                                    }] 
                                    })
                                ]
                            )
                        }
                    }, {
                        title: '返点比例',
                        render(h, params) {
                            return h('span', params.row.t_onwerRebateType)
                        }
                    },
                     {
                        title: '注册时间',
                        render(h, params) {
                            return h('span', tools.getDate(params.row.t_regTime * 1000, true))
                        }
                    },
                     {
                        title: '注册IP',
                        render(h, params) {
                            let arr = params.row.t_regIP.split(' - ')
                            return h('p', [
                                h('div',arr[0]),
                                h('div',arr[1]),
                            ])
                        }
                    },
                     {
                        title: '最近登录时间', 
                        render(h, params) {
                            return h('span', tools.getDate(params.row.t_lastLoginTime * 1000, true))
                        }
                    }, {
                        title: '登录次数',
                        // key: 'login_times'
                        render(h, params) {
                            return h('a',{
                                on:{
                                    click:()=>{
                                       /*  查询最近七天 */
                                        let end_time = new Date()
                                        let start_time =end_time.valueOf() -3600 * 24 * 1000 * 6
                                        let par = { 
                                            acc_id: params.row.t_accountID,
                                            start_date: tools.formatDate(start_time, false),
                                            end_date: tools.formatDate(end_time, false),
                                            team_type: 2 // 临时 1,2
                                        }
                                        self.openPop('LoginLog',par)
                                        // self.$router.push({path: '/loginlog',query: par})
                                    }
                                }
                            }, params.row.t_loginTimes)
                        }

                    }, {
                        title: '游戏时长/min',
                        key: 't_onlineTime'
                    }, {
                        title: '操作',
                        width: 300,
                        render(h, params) {
                            let arr = [
                                {
                                    text: '游戏记录',
                                    name: 'GameRecords'
                                }, {
                                    text: '充值记录',
                                    name: 'ChargeRecords'
                                }, {
                                    text: '提款记录',
                                    name: 'WithdrawRecords'
                                }, {
                                    text: '返利记录',
                                    name: 'RebateRecords'
                                }
                            ]
                            return h('div', [
                                arr.map((item, index) => {
                                    return h('Button', {
                                        props: {
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                let end_time = new Date()
                                                let start_time =end_time.valueOf() -3600 * 24 * 1000 * 6
                                                let par = {
                                                    acc_id: params.row.t_accountID,
                                                    start_date: tools.formatDate(start_time, false),
                                                    end_date: tools.formatDate(end_time, false),
                                                    team_type: 2
                                                }
                                                /*  传入组件名,参数 */
                                                self.openPop(item.name,par)
                                            }
                                        }
                                    }, item.text)
                                })
                            ])
                        }
                    }
                ],
                list: [],
                page_subcount: '',
                page_goldCoin: '',
                page_bankGoldCoin: '',
                all_subcount: 0,
                all_goldCoin: 0,
                all_bankGoldCoin: 0,
                search_children_id: '',
                adminInfo: {}
            }
        },
        methods: {
            updatePageSize() {
                this.pageNo = 1
                this.getList()
            },
            search(){
                this.pageNo = 1
                this.levelsCatche = []
                this.search_children_id = ''
                this.getList()
                this.$router.push({name: this.$route.name})
            },
            updatePageNo() {
                    this.getList()
            },
               /*  获取子级 */
            searchChild(id) {
                this.pageNo = 1
                this.search_children_id = id
                this.searchItems.acc_id = ''
                this.getList()
                this.$router.push({name: this.$route.name, query: {children_id: id}})
            },
            clearAll() {
                this.pageNo = 1
                this.search_children_id = ''
                this.searchItems.acc_id = ''
                this.levelsCatche = [ ]
                this.getList()
                this.$router.push({name: this.$route.name})
            },
            /* 打开弹出框 */
            openPop(component,params) {
                this.popShow = true;
                this.currentComponent = component;
                component 
                this.par =params
            },
            getRoom(list) {
                list.map( (item, index) =>{
                    setTimeout( ()=>{
                        this.getRoomApi(item.t_accountID)
                    },0)
                })
                this.list =list
            },
            getRoomApi(id) {
                let self = this
                this.$http.get('/get_room?acc_id='+id).then( res=>{
                    if(res.no===0) {
                        self.list.map( (item, index) => {
                            if(item.t_accountID==id){
                                item.t_roomname = res.data.room
                                item.score = res.data.score
                            }
                        })
                        return res.data
                    }
                })
            },
            /** 
             * 获取列表                         
             * 如果请求成功，则修改已请求过的id层级
             * 如果请求参数中无id, 则重置id层级为当前id
             */
            getList() {
                this.loading = true
                let params = this.searchItems
                params.search_children_id = this.search_children_id
                params.page_index = this.pageNo
                params.page_limit = this.pageSize
                this.$http.get('/get_staff_list' + tools.toQueryString(params))
                .then(data => {
                    this.loading = false
                    if(!data.no) {
                        // let index = this.levelsCatche.indexOf(params.search_children_id)
                        
                        this.isRequest = false
                        this.list = data.data.list || []
                        this.pop_balance = data.data.pop_balance
                        this.self_balance = data.data.self_balance
                        this.bank_balance = data.data.bank_balance
                        this.page_subcount = data.data.page_subcount
                        this.page_goldCoin = data.data.page_goldCoin
                        this.page_bankGoldCoin = data.data.page_bankGoldCoin
                        this.all_subcount = data.data.all_subcount
                        this.all_goldCoin = data.data.all_goldCoin
                        this.all_bankGoldCoin = data.data.all_bankGoldCoin
                        this.total = data.data.total
                        this.pageNo = data.data.page_index
                        this.pageSize = data.data.page_limit
                        if(params.search_children_id) {
                            // 如果当前id在已请求过的id层级中，则把该id下的其它层级移除
                            // if(index > -1) {
                            //     for(let i=this.levelsCatche.length-1; i>=0; i--) {
                            //         if(i<=index) {
                            //             break
                            //         }else{
                            //             this.levelsCatche.pop()
                            //         }
                            //     }
                            // }else{
                                // 否则添加在下级
                                
                            // }
                            if(data.data.father) {
                                this.levelsCatche = data.data.father.split(',')
                                this.levelsCatche.shift()
                                this.levelsCatche.push(params.search_children_id)
                            }
                        }else if(params.acc_id){
                            // 没有搜索本级__
                            if(data.data.father){
                                this.levelsCatche = data.data.father.split(',')
                                this.levelsCatche.shift()
                            }
                            this.$router.push({name: this.$route.name})
                        } else {
                            this.levelsCatche.length && (this.levelsCatche = [])
                        }
                        setTimeout(() => {
                            // this.isRequest = true
                        })
                        this.getRoom(data.data.list);
                    }else{
                        // this.levelsCatche.length && (this.levelsCatche = [])
                    }
                })
            }
        },
        mounted() {
             // tools.dragBox(document.getElementById('popContain'),document.getElementById('pop'))
            /**
             * 刷新页面的时候，按照query.id重新请求
             */
            if(this.$route.query.children_id) { this.search_children_id = this.$route.query.children_id}
            // this.adminInfo = window.tools.getSession('admin_info')
            this.adminInfo = JSON.parse(localStorage.getItem('admin_info'))            
            this.getList()
        },
        // beforeRouteUpdate(to, from, next) {
        //     // 解决用不存在于id列表中的id请求，造成请求两次的问题
        //     if(this.isRequest) {
        //         this.searchItems.acc_id = to.query.id
        //         this.getList()
        //     }
        //     next()
        // },
        
        // watch: {
        //     /* 禁止开始时间大于结束时间 */
        //     'searchItems.start_date': function(newVal, oldVal) {
        //         tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'start_date')
        //     },
        //     'searchItems.end_date': function(newVal, oldVal) {
        //         tools.limitTime(newVal, oldVal, this.searchItems,this.$toast, 'end_date')
        //     },
        // }
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
        margin-top: 10px;
        align-items: center;
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
    .bg-pink{
        background-color: rgba(255, 153, 255);
    }
    /* 弹出框 */
    .delete{
        text-align: right;
        margin-right:15px;
        cursor: pointer;
        font-size:15px;
    }
    .delete:hover{
        color:red;
    }
    .pop{
        position: fixed;
        z-index: 13;
        top:50%;
        /* left:50%; */
        transform: translateX(-50%);
        transform: translateY(-50%);
        overflow: scroll;
        max-width:80%;
        max-height:90%;
        padding:8px;
        padding-bottom:20px;
        border:2px solid rgb(9, 148, 235);
        border-radius: 5px;
        box-shadow: 0 0 4px 1px rgba(16, 57, 77, 0.445);
        background: rgb(254, 254, 255);
    }
    .search-child{
        text-align: left;
        margin-left: 15px;
        margin-bottom: 5px;
    }
    .child-id{
        margin-left: 15px;
        font-size: 16px;
    }
    .home-id{
        font-size: 15px;
    }
</style>
