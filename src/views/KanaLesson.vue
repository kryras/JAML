<template>
  <Loader v-if="loading" />
  <div v-else class="container">
    kana lesson {{ $route.params.id }}
    <br />
    {{ data }}
    <Canvas @getCanvas='checkSign' />
    <!-- <component :is="Canvas"></component> -->
  </div>
</template>
<script>
import Loader from '@/components/Loader.vue'
import Canvas from '@/components/Canvas.vue'
import * as tf from '@tensorflow/tfjs'
// import { toRaw } from 'vue'

export default {
  components: { Loader, Canvas },
  data() {
    return {
      data: {},
      loading: true,
      model: null,
    }
  },
  async created() {
    try {
      let alphabet = this.$route.path.split('/')[1]
      let lesson = require(`@/assets/lessons/hiraganakatakana/${alphabet}.json`)
      this.data = lesson[`${this.$route.params.id}`]['data']
      
      this.model = await tf.loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/model.json`)
      // let ten = tf.zeros([1, 48, 48, 1], 'int32')
      // let model = toRaw(this.model)
      // await model.predict(ten)
      
      this.loading = false
    } catch (e) {
      console.log(e);
      this.$router.push({ name: 'NotFound' })
    }
  },

  methods: {
    async checkSign(canvasImage) {
      let tensorImage = tf.browser
        .fromPixels(canvasImage)
        .resizeNearestNeighbor([48, 48])
        .div(255)
        .toInt()
        .mean(2)
        .expandDims(2)
        .expandDims(0)
        .arraySync()
      tensorImage = tf.cast(tensorImage, 'int32')
      console.log(tensorImage);
      // try {
      //   let model = toRaw(this.model)
      //   let result = await model.predict(tensorImage)
      //   console.log(result.dataSync().indexOf(Math.max(...result.dataSync())), Math.max(...result.dataSync()))
      //   this.predictedClass = result.dataSync().indexOf(Math.max(...result.dataSync()))
      //   this.predictedClassPercent = Math.max(...result.dataSync())
      // } catch (e) {
      //   console.error(e)
      // }
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
}
</style>
