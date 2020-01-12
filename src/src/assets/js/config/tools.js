import Modal from '../../../plugins/modal'
export default {

    /* 缓存 */
    setCookie(name, value, expires, opts){
        if(name && value){
            let cookie_ = name + '=' + JSON.stringify(value)
            if(expires) {
                let date = new Date();
                date.setDate(date.getDate() + expires/24)
                expires && (cookie_ += ';expires=' + date)
            }
            if(opts instanceof Object){
                for(let key in opts) {
                    cookie_ += `;${key}=${opts[key]}`
                }
            }
            document.cookie = cookie_
        }
    },
    getCookie(name){
        let cookie_ = document.cookie || '',
            result;
        cookie_.split(';').forEach(item => {
            const arr = item.split('=')
            if(arr[0] === name) {
                result = JSON.parse(arr[1])
                return
            }
        })
        return result
    },
    removeCookie(name) {
        this.setCookie(name, 1, -1)
    },
    setSession(name, val){
        window.sessionStorage.setItem(name, JSON.stringify(val))
    },
    getSession(name){
        let val = window.sessionStorage.getItem(name)
        return val ? JSON.parse(val) : ''
    },
    removeSession(name) {
        window.sessionStorage.removeItem(name)
    },
    setLocal(name, val){
        window.sessionStorage.setItem(name, JSON.stringify(val))
    },
    getLocal(name){
        let val = window.sessionStorage.getItem(name)
        return val ? JSON.parse(val) : ''
    },
    removeLocal(name) {
        window.sessionStorage.removeItem(name)
    },
    /* 缓存 */


    /* 数据操作 */

    formatDate(time, withTime=true) {
        let arr1 = [],
            arr2 = [],
            date = new Date(time);
        arr1.push(date.getFullYear())
        arr1.push(`0${date.getMonth() + 1}`.slice(-2))
        arr1.push(`0${date.getDate()}`.slice(-2))

        if(!withTime) return arr1.join('-')

        arr2.push(`0${date.getHours()}`.slice(-2))
        arr2.push(`0${date.getMinutes()}`.slice(-2))
        arr2.push(`0${date.getSeconds()}`.slice(-2))
        return `${arr1.join('-')} ${arr2.join(':')}`
    },
    // 格式 获取北京时间
    getDate(time, withTime=true) {
        if(!time) return
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时(北京时间)
        let timeString = date.toJSON().substr(0, 19).replace('T', ' ') // toJSON等同于toISOString
        return withTime ? timeString : timeString.slice(0,10)
    },
    formatNumber(str) {
        let arr = (str || 0).toString().split('.')
        return arr[1] ? `${arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}.${arr[1]}` : arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    formatBankcount(count) {
        return count.toString().replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    // 对象数组按key排序
    compare(propertyName, type, arr) {
        /*
            propertyName: 排序属性,
            bool: true 升序 | false 降序
         */
        let self = this
        return function(object1, object2) {  
            let value1 = object1[propertyName],
                value2 = object2[propertyName];
            if(typeof arr[0][propertyName] === 'number') {
                return bool ? value1 - value2 : value2 - value1
            }else{
                return type==='asc' ? value1.localeCompare(value2) : value2.localeCompare(value1)
            }
        }   
    },
    toQueryString(data) {
        let arr = []
        if(data instanceof Object) {
            for(let key in data) {
               data[key] && arr.push(`${key}=${data[key]}`)
            }
        }else if(obj instanceof Array) {
            data.forEach((value, index) => {
               value && arr.push(`${index}=${value}`)
            })
        }
        return '?' + arr.join('&')
    },
    toQuery(str) {
        let obj = {}
        if(str.length) {
            str.split('&').forEach(item => {
                let arr=item.split('=')
                obj[arr[0]] = arr[1]
            })
        }
        return obj
    },
    /* 数据操作 */

    // 获取具体某个时区的时间
    getLocalTime(i) {
        //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
        if (typeof i !== 'number') return;
        let d = new Date();     
        let len = d.getTime();
        let offset = d.getTimezoneOffset() * 60000;
        let utcTime = len + offset;
        return new Date(utcTime + 3600000 * i);
     
    },
    // 可拖动框窗口 , 目前没有使用
    dragBox(drag, wrap) {
        function getCss(ele, prop) {
             return parseInt(window.getComputedStyle(ele)[prop]);
        }
 
        var initX,
            initY,
            dragable = false,
            wrapLeft = getCss(wrap, "left"),
            wrapRight = getCss(wrap, "top");
 
        drag.addEventListener("mousedown", function (e) {
             dragable = true;
             initX = e.clientX;
             initY = e.clientY;
        }, false); 
 
       document.addEventListener("mousemove", function (e) {
             if (dragable === true ) {
                 var nowX = e.clientX,
                     nowY = e.clientY,
                     disX = nowX - initX,
                     disY = nowY - initY;
                 wrap.style.left = wrapLeft + disX + "px";
                 wrap.style.top = wrapRight + disY + "px";
             }
        });
 
        drag.addEventListener("mouseup", function (e) {
             dragable = false;
             wrapLeft = getCss(wrap, "left");
             wrapRight = getCss(wrap, "top");
        }, false); 
 
    },
    limitTime(newVal, oldVal,items,$toast,type) {
        let today_str = window.tools.formatDate(new Date(),false)
        /* 不能大于今天 */
        if(new Date(newVal).valueOf() >new Date(today_str)){
            $toast('所选时间不能大于今天')
            setTimeout(() => {
            if(type ==='start_date'){
                items.start_date = oldVal
            } else{
                items.end_date = oldVal
            }
            }, 0)
        } else {
            if(type==='start_date'){
                if(new Date(newVal).valueOf() > new Date(items.end_date)) {
                    $toast('开始时间不能大于于结束时间')
                    setTimeout(() => {
                        items.start_date = oldVal
                    }, 0)
                }
            } else{
                if(new Date(newVal) < new Date(items.start_date)) {
                    $toast('结束时间不能小于开始时间')
                    setTimeout(() => {
                        items.end_date = oldVal
                    }, 0)
                }
            }
        }
    },
    getExploreName(){
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1){
          return 'Opera';
        }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1){
          return 'IE';
        }else if(userAgent.indexOf("Edge") > -1){
          return 'Edge';
        }else if(userAgent.indexOf("Firefox") > -1){
          return 'Firefox';
        }else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1){
          return 'Safari';
        }else if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1){
          return 'Chrome';
        }else if(!!window.ActiveXObject || "ActiveXObject" in window){
          return 'IE>=11';
        }else{
          return 'Unkonwn';
        }        
    },
   /*  防抖 */
    debounce(func, delay=300) {
        var timeout;
        return function(e){
            clearTimeout(timeout);
            var context = this
            var args = arguments
            timeout = setTimeout(function(){
                func.apply(context, args);
            }, delay)
        }
    },
    /* 节流 */
    throttle(fn, delay=300) {
        var timeout
        var start = new Date;
        // var delay = delay
        return function() {
            var context = this
            var args = arguments
            var curr = new Date() - 0
            clearTimeout(timeout);
            if(curr - start >= delay) {
                // console.log('now', new Date(curr).toLocaleString(), curr-start)
                fn.apply(context, args)
                start = curr
            } else {
                timeout = setTimeout(function(){
                    fn.apply(context, args)
                }, delay)
            }
        }
    }
}