
export default {
    /* 
        验证表单输入
        v-validate = Object
        {
            type: [String [phone|username|password] | RegExp],
            desc: String,			验证条目中文描述
            required: Boolean, 		条目是否为可能空
            err: String,			验证出错提示信息
        }
        */
    validate: {
        inserted(el, binding) {
            let tipDom = el.parentNode.lastElementChild,
                query = binding.value;
            el.addEventListener('keyup', () => {
                let val = el.value,
                    text;
                if (!val && query.required) {
                    text = query.desc ? `请输入${query.desc || ''}` : `不能为空`
                } else {
                    switch (query.type) {
                        case 'phone':
                            text = /^1[34578]\d{9}$/.test(val) ? '' : (query.err || '手机号格式不正确')
                            break
                        case 'username':
                            text = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/.test(val) ? '' : (query.err || '请输入4-16个字母及数字组合')
                            break
                        case 'password':
                            text = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val) ? '' : (query.err || '请输入6-16个字母及数字组合')
                            break
                        case 'payPassword':
                            text = /[0-9a-zA-Z]{6,12}/.test(val) ? '' : (query.err || '请输入6-12个字母或数字组合')
                            break
                        case 'email':
                            text = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(val) ? '' : (query.err || '邮箱格式不正确')
                            break
                        default:
                            if (query.type instanceof RegExp) {
                                if (query.type.test(val)) {
                                    text = ''
                                } else {
                                    if (query.err) {
                                        text = query.err
                                    } else {
                                        throw new Error('Directive: validate, binding value syntax error!')
                                    }
                                }
                            }
                    }
                }
                tipDom.className = text ? 'err-msg' : ''
                tipDom.innerText = text ? text : ''
            })
        }
    },
    /* 
        提交表单验证所有输入
        v-checkSubmit = Object
        {   
            id: form的id,
            fn: 验证通过后执行的函数
        }
        */
    checkSubmit: {
        inserted(el, binding) {
            el.addEventListener('update', e => {
                e.preventDefault()
                let form = document.querySelector('#' + binding.value.el),
                    inputs = form.querySelectorAll('input'),
                    eventObj = new Event('keyup', {
                        bubbles: true,
                        cancelable: true
                    });
                inputs.forEach(item => {
                    item.dispatchEvent(eventObj)
                })
                if(form.querySelectorAll('.err-msg').length === 0) {
                    binding.value.fn && binding.value.fn()
                }
            })
        }
    },
        
    /* 
        限制input框输入
        v-inputLimit = String [number|p-number|integer|p-integer|no-zh-cn]
    */
    inputLimit: {
        inserted(el, binding) {
            let reg
            switch(binding.value) {
                case 'number':
                    reg = /[^\-?\d.]/g // 数字
                    break
                case 'p-number': // 正数
                    reg = /[^\d.]/g
                    break
                case 'integer':
                    reg = /[^\-?\d]/g // 整数
                    break
                case 'p-integer': // 正整数
                    reg = /\D/g
                    break
                case 'no-zh-cn':  // 禁止中文
                    reg = /[\u4E00-\u9FA5]*/g
                    break
                default:
            }
            el.addEventListener('keyup', () => {
                el.value = el.value.replace(reg, '')
            })
            el.addEventListener('onafterpaste', () => {
                // console.log(reg)
                el.value = el.value.replace(reg, '')
            })
        }
    },
    // 外部关闭面板
    clickoutside: {
        bind (el, binding) {
            function documentHandler (e) {
                if (el.contains(e.target)) {
                    return false
                }
                if (binding.expression) {
                    binding.value(e)
                }
            }
            el.__vueClickOutside__ = documentHandler;
            document.addEventListener('click', documentHandler);
        },
        unbind (el) {
            document.removeEventListener('click', el.__vueClickOutside__);
            delete el.__vueClickOutside__;
        }
    },
    // 将数字格式化为每三个一组 
    formatNumber: {
        bind(el, binding) {
            let arr = (binding.value || 0).toString().split('.')
            el.innerText = arr[1] ? arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + arr[1] : arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        },
        //没有update 更新时有些数据会丢失.例如user/bancard 卡号查询时,
        // 可能某些情况和想的任然不一样,待测试.
        update(el, binding) {
            let arr = (binding.value || 0).toString().split('.')
            el.innerText = arr[1] ? arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + arr[1] : arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }
    },
    // 格式化银行卡号
    formatBankcount: {
        bind(el, binding) {
            el.innerText = binding.value.toString().replace(/(\d{4})(?=\d)/g, '$1 ')
        },
        update(el, binding) {
            el.innerText = binding.value.toString().replace(/(\d{4})(?=\d)/g, '$1 ')
        },
    },
    // 隐藏银行卡号
    hideBankcount: {
        bind(el, binding) {
            el.innerText = binding.value.toString().replace(/(\d{4})(\d*)(\d{4})/, '$1****$3')
        }
    },
    // 影响手机号第4-7位
    hidePhoneNo: {
        bind(el, binding) {
            el.innerText = binding.value.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        },
        update(el, binding) {
            el.innerText = binding.value.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        },
    }
}