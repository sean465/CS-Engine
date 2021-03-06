/* global cs */

cs.objects.player = {
   zIndex: 2,
   create: function({ attr }) {
      this.networkId = attr.networkId
      this.socketId = attr.share.socketId
      this.friction = attr.share.friction
      this.angle = attr.share.angle
      this.pos = attr.share.pos
      this.speed = attr.share.speed
      this.forward = false
      this.turnSpeed = 0
      this.angleFix = 0
      this.radius = 3

      this.controlTime = 0
      this.controlTimeMax = 120
   },

   snapshotRead: function(snapshot) {
      const [ x, y, angle, turnSpeed, speedX, speedY, forward ] = snapshot
      this.pos.x = cs.script.smooth(this.pos.x, x, 50)
      this.pos.y = cs.script.smooth(this.pos.y, y, 50)
      this.angle = cs.script.smooth(this.angle, angle, 100)
      this.turnSpeed = turnSpeed
      this.speed = cs.vector.create(speedX, speedY)
      this.forward = forward ? true : false
   },

   step: function() {
      this.angle += this.turnSpeed * cs.loop.delta
      this.pos = cs.vector.add(this.pos, cs.vector.scale(this.speed, cs.loop.delta))
      if (!this.forward) this.speed = cs.vector.scale(this.speed, this.friction)

      if (this.pos.x < 0 || this.pos.x > cs.room.width) this.pos.x = this.pos.x < 0 ? 0 : cs.room.width
      if (this.pos.y < 0 || this.pos.y > cs.room.height) this.pos.y = this.pos.y < 0 ? 0 : cs.room.height

      if (this.socketId === cs.global.socketId) {
         cs.camera.follow(this.pos)
      }
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius, fill: true })

      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius })

      cs.draw.setWidth(0.5)
      cs.draw.line({
         points: [
            { x: this.pos.x, y: this.pos.y },
            {
               x: this.pos.x + cs.math.cos(this.angle) * this.radius,
               y: this.pos.y + cs.math.sin(this.angle) * this.radius
            }
         ]
      })

      // draw direction
      if (cs.global.socketId === this.socketId) {
         cs.global.selfObject = this
         var targetAngle = cs.global.controller.angle

         if (cs.global.controller.turning) {
            this.controlTime = Math.min(this.controlTimeMax, this.controlTime + 20)
         }

         this.controlTime = Math.max(0, this.controlTime - 1)
         var controlAlpha = 1 * (this.controlTime / this.controlTimeMax)
         var controlRadius = this.radius + 3
         var controlWidth = 10
         var controlHeight = 2
         cs.draw.setAlpha(controlAlpha)
         cs.draw.shape({
            vertices: [
               cs.vector.create(
                  this.pos.x + cs.math.cos(targetAngle) * (controlRadius + controlHeight),
                  this.pos.y + cs.math.sin(targetAngle) * (controlRadius + controlHeight)
               ),
               cs.vector.create(
                  this.pos.x + cs.math.cos(targetAngle + controlWidth) * (controlRadius + 0.25),
                  this.pos.y + cs.math.sin(targetAngle + controlWidth) * (controlRadius + 0.25)
               ),
               cs.vector.create(
                  this.pos.x + cs.math.cos(targetAngle - controlWidth) * (controlRadius + 0.25),
                  this.pos.y + cs.math.sin(targetAngle - controlWidth) * (controlRadius + 0.25)
               ),
            ],
            fill: true
         })
      }
   }
}
