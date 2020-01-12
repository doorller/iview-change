import Vue from "vue";
import VueRouter from "vue-router";
// import { state } from "../vuex";

import Main from '../../../pages/Main'
import Login from '../../../pages/Login'
import GroupList from '../../../pages/GroupList'
import GameRecords from '../../../pages/GameRecords'
import ChargeRecords from '../../../pages/ChargeRecords'
import WithdrawRecords from '../../../pages/WithdrawRecords'
import RebateRecords from '../../../pages/RebateRecords'
import LoginLog from '../../../pages/LoginLog'
import RegistLog from '../../../pages/RegistLog'


/* 系统设置 */
Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      component: Login,
      name: "Login",
      path: "/login",
    },
    {
      component: Main,
      name: "Main",
      path: "/",
      meta: {
        desc: '代理首页'
      }
    },
    {
      component: GroupList,
      name: "GroupList",
      path: "/grouplist",
      meta: {
        desc: '团队列表'
      }
    },
    {
      component: GameRecords,
      name: "GameRecords",
      path: "/gamerecords",
      meta: {
        desc: '游戏记录'
      }
    },
    {
      component: ChargeRecords,
      name: "ChargeRecords",
      path: "/chargerecords",
      meta: {
        desc: '充值记录'
      }
    },
    {
      component: WithdrawRecords,
      name: "WithdrawRecords",
      path: "/withdrawrecords",
      meta: {
        desc: '提现记录'
      }
    },
    {
      component: RebateRecords,
      name: "RebateRecords",
      path: "/rebaterecords",
      meta: {
        desc: '返利记录'
      }
    },
    {
      component: LoginLog,
      name: "LoginLog",
      path: "/loginlog",
      meta: {
        desc: '登录日志'
      }
    },
    {
      component: RegistLog,
      name: "RegistLog",
      path: "/registlog",
      meta: {
        desc: '注册日志'
      }
    },
    {
      path: '*',
      redirect: {
        path:'/'
      },
      meta: {
        desc: '主页'
      }
    }
  ]
});

/*
 * 全局拦截路由调转
 * 如果不是登陆页或主页 则允许加入缓存
 * 所有需要缓存的页面，需要设置 meta 的 desc 属性
 * component 的 name 须与对应的 router 的 name 一致
 */
/* router.beforeEach((to, from, next) => {
    if(to.meta.desc) {
      let name = to.name;
      state.activePage = name
      state.activePagePath = to.path
      !state.cachedPages[name] && (state.cachedPages[name] = to.meta.desc)
    }
    next();
}); */

export default router;
