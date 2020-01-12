<template>
	<transition name="toast">
		<div v-show="show" class="vue-toast">
			<div>
				<i v-if="type==='warning'" class="iconfont icon-jinggao1- toast-warning"></i>
				<i v-else-if="type==='success'" class="iconfont icon-chenggong- toast-success"></i>
				<i v-else-if="type==='error'" class="iconfont icon-cuowuguanbi- toast-error"></i>
				<i v-else class="iconfont icon-jinggao- toast-info"></i>
				<span>{{message}}</span>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
	export default {
		name: 'Toast',
		props: {
			message: {
				type: String,
				required: true
			},
			type: {
				type: String,
				default: () => 'info'
			},
			duration: {
				type: Number,
				default: () => 3000
			}
		},
		data() {
			return {
				show: false
			}
		},
		mounted() {
			this.show = true
			setTimeout(() => {
				this.show = false
			}, this.duration - 400)
		}
	}
</script>

<style scoped>
	.toast-leave-to,
	.toast-enter{
		margin-top: -55px;
		opacity: 0;
	}
	.toast-enter-to,
	.toast-leave{
		margin-top: 0;
		opacity: 1;
	}
	.toast-enter-active,
	.toast-leave-active {
		transition: all .3s ease;
	}
	.vue-toast{
		height: 55px;
		box-sizing: border-box;
		padding: 8px;
    	text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.vue-toast div{
		height: 100%;
		padding: 0 16px;
		border-radius: 4px;
		box-shadow: 0 1px 6px rgba(0,0,0,.2);
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.vue-toast i{
		margin-right: 5px;
	}
	.vue-toast .toast-success{
		color:#19be6b;
	}
	.vue-toast .toast-warning{
		color: #f90;
	}
	.vue-toast .toast-info{
		color: #2d8cf0;
	}
	.vue-toast .toast-error{
		color: #ed4014;
	}
</style>