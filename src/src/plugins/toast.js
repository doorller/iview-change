import Toast from '../pages/components/Toast.vue'

export default {
	install(Vue) {
		Vue.prototype.$toast = function(options) {
			let opt = {}
			if (typeof options === 'string' || typeof options === 'number') {
				opt = {
					message: options,
					duration: 3000
				}
			} else if(typeof options === 'object'){
				opt = options
				opt.duration = opt.duration || 3000
			}
			
			let ToastConstructor  = Vue.extend(Toast),
				tpl = new ToastConstructor ({
					propsData: opt,
					methods: {
						removeAfterClose() {
							document.querySelector('#message-box').removeChild(tpl)
						}
					}
				}).$mount().$el;
	
			document.querySelector('#message-box').appendChild(tpl)

			if (opt.duration) {
				setTimeout(function () {
					document.querySelector('#message-box').removeChild(tpl)
				}, opt.duration)
			}
		}
		
		new Array('error', 'success', 'info', 'warning').forEach(type => {
			Vue.prototype.$toast[type] = function (tips) {
				return Vue.prototype.$toast({
					message: tips,
					type
				})
			}
		})
	}
}