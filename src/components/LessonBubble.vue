<template lang="">
  <div class="container">
    <div class="badge">
      <font-awesome-icon v-if="icon" :icon="icon" class="badge__icon" />
      <div v-else-if="character" class="badge__character">{{ character }}</div>
      <div v-else-if="logo" class="badge__logo">
        <img class="icon" :src="require(`@/assets/${logo}`)" />
      </div>
    </div>
    <div class="title">{{ title }}</div>
    <div v-if="completion" class="completion">completion: {{ completion }}%</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    character: {
      type: [String, Number],
      required: false,
    },
    logo: {
      type: [String, Number],
      required: false,
    },
    completion: {
      type: [String, Number],
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: inline-flex;
  width: auto;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  &:hover > .badge,
  &:active > .badge {
    transform: scale(1.05, 1.05);
  }

  .badge {
    background-color: var(--color-background-white);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: grid;
    align-items: center;
    margin-bottom: 10px;
    border: 5px solid var(--color-details);
    box-shadow: 0 0 2px 2px var(--color-background-white);
    transition: transform 0.2s ease-in-out;
    user-select: none;

    &__icon,
    &__character {
      font-size: 3rem;
      margin: auto;
      color: var(--color-details);
      display: block;
      user-select: none;
    }

    &__logo > img {
      filter: invert(54%) sepia(97%) saturate(1110%) hue-rotate(331deg) brightness(101%) contrast(101%);
      width: 4rem;
      height: 4rem;
    }
  }

  .title {
    font-size: 1.5rem;
    user-select: none;
    white-space: nowrap;
  }
  .completion {
    font-size: 1rem;
    user-select: none;
    white-space: nowrap;
  }
}
</style>
