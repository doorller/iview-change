# vue-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/)

### 目录结构

    demo                    自定义组件及插件说明文档, 仅存在于开发环境
    dist                    编译后输出目录
    public                  
        index.html          html模板
    src
        assets
            css             
                common.css  公用样式
            img
            js
                $http.js    http请求拦截器
                api.js      请求api
                socket.js   websocket拦截器
                tools.js    工具函数
        pages               路由组件
            components      路由组件的子组件目录
        plugins             插件
            components      可复用的组件
            index.js        插件配置文件
            directives      自定义指令
        App.vue             app
        main.js             入口文件
    vue.config.js           webpack 自定义配置文件

### ftp 地址 
    /home/wwwroot/qipai/admin/static/dist