//----------------------------------------------------------------------------//
//----------------------------| CS ENGINE: NETWORK |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_NETWORK {
      constructor(cs) {
         this.cs = cs

         this.ws = {}
         this.status = false
         this.buffer = []

         this.metrics = {
            upNow: 0,
            downNow: 0,
            upAverage: 0,
            downAverage: 0,
            upTotal: 0,
            downTotal: 0,
            upWatch: 0,
            downWatch: 0,
            last: Date.now(),
            count: 0
         }

         this.overrides = {
            connect: function() {},
            disconnect: function() {},
            message: function() {},
         }
      }

      updateMetrics() {
         const metrics = this.cs.network.metrics
         const now = Date.now()
         if (now - metrics.last > 1000) {
            metrics.count++
            metrics.last = now
            metrics.upNow = metrics.upWatch
            metrics.downNow = metrics.downWatch
            metrics.upTotal += metrics.upWatch
            metrics.downTotal += metrics.downWatch
            metrics.upAverage = metrics.upTotal / metrics.count
            metrics.downAverage = metrics.downTotal / metrics.count

            metrics.upWatch = 0
            metrics.downWatch = 0
         }
      }

      connect(options) {
         // console.log('this.cs.network.connect', options)
         try {
            const host = options.host || window.location.hostname
            let url = "wss://" + host + ":" + options.port

            if (options.ssl == undefined || options.ssl == false) {
               url = "ws://" + host + ":" + options.port
            }

            const ws = new WebSocket(url);
            ws.onopen = () => {
               this.cs.network.onconnect()
            }
            ws.onclose = () => { this.cs.network.ondisconnect() }
            ws.onmessage = (event) => { this.cs.network.onmessage(event.data) }
            this.cs.network.ws = ws;
         } catch(e) {
            console.log(e);
         }
      }

      isConnected() {
         return this.cs.network.ws.readyState !== this.cs.network.ws.CLOSED
      }

      send(data) {
         if (!this.status) return
         if (typeof data !== 'string') {
            data = JSON.stringify(data)
         }
         this.cs.network.metrics.upWatch += data.length
         this.cs.network.ws.send(data)
      }

      read() {
         while(this.buffer.length) {
            const data = this.buffer.shift()
            this.cs.network.metrics.downWatch += data.length
            this.overrides.message(data)
         }
      }

      onconnect() {
         this.cs.network.status = true
         this.overrides.connect()
      }

      ondisconnect() {
         this.cs.network.status = false
         this.overrides.disconnect()
      }

      onmessage(message) {
         this.buffer.push(message)
      }

      setup(options) {
         for (const optionName in options) {
            this.cs.network.overrides[optionName] = options[optionName]
         }
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_NETWORK
      : this.cs.network = new CSENGINE_NETWORK(cs)
})()
