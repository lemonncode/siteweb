import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'


Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD2VQ6V3sggXB2LpU8GouIvcz8Zr3ebe70',
    libraries: 'places, directions',
    useBetaRenderer: false
  }
});