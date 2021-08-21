<template lang="">
  <div class="container">
    <div class="badge">
      <!-- <font-awesome-icon :icon="['fas', 'user-secret']"  /> -->
      <!-- <font-awesome-icon  class="badge__icon" :icon="['fas', 'cat']" /> -->
      <font-awesome-icon v-if="icon" :icon="icon" class="badge__icon" />
      <div v-else-if="character" class="badge__character">{{ character }}</div>
    </div>
    <div class="title">{{ title }}</div>
    <div v-if="completed" class="completion">Completed: {{ completed }}%</div>
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
    completed: {
      type: [String, Number],
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  /* margin: 20px; */
  display: inline-flex;
  width: auto;
  flex-flow: column nowrap;
  justify-content: center;
  /* align-items: center; */
  align-items: center;
  /* margin: 200px; */
  /* gap:20px; */
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

    &__icon,
    &__character {
      font-size: 3rem;
      margin: auto;
      color: var(--color-details);
      display: block;
      user-select: none;
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
