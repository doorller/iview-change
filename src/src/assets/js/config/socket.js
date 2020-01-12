export default class Socket {
    constructor(url, store) {
        this.ws = null
        this.url = url
        this.store = store
        this.timeout = 15000
        this.count = 1
        this.isconnecting = false
        this.init()
    }
    init() {
        this.ws && this.ws.close()

        let target = document.createElement('div'),
            self = this;

        target.addEventListener('open', function(e) {
            self.onopen(e)
        })
        target.addEventListener('close', function(e) {
            self.onclose(e)
        })
        target.addEventListener('message', function(e) {
            self.onmessage(e)
        })
        target.addEventListener('error', function(e) {
            self.onerror(e)
        })

        this.ws = new WebSocket(this.url)
        this.ws.onopen = function() {
            let event = new Event('open')
            event.data = {name:18}
            target.dispatchEvent(event)
        }
        this.ws.onmessage = function(e) {
            let event = new Event('message')
            event.data = e.data
            target.dispatchEvent(event)
        }
        this.ws.onerror = function() {
            let event = new Event('error')
            target.dispatchEvent(event)
        }
        this.ws.onclose = function() {
            let event = new Event('close')
            target.dispatchEvent(event)
            self.reconnect()
        }
    }
    onopen(event) {}
    onclose(event) {}
    onmessage(event) {}
    onerror(event) {}
    send(params) {
        this.ws.send(params)
    }
    reconnect() {
        if(this.isconnecting) return
        this.isconnecting = true
        let self = this
        setTimeout(() => {
            self.init()
            self.isconnecting = false
        }, 1000)
    }
}