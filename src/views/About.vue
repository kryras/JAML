<template>
  <div class="container">
    <h1 class="title">About</h1>
    <div class="about-container">
      <div class="about-element"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  method: {},
}
</script>

<style lang="scss" scoped>
.container {
  max-width: var(--xxl);
  margin: auto;

  .title {
    margin-bottom: 60px;
    user-select: none;
  }

  .about-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    /* @media only screen and (min-width: 768px) {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 70px 0;
    }

    @media only screen and (max-width: 1024px) and (min-width: 768px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 70px 0;
    } */

    .about-element {
      margin: 20px;
    }
  }
}
</style>
