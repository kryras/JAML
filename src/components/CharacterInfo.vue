<template>
  <div class="character-info-container">
    <h1 class="character">{{ data.character }}</h1>
    <div class="meanings">
      <h2 class="meanings__element" v-for="meaning in data.meanings" :key="meaning">{{ meaning }}</h2>
    </div>
    <div class="readings">
      <div class="readings__kun">
        <h3 class="readings__kun-single"></h3>
      </div>
      <div class="readings__on">
        <h3 class="readings__onn-single"></h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
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
}
</style>
