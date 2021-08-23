<template>
  <div class="home-container">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="logo">
      <img class="logo__img" src="@/assets/logo.png" />
      <h1 class="logo__title">An application for learning Japanese alphabets with machine learning assistance</h1>
    </div>

    <h2 class="main-container-title">Select an alphabet</h2>
    <div class="main-container">
      <div>
        <router-link :to="{ name: 'MenuHiragana' }">
          <LessonBubble title="Hiragana" logo="logo_hiragana.svg"></LessonBubble>
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'MenuKatakana' }">
          <LessonBubble title="Katakana" logo="logo_katakana.svg"></LessonBubble>
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'MenuKanji' }">
          <LessonBubble title="Kanji" logo="logo_kanji.svg"></LessonBubble>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import LessonBubble from '@/components/LessonBubble.vue'

export default {
  name: 'Home',
  components: {
    LessonBubble,
  },
}
</script>

<style lang="scss" scoped>
.logo {
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 60px;
  user-select: none;

  &__img {
    width: 300px;
    height: auto;
  }

  &__title {
    font-size: 1rem;
  }
}

.main-container {
  display: flex;
  flex-flow: column nowrap;
  @media only screen and (min-width: 1400px) {
    flex-flow: row wrap;
    margin: auto;
    justify-content: space-evenly;
    max-width: 1920px;
  }

  &-title {
    margin-bottom: 30px;
    user-select: none;
  }

  a {
    text-decoration: none;
    display: inline-block;
    &:visited {
      color: inherit;
    }
  }

  & > *:not(h2) {
    margin: 20px;
  }
}

.icon {
  filter: invert(54%) sepia(97%) saturate(1110%) hue-rotate(331deg) brightness(101%) contrast(101%); /* box-shadow: 0 0 10px  var(--color-background-white); */
  width: 2rem;
  height: 2rem;
  z-index: 102;
  font-size: 2rem;
}
</style>
