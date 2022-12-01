import api from '~/services/api'

export default ({ $axios }, inject) => {
  inject('api', api($axios))
}
