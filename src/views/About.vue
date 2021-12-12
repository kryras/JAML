<template>
  <div class="about-container">
    <div class="logo">
      <img class="logo__img" src="@/assets/logo.png" alt="logo" />
      <h1 class="logo__title">An application for learning Japanese alphabets with machine learning assistance</h1>
    </div>
    <p>
      JAML application uses a convolutional neural network (made with TensorFlow + Keras) trained on the
      <a class="link" href="https://etlcdb.db.aist.go.jp/" target="_blank" rel="noopener noreferrer">ETL Character Database</a> datasets to classify handwritten
      Japanese characters.
    </p>
    <p class="list-title">The application uses:
      <ul class="list">
        <li><a class="link" href="https://kanjiapi.dev/" target="_blank" rel="noopener noreferrer">kanjiapi.dev</a> dictionary</li>
        <li><a class="link" href="https://wanakana.com/" target="_blank" rel="noopener noreferrer">WanaKana</a> library</li>
      </ul>
    </p>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>

.about-container {
  max-width: var(--xxl);
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;

  .logo {
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 60px;
    user-select: none;

    &__img {
      width: min(90vw, 300px);
      height: auto;
    }

    &__title {
      font-size: 1rem;
    }
  }

  .link {
    font-weight: bold;

    &:hover {
      color: var(--color-details);
    }
  }

  .list-title {
    margin-top: 10px;
  }

  .list{
    list-style: none;
    padding: 0;
  }

  .about-element {
    margin: 20px;
  }
}
</style>
