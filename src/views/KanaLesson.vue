<template>
  <Loader v-if="loading" />
  <div v-else class="kana-lesson-container">
    <component
      v-if="currentExcercise"
      :is="currentExcercise.type"
      :data="currentExcercise.data"
      :secondChance="currentExcercise.secondChance"
      :lesson="data"
      :model="model"
      v-dynamic-events="knownEvents"
      @excerciseChecked="excerciseChecked"
      @getCanvas="excerciseChecked"
      :key="currentExcercise.data"
      id="component"
    ></component>
    <Button color="orange" @click="nextExcercise" class="next-button" :disabled="buttonDisabled">NEXT</Button>
  </div>
  <div class="result" v-if="displayResult">
    <h2>Correct answers:</h2>
    <h2>{{ correctAnswers }} / {{ excercisesLength }} ({{ result }}%)</h2>
    <Button color="orange" @click="finishLesson">
      FINISH
    </Button>
  </div>
</template>
<script>
import Loader from '@/components/Loader.vue'
import Button from '@/components/Button.vue'
import CharacterInfo from '@/components/CharacterInfo.vue'
import ExcerciseDrawCharacter from '@/components/ExcerciseDrawCharacter.vue'
import ExcerciseMeaningToCharacter from '@/components/ExcerciseMeaningToCharacter.vue'
import ExcerciseCharacterToMeaning from '@/components/ExcerciseCharacterToMeaning.vue'
import mixins from '@/scripts/mixins.js'
import * as tf from '@tensorflow/tfjs'

export default {
  components: {
    Loader,
    Button,
    CharacterInfo,
    ExcerciseDrawCharacter,
    ExcerciseMeaningToCharacter,
    ExcerciseCharacterToMeaning,
  },
  directives: {
    DynamicEvents: {
      bind: (el, binding, vnode) => {
        const allEvents = binding.value
        Object.keys(allEvents).forEach((event) => {
          // register handler in the dynamic component
          vnode.componentInstance.$on(event, (eventData) => {
            const targetEvent = allEvents[event]
            vnode.context[targetEvent](eventData)
          })
        })
      },
      unbind: function(el, binding, vnode) {
        vnode.componentInstance.$off()
      },
    },
  },
  mixins: [mixins],
  data() {
    return {
      knownEvents: ['getCanvas', 'excerciseChecked'],
      loading: true,
      model: null,
      data: [],
      excercises: [],
      excercisesLength: null,
      correctAnswers: 0,
      secondChanceExcercises: [],
      currentExcercise: null,
      disableButton: false,
      result: null,
      displayResult: false,
    }
  },
  async created() {
    window.scrollTo(0, 0)
    try {
      let alphabet =
        this.$route.params.alphabet.toLowerCase() === 'hiragana' ||
        this.$route.params.alphabet.toLowerCase() === 'katakana'
          ? 'hiraganakatakana'
          : 'kanji'
      let lesson = require(`@/assets/lessons/${alphabet}/${this.$route.params.alphabet.toLowerCase()}.json`)
      this.data = lesson[`${this.$route.params.id.toLowerCase()}`]['data']
      this.model = await tf.loadLayersModel(`indexeddb://${this.$route.params.alphabet.toLowerCase()}`)

      this.prepareLesson()
      this.nextExcercise()
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
          this.excercises.push({ type: excercise, data: data, secondChance: true })
        })
      })
      for (let index = this.data.length - 1; index >= 0; index--) {
        this.excercises.push({ type: 'CharacterInfo', data: this.data[index] })
      }
    },
    nextExcercise() {
      this.disableButton = true
      if (this.excercises.length > 0) {
        this.currentExcercise = this.excercises.pop()
        this.disableButton = this.currentExcercise.type === 'CharacterInfo' ? false : true
      } else if (this.secondChanceExcercises.length > 0) {
        this.currentExcercise = this.secondChanceExcercises.shift()
        this.disableButton = true
      }
    },
    showResult() {
      this.result = ((this.correctAnswers / this.excercisesLength) * 100).toFixed()
      this.displayResult = true
      this.saveResult()
    },
    saveResult() {
      let lessonsProgress = localStorage.getItem('lessonsProgress')
      if (lessonsProgress) {
        lessonsProgress = JSON.parse(lessonsProgress)
      } else {
        lessonsProgress = {}
      }

      if (lessonsProgress[`${this.$route.params.alphabet.toLowerCase()}`] === undefined) {
        lessonsProgress[`${this.$route.params.alphabet.toLowerCase()}`] = {}
      }
      lessonsProgress[`${this.$route.params.alphabet.toLowerCase()}`][
        `${this.$route.params.id.toLowerCase()}`
      ] = parseInt(this.result)
      localStorage.setItem('lessonsProgress', JSON.stringify(lessonsProgress))
    },
    finishLesson() {
      this.$router.back()
    },
    excerciseChecked(payload) {
      if (typeof payload == 'number') {
        this.correctAnswers += 1
      } else if (typeof payload == 'object' && payload.secondChance) {
        this.secondChanceExcercises.push({ ...payload, secondChance: false })
      }
      this.disableButton = false
      if (this.excercises.length === 0 && this.secondChanceExcercises.length === 0) {
        this.disableButton = true
        this.showResult()
      }
    },
  },
  computed: {
    buttonDisabled() {
      return this.disableButton
    },
  },
}
</script>
<style lang="scss" scoped>
.kana-lesson-container {
  max-width: var(--xxl);
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  align-items: center;
  .next-button {
    width: 5rem;
    height: 5rem;
    margin: 5px;
    margin: 10px auto;
  }

  #component {
    min-height: calc(75vh - 50px);
  }
}

.result {
  width: calc(100% - var(--navbar-width));

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  background-color: hsla(0, 0%, 0%, 0.75);
  height: 50vh;
  position: fixed;
  top: 50%;
  color: white;
  transform: translate(0, -50%);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  & > h2,
  & > button {
    margin: 5px auto;
  }
}
</style>
