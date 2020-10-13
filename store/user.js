export const state = () => ({
  validated: false,
  emailValidated: false,
})

export const getters = {
  validated: state => state.validated,
  emailValidated: state => state.emailValidated
}

export const mutations = {
  setValidated(state, validated) {
    state.validated = validated
  },
  setEmailValidated(state, validated) {
    state.emailValidated = validated
  }
}

export const actions = {
  async login({ commit }, data) {
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
  },
  async refreshCaptcha ({ commit }, validated) {
    commit('setValidated', validated)
  },
  async update({ commit, dispatch }, user) {
    return this.$axios.$patch('/update-user', user)
  },
  async emailValidToken({ commit, dispatch }, user) {
    return this.$axios.$get('/email-validation/' + user.token)
  },
  async validateEmail({ commit, dispatch }, email) {
    return this.$axios.$post('/email-validation', {email: email})
  },
  async emailValidation({}, user) {
    return this.$axios.$patch('/email-validation/' + user.token)
  },
  async emailValidated({ commit }, value) {
    commit('setEmailValidated', value)
  }
}
