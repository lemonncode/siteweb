import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'


Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA2o3Cua0_qGNrr47MOvTK7rXqMaWb171M',
    libraries: 'places, directions',
    useBetaRenderer: false
  }
});