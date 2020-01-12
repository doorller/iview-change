<template>
    <div class="main">
        <ul class="admin-info">
            <li>
                <label>您的ID：</label>
                <span class="text-blue">{{adminInfo.id}}</span>
            </li>
            <li>
                <label>您的返点：</label>
                <span class="text-blue">{{list.rebase||0}}</span>
            </li>
            <li>
                <label>推广链接：</label>
                <span>{{promoteUrl}}</span>
                <Button color="green" class="copy-btn">复制</Button>
            </li>
            <li>
                <label class="qrtext">推广二维码：</label>
                <div id="qrcode"></div>
                <Button color="green" class="save-qrcode" @click="saveQrcode">保存到本地</Button>
            </li>
        </ul>
        <div class="statistical-data">
            <div class="time-range">
                <Button
                    v-for="(item, index) in timeFilterArr"
                    :key="index"
                    :active="activeIndex===index"
                    @click="getTimeRange(item.value, index)"
                >{{item.label}}</Button>
            </div>
            <div class="user-data data-box">
                <h3>用户数据</h3>
                <ul>
                    <li>
                        <span class="text-blue">{{list.team_cnt}}</span>
                        <span>团队人数</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.team_rebase}}</span>
                        <span>团队余额</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.Addpop}}</span>
                        <span>新增下级人数</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.ret_amount}}</span>
                        <span>返利金额</span>
                    </li>
                </ul>
            </div>
            <div class="deposite-withdraw-data data-box">
                <h3>充提数据</h3>
                <ul>
                    <li>
                        <span class="text-blue">{{list.t_camount}}</span>
                        <span>总存款</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.t_tamount}}</span>
                        <span>总提款</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.c_popnum}}</span>
                        <span>存款人数</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.t_scpopnum}}</span>
                        <span>首充人数</span>
                    </li>
                    <li>
                        <span class="text-blue">{{list.t_popnum}}</span>
                        <span>提款人数</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import Clipboard from 'clipboard'
    import QRCode  from "qrcodejs2"

    export default {
        name: 'Main',
        components: {
            QRCode
        },
        data() {
            return {
                date: '',
                activeIndex: 0,
                startTime: '',
                endTime: '',
                downloadUrl: '',
                clipboard: undefined,
                timeFilterArr: [
                    {
                        label: '今天',
                        value: 'today'
                    }, {
                        label: '昨天',
                        value: 'yesterday'
                    }, {
                        label: '最近七天',
                        value: '7days'
                    }, {
                        label: '最近十五天',
                        value: '15days'
                    }
                ],
                adminInfo: {},
                list : {
                    team_cnt : '',             // 团队人数
                    team_rebase : '',          // 团队余额
                    Addpop : '',               // 新增下级人数
                    ret_amount : '',           // 返利金额
                    t_camount: '',             // 总存款
                    t_tamount: '',             // 总提款
                    c_popnum: '',              // 存款人数
                    t_scpopnum: '',            // 首充人数
                    t_popnum: '',              // 提款人数
                    url:'',                    //url
                    rebase:'',
                },
                promoteUrl:'',
                isBindCopy: false,
                qr: {},
            }
        },
        methods: {
            /**
             * 根据选择时间范围，初始话startTime与endTime
             */
            getTimeRange(type, index) {
                let date = new Date(),
                    timestamp,
                    day,
                    start,
                    end;
                // if(this.activeIndex===index) return
                this.activeIndex = index  
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
                this.startTime = tools.formatDate(start, false)
                this.endTime = tools.formatDate(end, false)
                this.getStatisticalData()
            },
            /**
             * 获取主页的统计数据
             */
            getStatisticalData() {
                // console.log(sessionStorage.getItem('admin_info'))
                let params = {
                    acc_id: this.adminInfo.id,
                    start_date: this.startTime,
                    end_date: this.endTime ||tools.formatDate(new Date(),false),
                }
                params = window.tools.toQueryString(params)
                this.$http.get('/get_homepage_data'+params).then( res => {
                    if(!res.no) {
                        this.list = res.data
                        if(!this.promoteUrl) {
                            this.promoteUrl = res.data.url+'#id='+this.adminInfo.id
                            this.bindCopy()
                            this.qrcode()  //$nextTick
                            this.getShortUrl()
                        }
                    }
                })
            },
            /**
             * 绑定复制推广url的事件
             */
            bindCopy() {
                let self = this
                self.clipboard = {}
                self.clipboard = new Clipboard('.copy-btn', {
                    text: function () {
                        let txt = self.promoteUrl
                        return txt;
                    }
                })
                self.clipboard.on('success', function() {
                    self.isBindCopy || self.$toast.success('复制成功')
                    self.isBindCopy = true
                    self.clipboard.destroy()
                })
                self.clipboard.on('error', function () {
                    self.$toast.error('复制失败')
                    self.clipboard.destroy()
                })
            },
            /**
             * 点击下载二维码
             */
            saveQrcode(){
                let aLink = document.createElement('a'),
                    base64 = '';
                if(!this.promoteUrl) return
                base64 = document.querySelector('#qrcode').children[1].src
                aLink.download = "qrcode.png"
                aLink.href = base64
                aLink.click()
            },
            /* url 转二维码图 */
            qrcode() {
                let qrDom = document.querySelector('#qrcode');
                if(qrDom){
                    // console.log('qrDom: ', qrDom);
                }
                qrDom.innerHTML = '' // 清空之前的内容
                let qrcode = new QRCode('qrcode', {
                    width: 135,
                    height: 135,
                    text:  this.promoteUrl,
                    // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    // background: '#f0f',   // 背景色
                    // foreground: '#ff0'    // 前景色
                })
            },
            /* 获取短链接 */
            getShortUrl() {
                this.$http.get('/get_www_url')
                .then( res => {
                    if(res.url_short){
                        this.promoteUrl =res.url_short // 更改为短链接
                        this.qrcode()     // 图也要改
                        this.bindCopy()   // 复制内容更改
                    }
                })
            }
        },
        mounted() {
            this.startTime = tools.formatDate(new Date(), false)
            // this.adminInfo = window.tools.getSession('admin_info')   改为localStorage
            this.adminInfo = JSON.parse(localStorage.getItem('admin_info'))
            this.getStatisticalData()
            // ie 浏览器不建议使用
            let explore = window.tools.getExploreName()
            if(explore==='IE' ||explore==='IE>=11'){
                alert('请更换其他浏览器!!')
            }
        }
    }
</script>

<style scoped>
    .main span.text-blue{
        color: #0000ff;
        font-weight: bold;
    }
    .admin-info{
        margin-top: 20px;
    }
    .admin-info li{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
    }
    .admin-info li label{
        display: inline-block;
        width: 1.5rem;
        text-align: right;
        line-height: 32px;
    }
    .admin-info li button{
        margin-left: 20px;
    }
    .admin-info li:last-child label{
        align-self: flex-start;
    }
    .admin-info li:last-child a{
        display: none;
    }
    .admin-info li .qrcode{
        width: 150px;
        height: 150px;
        display: flex;
    }
    .admin-info li .save-qrcode{
        align-self: flex-end;
    }
    .statistical-data{
        margin-top: 20px;
    }
    .statistical-data .time-range{
        display: flex;
        flex-direction: row;
    }
    .statistical-data .time-range button{
        margin-left: 15px;
    }
    .data-box{
        margin-top: 30px;
    }
    .user-data h3{
        background-color: #0099FF;
    }
    .deposite-withdraw-data h3{
        background-color: #009900;
    }
    .data-box h3{
        font-size: 20px;
        color: #fff;
        padding-left: 15px;
        line-height: 40px;
        text-align: left;
    }
    .data-box ul{
        border: 1px solid #e7eaec;
        display: flex;
        flex-direction: row;
        padding: 10px 0;
        font-size: 20px;
    }
    .data-box ul li{
        width: 25%;
        height: 1.2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .data-box ul li:not(:last-child){
        border-right: 1px solid #e7eaec;
    }
    .qrtext{
        white-space: nowrap;
    }
</style>

