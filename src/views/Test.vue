<template>
  <h1>Hello {{ model ? 'true' : 'false' }}</h1>
  <div id="sketchpadapp">
    <div class="rightside">
      <canvas id="sketchpad" height="300" width="400"> </canvas>
      <canvas id="res"> </canvas>
      <button id="clearbutton" @click="clearCanvas">clear</button>
      <button id="submit" @click="checkSign">CHECK</button>
    </div>
    <p id="status">Awaiting TF.js load</p>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'

export default {
  data() {
    return {
      model: null,
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
    }
  },
  async mounted() {
    const status = document.getElementById('status')
    status.innerText = 'Loaded TensorFlow.js - version: ' + tf.version.tfjs
    this.init()
    // tf.enableDebugMode()
    this.model = Object.freeze(await tf.loadLayersModel('http://192.168.0.157:8080/model.json'))
    // this.model.compile({optimizer: 'adam', loss:"sparseCategoricalCrossentropy", metrics:['accuracy']});
    // this.model.summary()
    // console.log(tf.getBackend());
    // console.log(tf.zeros([null,48,48,1], 'int32'));
    // tf.setBackend('cpu')

    // const srcBackend = info.backend;
    let ten = tf.zeros([1,48,48,1], 'int32')
    console.log(ten);
    console.log(ten.shape);
    console.log(ten.toString());
    // const a = tf.tensor([[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]], [1, 48, 48, 1], 'int32');
// console.log('shape:', a.shape);
// console.log('dtype', a.dtype);
// a.print();

    // console.log(ten);
    // let result = await this.model.predict(ten);
    // console.log(result);
    // warmupResult.dataSync();
    // warmupResult.dispose();


  },
  methods: {
    init() {
      this.canvas = document.getElementById('sketchpad')
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d')
      }
      if (this.ctx) {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.imageSmoothingEnabled = true

        this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false)
        this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false)
        window.addEventListener('mouseup', this.sketchpad_mouseUp, false)

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
        this.mouse.x = e.offsetX
        this.mouse.y = e.offsetY
      } else if (e.layerX) {
        this.mouse.x = e.layerX
        this.mouse.y = e.layerY
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
          this.touch.x = touch.clientX - touch.target.offsetLeft
          this.touch.y = touch.clientY - touch.target.offsetTop
        }
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    async checkSign() {
    //   let im = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    //   let imgPixel = tf.browser
    //     .fromPixels(this.canvas)
    //     .resizeNearestNeighbor([48, 48])
    //     .div(255)
    //     .toInt()
    //     .mean(2)
    //     .expandDims(2)
    //     .expandDims(0)
    //   // imgPixel.div(255)
    //   // imgPixel.shape[0] = null
    //   console.log(tf.stack(imgPixel.arraySync()))
    //   //   console.log(imgPixel)
    //   //   this.model.predict(tf.stack(imgPixel)).print()
    //   await this.model.predict(imgPixel)



    // let im = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    //   let imgPixel = tf.browser
    //     .fromPixels(im, 1)
    //     .resizeNearestNeighbor([48, 48])
    //     .div(255)
    //     .toInt()
    //     .mean(2)
    //     .expandDims(2)
    //     .expandDims(0)
    //   // imgPixel.div(255)
    // //   imgPixel.shape[0] = null
    //   console.log(tf.stack(imgPixel.arraySync()))
    //   imgPixel = tf.stack(imgPixel.arraySync())
    //   //   console.log(imgPixel)
    //   //   this.model.predict(tf.stack(imgPixel)).print()
    //   let asd = await (this.model.predict(imgPixel)).data()
    //   console.log(asd);



    let im = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      let imgPixel = tf.browser
        .fromPixels(im)
        .resizeNearestNeighbor([48, 48])
        .div(255)
        .toInt()
        .mean(2)
        .expandDims(2)
        .expandDims(0)
        .arraySync()
      // imgPixel.div(255)
    //   imgPixel.shape[0] = null
      imgPixel = tf.cast(imgPixel, 'int32')
    //   imgPixel = tf.stack(imgPixel.arraySync())
        console.log(imgPixel)
      //   this.model.predict(tf.stack(imgPixel)).print()
      try {
          let asd = await (this.model.predict(imgPixel))
        //   .then(info => {
        //         console.log("Final accuracy", info);
        //     });
          console.log(asd);

      } catch(e) {
          console.warn(e);
      }



      //   const canvas = document.querySelector('#res')
      //   canvas.imgPixel = imgPixel.shape.width
      //   canvas.imgPixel = imgPixel.shape.height
      //   await tf.browser.toPixels(imgPixel, canvas)
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  color: hsl(299, 81%, 29%);
}

/* Some CSS styling */
#sketchpadapp {
  /* Prevent nearby text being highlighted when accidentally dragging mouse outside confines of the canvas */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  max-width: 100vw;
}

#sketchpad {
  /* $war: 50px; */
  max-width: 100%;
  border: 10px solid #888;
  border-radius: 4px;
  position: relative; /* Necessary for correct mouse co-ords in Firefox */
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
