import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/test',
    name: 'Test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  }
  ,
  {
    path: '/katakana',
    name: 'MenuKatakana',
    component: () => import('../views/KatakanaMenu.vue')
  }  ,
  {
    path: '/hiragana',
    name: 'MenuHiragana',
    component: () => import('../views/HiraganaMenu.vue')
  }
  ,
  {
    path: '/kanji',
    name: 'MenuKanji',
    component: () => import('../views/KanjiMenu.vue')
  }
  ,
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  }
  ,
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
