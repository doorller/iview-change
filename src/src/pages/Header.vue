<template>
    <div class="header">
        <span class="header-name">代理运营平台</span>
        <span :class="['fold-icon',menu_unFold ? '' : 'icon-menu-fold']" @click="menuFold"><i class="iconfont icon-fold"></i></span>
        <span>北京 (GMT+8) {{timeNow}}</span>
        <div class="user-menu">
            <div v-clickoutside="updateShowMenu">
                <span class="avatar iconfont icon-touxiang"></span>
                <span @click="avatar_unfold" class="pointer">{{adminInfo.nickname}}<i :class="['iconfont', 'icon-tubiaozhizuo-', showMenu ? 'icon-upfold' : '']"></i></span>
                <transition name="user-menu">
                    <ul v-if="showMenu" class="user-menu-list">
                        <!-- <li @click="toChangePwd">修改密码</li> -->
                        <li @click="logout">退出登录</li>
                    </ul>
                </transition>
            </div>
        </div>
        <Dialog :status.sync="dialogStatus">
            <!-- 修改密码 -->
            <div v-if="dialogStatus===1" class="change-pwd">
                <h3>修改密码</h3>
                <form>
                    <ul>
                        <li v-show="false">
                            <Input type="text"/>
                        </li>
                        <li>
                            <label>旧密码：</label>
                            <Input v-model="oldPwd" type="password" holder="请输入"/>
                            <span class="change-tip"><i v-if="oldPwdTip" class="iconfont icon-jinggao1-"></i>{{oldPwdTip}}</span>
                        </li>
                        <li>
                            <label>新密码：</label>
                            <Input @update="checkNewPwd" type="password" v-model="newPwd" holder="请输入"/>
                            <span class="change-tip"><i v-if="newPwdTip" class="iconfont icon-jinggao1-"></i>{{newPwdTip}}</span>
                        </li>
                        <li>
                            <label>确认新密码：</label>
                            <Input @update="checkRePwd" type="password" v-model="rePwd" holder="请输入"/>
                            <span class="change-tip"><i v-if="rePwdTip" class="iconfont icon-jinggao1-"></i>{{rePwdTip}}</span>
                        </li>
                        <li>
                            <label></label>
                            <Button size="large" @click="dialogStatus=false">取消</Button>
                            <Button size="large" class="ml-30" @click="submit" active>提交</Button>
                        </li>
                    </ul>
                </form>
            </div>
            <!-- 修改密码 -->
        </Dialog>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'Header',
        props:{

        },
        computed: {
            ...mapGetters(['isLogin', 'adminInfo'])
        },
        data() {
            return {
                menu_unFold: true,
                timestamp: 0,
                timeNow: '',
                showMenu: false,
                dialogStatus: 0,
                oldPwd: '',
                newPwd: '',
                rePwd: '',
                oldPwdTip: '',
                newPwdTip: '',
                rePwdTip: '',
                setTime:''
            }
        },
        methods: {
            ...mapActions(['updateIsLogin', 'updateAdminInfo', 'updateMenuNav_show']),
            menuFold() {
                this.menu_unFold = !this.menu_unFold;
                // this.showMenu = this.menu_unFold;
                this.updateMenuNav_show(this.menu_unFold);
            },
            avatar_unfold(){
                this.updateShowMenu(true);
            },
            updateShowMenu(bool) {
                this.showMenu = bool===true ? !this.showMenu : false
            },
            toChangePwd() {
                this.showMenu = false
                this.dialogStatus = 1
            },
            logout() {
                this.showMenu = false
                let self = this
                this.$modal.info({
                    content: '确认退出登录?',
                    confirmFn() {
                        self.$http.get('/logout')
                        .then(data => {
                            if(!data.no) {
                                self.$toast.success('退出成功')
                                // window.tools.removeSession('isLogin')
                                // window.tools.removeSession('admin_info')
                                localStorage.removeItem('isLogin')
                                localStorage.removeItem('admin_info')
                                self.$router.push('/login')
                            }
                        })
                    }
                })
            },
            checkNewPwd() {
                if(!this.newPwd) {
                    this.newPwdTip = '新密码不能为空'
                    return false
                }else if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.newPwd)) {
                    this.newPwdTip = '密码格式不正确'
                }
                this.newPwdTip = ''
                return true
            },
            checkRePwd() {
                if(this.newPwd !== this.rePwd) {
                    this.rePwdTip = '两次密码输入不一致'
                    return false
                }
                this.rePwdTip = ''
                return true
            },
            submit() {
                if(this.checkNewPwd() && this.checkRePwd()) {
                    let params={
                        old_passwd: this.oldPwd,
                        passwd: this.newPwd,
                        second_passwd: this.rePwd
                    }
                    this.$http.put('/backstage_system/admin_user/admin_passwd', params).then(res=>{
                        if(res.code===200) {
                            this.$toast.success('成功修改密码')
                            this.oldPwd ='';
                            this.newPwd = '';
                            this.rePwd = '';
                            dialogStatus = 0;
                        }else{
                        }
                    })
                }
            },
            /**
             * 通过本地时间获取当前的北京时间 
             */
            getTimeNow() {
                this.timeNow = window.tools.formatDate(this.timestamp, true)
                this.setTime = setInterval(() => {
                    this.timestamp += 1000
                    this.timeNow = window.tools.formatDate(this.timestamp, true)
                }, 1000)
            }
        },
        mounted() {
            this.timestamp = window.tools.getLocalTime(8).valueOf()
            this.getTimeNow()
            // let isLogin = tools.getSession('isLogin')
            let isLogin = localStorage.getItem('isLogin')
            if(isLogin) {
                // this.updateAdminInfo(tools.getSession('admin_info'))
                this.updateAdminInfo(JSON.parse(localStorage.getItem('admin_info')))
                this.updateIsLogin(isLogin)
            }else{
                this.$router.replace('/login')
            }
        }
    }
</script>

<style scoped>
    .header{
        width: 100%;
        background-color: #000066;
        box-sizing: border-box;
        padding: 10px .1rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .header-name{
        font-size:24px;
        margin: 0 5px;
        margin-right: 15px;
    }
    .header>img{
        width: 5%;
        height: 42px;
        background: gray;
    }
    .fold-icon{
        margin: 0 25px;
        box-shadow: 0 0 4px rgb(46, 45, 45);
        transform: scale(1.7);
        transition: transform .3s;
        cursor: pointer;
    }
    .icon-menu-fold{
        transform: scale(1.5) rotate(-90deg);
    }
    .header>span{
        align-self: flex-end;
        color: #fff;
        white-space: nowrap;
        /* margin-left: 1rem; */
    }
    .header .user-menu{
        margin-left: auto;
    }

    .user-menu-enter,
    .user-menu-leave-to{
        opacity: 0;
        max-height: 0;
    }
    .user-menu-leave,
    .user-menu-enter-to{
        opacity: 1;
        max-height: 1000px;
    }
    .user-menu-enter-active,
    .user-menu-leave-active{
        transition: all .3s ease-in-out;
    }
    .header .user-menu{
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 32px;
        color: #fff;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .header .user-menu>div{
        position: relative;
        padding: 0 .15rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .header .user-menu .avatar{
        font-size: 24px;
        margin-right: 10px;
    }
    .header .user-menu .iconfont{
        margin-left: 3px;
    }
    .header .user-menu .icon-upfold{
        transform: rotate(90deg);
    }
    .header .user-menu ul {
        position: absolute;
        top: 100%;
        right: 20px;
        margin-top: 5px;
        border-radius: 4px;
        background-color: #fff;
        color: #000;
        overflow: hidden;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
    }
    .header .user-menu li{
        padding: 0 20px;
        cursor: pointer;
        border-radius: 4px;
        white-space: nowrap;
    }
    .header .user-menu li:hover{
        background-color: #131E26;
        color: #fff;
    }

    /* 修改密码 start */
    .change-pwd{
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .change-pwd .v-input{
        width: 200px;
    }
    .change-pwd h3{
        text-align: left;
        padding-left: 30px;
        font-size: .2rem;
    }
    .change-pwd ul label{
        display: inline-block;
        width: 200px;
        text-align: right;
    }
    .change-pwd ul .change-tip{
        display: inline-block;
        width: 140px;
        padding-left: 10px;
        text-align: left;
        font-size: 12px;
        color: rgb(153, 153, 153);
    }
    .change-pwd ul .change-tip .iconfont{
        margin-right: 3px;
        color: #FFBF00;
    }
    .change-pwd ul li{
        margin-top: 20px;
        margin-left: 50px;
        /* width:400px; */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .change-pwd ul li:last-child {
        margin: 20px 0;
    }
    /* 修改密码 end */
</style>


