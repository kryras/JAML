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
import { predict } from '@/scripts/tf-worker-api.js'

export default {
  name: 'ExerciseDrawCharacter',
  components: { Canvas },
  props: {
    data: {
      type: Object,
      required: true,
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
      try {
        const quantity = this.data.character ? 1 : 25
        let results = await predict([this.$route.params.alphabet.toLowerCase(), canvasImage, quantity])
        if (this.data.character) {
          this.checkAnswer(this.labels[results[0]])
        } else {
          this.checkAnswer(
            results.map((el) => {
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
    height: var(--font-size);
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;

    .meaning,
    .character {
      font-size: var(--font-size);
      line-height: var(--font-size);
    }

    .meaning-kanji {
      display: inline-block;
      overflow-wrap: break-word;
      line-height: clamp(1.4rem, 6vw, 2rem);
      font-size: clamp(1.4rem, 6vw, 2rem);
      hyphens: auto;
    }

    span::after {
      content: ',\00a0';
    }
    span:last-of-type::after {
      display: none;
    }
  }

  .description {
    --font-size: 1.2rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    margin: 5px auto;
    user-select: none;
  }
}
</style>
