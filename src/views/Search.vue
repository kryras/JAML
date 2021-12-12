<template>
  <div class="loader" v-if="loading">
    <Loader />
  </div>
  <div class="search-container" v-else>
    <h1 class="title">SEARCH KANJI</h1>
    <div class="input">
      <div class="input-tooltip">
        <p style="font-weight: bold;">Examples:</p>
        <p>猫</p>
        <p>ねこ</p>
        <p>neko</p>
        <p>cat (exact match)</p>
        <p>cat* (all with the phrase)</p>
        <p>STROKES 9</p>
        <p>JLPT 2</p>
        <p>GRADE 8</p>
      </div>
      <InputText
        @getInput="getInputValue"
        @buttonClicked="prepareCanvas"
        placeholder="kanji, meaning, reading, JLPT"
        :lengthToEmit="0"
        :time="1000"
        :icon="icon"
        :disabled="disableInput"
      />
    </div>
    <div class="draw-character" v-if="showCanvas">
      <h2 class="description">Draw the character:</h2>
      <Canvas @getCanvas="checkCanvas" />
      <Button
        v-for="(predictedClass, idx) in predictedClasses"
        @click="getInputValue(predictedClass)"
        class="button"
        :key="idx"
      >
        {{ predictedClass }}
      </Button>
    </div>
    <p class="counter" v-if="searchResults.length >= 0 && value.length > 0">Found: {{ searchResults.length }}</p>
    <div class="search-results">
      <DictionaryKanjiDetails
        v-for="(item, index) in searchResultsPart"
        :key="index"
        :element="item"
        :index="index + 1"
        :total="searchResults.length"
      >
      </DictionaryKanjiDetails>
      <Observer @intersect="loadMoreResults" />
    </div>
    <ButtonScrollTop />
  </div>
</template>

<script>
import InputText from '@/components/InputText.vue'
import Canvas from '@/components/Canvas.vue'
import Loader from '@/components/Loader.vue'
import Button from '@/components/Button.vue'
import Observer from '@/components/Observer.vue'
import DictionaryKanjiDetails from '@/components/DictionaryKanjiDetails.vue'
import ButtonScrollTop from '@/components/ButtonScrollTop.vue'
import kanjiData from '@/assets/dict/kanji_dict.json'
import { toRomaji, toHiragana, toKatakana } from '@/scripts/wanakana.js'
import { warmUpModel, predict } from '@/scripts/tf-worker-api.js'

export default {
  components: { Loader, InputText, Canvas, Button, Observer, DictionaryKanjiDetails, ButtonScrollTop },
  data() {
    return {
      kanjiDict: Object.keys(kanjiData).map((key) => kanjiData[key]),
      disableInput: false,
      showCanvas: false,
      model: null,
      loading: true,
      icon: 'paint-brush',
      predictedClasses: [],
      searchResults: [],
      searchResultsPart: [],
      searchResultsPosition: 0,
      value: '',
      labels: [],
    }
  },
  async mounted() {
    try {
      await warmUpModel('kanji')
      ;({ labels: this.labels } = require(`@/assets/lessons/kanji/kanji_labels.js`))
    } catch (e) {
      console.log(e)
      this.$router.push({ name: 'NotFound' })
    }
    this.loading = false
  },
  methods: {
    isKanji(ch) {
      ch = ch[0]
      return (
        (ch >= '\u4e00' && ch <= '\u9fcf') || (ch >= '\uf900' && ch <= '\ufaff') || (ch >= '\u3400' && ch <= '\u4dbf')
      )
    },
    getInputValue(value) {
      this.searchCharacters(value)
    },
    isSearchingAttributeContainingNumber(value) {
      const inputValue = value.split(' ')
      const attributes = ['jlpt', 'strokes', 'grade']
      return inputValue.length === 2 && attributes.indexOf(inputValue[0]) !== -1 && parseInt(inputValue[1], 10)
    },
    isSearchingAllKanji(value) {
      return value.indexOf('*') !== -1 && new Set(value).size === 1
    },
    getKanjiWithExactAttributeValue(collection, attribute, value, singleKanji = false, singleValue = false) {
      if (singleKanji) {
        if (singleValue && collection[attribute] === value) {
          this.searchResults.push(collection)
        } else if (!singleValue) {
          for (const attributeValue of collection[attribute]) {
            if (attributeValue.replaceAll('.', '') === value) {
              this.searchResults.push(collection)
              break
            }
          }
        }
      } else {
        collection.forEach((kanji) => {
          if (kanji[attribute] === value) {
            this.searchResults.push(kanji)
          }
        })
      }
    },
    getKanjiWithAttributeContainingValue(collection, attribute, value, singleKanji = false, singleValue = false) {
      if (singleKanji) {
        if (singleValue && collection[attribute]?.includes(value)) {
          this.searchResults.push(collection)
        } else if (!singleValue) {
          for (const attributeValue of collection[attribute]) {
            if (attributeValue.replaceAll('.', '').includes(value)) {
              this.searchResults.push(collection)
              break
            }
          }
        }
      } else {
        collection.forEach((kanji) => {
          if (kanji[attribute].includes(value)) {
            this.searchResults.push(kanji)
          }
        })
      }
    },
    convertValueToAllAlphabets(value) {
      return {
        romaji: toRomaji(value),
        katakana: toKatakana(value),
        hiragana: toHiragana(value),
      }
    },
    getAttributeNameWithNumber(value) {
      const inputValue = value.split(' ')
      return { name: inputValue[0] === 'strokes' ? 'stroke_count' : inputValue[0], number: parseInt(inputValue[1], 10) }
    },
    searchCharacters(value) {
      this.value = value.trim()
      value = value.trim().toLowerCase()
      if (value.length === 0) return
      this.searchResults = []

      if (this.isKanji(value) && value.length === 1) {
        this.searchResults = [this.kanjiDict.find((element) => element.kanji === value)]
      } else if (this.isSearchingAttributeContainingNumber(value)) {
        const attribute = this.getAttributeNameWithNumber(value)
        this.getKanjiWithExactAttributeValue(this.kanjiDict, attribute.name, attribute.number)
      } else if (this.isSearchingAllKanji(value)) {
        this.searchResults = this.kanjiDict
      } else {
        let isExactSearch = value.indexOf('*') === -1
        value = value.replaceAll('*', '')
        let { romaji, katakana, hiragana } = this.convertValueToAllAlphabets(value)

        if (isExactSearch) {
          for (const kanji of this.kanjiDict) {
            this.getKanjiWithExactAttributeValue(kanji, 'meanings', romaji, true)
            this.getKanjiWithExactAttributeValue(kanji, 'heisig_en', romaji, true, true)
            this.getKanjiWithExactAttributeValue(kanji, 'kun_readings', hiragana, true)
            this.getKanjiWithExactAttributeValue(kanji, 'on_readings', katakana, true)
          }
        } else {
          for (const kanji of this.kanjiDict) {
            this.getKanjiWithAttributeContainingValue(kanji, 'meanings', romaji, true)
            this.getKanjiWithAttributeContainingValue(kanji, 'heisig_en', romaji, true, true)
            this.getKanjiWithAttributeContainingValue(kanji, 'kun_readings', hiragana, true)
            this.getKanjiWithAttributeContainingValue(kanji, 'on_readings', katakana, true)
          }
        }
      }
      this.searchResults = Array.from(new Set(this.searchResults))
      this.searchResultsPosition = 0
      this.searchResultsPart = []
      this.loadMoreResults()
    },
    prepareCanvas() {
      if (this.showCanvas) {
        this.disableInput = false
        this.showCanvas = false
        this.icon = 'paint-brush'
      } else {
        this.disableInput = true
        this.showCanvas = true
        this.icon = 'times'
      }
    },
    async checkCanvas(payload) {
      this.checkCharacter(payload)
    },
    async checkCharacter(canvasImage) {
      try {
        const quantity = 10
        let results = await predict(['kanji', canvasImage, quantity])
        this.getPredictedKanjis(results)
      } catch (e) {
        console.error(e)
      }
    },
    getPredictedKanjis(values) {
      this.predictedClasses = []
      values.forEach((el) => {
        this.predictedClasses.push(this.labels[el])
      })
    },
    loadMoreResults() {
      if (this.searchResults.length > 0 && this.searchResultsPosition <= this.searchResults.length) {
        const offset = 50
        this.searchResultsPart = [
          ...this.searchResultsPart,
          ...this.searchResults.slice(this.searchResultsPosition, this.searchResultsPosition + offset),
        ]
        this.searchResultsPosition += offset
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  max-width: min(90vw, var(--xxl));
  margin: auto;
  padding: 0 5px 0 5px;

  .title {
    margin-bottom: 60px;
    user-select: none;
  }

  .counter {
    margin: 10px auto;
  }

  .input {
    position: relative;
  }

  @media screen and (min-width: 1025px) {
    .input,
    .search-results {
      max-width: 90%;
      margin: auto;
    }
  }

  .input-tooltip {
    display: none;
    position: absolute;
    background: var(--color-background-white);
    left: 50%;
    transform: translate(-50%, -92%);
    padding: 5px;
    border-radius: 5px;
    min-width: 155px;
    border: 2px solid var(--color-details);
    z-index: 50;
    font-size: 0.8rem;

    &::after {
      content: '▼';
      position: absolute;
      bottom: -6px;
      left: 50%;
      color: var(--color-background-white);
      text-shadow: 0 6.5px 0 var(--color-details);
      transform: translate(-50%, 0);
    }
  }

  .input:hover .input-tooltip {
    display: block;
  }

  .draw-character {
    margin-top: 10px;
    .description {
      --font-size: 1.2rem;
      font-weight: normal;
      font-size: var(--font-size);
      line-height: var(--font-size);
      margin: 5px auto;
    }

    .button {
      margin: 10px;
      width: 3rem;
      height: 3rem;
      font-weight: normal;
    }
  }
}

.loader {
  $offset: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - #{$offset});
  transform: translateY(calc(-#{$offset} + 2.25rem));
  width: 100%;
}
</style>
