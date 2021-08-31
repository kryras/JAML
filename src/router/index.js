// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/katakana',
    name: 'MenuKatakana',
    component: () => import(/* webpackChunkName: "katakana" */ '../views/KatakanaMenu.vue')
  },
  {
    path: '/:alphabet/:id',
    name: 'KanaLesson',
    component: () => import(/* webpackChunkName: "kanalesson" */'../views/KanaLesson.vue')
  },
  {
    path: '/hiragana',
    name: 'MenuHiragana',
    component: () => import(/* webpackChunkName: "hiragana" */'../views/HiraganaMenu.vue')
  },
  {
    path: '/kanji',
    name: 'MenuKanji',
    component: () => import(/* webpackChunkName: "kanji" */'../views/KanjiMenu.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */'../views/Search.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */'../views/About.vue')
  },
  {
    path: "/:catchAll(.*)*",
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */'../views/NotFound.vue')
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
