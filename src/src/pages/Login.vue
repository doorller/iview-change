<template>
    <div class="login">
        <div class="login-box">
            <div class="login-title">代理登录</div>
            <form id="loginForm">
                <ul>
                    <li>
                        <Input v-model="username" size="large"
                            @update="checkUname"
                            limit="no-zh-cn"
                            holder="请输入ID或手机号"
                            clearable
                        />
                    </li>
                    <li class="err-item">
                        <span>{{unameMsg}}</span>
                    </li>
                    <li>
                        <Input 
                            v-model="password"
                            size="large"
                            @update="checkPwd"
                            @enter="login"
                            holder="请输入密码"
                            clearable
                            type="password"
                        />
                        </li>
                    <li class="err-item">
                        <span>{{pwdMsg}}</span>
                    </li>
                    <li class="verify" v-if="needQR">
                        <Input
                            v-model="verify"
                            limit="no-zh-cn"
                            size="large"
                            @enter="login"
                            holder="请输入验证码"
                        />
                        <img   :src="verifyImg" @click="getVerifyImg"/>
                    </li>
                    <li class="err-item" v-if="errCount>=3">
                        <span>{{verifyMsg}}</span>
                    </li>
                    <li>
                        <button type="button" @click.enter="login">登入</button>
                    </li>
                </ul>
            </form>
        </div>
    </div>
</template>

<script>
    import md5 from 'md5'
    import { mapActions } from 'vuex'

    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: '',
                unameReg: /^[0-9A-Za-z]{6,16}$/,
                pwdReg: /^[0-9A-Za-z]{6,16}$/,
                unameMsg: '',
                pwdMsg: '',
                verify: '',
                errCount: 0,
                needQR: '',
                verifyMsg: '',
                verifyImg: 'api/getshowcode?'+new Date(),
            }
        },
        methods: {
            ...mapActions(['updateIsLogin', 'updateAdminInfo']),
            checkUname() {
                if(!this.username) {
                    this.unameMsg = '账号不能为空'
                }else{
                    this.unameMsg = this.unameReg.test(this.username) ? '' : '请输入6-16个字母及数字组合'
                }
                return this.unameMsg ? false : true
            },
            checkPwd() {
                if(!this.password) {
                    this.pwdMsg = '密码不能为空'
                }else{
                    this.pwdMsg = this.pwdReg.test(this.password) ? '' : '请输入6-16个字母及数字组合'
                }
                return this.pwdMsg ? false : true
            },
            checkVerify() {
                if(this.verify) {
                    this.verifyMsg = ''
                    return true
                }else{
                    this.verifyMsg = '请输入验证码'
                    return false
                }
            },
            getVerifyImg() {
                this.verifyImg = '/api/getshowcode?' + new Date()
            },
            isNeedQr(){
                this.$http.get('/getviscode').then( res=>{
                if(!res.no){
                    this.needQR = res.needqr
                    this.getVerifyImg()
                }
            })
            },
            login() {
                let modal=document.getElementsByClassName('vue-modal') //有提示框则不能进入
                if(modal.length>0) return
                let params = {
                    username: this.username,
                    passwd: md5(this.password),
                    code: this.verify
                }
                this.$http.post('/login', params)
                .then(data => {
                    if(data && data.no===0) {
                        this.$toast.success('登陆成功')
                        this.errCount = 0
                        // tools.setSession('isLogin', true)
                        // tools.setSession('admin_info', data.data)
                        localStorage.setItem('isLogin', true)
                        localStorage.setItem('admin_info', JSON.stringify(data.data))
                        this.updateIsLogin(true)
                        this.updateAdminInfo(data.data)
                        this.$router.replace('/')
                    } else {
                        this.isNeedQr()
                    }
                })
            }
        },
        beforeRouteEnter(to, from, next) {
            if(tools.getSession('token')) {
                this.updateIsLogin(true)
                next('/')
            }else{
                next()
            }
        },
        mounted() {
            this.isNeedQr()
            // ie 浏览器不建议使用
            let explore = window.tools.getExploreName()
            if(explore==='IE' ||explore==='IE>=11'){
                alert('请更换其他浏览器!!!')
                this.$modal.warning('请更换其他浏览器!!!')
            }
        }
    }
</script>

<style scoped>
    .login{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
    }
    .login-box {
        width: 460px;
        background-color: #000033;
        border-radius: 6px;
        padding-bottom: 50px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .login .login-title{
        min-width: auto;
        line-height: 70px;
        font-size: 20px;
        color: #fff;
        font-weight: bold;
    }
    .login-box li{
        margin: 0 auto;
        width: auto;
    }
    .login-box .v-input{
        width: 300px;
    }
    .login-box .err-item>span{
        display: block;
        width: 300px;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        padding-left: 10px;
        text-align: left;
        color: #ED4014;
        margin: 0 auto;
        font-size: 12px;
    }
    .login-box li.verify{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .login-box li.verify .v-input{
        width: 205px;
    }
    .login-box li.verify img{
        width: 85px;
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
        padding: 3px;
        border-radius: 4px;
        background: #fff;
    }
    .login-box li:last-child {
        margin-top: 10px;
    }
    .login-box button{
        width: 140px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        border: none;
        background-color: #169BD5;
        color: #fff;
        margin-top: 10px;
        font-size: .16rem;
    }
</style>


