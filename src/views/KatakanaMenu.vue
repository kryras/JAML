<template>
  <div class="container">
    <h1 class="title">KATAKANA</h1>
    <div class="lessons-container">
      <div class="lesson" v-for="(element, element_key) in katakana" :key="element_key">
        <LessonBubble :title="element['title']" :character="element['icon']" completed="75" />
      </div>
    </div>
  </div>
</template>

<script>
import katakanaData from '../assets/lessons/hiraganakatakana/katakana.json'
// import * as wanakana from './scripts/wanakana.js'
// console.log(`test ${wanakana.toKana('TOFUGUnosushi')}`);
import LessonBubble from '../components/LessonBubble.vue'

export default {
  components: { LessonBubble },
  data() {
    return {
      katakana: katakanaData,
    }
  },
  mounted() {
    console.log(this.katakana['katakana1']['data'])
    // console.log(wanakana.isJapanese('泣き虫。！〜２￥ｚｅｎｋａｋｕ'))
  },
  method: {},
}
</script>

<style lang="scss" scoped>
.container {
  max-width: var(--xxl);
  margin: auto;

  .lessons-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    @media only screen and (min-width: 768px) {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 70px 0;
    }

    .lesson:nth-child(3n + 3) {
      flex: 0 1 100%;
    }
  }
}
</style>
