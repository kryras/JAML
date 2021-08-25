<template>
  <div class="mtc-container">
    <h1 class="meanings">
      <span v-for="meaning in data.meanings" :key="meaning">{{ meaning }}</span>
    </h1>
    <h2 class="description">Choose the correct answer:</h2>
    <div class="character">
      <Button
        class="character__elements"
        v-for="(answer, idx) in answers"
        :key="answer"
        color="white"
        :ref="setItemRef"
        @click="checkAnswer(answer, idx)"
      >
        {{ answer.character }}
      </Button>
    </div>
  </div>
</template>
<script>
import mixins from '@/scripts/mixins.js'
import Button from '@/components/Button.vue'

export default {
  name: 'ExcerciseMeaningToCharacter',
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
      if (temp[index].character !== this.data.character) {
        this.answers.push(temp[index])
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
      if (this.data.character === answer.character) {
        this.itemRefs[idx].$el.classList.value += ' correct'
        this.$emit('excerciseChecked', 1)
      } else {
        this.itemRefs[idx].$el.classList.value += ' wrong'
        let correctAnswerIdx = this.answers.findIndex((element) => {
          return element.character === this.data.character
        })
        this.itemRefs[correctAnswerIdx].$el.classList.value += ' correct'
        this.$emit('excerciseChecked', { type: this.$options.name, data: this.data })
      }
    },
  },
  beforeUpdate() {
    this.itemRefs = []
  },
}
</script>
<style lang="scss" scoped>
.mtc-container {
  .character {
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
  }

  .description {
    --font-size: 1.2rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    margin: 5px auto;
  }
  .meanings {
    --font-size: 10rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
    overflow-wrap: break-word;

    span::after {
      content: ', ';
    }
    span:last-of-type::after {
      display: none;
    }
    &__text {
    }
  }
}
</style>
