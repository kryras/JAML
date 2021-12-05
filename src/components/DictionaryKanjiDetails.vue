<template>
  <div class="dict-kanji-container">
    <span class="number" v-if="index">{{ index }}/{{ total }}</span>
    <h1 class="kanji">{{ element.kanji }}</h1>
    <section class="details">
      <div>
        <strong>Meanings:</strong>
      </div>
      <div>
        <p v-for="(meaning, index) in element.meanings" :key="index">{{ meaning }}</p>
      </div>

      <div>
        <strong>'Heisig' meaning:</strong>
      </div>
      <div>
        <p v-if="element.heisig_en">{{ element.heisig_en }}</p>
        <p v-if="element.heisig_en == null">-</p>
      </div>

      <div>
        <strong>Kun’yomi:</strong>
      </div>
      <div>
        <p v-for="(kun, index) in element.kun_readings" :key="index">{{ kun }} ({{ getRomaji(kun) }})</p>
        <p v-if="element.kun_readings.length === 0">-</p>
      </div>

      <div>
        <strong>On’yomi:</strong>
      </div>
      <div>
        <p v-for="(on, index) in element.on_readings" :key="index">{{ on }} ({{ getRomaji(on) }})</p>
        <p v-if="element.on_readings.length === 0">-</p>
      </div>

      <div>
        <strong>JLPT:</strong>
      </div>
      <div>
        <p v-if="element.jlpt">{{ element.jlpt }}</p>
        <p v-if="element.jlpt == null">-</p>
      </div>

      <div>
        <strong>Grade:</strong>
      </div>
      <div>
        <p v-if="element.grade">{{ element.grade }}</p>
        <p v-if="element.grade == null">-</p>
      </div>

      <div>
        <strong>Name readings:</strong>
      </div>
      <div>
        <p v-for="(name, index) in element.name_readings" :key="index">{{ name }} ({{ getRomaji(name) }})</p>
        <p v-if="element.name_readings.length === 0">-</p>
      </div>
    </section>
  </div>
</template>
<script>
import { toRomaji } from '@/scripts/wanakana.js'

export default {
  props: {
    element: {
      type: Object,
      required: true,
    },
    index: {
      required: false,
    },
    total: {
      required: false,
    },
  },
  methods: {
    getRomaji(value) {
      return toRomaji(value)
    },
  },
}
</script>
<style lang="scss" scoped>
.dict-kanji-container {
  margin: 10px auto;
  padding: 10px;
  background-color: var(--color-background-white);
  border-radius: 5px;
  border: 2px solid var(--color-details);
  position: relative;

  .number {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 0.9rem;
    color: var(--color-light-gray);
  }

  .kanji {
    font-weight: normal;
    margin: 10px auto;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: left;

    div {
      border-bottom: 1px solid var(--color-details);
      margin: 10px 0;
    }

    div:last-of-type,
    div:nth-last-of-type(2) {
      border-bottom: none;
    }
  }

  p:not(:last-of-type)::after {
    content: ', ';
  }
}
</style>
