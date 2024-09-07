import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/Login.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      component: () => import('../views/signUp.vue')
    },
    {
      path: '/todolist',
      component: () => import('../views/List.vue')
    },
    {
      path: '/:catchAll(.*)', // 捕捉所有未定義的路徑
      redirect: '/' // 重定向到首頁
    }
  ]
})

export default router
