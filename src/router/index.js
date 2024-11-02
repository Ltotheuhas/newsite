import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/PortfolioView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/BlogPosts.vue')
  },
  {
    path: '/reveal',
    name: 'reveal',
  },
  {
    path: '/portfolio/:id',
    name: 'details',
    component: () => import('../views/DetailView.vue'),
    props: true
  },
  {
    path: '/notebook',
    name: 'notebook',
    component: () => import('../views/NotebookView.vue')
  },
  {
    path: '/evahakai',
    name: 'evahakai',
    component: () => import('../views/EvaView.vue')
  },
  {
    path: '/writing',
    name: 'writing',
    component: () => import('../views/WritingView.vue')
  },
  {
    path: '/threedee',
    name: 'threedee',
    component: () => import('../views/ThreeDee.vue')
  },
  {
    path: '/shapes',
    name: 'shapes',
    component: () => import('../views/SymmetricalShapes.vue')
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/StoreView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

export default router