<template>
  <Loader v-if="loading" />
  <div v-else class="container">
    <!-- kana lesson {{ $route.params.id }} -->
    {{ data }}
    <!-- <Canvas @getCanvas='checkSign' /> -->
    <!-- <component :is="'Canvas'" @getCanvas="checkSign"></component> -->
  </div>
</template>
<script>
/* eslint-disable */

import Loader from '@/components/Loader.vue'
import Canvas from '@/components/Canvas.vue'
import CharacterInfo from '@/components/CharacterInfo.vue'
import ExcerciseDrawCharacter from '@/components/ExcerciseDrawCharacter.vue'
import ExcerciseMeaningToCharacter from '@/components/ExcerciseMeaningToCharacter.vue'
import ExcerciseCharacterToMeaning from '@/components/ExcerciseCharacterToMeaning.vue'
import mixins from '@/scripts/mixins.js'
import * as tf from '@tensorflow/tfjs'
// import { toRaw } from 'vue'

export default {
  components: {
    Loader,
    Canvas,
    CharacterInfo,
    ExcerciseDrawCharacter,
    ExcerciseMeaningToCharacter,
    ExcerciseCharacterToMeaning,
  },
  mixins: [mixins],
  data() {
    return {
      loading: true,
      model: null,
      data: [],
      excercises: [],
      excercisesLength: null,
      correctAnswers: 0,
      secondChanceExcercises: [],
      currentExcercise: null,
      excercise: null,
    }
  },
  async created() {
    window.scrollTo(0, 0)
    try {
      let alphabet = this.$route.path.split('/')[1]
      let lesson = require(`@/assets/lessons/hiraganakatakana/${alphabet}.json`)
      this.data = lesson[`${this.$route.params.id}`]['data']

      this.model = await tf.loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/model.json`)
      // let ten = tf.zeros([1, 48, 48, 1], 'int32')
      // let model = toRaw(this.model)
      // await model.predict(ten)

      this.prepareLesson()
      this.loading = false
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }
  },

  methods: {
    prepareLesson() {
      const excercises = ['ExcerciseDrawCharacter', 'ExcerciseMeaningToCharacter', 'ExcerciseCharacterToMeaning']
      this.excercisesLength = this.data.length * excercises.length
      excercises.forEach((excercise) => {
        const shuffledData = this.shuffleArray([...this.data])
        shuffledData.forEach((data) => {
          this.excercises.push({ type: excercise, character: data })
        })
      })
      for (let index = this.data.length - 1; index >= 0; index--) {
        this.excercises.push({ type: 'CharacterInfo', data: this.data[index] })
      }
      console.log(this.excercises)
    },
    getExcercise() {
      var nextIndex = 0

      return {
        next() {},
      }
    },
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
      console.log(tensorImage)
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
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
</style>
