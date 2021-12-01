<template>
  <div class="dc-container">
    <font-awesome-icon icon="exchange-alt" @click="showMeaning = !showMeaning" class="replace" />
    <h1 class="meanings">
      <div v-if="showMeaning">
        <span
          class="meaning"
          :class="{ 'meaning-kanji': data.kanji }"
          v-for="meaning in data.meanings"
          :key="meaning"
          >{{ meaning }}</span
        >
      </div>
      <div v-else>
        <span class="character" v-if="data.character">{{ data.character }}</span>
        <span class="character" v-if="data.kanji">{{ data.kanji }}</span>
      </div>
    </h1>
    <h2 class="description">Draw the character:</h2>
    <Canvas @getCanvas="checkCanvas" :answer="answer" :disableButton="disableCanvasButton" />
  </div>
</template>
<script>
import Canvas from '@/components/Canvas.vue'
import { toRaw } from 'vue'
import * as tf from '@tensorflow/tfjs'

export default {
  name: 'ExerciseDrawCharacter',
  components: { Canvas },
  props: {
    data: {
      type: Object,
      required: true,
    },
    model: {
      required: true,
      type: Object,
    },
    secondChance: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      showMeaning: true,
      labels: [],
      answer: null,
      disableCanvasButton: false,
    }
  },
  mounted() {
    try {
      let alphabet = this.$route.path.split('/')[1].toLowerCase()
      let folder = alphabet.includes('hiragana') || alphabet.includes('katakana') ? 'hiraganakatakana' : 'kanji'

      ;({ labels: this.labels } = require(`@/assets/lessons/${folder}/${alphabet}_labels.js`))
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }
  },
  methods: {
    async checkCanvas(payload) {
      this.disableCanvasButton = true
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
        if(this.data.character) {
          this.predictedClass = result.dataSync().indexOf(Math.max(...result.dataSync()))
          this.predictedClassPercent = Math.max(...result.dataSync())
          console.log(this.labels[this.predictedClass], this.predictedClassPercent)
          this.checkAnswer(this.labels[this.predictedClass])
        } else {
          let topPredictions = []
          let predictedClass = null
          result = Array.from(result.dataSync())
          for (let index = 0; index < 25; index++) {
            predictedClass = result.indexOf(Math.max(...result))
            topPredictions.push(predictedClass)
            result.splice(predictedClass, 1)
          }
          this.checkAnswer(
            topPredictions.map((el) => {
              return this.labels[el]
            })
          )
        }
      } catch (e) {
        console.error(e)
      }
    },
    checkAnswer(predictedClass) {
      if (this.data.character) {
        if (this.data.character === predictedClass) {
          this.answer = 'correct'
          this.$emit('exerciseChecked', 1)
        } else {
          this.answer = 'wrong'
          this.$emit('exerciseChecked', { type: this.$options.name, data: this.data, secondChance: this.secondChance })
        }
      } else {
        console.log(predictedClass);
        if (predictedClass.includes(this.data.kanji)) {
          this.answer = 'correct'
          this.$emit('exerciseChecked', 1)
        } else {
          this.answer = 'wrong'
          this.$emit('exerciseChecked', { type: this.$options.name, data: this.data, secondChance: this.secondChance })
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.dc-container {
  position: relative;
  .replace {
    cursor: pointer;
    position: absolute;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    top: -30px;
    left: 50%;
    transform: translate(-50%);
    font-size: 1.6rem;
    color: var(--color-details);
    z-index: 2;
  }
  .meanings {
    --font-size: 10rem;
    font-weight: normal;
    position: relative;
    overflow-wrap: break-word;

    .meaning,
    .character {
      overflow-wrap: anywhere;
      font-size: var(--font-size);
      line-height: var(--font-size);
    }

    .meaning-kanji {
      margin: 20px auto;
      line-height: 2rem;
      font-size: 2rem;
      hyphens: auto;
    }

    span::after {
      content: ', ';
    }
    span:last-of-type::after {
      display: none;
    }
    &__text {
    }
  }

  .description {
    --font-size: 1.2rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    margin: 5px auto;
  }
}
</style>