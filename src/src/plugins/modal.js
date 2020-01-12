import Vue from 'vue'
import Modal from '../pages/components/Modal'

function instance(props = {}) {
    props.css = props.css || {}
    props.show = true
    props.source = 2

    let ModalConstructor  = Vue.extend(Modal),
        tpl = new ModalConstructor ({
            propsData: props,
            methods: {
                removeAfterHandle() {
                    document.body.removeChild(tpl)
                }
            }
        }).$mount().$el;

    document.body.appendChild(tpl)
}

function configProps(params) {
    let opt = {}
    if(typeof params === 'string') {
        opt.content = params
    }else if(params instanceof Object) {
        opt = params
    }
    return opt
}

export default {
    info(props) {
        instance(Object.assign({
            title: '温馨提示',
            type: 'info'
        }, configProps(props)))
    },
    success(props) {
        instance(Object.assign({
            title: '成功',
            type: 'success'
        }, configProps(props)))
    },
    warning(props) {
        instance(Object.assign({
            title: '警告',
            type: 'warning'
        }, configProps(props)))
    },
    error(props) {
        instance(Object.assign({
            title: '错误',
            type: 'error'
        }, configProps(props)))
    }
}