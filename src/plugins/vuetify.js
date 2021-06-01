import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      themes: {
        light: {
          bar: '#3f51b5',
          login: '#00695C'
        },
        dark: {
          bar: '#37474f',
          login: '#263238'
        }
      }
    }
});
