import Vue from 'vue';
import App from './App.vue';
import VModal from 'vue-js-modal';
import vueHeadful from 'vue-headful';

Vue.use(VModal);
Vue.component('vue-headful', vueHeadful);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')