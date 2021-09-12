<template>
  <div class="search-container">
    <h1 class="title">SEARCH KANJI</h1>
    <Loader v-if="loading" />
    <div class="input">
      <div class="input-tooltip">
        <p style="font-weight: bold;">Examples:</p>
        <p>猫</p>
        <p>ねこ</p>
        <p>neko</p>
        <p>cat (exact match)</p>
        <p>cat* (all with the phrase)</p>
        <p>JLPT 2</p>
      </div>
      <InputText
        @getInput="getInputValue"
        @buttonClicked="prepareCanvas"
        placeholder="kanji, meaning, reading, JLPT"
        :lengthToEmit="0"
        :time="1000"
        :icon="icon"
        :disabled="disableInput"
      />
    </div>
    <div class="draw-character" v-if="showCanvas">
      <h2 class="description">Draw the character:</h2>
      <Canvas @getCanvas="checkCanvas" />
      <Button
        v-for="(predictedClass, idx) in predictedClasses"
        @click="getInputValue(predictedClass)"
        class="button"
        :key="idx"
      >
        {{ predictedClass }}
      </Button>
    </div>
    <p class="counter" v-if="searchResults.length >= 0 && value.length > 0">Found: {{ searchResults.length }}</p>
    <DictionaryKanjiDetails
      v-for="(item, index) in searchResults"
      :key="index"
      :element="item"
    ></DictionaryKanjiDetails>
  </div>
</template>

<script>
import InputText from '@/components/InputText.vue'
import Canvas from '@/components/Canvas.vue'
import Loader from '@/components/Loader.vue'
import Button from '@/components/Button.vue'
import DictionaryKanjiDetails from '@/components/DictionaryKanjiDetails.vue'
import kanjiData from '@/assets/dict/kanji_dict.json'
import * as wanakana from '@/scripts/wanakana.js'
import { toRaw } from 'vue'
import * as tf from '@tensorflow/tfjs'

export default {
  components: { Loader, InputText, Canvas, Button, DictionaryKanjiDetails },
  data() {
    return {
      kanjiDict: kanjiData,
      disableInput: false,
      showCanvas: false,
      model: null,
      loading: true,
      icon: 'paint-brush',
      predictedClasses: [],
      searchResults: [],
      value: '',
      labels: [],
    }
  },
  async mounted() {
    try {
      this.model = await tf.loadLayersModel(`indexeddb://kanji`)
      ;({ labels: this.labels } = require(`@/assets/lessons/kanji/kanji_labels.js`))
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }

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
      this.searchCharacters(value)
    },
    searchCharacters(value) {
      this.value = value
      this.loading = true
      this.searchResults = []
      value = value.trim()
      if (value.length > 0) {
        if (this.isKanji(value) && value.length === 1) {
          this.searchResults.push(this.kanjiDict[value])
        } else if (value.toLowerCase().startsWith('jlpt')) {
          let jlpt = value.split(' ')
          if (jlpt.length > 1) {
            jlpt = jlpt[jlpt.length - 1]
            for (const kanji in this.kanjiDict) {
              if (this.kanjiDict[kanji].jlpt === parseInt(jlpt, 10)) {
                this.searchResults.push(this.kanjiDict[kanji])
              }
            }
          }
        } else if (value.length === 1 && value.indexOf('*') !== -1) {
          this.searchResults = this.kanjiDict
        } else {
          let isExactSearch = value.indexOf('*') // -1 = yes, else = no
          value = value.replaceAll('*', '')
          let romaji, katakana, hiragana
          if (wanakana.isHiragana(value)) {
            romaji = wanakana.toRomaji(value)
            katakana = wanakana.toKatakana(value)
            hiragana = value
          } else if (wanakana.isKatakana(value)) {
            romaji = wanakana.toRomaji(value)
            katakana = value
            hiragana = wanakana.toHiragana(value)
          } else if (wanakana.isRomaji(value)) {
            romaji = value
            katakana = wanakana.toKatakana(value)
            hiragana = wanakana.toHiragana(value)
          }

          if (isExactSearch === -1) {
            for (const kanji in this.kanjiDict) {
              this.kanjiDict[kanji].meanings.forEach((el) => {
                if (el.toLowerCase() === romaji.toLowerCase()) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
              if (
                this.kanjiDict[kanji].heisig_en != null &&
                this.kanjiDict[kanji].heisig_en.toLowerCase() === romaji.toLowerCase()
              ) {
                this.searchResults.push(this.kanjiDict[kanji])
              }
              this.kanjiDict[kanji].kun_readings.forEach((el) => {
                if (el.replaceAll('.', '') === hiragana) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
              this.kanjiDict[kanji].on_readings.forEach((el) => {
                if (el.replaceAll('.', '') === katakana) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
            }
          } else {
            for (const kanji in this.kanjiDict) {
              this.kanjiDict[kanji].meanings.forEach((el) => {
                if (el.toLowerCase().includes(romaji.toLowerCase())) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
              if (
                this.kanjiDict[kanji].heisig_en != null &&
                this.kanjiDict[kanji].heisig_en.toLowerCase().includes(romaji.toLowerCase())
              ) {
                this.searchResults.push(this.kanjiDict[kanji])
              }
              this.kanjiDict[kanji].kun_readings.forEach((el) => {
                if (el.replaceAll('.', '').includes(hiragana)) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
              this.kanjiDict[kanji].on_readings.forEach((el) => {
                if (el.replaceAll('.', '').includes(katakana)) {
                  this.searchResults.push(this.kanjiDict[kanji])
                  return
                }
              })
            }
          }
          this.searchResults = Array.from(new Set(this.searchResults))
        }
      }
      this.loading = false
    },
    prepareCanvas() {
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
        let topPredictions = []
        let predictedClass = null
        result = Array.from(result.dataSync())
        for (let index = 0; index < 10; index++) {
          predictedClass = result.indexOf(Math.max(...result))
          topPredictions.push(predictedClass)
          result.splice(predictedClass, 1)
        }
        this.getPredictedKanjis(topPredictions)
      } catch (e) {
        console.error(e)
      }
    },
    getPredictedKanjis(values) {
      this.predictedClasses = []
      values.forEach((el) => {
        this.predictedClasses.push(this.labels[el])
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  max-width: min(90vw, var(--xxl));
  margin: auto;
  padding: 0 5px 0 5px;

  .title {
    margin-bottom: 60px;
    user-select: none;
  }

  .counter {
    margin: 10px auto;
  }

  .input {
    position: relative;
  }

  .input-tooltip {
    display: none;
    position: absolute;
    background: var(--color-background-white);
    top: -115px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 5px;
    border-radius: 5px;
    border: 2px solid var(--color-details);
    z-index: 50;
    font-size: 0.8rem;

    &::after {
      content: '▼';
      position: absolute;
      bottom: -6px;
      left: 50%;
      color: var(--color-background-white);
      text-shadow: 0 6.5px 0 var(--color-details);
      transform: translate(-50%, 0);
    }
  }

  .input:hover .input-tooltip {
    display: block;
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
      font-weight: normal;
    }
  }
}
</style>
