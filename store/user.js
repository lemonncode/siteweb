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
  },
  async resetPassword({ commit, dispatch }, email) {
    return this.$axios.$post('/reset-password', {email: email})
  },
  async newPassword({ commit, dispatch }, user) {
    let data = {
      plainPassword: {
        'first': user.password,
        'second': user.confirmPassword
      }
    };

    return this.$axios.$patch('/new-password/' + user.token, data)
  },
  async validToken({ commit, dispatch }, user) {
    return this.$axios.$get('/new-password/' + user.token)
  }
}