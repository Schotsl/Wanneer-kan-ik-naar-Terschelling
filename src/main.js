import Vue, { createApp } from 'vue';
import App from './App.vue'
import vueHeadful from 'vue-headful';

Vue.component('vue-headful', vueHeadful);

createApp(App).mount('#app')
