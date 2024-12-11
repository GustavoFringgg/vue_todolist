import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/LoginView.vue'

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
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/todolist',
      component: () => import('../views/TodoView.vue')
    },
    {
      path: '/new',
      component: () => import('../views/newView.vue')
    },
    {
      path: '/:catchAll(.*)', // 捕捉所有未定義的路徑
      redirect: '/' // 重定向到首頁
    }
  ]
})

export default router
