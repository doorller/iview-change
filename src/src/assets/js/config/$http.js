'use strict';
import axios from 'axios'
import api from './api'
import Modal from '../../../plugins/modal'
import router from '../../../assets/js/router'
import {
	state
} from '../vuex';

const BASE_PATH = '/api' // 开发环境, 以被代理
// const BASE_PATH = 'https://www.hgqp1688.com' // 开发环境, 以被代理
const ERROR_MAP = {
	400: {
		msg: '请求错误'
	},
	401: {
		msg: '未授权，请登录',
		callback() {
			tools.removeSession('token')
			tools.removeSession('admin_info')
			state.cachedPages = {}
			router.replace('/login')
		}
	},
	403: {
		msg: '拒绝访问'
	},
	404: {
		msg: '请求地址出错'
	},
	408: {
		msg: '请求超时'
	},
	500: {
		msg: '服务器内部错误'
	},
	501: {
		msg: '服务未实现'
	},
	502: {
		msg: '网关错误'
	},
	503: {
		msg: '服务不可用'
	},
	504: {
		msg: '网关超时'
	},
	505: {
		msg: 'HTTP版本不受支持'
	},
	20009: {
		msg: '登陆失效'
	},
	other: {
		msg: '服务器繁忙'
	}
}

let refreshSubscribers = []
window.isRefreshing = false

let http = axios.create({
	baseURL: BASE_PATH,
	timeout: 15000,
	retry: 2,
	retryDelay: 1000,
	// withCredentials: true, // 允许携带 cookie
	
	headers: {
		'Content-Type': 'application/json', 
		'Cache-Control': 'no-cache'
	}
})

http.interceptors.request.use(
	req => {
		// let isLogin = window.tools.getSession('isLogin')
		let isLogin = JSON.parse(localStorage.getItem('isLogin'))
		if (isLogin) {
			if (req.headers['Content-Type'] === 'application/vnd.ms-excel') {
				req.responseType = 'blob'
			}
			return req
		} else {
			// 如果没有登录直接返回请求        /getviscode(获取验证码)
			if (req.url.indexOf('/login') === -1 && req.url.indexOf('/getviscode') == -1) {
				Modal.warning({
					content: '请先登录再进行访问',
					confirmFn() {
						router.replace('/login')
					},
					cancelable: false
				})
			} else {
				return req
			}
		}
	},
	error => {
		reject(error)
	}
)

http.interceptors.response.use(
	res => {
		let data = res.data
		if (/application\/json/.test(res.headers['content-type'])) {
			let modal = document.getElementsByClassName('vue-modal')
			if (data.no && modal.length < 2) {
				Modal.warning({
					content: data.msg,
					cancelable: false,
					confirmFn() {
						if (data.no === 301) return router.replace('/login')
					}
				})
			} else {
				if (data.no === 301) {
					alert('请重新登录')
					return router.replace('/login')
				}

			}
		} else {
			// 下载文件
			if (data.no) {
				Modal.warning({
					content: data.message,
					cancelable: false
				})
			} else if (data.not_need) {
				// 返回的内容为不需要的内容,
			} else {
				// let url = window.URL.createObjectURL(new Blob([data])),
				// link = document.createElement('a');
				// link.style.display = 'none'
				// link.href = url
				// link.setAttribute('download', res.headers['content-disposition'].match(/"(\S*)"/)[1])
				// document.body.appendChild(link)
				// link.click()
				// setTimeout(() => {
				// 	document.body.removeChild(link)
				// }, 1000)
			}
		}
		return Promise.resolve(data)
	},
	error => {
		let status = error.response ? error.response.status : 0
		let config = error.config
		// 超时时重新请求, 否则报错
		if (status) {
			handleError(status)
		} else if (!config || !config.retry) {
			// return Promise.reject()
		} else {
			config.retryCount = config.retryCount || 0
			// 重新请求次数超过最大支持的次数报错
			if (config.retryCount >= config.retry) {
				Modal.error({
					content: '请求超时',
					cancelable: false
				})
				return Promise.reject(error)
			}
			config.retryCount += 1
			let backoff = new Promise(resolve => {
				setTimeout(() => {
					resolve()
				}, config.retryDelay || 1)
			})
			return backoff.then(() => {
				return http(config)
			})
		}
	}
)

function subscribeTokenRefresh(cb) {
	refreshSubscribers.push(cb);
}

function onRefreshed(token) {
	refreshSubscribers.map(cb => cb(token));
}

function refreshToken() {
	return new Promise((resolve, reject) => {
		let refresh_token = window.tools.getCookie('refresh_token')
		if (refresh_token) {
			axios.post(BASE_PATH + api.refreshToken.url, {
					refreshToken: refresh_token
				})
				.then(res => {
					if (!res.data.no) {
						resolve(res.data)
					} else {
						Modal.warning({
							content: '登陆过期, 请重新登陆',
							confirmFn() {
								window.tools.removeCookie('token')
								window.tools.removeCookie('refresh_token')
								window.tools.removeSession('token')
								router.replace('/login')
							},
							cancelable: false
						})
					}
					window.isRefreshing = false
				})
				.catch(err => {
					return Promise.reject(err)
				})
		} else {
			Modal.warning({
				content: '登陆过期, 请重新登陆',
				confirmFn() {
					window.tools.removeCookie('token')
					window.tools.removeCookie('refresh_token')
					window.tools.removeSession('token')
					router.replace('/login')
				},
				cancelable: false
			})
		}
	})
}

function isTokenExpired() {
	return window.tools.getCookie('token') ? false : true
}

function isRefresTokenExpired() {
	return window.tools.getCookie('refresh_token') ? false : true
}

function handleError(code, msg) {
	let err = ERROR_MAP[code]

	if (err) {
		let obj = {
			content: err.msg,
			cancelable: false
		}
		err.callback && (obj.confirmFn = err.callback)
		document.getElementsByClassName('vue-modal').length < 1 && Modal.error(obj)
	} else if (msg) {
		Modal.error({
			content: msg,
			cancelable: false
		})
	} else {
		Modal.error(ERROR_MAP.other.msg)
	}
}

export default http