// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: MATH |--------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_MATH {
      constructor(cs) {
         this.cs = cs
      }

      sign(number) {
         if (!number) return 0
         return number < 0 ? -1 : 1
      }

      round(number, tenths) {
         if (tenths == null) tenths = 1
         return Math.round(number * tenths) / tenths
      }

      between(num, min, max) {
         return num >= Math.min(min, max) && num <= Math.max(min, max)
      }

      outside(num, min, max) {
         return num < Math.min(min, max) || num > Math.max(min, max)
      }

      randomRange(min, max) {
         return (min + Math.random() * (max - min))
      }

      iRandomRange(min, max) {
         return Math.round(this.randomRange(min, max))
      }

      choose(array) {
         return array[this.iRandomRange(0, array.length - 1)]
      }

      chooseRatio(ratios) {
         // ratios = { "50": "Choice1", "100": "Choice2" }
         const random = Math.random() * 100
         let ratio
         for (ratio in ratios) {
            if (Number(ratio) > random) {
               return ratios[ratio]
            }
         }

         return ratios[ratio]
      }

      brakingDistance(options) {
         return (Math.abs(options.speed) * options.friction) / (1 - options.friction)
      }

      requiredSpeed(options) {
         return Math.sqrt(2 * options.friction * options.distance)
      }

      inRange(options) {
         return options.num > options.min && options.num < options.max
      }

      sin(angleInDegrees) {
         return Math.sin((angleInDegrees - 90) * (Math.PI / 180))
      }

      cos(angleInDegrees) {
         return Math.cos((angleInDegrees - 90) * (Math.PI / 180))
      }

      degrees(radians) {
         return radians * (180 / Math.PI)
      }

      radians(degree) {
         return degree * (Math.PI / 180)
      }

      distance(p1, p2) {
         // a^2 + b^2 = c^2
         const a2 = (p1.x - p2.x) * (p1.x - p2.x)
         const b2 = (p1.y - p2.y) * (p1.y - p2.y)

         return Math.sqrt(a2 + b2)
      }

      anglePointToPoint(p1, p2) {
         if (!p2) {
            p2 = p1
            p1 = { x: 0, y: 0 }
         }

         const xOff = p2.x - p1.x
         const yOff = p2.y - p1.y

         return this.angleXY(xOff, yOff)
      }

      angleXY(xOff, yOff) {
         const beforeTurn = this.degrees(Math.atan2(xOff, -yOff)) + 180
         let afterTurn = beforeTurn + 180
         if (afterTurn > 360) {
            afterTurn -= 360
         }
         return afterTurn
      }

      angleToAngle(d1, d2) {
         let right = d2 - d1
         if (right < 0) {
            right = 360 + right
         }

         let left = d1 - d2
         if (left < 0) {
            left = 360 + left
         }

         return right > left ? -left : right
      }

      stepsToSeconds(steps, decimals = 1) {
         return Math.ceil((steps / 60) * decimals) / decimals
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_MATH
   else cs.math = new CSENGINE_MATH(cs) // eslint-disable-line no-undef
})()
