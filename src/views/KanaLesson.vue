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
// import { toRaw } from 'vue'

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
      secondChanceExcercisesLength: null,
      currentExcercise: null,
      disableButton: false,
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
      // this.model.summary()

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
      } else {
        this.showResult()
      }
    },
    showResult() {
      console.log('$$$$ RESLUT ###')
      // perc = ((pEarned/pPos) * 100).toFixed();
    },
    excerciseChecked(payload) {
      if (typeof payload == 'number') {
        this.correctAnswers += 1
        console.log('dodanie punktu')
      } else if (typeof payload == 'object' && payload.secondChance) {
        console.log('dodanie seocnd chance')
        this.secondChanceExcercises.push({ ...payload, secondChance: false })
      }
      this.disableButton = false
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
  /* display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around; */
  /* min-height: calc(100vh - 50px); */
  /* max-height: 1080px; */

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
    /* background: red; */
    min-height: calc(75vh - 50px);
  }
}
</style>
