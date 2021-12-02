<template>
  <div class="loader" v-if="loading">
    <Loader />
  </div>
  <div v-else class="kana-lesson-container">
    <component
      v-if="currentExercise"
      :is="currentExercise.type"
      :data="currentExercise.data"
      :secondChance="currentExercise.secondChance"
      :lesson="data"
      :model="model"
      v-dynamic-events="knownEvents"
      @exerciseChecked="exerciseChecked"
      @getCanvas="exerciseChecked"
      :key="currentExercise.data"
      id="component"
    ></component>
    <Button color="orange" @click="nextExercise" class="next-button" :disabled="buttonDisabled" ref="buttonNext"
      >NEXT</Button
    >
  </div>
  <div class="result" v-if="displayResult">
    <h2>Correct answers:</h2>
    <h2>{{ correctAnswers }} / {{ exercisesLength }} ({{ result }}%)</h2>
    <Button color="orange" @click="finishLesson">
      FINISH
    </Button>
  </div>
</template>
<script>
import Loader from '@/components/Loader.vue'
import Button from '@/components/Button.vue'
import CharacterInfo from '@/components/CharacterInfo.vue'
import ExerciseDrawCharacter from '@/components/ExerciseDrawCharacter.vue'
import ExerciseMeaningToCharacter from '@/components/ExerciseMeaningToCharacter.vue'
import ExerciseCharacterToMeaning from '@/components/ExerciseCharacterToMeaning.vue'
import mixins from '@/scripts/mixins.js'
import * as tf from '@tensorflow/tfjs'
import { toRaw } from 'vue'

export default {
  components: {
    Loader,
    Button,
    CharacterInfo,
    ExerciseDrawCharacter,
    ExerciseMeaningToCharacter,
    ExerciseCharacterToMeaning,
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
      knownEvents: ['getCanvas', 'exerciseChecked'],
      loading: true,
      model: null,
      data: [],
      exercises: [],
      exercisesLength: null,
      correctAnswers: 0,
      secondChanceExercises: [],
      currentExercise: null,
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

      const warmupResult = toRaw(this.model).predict(tf.zeros([1, 48, 48, 1]))
      warmupResult.dataSync()
      warmupResult.dispose()

      this.prepareLesson()
      this.nextExercise()
      this.loading = false
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }
  },
  methods: {
    prepareLesson() {
      const exercises = ['ExerciseDrawCharacter', 'ExerciseMeaningToCharacter', 'ExerciseCharacterToMeaning']
      this.exercisesLength = this.data.length * exercises.length
      exercises.forEach((exercise) => {
        const shuffledData = this.shuffleArray([...this.data])
        shuffledData.forEach((data) => {
          this.exercises.push({ type: exercise, data: data, secondChance: true })
        })
      })
      for (let index = this.data.length - 1; index >= 0; index--) {
        this.exercises.push({ type: 'CharacterInfo', data: this.data[index] })
      }
    },
    nextExercise() {
      this.disableButton = true
      if (this.exercises.length > 0) {
        this.currentExercise = this.exercises.pop()
        this.disableButton = this.currentExercise.type === 'CharacterInfo' ? false : true
      } else if (this.secondChanceExercises.length > 0) {
        this.currentExercise = this.secondChanceExercises.shift()
        this.disableButton = true
      }
    },
    showResult() {
      this.result = ((this.correctAnswers / this.exercisesLength) * 100).toFixed()
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
    exerciseChecked(payload) {
      if (typeof payload == 'number') {
        this.correctAnswers += 1
      } else if (typeof payload == 'object' && payload.secondChance) {
        this.secondChanceExercises.push({ ...payload, secondChance: false })
      }
      this.disableButton = false
      if (this.exercises.length === 0 && this.secondChanceExercises.length === 0) {
        this.disableButton = true
        this.showResult()
      }
      this.$nextTick(() => this.$refs.buttonNext.$el.focus())
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

.loader {
  $offset: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - #{$offset});
  transform: translateY(-#{$offset});
  width: 100%;
}
</style>
