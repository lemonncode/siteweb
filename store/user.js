import VueNotifications from 'vue-notifications'

export const state = () => ({
})

export const actions = {
  async login({}, data) {
    return this.$auth.loginWith('local', { data: data }).then(() => {
      this.$router.push({ name: 'app' })
    })
  },
  async register({ commit, dispatch }, user) {
    return this.$axios.$post('/register', user)
  }
}