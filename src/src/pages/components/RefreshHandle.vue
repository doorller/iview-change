<template>
    <div class="refresh-handle">
        <Button @click="runManualRefresh">手动刷新<span>{{manualRefreshSpace || ''}}</span></Button>
        <label></label>
        <Select :options="refreshOptions" v-model="autoRefreshSpace" @update="updateFreshSpace"/>
    </div>
</template>

<script>
    import Button from './Button'
    import Select from './Select'

    export default {
        name: 'RefreshHandle',
        props: {
            cb: {
                type: Function
            }
        },
        data() {
            return {
                manualRefreshSpace: 0,
                autoRefreshSpace: 0,
                autoTimer: undefined,
                refreshOptions: [
                    {
                        label: '不自动刷新',
                        value: 0
                    }, {
                        label: '20秒',
                        value: 20
                    }, {
                        label: '40秒',
                        value: 40
                    }, {
                        label: '60秒',
                        value: 60
                    }, {
                        label: '80秒',
                        value: 80
                    }, {
                        label: '100秒',
                        value: 100
                    }, {
                        label: '120秒',
                        value: 120
                    }
                ]
            }
        },
        methods: {
            updateFreshSpace() {
                clearInterval(this.autoTimer)
                if(!this.autoRefreshSpace) return
                this.cb && this.cb()
                this.runAutoRefresh()
            },
            runManualRefresh() {
                if(this.manualRefreshSpace) return
                this.autoRefreshSpace && (this.autoRefreshSpace = 0) 
                this.cb && this.cb()
                this.manualRefreshSpace = 3
                let timer = setInterval(() => {
                    this.manualRefreshSpace--
                    if(!this.manualRefreshSpace) {
                        clearInterval(timer)
                    }
                }, 1000)
            },
            runAutoRefresh() {
                this.autoRefreshSpace
                if(!this.autoRefreshSpace) return
                this.autoTimer = setInterval(() => {
                    this.cb && this.cb()
                }, this.autoRefreshSpace * 1000)
            }
        }
    }
</script>

<style scoped>
    .refresh-handle label{
        padding: 0 10px;
    }
</style>

