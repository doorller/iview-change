<template>
    <div class="menu">
        <ul class="level1">
            <li
                v-for="(item, index) in menuList"
                :key="index"
                :class="[curIndex===index ? 'active' : '', curIndex===index && isExpand ? 'expand' : '']"
            >
                <div class="inner">
                    <span @click="expandMenu(index)">
                        {{item.name}}
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'

export default {
    name: "Menu",
    computed: {
        ...mapGetters(['activePagePath'])
    },
    data() {
        return {
            menuList: [
                {
                    name: '代理首页',
                    path: '/',
                }, {
                    name: '团队列表',
                    path: '/grouplist',
                }, {
                    name: '游戏记录',
                    path: '/gamerecords',
                }, {
                    name: '充值记录',
                    path: '/chargerecords',
                }, {
                    name: '提现记录',
                    path: '/withdrawrecords',
                }, {
                    name: '返利记录',
                    path: '/rebaterecords',
                },
                {
                    name: '登录日志',
                    path: '/loginlog'
                },
                {
                    name: '注册日志',
                    path: '/registlog'
                }
            ],
            menuRouter: {},
            curIndex: 0,
            isExpand: true
        };
    },
    methods: {
        expandMenu(index) {
            let path = this.menuList[index].path
            if (this.curIndex !== index) {
                path && this.$router.push(path)
                this.curIndex = index;
                this.isExpand = true;
            }
        },
        initActiveIndex() {
            let path = this.$route.path
            this.menuList.some((item, index) => {
                if(item.path === path) {
                    this.curIndex = index
                }
                return item.path === path
            })
        }
    },
    mounted() {
        this.initActiveIndex()
    },
    watch: {
        $route() {
            this.initActiveIndex()
        }
    }
};
</script>

<style scoped>
.menu {
    width: 100%;
    background-color: #1c2b36;
    font-weight: 600;
    text-align: left;
    color: #869fb1;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.level1 > li::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin: 10px 0;
    background-color: #131e26;
}
.level1 > li:last-child:after {
    display: none;
}
.level1 .inner {
    transition: all 0.2s ease;
    border-color: #19a9d5;
    border-style: solid;
    border-width: 0;
}
.level1 .inner span {
    display: inline-block;
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    line-height: 46px;
    text-indent: 16%;
    position: relative;
    cursor: pointer;
}
.level1 .inner span:hover {
    color: #fff;
    background-color: #131e26;
}
.level1 .inner span i {
    position: absolute;
    right: 15px;
    transition: all 0.2s ease;
}
.expand .inner {
    border-left-width: 4px;
}
.active .inner span {
    background-color: #131e26;
    color: #fff;
}
.active .inner ul {
    background-color: #131e26;
}
.expand .inner span i {
    transform: rotate(-90deg);
}
.level2 {
    overflow: hidden;
    display: none;
}
.expand-show {
    display: block;
}
.expand-hide {
    display: none;
}
.level2 li {
    width: 100%;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    cursor: pointer;
    text-indent: 25%;
}
.level2 li:hover {
    color: #fff;
}
.level2 .active {
    color: #fff;
}
</style>


