<template>
  <div class="character-info-container">
    <h1 class="character" v-if="data.character">{{ data.character }}</h1>
    <h1 class="character" v-else-if="data.kanji">{{ data.kanji }}</h1>

    <div class="meanings" v-if="data.character">
      <h2 class="meanings__element" v-for="meaning in data.meanings" :key="meaning">{{ meaning }}</h2>
    </div>
    <div class="meanings-kanji" v-else-if="data.kanji">
      <h2 class="meanings-kanji__element" v-for="meaning in data.meanings" :key="meaning">{{ meaning }}</h2>
    </div>

    <div class="readings" v-if="data.kanji">
      <div class="readings__kun">
        <h3>Kun’yomi:</h3>
        <h3 class="readings__kun-single" v-for="kun in data.kun_readings" :key="kun">
          {{ kun }} ({{ getRomaji(kun) }})
        </h3>
      </div>
      <div class="readings__on">
        <h3>On’yomi:</h3>
        <h3 class="readings__onn-single" v-for="on in data.on_readings" :key="on">{{ on }} ({{ getRomaji(on) }})</h3>
      </div>
    </div>
  </div>
</template>
<script>
import * as wanakana from '@/scripts/wanakana.js'
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getRomaji(value) {
      return wanakana.toRomaji(value)
    },
  },
}
</script>
<style lang="scss" scoped>
.character-info-container {
  .character {
    --font-size: 10rem;
    font-weight: normal;
    font-size: var(--font-size);
    line-height: var(--font-size);
  }

  .meanings {
    &__element {
      --font-size: 2rem;
      font-weight: normal;
      font-size: var(--font-size);
      line-height: var(--font-size);
    }
  }

  .meanings-kanji {
    margin-top: 20px;
    padding: 0 10px;
    &__element {
      margin-top: 20px;
      --font-size: 2rem;
      font-weight: normal;
      font-size: var(--font-size);
      line-height: var(--font-size);
      display: inline;
    }

    &__element:not(:last-of-type)::after {
      content: ', ';
    }
  }

  .readings {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
