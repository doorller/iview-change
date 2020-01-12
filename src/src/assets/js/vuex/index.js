import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    isLogin: false,
    showMask: false,
    // 已缓存的页面; key 为组件的name,value 为meta.desc
    adminInfo: {},
    menuNav_show: true,
    main_show: true
}
const getters = {
    // withdrawOrderDict
}
const mutations = {

}
const actions = {
    // this.updateWithdrawOrderDict(s)
}

for(let key in state) {
    getters[key] = state => {
        return state[key]
    }
    mutations[key] = (state, data) => {
        state[key] = data
    }
    actions['update' + key.slice(0, 1).toUpperCase() + key.slice(1)] = (state, data) => {
        state.commit(key, data)
    }
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export {
    state,
    store
}