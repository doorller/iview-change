import Notice from '../pages/components/Notice.vue'

export default {
    install(Vue) {
        Vue.prototype.$notice = function(options) {
            options.title = options.title || '审核通知'

            // 未设置提示类型，默认播放提示声音及弹框通知
            !options.type && (options.type===1)

            // 如果设置的不是纯提示音，同时页面中已有提示框；则改为只播放提示音
            if(options.type != 3 && document.querySelectorAll('.notice-' + options.source).length) {
                options.type = 3
            }
            let ToastConstructor  = Vue.extend(Notice),
				tpl = new ToastConstructor ({
                    propsData: options,
                    methods: {
						removeAfterClose() {
							document.querySelector('#notice-box').removeChild(tpl)
						}
					}
                }).$mount().$el,
                firstChild = document.querySelector('#notice-box').children[0];

            document.querySelector('#notice-box').insertBefore(tpl, firstChild)
        }
    }
}
