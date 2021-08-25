<template>
  <div class="canvas-container">
    <canvas :class="answer" id="sketchpad"></canvas>
    <div class="buttons">
      <Button color="white" icon="eraser" @click="clearCanvas" :disabled="disableButton"></Button>
      <Button color="orange" icon="check" @click.once="emitCanvas" :disabled="disableButton"></Button>
    </div>
  </div>
</template>
<script>
import Button from '@/components/Button.vue'

export default {
  components: {
    Button,
  },
  props: {
    answer: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      canvas: undefined,
      ctx: undefined,
      mouse: {
        x: 0,
        y: 0,
      },
      touch: {
        x: 0,
        y: 0,
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      mousedown: false,
      disableButton: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.canvas = document.getElementById('sketchpad')
      const dimensions = 192
      this.canvas.width = dimensions
      this.canvas.height = dimensions
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d')
      }
      if (this.ctx) {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.imageSmoothingEnabled = true

        this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false)
        this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false)
        this.canvas.addEventListener('mouseup', this.sketchpad_mouseUp, false)

        this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false)
        this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false)
      }
    },
    sketchpad_mouseDown() {
      this.mouseDown = true
      this.ctx.moveTo(this.mouse.x, this.mouse.y)
      this.ctx.beginPath()
      this.ctx.lineWidth = 5
      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'
      this.ctx.strokeStyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`
    },
    sketchpad_mouseUp() {
      this.mouseDown = false
    },
    sketchpad_mouseMove(e) {
      this.getMousePos(e)

      if (this.mouseDown == 1) {
        this.ctx.lineTo(this.mouse.x, this.mouse.y)
        this.ctx.stroke()
      }
    },
    getMousePos(e) {
      if (!e) e = event

      if (e.offsetX) {
        this.mouse.x = e.offsetX + window.scrollX
        this.mouse.y = e.offsetY + window.scrollY
      } else if (e.layerX) {
        this.mouse.x = e.layerX + window.scrollX
        this.mouse.y = e.layerY + window.scrollY
      }
    },
    sketchpad_touchStart(e) {
      this.getTouchPos()
      this.ctx.moveTo(this.touch.x, this.touch.y)
      this.ctx.beginPath()
      this.ctx.lineWidth = 5
      this.ctx.lineCap = 'round'
      this.ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
      e.preventDefault()
    },
    sketchpad_touchMove(e) {
      this.getTouchPos(e)
      this.ctx.lineTo(this.touch.x, this.touch.y)
      this.ctx.stroke()
      e.preventDefault()
    },
    getTouchPos(e) {
      if (!e) e = event

      if (e.touches) {
        if (e.touches.length == 1) {
          let touch = e.touches[0]
          let rect = e.target.getBoundingClientRect()
          this.touch.x = touch.clientX - rect.left
          this.touch.y = touch.clientY - rect.top
        }
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    emitCanvas() {
      this.disableButton = true
      let canvasImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      this.$emit('getCanvas', canvasImage)
    },
  },
}
</script>
<style lang="scss" scoped>
.canvas-container {
  user-select: none;
  max-width: 192px;
  margin: auto;

  .buttons {
    width: 100%;

    button + button {
      margin-left: 10px;
    }
    & > button {
      --margin: 5px;
      width: calc(50% - var(--margin));
      margin-top: calc(2 * var(--margin));
    }
  }
}

#sketchpad {
  max-width: 100%;
  border: 1px solid var(--color-details);
  border-radius: 5px;
  position: relative;
  margin-top: 10pxpx;
}

.wrong {
  box-shadow: 0 0 5px 5px hsl(0, 97%, 39%) !important;
  border: 1px solid hsl(0, 97%, 39%) !important;
}

.correct {
  box-shadow: 0 0 5px 5px hsl(120, 88%, 35%) !important;
  border: 1px solid hsl(120, 88%, 35%) !important;
}

#clearbutton {
  font-size: 15px;
  padding: 10px;
  -webkit-appearance: none;
  background: #eee;
  border: 1px solid #888;
}

canvas {
  cursor: crosshair;
}
</style>
