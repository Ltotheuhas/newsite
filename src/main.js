import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import preloadImages from './preloadImages';

loadFonts();

const images = preloadImages();

const app = createApp(App);
app.config.globalProperties.$images = images;

app
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app');
