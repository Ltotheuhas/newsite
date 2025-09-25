import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../views/PortfolioView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
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
    path: '/ilyguys',
    name: 'ilyguys',
    component: () => import('../views/NeuJahr.vue')
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/StoreView.vue')
  },
  {
    path: '/store/:productId',
    name: 'ProductModal',
    component: () => import('../views/StoreView.vue'),
    props: true,
  },
  {
    path: '/store/cart',
    name: 'shoppingcart',
    component: () => import('../views/ShoppingCart.vue')
  },
  {
    path: '/store/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue')
  },
  {
    path: '/store/confirmation',
    name: 'confirmation',
    component: () => import('../views/ConfirmationView.vue'),
  },
  {
    path: '/radio',
    name: 'radio',
    component: () => import('../views/RadioView.vue')
  },
  {
    path: '/netcronomicon',
    name: 'netcronomicon',
    component: () => import('../views/NetcroNomicon.vue')
  },
  {
    path: '/angel',
    name: 'angel',
    component: () => import('../views/AngelPage.vue')
  },
  {
    path: '/cat',
    name: 'coverarttest',
    component: () => import('../views/CoverArtTest.vue')
  },
  {
    path: '/surveillance',
    name: 'surveillance',
    component: () => import('../views/SurveillanceView.vue')
  },
  {
    path: '/server',
    name: 'server',
    component: () => import('../views/FastfetchView.vue')
  },
  {
    path: '/shrine',
    name: 'shrine',
    component: () => import('../views/ShrineView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/FourOhFour.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

export default router;
