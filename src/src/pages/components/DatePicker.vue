<template>
    <div 
        :class="{'v-date-picker': true, 'date': type==='date', 'datetime': type==='datetime', 'daterange': type==='daterange', 'datetimerange': type==='datetimerange'}" 
        v-clickoutside="closePanel"
        :style="css"
    >
        <!-- 已选 -->
        <div
            @click="chooseDate"
            @mouseover="changeClearState(true)"
            @mouseout="changeClearState(false)"
            :class="{'date-current': true, 'date-disabled': disabled}"
            ref="timeBox"
        >
            <input v-model="startDate" type="hidden"/>
            <span class="date-str">{{dateStr}}</span>
            <i 
                v-if="clearable && isClear"
                @click.stop="clear"
                class="iconfont icon-icon-test"
            ></i>
            <i v-else class="iconfont icon-rili"></i>
        </div>
        <!-- 已选 -->
        <transition name="date-picker">
            <div class="date-container">
                <div
                    v-if="showPanel"
                    :class="['date-box', pickerClassName]"
                    ref="date-box"
                >
                    <!-- 当前选中 -->
                    <div class="date-info">
                        <span>
                            <i 
                                @click="changeYear('-')"
                                class="iconfont icon-zuofanyezuohua"></i>
                            <i
                                v-show="step===1"
                                @click="changeMonth('-')"
                                class="iconfont icon-shangyiye"></i>
                        </span>
                        <span>
                            <span 
                                @click="changeStep(2)"
                                class="change-btn change-year">{{startYear}}年</span>&nbsp;
                            <span 
                                @click="changeStep(3)"
                                v-if="step==1"
                                class="change-btn change-month">{{startMonth}}月</span>
                        </span>
                        <span v-if="type==='daterange' || type==='datetimerange'">
                            <span 
                                @click="changeStep(2)"
                                class="change-btn change-year">{{endYear}}年</span>&nbsp;
                            <span 
                                @click="changeStep(3)"
                                v-if="step==1"
                                class="change-btn change-month">{{endMonth}}月</span>
                        </span>
                        <span>
                            <i
                                v-show="step===1"
                                @click="changeMonth('+')"
                                class="iconfont icon-xiayiye"></i>
                            <i 
                                @click="changeYear('+')"
                                class="iconfont icon-youfanyeyouhua"></i>
                        </span>
                    </div>
                    <!-- 当前选中 -->
                    <div class="list-container">
                        <div class="list-box">
                            <!-- 日期 -->
                            <div class="date-list" v-if="step===1">
                                <ul class="week-list">
                                    <li v-for="(day, index) in weekList" :key="index">{{day}}</li>
                                </ul>
                                <ul class="days-list">
                                    <li 
                                        @click="changeDate(preMonthLastDate-beforeThisMonthDays+n, -1)"
                                        class="pre-month-day"
                                        v-for="n in beforeThisMonthDays"
                                        :key="'0'+n">{{preMonthLastDate-beforeThisMonthDays+n}}</li>
                                    <li 
                                        @click="changeDate(n, 0)"
                                        :class="{
                                            'cur-month-day': true,
                                            today: startYear===todayYear && startMonth===todayMonth && n===todayDate,
                                            active: startYear===curStartYear && startMonth===curStartMonth && n===curStartDate || startYear===curEndYear && startMonth===curEndMonth && n===curEndDate,
                                            'range-day': `${startYear}-${('0' + startMonth).slice(-2)}-${('0' + n).slice(-2)}` > resultTime[0] && `${startYear}-${('0' + startMonth).slice(-2)}-${('0' + n).slice(-2)}` < resultTime[1]
                                        }"
                                        v-for="n in thisMonthDays" :key="'1'+n"
                                    >{{n}}</li>
                                    <li 
                                        @click="changeDate(n, 1)"
                                        class="next-month-day"
                                        v-for="n in afterThisMonthDays"
                                        :key="'2'+n">{{n}}</li>
                                </ul>
                            </div>
                            <!-- 日期 -->
                            <!-- 年份 -->
                            <div v-else-if="step===2" class="year-list">
                                <ul>
                                    <li v-for="n in 10" :key="n">
                                        <span 
                                            @click="changeYear(startYear+n)"
                                            :class="{'today-year': startYear+n===todayYear, 'active': startYear+n===curStartYear}">{{startYear+n}}</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- 年份 -->
                            <!-- 月份 -->
                            <div v-else-if="step===3" class="month-list">
                                <ul>
                                    <li v-for="n in 12" :key="n">
                                        <span
                                            @click="changeMonth(n)"
                                            :class="{'today-month': startYear===todayYear && n===todayMonth, 'active': startYear===curStartYear && n===curStartMonth}">{{n}}月</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- 月份 -->
                            <!-- 时间 -->
                            <div v-else-if="step===4" class="time-picker">
                                <div ref="startHour">
                                    <ul>
                                        <li 
                                            v-for="n in 24"
                                            @click="changeTime(n-1, 'startHour')"
                                            :key="n"
                                            :class="{active: startHour==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                                <div ref="startMinute">
                                    <ul>
                                        <li
                                            v-for="n in 60"
                                            @click="changeTime(n-1, 'startMinute')"
                                            :key="n"
                                            :class="{active: startMinute==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                                <div ref="startSecond">
                                    <ul>
                                        <li
                                            v-for="n in 60"
                                            @click="changeTime(n-1, 'startSecond')"
                                            :key="n"
                                            :class="{active: startSecond==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                            </div>
                            <!-- 时间 -->
                        </div>
                        <div class="list-box" v-if="type==='daterange' || type==='datetimerange'">
                            <!-- 日期 -->
                            <div class="date-list" v-if="step===1">
                                <ul class="week-list">
                                    <li v-for="(day, index) in weekList" :key="index">{{day}}</li>
                                </ul>
                                <ul class="days-list">
                                    <li 
                                        @click="changeDate(thisMonthLastDate-beforeNextMonthDays+n, 0)"
                                        class="pre-month-day"
                                        v-for="n in beforeNextMonthDays"
                                        :key="'0'+n">{{thisMonthLastDate-beforeNextMonthDays+n}}</li>
                                    <li 
                                        @click="changeDate(n, 1)"
                                        :class="{
                                            'cur-month-day': true,
                                            today: endYear===todayYear && endMonth===todayMonth && n===todayDate,
                                            active: endYear===curEndYear && endMonth===curEndMonth && n===curEndDate || endYear===curStartYear && endMonth===curStartMonth && n===curStartDate,
                                            'range-day': `${endYear}-${('0' + endMonth).slice(-2)}-${('0' + n).slice(-2)}` < resultTime[1] && resultTime[0] < `${endYear}-${('0' + endMonth).slice(-2)}-${('0' + n).slice(-2)}`
                                        }"
                                        v-for="n in nextMonthDays"
                                        :key="'1'+n"
                                    >{{n}}</li>
                                    <li 
                                        @click="changeDate(n, 2)"
                                        class="next-month-day"
                                        v-for="n in afterNextMonthDays"
                                        :key="'2'+n">{{n}}</li>
                                </ul>
                            </div>
                            <!-- 日期 -->
                            <!-- 年份 -->
                            <div v-else-if="step===2" class="year-list">
                                <ul>
                                    <li v-for="n in 10" :key="n">
                                        <span 
                                            @click="changeYear(endYear+n)"
                                            :class="{'today-year': endYear+n===todayYear, 'active': endYear+n===curEndYear}">{{endYear+n}}</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- 年份 -->
                            <!-- 月份 -->
                            <div v-else-if="step===3" class="month-list">
                                <ul>
                                    <li v-for="n in 12" :key="n">
                                        <span
                                            @click="changeMonth(n)"
                                            :class="{'today-month': endYear===todayYear && n===todayMonth, 'active': endYear===curEndYear && n===curEndMonth}">{{n}}月</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- 月份 -->
                            <!-- 时间 -->
                            <div v-else-if="step===4" class="time-picker">
                                <div ref="endHour">
                                    <ul>
                                        <li 
                                            v-for="n in 24"
                                            @click="changeTime(n-1, 'endHour')"
                                            :key="n"
                                            :class="{active: endHour==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                                <div ref="endMinute">
                                    <ul>
                                        <li
                                            v-for="n in 60"
                                            @click="changeTime(n-1, 'endMinute')"
                                            :key="n"
                                            :class="{active: endMinute==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                                <div ref="endSecond">
                                    <ul>
                                        <li
                                            v-for="n in 60"
                                            @click="changeTime(n-1, 'endSecond')"
                                            :key="n"
                                            :class="{active: endSecond==n-1}"
                                        >{{`0${n-1}`.slice(-2)}}</li>
                                    </ul>
                                </div>
                            </div>
                            <!-- 时间 -->
                        </div>
                    </div>
                    <div class="select-time" v-if="type==='datetime' || type==='datetimerange'">
                        <div @click="chooseTime" class="pointer">{{step===4 ? '选择日期' : '选择时间'}}</div>
                        <div>
                            <Button size="small" @click="clear" v-if="clearable">清空</Button>
                            <Button size="small" @click="confirm" active>确定</Button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'DatePicker',
        props: {
            clearable: {
                type: Boolean,
                default: () => true
            },
            direction: {
                type: String
            },
            value: {
                type: [String, Array]
            },
            type: {
                type: String,
                default: () => 'date'
            },
            css: {
                type: Object
            },
            disabled: {
                type: Boolean,
                default: () => false
            }
            // ,
            // furture:{
            //     type :Boolean,
            //     default: false
            // }
        },
        model: {
            prop: 'value',
            event: 'update'
        },
        data() {
            return {
                resultTime: [],
                dateStr: '',
                isClear: false,
                startYear: undefined, // 当前选中未确定
                startMonth: undefined,
                startDate: undefined,
                curStartYear: undefined, // 当前确认选中
                curStartMonth: undefined,
                curStartDate: undefined,
                endYear: undefined, //
                endMonth: undefined,
                endDate: undefined,
                curEndYear: undefined,
                curEndMonth: undefined,
                curEndDate: undefined,
                todayYear: undefined, // 今日日期
                todayMonth: undefined,
                todayDate: undefined,
                startHour: 0,
                startMinute: 0,
                startSecond: 0,
                endHour: 23,
                endMinute: 59,
                endSecond: 59,
                hourScrollTop: 0,
                minuteScrollTop: 0,
                secondScrollTop: 0,
                preMonthLastDate: 0, // 上月最后一天的日期
                thisMonthLastDate: 0, // 本月最后一天日期
                beforeThisMonthDays: 0, // 上月补全天数
                thisMonthDays: 0, // 当月天数
                afterThisMonthDays: 0, // 下月补全天数
                beforeNextMonthDays: 0, // 下月的前面补全天数
                nextMonthDays: 0,   // 下月总天数
                afterNextMonthDays: 0,  // 下月的后面补全天数
                weekList: ['日', '一', '二', '三', '四', '五', '六'],
                step: 1,
                showPanel: false,
                pickerClassName: 'bottom-expand',
                beginStartYear: 0,
                beginEndYear: 0
            }
        },
        methods: {
            changeClearState(bool) {
                if(this.disabled) return
                this.isClear = bool
            },
            chooseDate() {
                if(this.disabled) return
                this.step = 1
                this.initDays()
                this.showPanel = !this.showPanel
            },
            closePanel() {
                this.showPanel = false
                this.step = 1
            },
            clear() {
                this.dateStr = ''
                this.resultTime[0] = this.resultTime[1] = ''
                this.curEndYear = this.curEndMonth = this.curEndDate = this.curStartYear = this.curStartMonth = this.curStartDate = undefined
                this.startHour = this.startMinute = this.startSecond = 0
                this.endHour = 23
                this.endMinute = this.endSecond = 59
                this.step = 1

                let time = new Date()
                this.startYear = this.todayYear = time.getFullYear()
                this.startMonth = this.todayMonth = time.getMonth() + 1
                this.startDate = this.todayDate = time.getDate()
                this.beginStartYear = this.startYear - 9
                this.showPanel = false
                if(this.type === 'date' || this.type === 'datetime') {
                    this.$emit('update', this.resultTime[0])
                }else{
                    time = new Date(time.setMonth(time.getMonth() + 1))
                    this.endYear = time.getFullYear()
                    this.endMonth = time.getMonth() + 1
                    this.endDate = time.getDate()
                    this.beginEndYear = this.endYear - 9
                    this.$emit('update', this.resultTime)
                }
            },
            confirm() {
                this.step = 1
                if(this.resultTime[0] && this.resultTime[1] && this.resultTime[0] > this.resultTime[1]) {
                    this.exchangeResultTime()
                }
                this.showPanel = false
            },
            changeDate(date, type) {
                if(this.resultTime[0] && this.resultTime[1]) {
                    this.resultTime = ['', '']
                    this.curStartDate = this.curEndDate = undefined
                    this.curStartMonth = this.curEndMonth = undefined
                    this.curStartYear = this.curEndYear = undefined
                    this.startHour = 0
                    this.startMinute = 0
                    this.startSecond = 0
                    this.endHour = 23
                    this.endMinute = 59
                    this.endSecond = 59
                }
                let year,  month, timeType;
                switch(type) {
                    case -1:
                        month = this.startMonth - 1
                        if(month < 1) {
                            month = 12
                            year = this.startYear - 1
                        }else{
                            year = this.startYear
                        }
                        this.changeMonth('-')
                        break
                    case 0:
                        month = this.startMonth
                        year = this.startYear
                        break
                    case 1:
                        month = this.startMonth + 1
                        if(month > 12) {
                            month = 1
                            year = this.startYear + 1
                        }else{
                            year = this.startYear
                        }
                        if(this.type==='date' || this.type==='datetime' || !this.resultTime[0]) {
                            this.changeMonth('+')
                        }
                        break
                    case 2:
                        month = this.endMonth + 1
                        if(month > 12) {
                            month = 1
                            year = this.endYear + 1
                        }else{
                            year = this.endYear
                        }
                        if(!this.resultTime[0]) {
                            this.changeMonth(this.startMonth + 2)
                        }
                        break
                    default:
                }
                switch(this.type) {
                    case 'daterange':
                    case 'datetimerange':
                        this.resultTime[0] ? (this.endDate = date) : (this.startDate = date)
                        if(this.resultTime[0]) {
                            timeType = 'end'
                        }else{
                            timeType = 'start'
                        }
                        break
                    default:
                        timeType = 'start'
                }
                this[timeType+'Date'] = date
                this.setDateData(year, month, date, timeType)
            },
            setDateData(year, month, date, dateType) {
                switch(dateType) {
                    case 'end':
                        this.curEndYear = year
                        this.curEndMonth = month
                        this.curEndDate = date
                        if(this.type === 'date' || this.type === 'daterange') {
                            this.resultTime[1] = `${this.curEndYear}-${('0' + this.curEndMonth).slice(-2)}-${('0' + this.curEndDate).slice(-2)}`
                        }else{
                            this.resultTime[1] = `${this.curEndYear}-${('0' + this.curEndMonth).slice(-2)}-${('0' + this.curEndDate).slice(-2)} ${('0' + this.endHour).slice(-2)}:${('0' + this.endMinute).slice(-2)}:${('0' + this.endSecond).slice(-2)}`
                        }
                        if(this.resultTime[0] > this.resultTime[1]) {
                            this.exchangeResultTime()
                        }
                        break
                    default:
                        this.curStartYear = year
                        this.curStartMonth = month
                        this.curStartDate = date
                        if(this.type === 'date' || this.type === 'daterange') {
                            this.resultTime[0] = `${this.curStartYear}-${('0' + this.curStartMonth).slice(-2)}-${('0' + this.curStartDate).slice(-2)}`
                        }else{
                            this.resultTime[0] = `${this.curStartYear}-${('0' + this.curStartMonth).slice(-2)}-${('0' + this.curStartDate).slice(-2)} ${('0' + this.startHour).slice(-2)}:${('0' + this.startMinute).slice(-2)}:${('0' + this.startSecond).slice(-2)}`
                        }
                }
                if(this.type === 'date' || this.type === 'datetime') {
                    this.dateStr = this.resultTime[0]
                    this.$emit('update', this.resultTime[0])
                    this.type === 'date' && (this.showPanel = false)
                }else{
                    if(this.resultTime[0] && this.resultTime[1]) {
                        this.dateStr = this.resultTime[0] + ' - ' + this.resultTime[1]
                        this.$emit('update', this.resultTime)
                        this.type === 'daterange' && (this.showPanel = false)
                    }
                }
            },
            exchangeResultTime() {
                [
                    this.resultTime[0],
                    this.resultTime[1],
                    this.curStartYear,
                    this.curEndYear,
                    this.curStartMonth,
                    this.curEndMonth,
                    this.curStartDate,
                    this.curEndDate
                ] = [
                    this.resultTime[1],
                    this.resultTime[0],
                    this.curEndYear,
                    this.curStartYear,
                    this.curEndMonth,
                    this.curStartMonth,
                    this.curEndDate,
                    this.curStartDate
                ]       
                if(this.type==='datetimerange') {
                    [
                        this.startHour,
                        this.endHour,
                        this.startMinute,
                        this.endMinute,
                        this.startSecond,
                        this.endSecond
                    ] = [
                        this.endHour,
                        this.startHour,
                        this.endMinute,
                        this.startMinute,
                        this.endSecond,
                        this.startSecond
                    ]
                }
                this.dateStr = this.resultTime.join(' - ')
            },
            changeMonth(num) {
                if(num === '-') {
                    if(this.startMonth === 1) {
                        this.startMonth = 12
                        this.startYear --
                        this.endMonth --
                    }else{
                        if(this.startMonth === 12) {
                            this.endYear --
                            this.endMonth = 12
                        }else{
                            this.endMonth --
                        }
                        this.startMonth --
                    }
                }else if(num === '+'){
                    if(this.startMonth === 12) {
                        this.startMonth = 1
                        this.startYear ++
                        this.endMonth ++
                    }else{
                        if(this.startMonth === 11){
                            this.endMonth = 1
                            this.endYear+=1
                        }else{
                            this.endMonth ++
                        }
                        this.startMonth ++
                    }
                }else{
                    this.startMonth = num
                    if(num + 1 > 12) {
                        this.endMonth = 1
                        this.endYear ++
                    }else{
                        this.endMonth = num + 1
                    }
                    this.step = 1
                }
                this.initDays()
            },
            changeYear(num) {
                if(num === '-') {
                    if(this.step === 2) {
                        this.startYear -=10
                        this.endYear -=10
                    }else{
                        this.startYear--
                        this.endYear--
                    }
                }else if(num === '+'){
                    if(this.step === 2) {
                        this.startYear +=10
                        this.endYear +=10
                    }else{
                        this.startYear++
                        this.endYear++
                    }
                }else {
                    this.startYear = num
                    this.endYear = this.startMonth === 12 ? num + 1 : num
                    this.step = 3
                }
                this.initDays()
            },
            changeTime(num, type) {
                let e = event
                this[type] = `0${num}`.slice(-2)
                if(!this.curStartYear || !this.curStartMonth || !this.curStartDate) {
                    this.curStartYear = this.todayYear
                    this.curStartMonth = this.todayMonth
                    this.curStartDate = this.todayDate
                }
                this.resultTime[0] = `${this.curStartYear}-${('0' + this.curStartMonth).slice(-2)}-${('0' + this.curStartDate).slice(-2)} ${('0' + this.startHour).slice(-2)}:${('0' + this.startMinute).slice(-2)}:${('0' + this.startSecond).slice(-2)}`
                if(this.type === 'datetime') {
                    this.dateStr = this.resultTime[0]
                    this.$emit('update', this.resultTime[0])
                }else{
                    if(!this.curEndYear || !this.curEndMonth || !this.curEndDate) {
                        this.curEndYear = this.todayYear
                        this.curEndMonth = this.todayMonth
                        this.curEndDate = this.todayDate
                    }
                    this.resultTime[1] = `${this.curEndYear}-${('0' + this.curEndMonth).slice(-2)}-${('0' + this.curEndDate).slice(-2)} ${('0' + this.endHour).slice(-2)}:${('0' + this.endMinute).slice(-2)}:${('0' + this.endSecond).slice(-2)}`
                    this.dateStr = this.resultTime.join(' - ')
                    this.$emit('update', this.resultTime)
                }
                this.scrollTop(this.$refs[type], this.$refs[type].scrollTop, num * 30)
            },
            changeStep(num) {
                this.step = num
            },
            initDays() {
                let thisMonthDays = this.thisMonthDays = this.getDaysInOneMonth(this.startYear, this.startMonth)
                this.preMonthLastDate = this.getDaysInOneMonth(this.startYear, this.startMonth)
                this.beforeThisMonthDays = new Date(`${this.startYear}-${this.startMonth}-1`).getDay()
                this.afterThisMonthDays = 42 - thisMonthDays - this.beforeThisMonthDays
                if(this.type === 'daterange' || this.type === 'datetimerange') {
                    this.thisMonthLastDate = this.thisMonthDays
                    this.nextMonthDays = this.getDaysInOneMonth(this.endYear, this.endMonth)
                    this.beforeNextMonthDays = new Date(`${this.endYear}-${Number(this.endMonth)}-1`).getDay()
                    this.afterNextMonthDays = 42 - this.nextMonthDays - this.beforeNextMonthDays
                }
            },
            getDaysInOneMonth(year, month){
                month = parseInt(month, 10)
                let d= new Date(year, month, 0)
                return d.getDate();
            },
            chooseTime(type) {
                if(this.step === 4) {
                    this.step = 1
                }else{
                    this.step = 4
                    if(this.type==='datetime' || this.type==='datetimerange') {
                        if(this.type==='datetimerange') {
                            setTimeout(() => {
                                this.$refs.startHour.scrollTop = parseInt(this.startHour) * 30
                                this.$refs.startMinute.scrollTop = parseInt(this.startMinute) * 30
                                this.$refs.startSecond.scrollTop = parseInt(this.startSecond) * 30
                                this.$refs.endHour.scrollTop = parseInt(this.endHour) * 30
                                this.$refs.endMinute.scrollTop = parseInt(this.endMinute) * 30
                                this.$refs.endSecond.scrollTop = parseInt(this.endSecond) * 30
                            }, 0)
                        }else{
                            setTimeout(() => {
                                this.$refs.startHour.scrollTop = parseInt(this.startHour) * 30
                                this.$refs.startMinute.scrollTop = parseInt(this.startMinute) * 30
                                this.$refs.startSecond.scrollTop = parseInt(this.startSecond) * 30
                            }, 0)
                        }
                    }
                }
            },
            scrollTop(el, from = 0, to, duration = 500, endCallback) {
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = (
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (callback) {
                            return window.setTimeout(callback, 1000/60);
                        }
                    );
                }
                const difference = Math.abs(from - to);
                const step = Math.ceil(difference / duration * 50);

                function scroll(start, end, step) {
                    if (start === end) {
                        endCallback && endCallback();
                        return;
                    }

                    let d = (start + step > end) ? end : start + step;
                    if (start > end) {
                        d = (start - step < end) ? end : start - step;
                    }

                    if (el === window) {
                        window.scrollTo(d, d);
                    } else {
                        el.scrollTop = d;
                    }
                    window.requestAnimationFrame(() => scroll(d, end, step));
                }
                scroll(from, to, step);
            },
            formatDateString(val) {
                let arr = [],
                    date = '';
                if(!val) {
                    return
                }if(val instanceof Array) {
                    if(!val[0] || !val[1]) {
                        return
                    }else{
                        arr = val[0].split(' ')[0].split('-')
                        let arr1 = val[1].split(' ')[0].split('-')
                        date = new Date(val[0])
                        
                        this.curStartYear = this.startYear = Number(arr[0])
                        this.curStartMonth = this.startMonth = Number(arr[1])
                        this.curStartDate = this.startDate = Number(arr[2])
                        this.curEndYear = Number(arr1[0])
                        this.curEndMonth = Number(arr1[1])
                        this.curEndDate = Number(arr1[2])

                        if(this.type==='datetimerange') {
                            let arr2 = val[0].split(' ')[1].split(':'),
                                arr3 = val[0].split(' ')[1].split(':');
                            this.startHour = Number(arr2[0])
                            this.startMinute = Number(arr2[1])
                            this.startSecond = Number(arr2[2])
                            this.endHour = Number(arr3[0])
                            this.endMinute = Number(arr3[1])
                            this.endSecond = Number(arr3[2])
                        }
                        this.resultTime = val
                        this.dateStr = val.join(' - ')
                    }
                }else{
                    arr = val.split(' ')[0].split('-')
                    date = new Date(val)
                    date.setMonth(date)
                    this.curStartYear = this.startYear = Number(arr[0])
                    this.curStartMonth = this.startMonth = Number(arr[1])
                    this.curStartDate = this.startDate = Number(arr[2])
                    if(this.type==='datetime') {
                        let arr1 = val.split(' ')[1].split(':')
                        this.startHour = Number(arr1[0])
                        this.startMinute = Number(arr1[1])
                        this.startSecond = Number(arr1[2])
                    }
                    this.dateStr = this.resultTime[0] = val
                }
                date.setMonth(date.getMonth() + 1)
                this.endYear = date.getFullYear()
                this.endMonth = date.getMonth() + 1
                this.endDate = date.getDate()
                this.beginStartYear = this.startYear - 9
                this.beginEndYear = this.endYear - 9
            }
        },
        mounted() {
            let time = new Date()
            this.todayYear = time.getFullYear()
            this.todayMonth = time.getMonth() + 1
            this.todayDate = time.getDate()
            switch(this.type) {
                case 'daterange':           
                case 'datetimerange':
                    if(this.value[0] && this.value[1]) {
                        this.resultTime[0] = this.value[0]
                        this.resultTime[1] = this.value[1]
                    }else{
                        let str = ''
                        str = tools.formatDate(new Date(), false)
                        if(this.type==='daterange') {
                            this.resultTime[0] = this.resultTime[1] = str
                        }else{
                            this.resultTime[0] = str + ' 00:00:00'
                            this.resultTime[1] = str + ' 23:59:59'
                        }
                        this.$emit('update', this.resultTime)
                    }
                    this.formatDateString(this.resultTime)
                    break
                default:
                    if(this.value) {
                        this.resultTime[0] = this.value
                    }else{
                        this.resultTime[0] = this.type==='datetime' ? tools.formatDate(new Date()) : tools.formatDate(new Date(), false)
                        this.$emit('update', this.resultTime[0])
                    }
                    this.formatDateString(this.resultTime[0])
            }

            if(this.direction) {
                this.pickerClassName = this.direction + '-expand'
            }else{
                let y = document.body.scrollHeight - this.$refs.timeBox.getBoundingClientRect().bottom
                this.pickerClassName = y < 295 ? 'top-expand' : 'bottom-expand'
            }
        },
        watch: {
            value(val, old) {
                this.formatDateString(val)
            }
        }
    }
</script>

<style scoped>
    .v-date-picker{
        height: 32px;
        line-height: 32px;
        position: relative;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .v-date-picker.date{
        width: 120px;
    }
    .v-date-picker.datetime{
        width: 160px;
    }
    .v-date-picker.daterange{
        width: 180px;
    }
    .v-date-picker.datetimerange{
        width: 280px;
    }
    .v-date-picker .date-str{
        font-size: 12px;
    }
    .date-current{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 8px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        cursor: pointer;
        background: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .date-current.date-disabled{
        cursor: not-allowed;
    }
    
    .date-current span{
        display: inline-block;
        text-align: left;
        flex: 1;
    }
    .date-current:hover{
        border-color: #57a3f3;
    }
    .date-current i{
        line-height: 30px;
    }
    .date-picker-enter,
    .date-picker-leave-to{
        opacity: 0;
        max-height: 0;
    }
    .date-picker-leave,
    .date-picker-enter-to{
        opacity: 1;
        max-height: 240px;
    }
    .date-picker-enter-active,
    .date-picker-leave-active{
        transition: all .2s ease-in-out;
    }
    .date-box{
        position: absolute;
        left: 0;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        border-radius: 4px;
        background: #fff;
        z-index: 10;
        overflow: hidden;
    }
    .list-container{
        display: flex;
        flex-direction: row;
    }
    .top-expand{
        bottom: 35px;
    }
    .bottom-expand{
        top: 35px;
    }
    .date-box .date-info{
        width: 100%;
        height: 32px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8eaec;
        box-sizing: border-box;
        padding: 0 10px;
    }
    .date-box .date-info i{
        font-size: 20px;
        cursor: pointer;
        color: #c5c8ce;
    }
    .date-box .date-info i:hover{
        color: #19a9d5;
    }
    .date-box .date-info i:first-child{
        margin-right: 10px;
    }
    .date-box .date-info .change-btn{
        cursor: pointer;
    }
    .date-box .date-info .change-btn:hover{
        color: #19a9d5;
    }
    .date-box .list-box{
        padding: 10px;
        background-color: #fff;
    }
    .date-box ul{
        width: 210px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .date-box .week-list{
        color: #c5c8ce;
    }
    .date-box .date-list li{
        width: 30px;
        height: 30px;
        border-radius: 4px;
        line-height: 30px;
    }
    .date-box .year-list li,
    .date-box .month-list li{
        width: 33.333%;
        text-align: center;
        height: 52.5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .days-list li {
        cursor: pointer;
        color: #c5c8ce;
        text-align: center;
    }
    .days-list .cur-month-day{
        box-sizing: border-box;
        color: #2c3e50;
    }
    .days-list .cur-month-day.range-day{
        background-color: #D0F0Ff;
    }
    .days-list .cur-month-day:hover{
        background-color: #D0F0Ff;
    }
    .date-box .year-list span,
    .date-box .month-list span{
        display: inline-block;
        width: 40px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        cursor: pointer;
    }
    .date-box .year-list span:hover,
    .date-box .month-list span:hover{
        background-color: #D0F0Ff;
    }
    .date-box .year-list span.active,
    .date-box .month-list span.active,
    .date-box .date-list li.active{
        background-color: #2d8cf0;
        color: #fff;
    }
    .date-box .year-list .today-year,
    .date-box .month-list .today-month{
        background-color: #E1F0FE;
    }
    .date-box .days-list .today{
        border: 1px solid #2d8cf0;
    }

    .v-date-picker .select-time{
        box-sizing: border-box;
        padding: 0 10px;
        border-top: 1px solid #e8eaec;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .v-date-picker .select-time div{
        padding: 0 10px;
    }
    .v-date-picker .select-time div>button{
        margin-left: 10px;
    }
    .v-date-picker .select-time>div:hover{
        color: #2d8cf0;
    }

    .time-picker{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .time-picker>div{
        width: 70px;
        height: 210px;
        overflow-y: scroll;
    }
    .time-picker ul{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-wrap: nowrap;
        border-bottom: 180px solid transparent;
    }
    .date-box .time-picker ul li{
        width: 100%;
        height: 30px;
        text-align: center;
        border-radius: 4px;
    }
    .time-picker ul li.active{
        color: #2d8cf0;
        background-color: #f3f3f3;
    }
    .date-box .time-picker ul li:hover{
        background-color: #f3f3f3;
        cursor: pointer;
    }
    .not-allowed{
        cursor:not-allowed
    }
</style>


