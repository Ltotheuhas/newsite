import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import preloadImages from './preloadImages';
import { createPinia } from 'pinia';

loadFonts();

const images = preloadImages();

const app = createApp(App);
app.config.globalProperties.$images = images;

const pinia = createPinia();

app
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app');
