<template>
  <div class="ctm-container">
    <h1 class="character" v-if="data.character">
      {{ data.character }}
    </h1>
    <h1 class="character" v-else-if="data.kanji">
      {{ data.kanji }}
    </h1>
    <h2 class="description">Choose the correct answer:</h2>
    <div class="meanings">
      <Button
        class="meanings__elements"
        v-for="(answer, idx) in answers"
        :key="answer"
        color="white"
        :ref="setItemRef"
        @click="checkAnswer(answer, idx)"
      >
        <div class="meanings__text" :class="{ 'meanings__text-kanji': data.kanji }">
          <span v-for="meaning in answer.meanings" :key="meaning">{{ meaning }}</span>
        </div>
      </Button>
    </div>
  </div>
</template>
<script>
import mixins from '@/scripts/mixins.js'
import Button from '@/components/Button.vue'

export default {
  name: 'ExerciseCharacterToMeaning',
  components: { Button },
  mixins: [mixins],
  props: {
    data: {
      type: Object,
      required: true,
    },
    lesson: {
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
      answers: [],
      itemRefs: [],
    }
  },
  mounted() {
    let temp = this.shuffleArray([...this.lesson])
    this.answers.push(this.data)
    for (let index = 0; index < temp.length; index++) {
      if (this.answers.length > 2) {
        break
      }
      if (this.data.character) {
        if (temp[index].character !== this.data.character) {
          this.answers.push(temp[index])
        }
      } else {
        if (temp[index].kanji !== this.data.kanji) {
          this.answers.push(temp[index])
        }
      }
    }
    this.shuffleArray(this.answers)
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    },
    checkAnswer(answer, idx) {
      this.itemRefs.forEach((button) => {
        button.$el.disabled = true
      })
      if (this.data.character) {
        if (this.data.character === answer.character) {
          this.itemRefs[idx].$el.classList.value += ' correct'
          this.$emit('exerciseChecked', 1)
        } else {
          this.itemRefs[idx].$el.classList.value += ' wrong'
          let correctAnswerIdx = this.answers.findIndex((element) => {
            return element.character === this.data.character
          })
          this.itemRefs[correctAnswerIdx].$el.classList.value += ' correct'
          this.$emit('exerciseChecked', { type: this.$options.name, data: this.data, secondChance: this.secondChance })
        }
      } else {
        if (this.data.kanji === answer.kanji) {
          this.itemRefs[idx].$el.classList.value += ' correct'
          this.$emit('exerciseChecked', 1)
        } else {
          this.itemRefs[idx].$el.classList.value += ' wrong'
          let correctAnswerIdx = this.answers.findIndex((element) => {
            return element.kanji === this.data.kanji
          })
          this.itemRefs[correctAnswerIdx].$el.classList.value += ' correct'
          this.$emit('exerciseChecked', { type: this.$options.name, data: this.data, secondChance: this.secondChance })
        }
      }
    },
  },
  beforeUpdate() {
    this.itemRefs = []
  },
}
</script>
<style lang="scss" scoped>
.ctm-container {
  .character {
    --font-size: 10rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    min-height: var(--font-size);
  }

  .description {
    --font-size: 1.2rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    margin: 5px auto;
  }
  .meanings {
    display: flex;
    justify-content: center;
    align-content: center;
    &__elements {
      --font-size: 2rem;
      font-size: var(--font-size);
      margin: 8px;
      width: 5rem;
      min-height: 5rem;
      height: auto;
    }

    &__text {
      overflow-wrap: break-word;

      span::after {
        content: ',\00a0';
      }
      span:last-of-type::after {
        display: none;
      }
    }

    &__text-kanji {
      font-size: 1rem;
      hyphens: auto;
    }
  }
}
</style>
