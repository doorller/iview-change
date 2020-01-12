<template>
	<div id="app" ref="app">
		<Header/>
		<div class="container">
			<transition name="menu">
				<div class="menu-nav" v-if="menuNav_show">
					<Menu/>
				</div>
			</transition>
			<div class="wrapper">
				<router-view/>
			</div>
		</div>
		<div class="mask" v-if="showMask"></div>
		<div id="message-box"></div>
		<div id="notice-box"></div>
	</div>
</template>

<script>
import Header from './pages/Header'
import Menu from './pages/Menu'
import {mapGetters, mapActions} from 'vuex'

export default {
	name: 'app',
	data(){
		return {
		}
	},
	computed: {
		...mapGetters(['showMask', 'menuNav_show'])
	},
	components: {
		Header,
		Menu
	},
	methods:{
		refreshToken() {
			// if( sessionStorage.getItem('isLogin') ){
			// 	this.$http.get('/get_check_heartbeat').then( res=>{
			// 	})
			// }
			if( localStorage.getItem('isLogin') ){
				this.$http.get('/get_check_heartbeat').then( res=>{
				})
			}
		}
	},
	mounted() {
		let intervalTime = setInterval(this.refreshToken,60*1000)
	},
	watch: {
		showMask: (val) => {
			document.body.style.overflow = val ? 'hidden' : 'visible'
		}
	}
}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
	.mask{
        position: fixed;
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55,55,55,.6);
    }
	.container{
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	.container .menu-nav{
		width: 2.2rem;
		min-width: 130px;
		background-color: #1C2B36;
	}

	.menu-enter,
    .menu-leave-to{
        opacity: 0;
		transform: translate(-100%)
    }
    .menu-leave,
    .menu-enter-to{
        opacity: 1;
		transform: translate(0)
    }
	.menu-enter-active,
    .menu-leave-active{
        transition: all .2s ease-in-out;
    }
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #F0F3F4;
		padding: .15rem;
		overflow: hidden;
	}
	.wrapper .opened-pages{
		height: 36px;
		padding: 0 .15rem;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.wrapper .opened-pages li.close-all{
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: rgba(0, 153, 153);
	}
	.wrapper .opened-pages li.close-all i{
		font-size: 18px;
	}
	.wrapper .opened-pages .tab-item{
		flex-grow: 1;
		flex-basis: 0%;
		max-width: 120px;
		margin-left: 10px;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 24px;
		padding: 0 5px;
		border: 1px solid rgba(0, 153, 153);
		color: rgba(0, 153, 153);
		border-radius: 12px;
		font-size: 12px;
		cursor: pointer;
	}
	.wrapper .opened-pages li span{
		display: inline-block;
		overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
	}
	.wrapper .opened-pages li.active{
		background-color: rgba(0, 153, 153);
		color: #fff;
	}
	.wrapper .opened-pages li i{
		font-size: 12px;
		margin-left: 5px;
		cursor: pointer;
	}
	.wrapper>div:last-child{
		width: 100%;
		flex: 5;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	.wrapper>div>div{
		width: 100%;
	}
	#message-box{
		position: fixed;
		z-index: 30;
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
	}
	#notice-box{
		position: fixed;
		z-index: 30;
		right: 7px;
		bottom: 10px;
	}
	#notice-box>div:not(:last-child) {
		margin-bottom: 10px;
	}
</style>
