<template>
  <div class="search-container">
    <h1 class="title">SEARCH KANJI</h1>
    <Loader v-if="loading" />
    <InputText
      label="Search"
      @getInput="getInputValue"
      @buttonClicked="prepareCanvas"
      placeholder="Search (kanji, meaning or reading)"
      :icon="icon"
      :disabled="disableInput"
    />
    <div class="draw-character" v-if="showCanvas">
      <h2 class="description">Draw the character:</h2>
      <Canvas @getCanvas="checkCanvas" />
      <Button v-for="(predictedClass, idx) in predictedClasses" @click="getInputValue(predictedClass)" class="button" :key="idx">{{predictedClass}}</Button>
    </div>
  </div>
</template>

<script>
import InputText from '@/components/InputText.vue'
import Canvas from '@/components/Canvas.vue'
import Loader from '@/components/Loader.vue'
import Button from '@/components/Button.vue'
import kanjiData from '@/assets/dict/kanji_dict.json'
import * as wanakana from '@/scripts/wanakana.js'
import { toRaw } from 'vue'
import * as tf from '@tensorflow/tfjs'

export default {
  components: { Loader, InputText, Canvas, Button },
  data() {
    return {
      kanjiDict: kanjiData,
      disableInput: false,
      showCanvas: false,
      model: null,
      loading: true,
      icon: 'paint-brush',
      predictedClasses: ["握", "円", "縁", "加", "吉"]
    }
  },
  async mounted() {
    try {
      this.model = await tf.loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/model.json`)
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }
    // this.kanjiDict = Object.entries(this.kanjiDict)
    // this.kanjiDict.forEach((el, id) => {
    //   // if(id == 0) {
    //     console.log(el, id);
    //   // }
    // })

    // for (const kanji in this.kanjiDict) {
    //   console.log(this.kanjiDict[kanji])
    // }

    console.log(`test ${wanakana.toKana('tofunosushi')}`)
    console.log(wanakana.isJapanese('泣き虫。！〜２￥ｚｅｎｋａｋｕ'))
    console.log(this.isKanji('タ'))
    console.log(this.isKanji('亜'))
    this.loading = false
  },
  methods: {
    isKanji(ch) {
      ch = ch[0]
      return (
        (ch >= '\u4e00' && ch <= '\u9fcf') || (ch >= '\uf900' && ch <= '\ufaff') || (ch >= '\u3400' && ch <= '\u4dbf')
      )
    },
    getInputValue(value) {
      console.log(value)
    },
    prepareCanvas() {
      console.log('button clicked')
      if (this.showCanvas) {
        this.disableInput = false
        this.showCanvas = false
        this.icon = 'paint-brush'
      } else {
        this.disableInput = true
        this.showCanvas = true
        this.icon = 'times'
      }
    },
    async checkCanvas(payload) {
      console.log(payload)
      this.checkCharacter(payload)
    },
    async checkCharacter(canvasImage) {
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
      try {
        let model = toRaw(this.model)
        let result = await model.predict(tensorImage)
        let top5predictions = []
        let predictedClass = null
        console.log('asdadas');
        result = Array.from(result.dataSync())
        for (let index = 0; index < 5; index++) {
          predictedClass = result.indexOf(Math.max(...result))
          top5predictions.push(predictedClass)
          result.splice(predictedClass, 1);
        }
        console.log('po wynikach', top5predictions);
        // change - top5 has indexes, get real kanjis
        // this.predictedClasseses
        // console.log(this.predictedClass, this.predictedClassPercent)
        // this.checkAnswer(this.labels[this.predictedClass])
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  max-width: min(90vw, var(--xxl));
  margin: auto;

  .title {
    margin-bottom: 60px;
    user-select: none;
  }

  .draw-character {
    margin-top: 10px;
    .description {
      --font-size: 1.2rem;
      font-weight: normal;
      font-size: var(--font-size);
      line-height: var(--font-size);
      margin: 5px auto;
    }
    
    .button {
      margin: 10px;
      width: 3rem;
      height: 3rem;
      font-weight:  normal;
    }
  }
}
</style>
