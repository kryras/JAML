<template>
    <div class="kanji-menu-container">
      <h1 class="title">KANJI</h1>
      <div class="lessons-container">
        <div class="lesson" v-for="(element, element_key) in kanji" :key="element_key">
          <LessonBubble
            class="lesson__start"
            :title="element['title']"
            :character="element['icon']"
            :completion="progress[element_key]"
            @click="startLesson(element_key)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import kanjiData from '@/assets/lessons/kanji/kanji.json'
  // import * as wanakana from '@/scripts/wanakana.js'
  // console.log(`test ${wanakana.toKana('TOFUGUnosushi')}`);
  import LessonBubble from '@/components/LessonBubble.vue'
  
  export default {
    components: { LessonBubble },
    data() {
      return {
        kanji: kanjiData,
        progress: {},
      }
    },
    mounted() {
      let lessonsProgress = localStorage.getItem('lessonsProgress')
      if (lessonsProgress) {
        lessonsProgress = JSON.parse(lessonsProgress)
        if (lessonsProgress[`${this.$route.path.split('/')[1].toLowerCase()}`] !== undefined) {
          this.progress = lessonsProgress[`${this.$route.path.split('/')[1].toLowerCase()}`]
        }
      }
      // console.log(wanakana.isJapanese('泣き虫。！〜２￥ｚｅｎｋａｋｕ'))
    },
    methods: {
      startLesson(element_key) {
        this.$router.push({ name: 'KanaLesson', params: { alphabet: 'kanji',  id: `${element_key}` } })
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .kanji-menu-container {
    max-width: var(--xxl);
    margin: auto;
  
    .title {
      margin-bottom: 60px;
      user-select: none;
    }
  
    .lessons-container {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      @media only screen and (min-width: 768px) {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 70px 0;
      }
  
      @media only screen and (max-width: 1024px) and (min-width: 768px) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 70px 0;
      }
  
      .lesson {
        margin: 20px;
  
        &__start {
          cursor: pointer;
        }
      }
  
      .lesson:nth-child(3n + 3) {
        flex: 0 1 100%;
      }
    }
  }
  </style>
  