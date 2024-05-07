import { createRouter, createWebHistory } from 'vue-router'
/*import HomeView from '../views/HomeView.vue'*/

const routes = [
  /*{
    path: '/',
    name: 'home',
    component: HomeView
  },*/
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/',
    name: 'myspace',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MySpace.vue')
  },
  {
    path: '/comments',
    name: 'comments',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/CommentView.vue')
  },
  {
    path: '/test',
    name: 'test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/TestView.vue')
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
    path: '/test/:id',
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