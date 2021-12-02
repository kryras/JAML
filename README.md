# JAML

**An application for learning Japanese alphabets with machine learning assistance**

![JAML](../media/screenshots/JAML_gif.gif?raw=true)

---

## About

The app allows learning the three Japanese alphabets (hiragana, katakana, kanji) by doing exercises such as matching meaning to character, matching character to meaning, drawing character which is further processed by CNN. It is possible to install the application (PWA) on supported devices and use it offline.
The user can select the alphabet on the home page or from the navigation, then select a lesson in which the user carries out a series of exercises. In case of an incorrect answer, the user has a second chance to do the exercise at the end of the lesson. After completing the entire lesson, the result is saved and visible in the lesson selection menu.
The application allows to search for a kanji character by typing the translation, meaning, or pronunciation in any form, or by drawing a character.  

## Screenshots

(click to enlarge)

| | | |
|:-:|:-:|:-:|
| ![Home Page](../media/screenshots/home.png?raw=true) | ![Lesson selection view](../media/screenshots/lesson_selection.png?raw=true) | ![Lesson - character presentation](../media/screenshots/lesson_character.png?raw=true)
| ![Lesson - match meaning to character](../media/screenshots/lesson_m2c.png?raw=true) | ![Lesson - match character to meaning](../media/screenshots/lesson_c2m.png?raw=true) | ![Lesson - draw character](../media/screenshots/lesson_draw.png?raw=true)
| ![Lesson - summary](../media/screenshots/lesson_summary.png?raw=true) | ![Search character](../media/screenshots/dictionary.png?raw=true) | ![]() 

## Technologies, libraries and resources

- [Vue.js (3.0)](https://v3.vuejs.org/) (with PWA plugin)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [ETL Character Database](http://etlcdb.db.aist.go.jp/)
  ETL Character Database was used to train CNN models used in the application.
- [kanjiapi.dev](https://kanjiapi.dev/)
- [WanaKana](https://wanakana.com/)

## The accuracy of the CNN models used in the application (on test datasets)

- Kanji: 92.67%
- Hiragana: 97.77%
- Katakana: 97.10%

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

## Credits

[kryras](https://github.com/kryras)
