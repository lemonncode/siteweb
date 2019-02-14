import VueNotifications from 'vue-notifications'

export const state = () => ({
  current_account: '',
  validated: false
})

export const getters = {
  current_account: state => state.current_account,
  validated: state => state.validated
}

export const mutations = {
  setAccount(state, account) {
    state.current_account = account
  },
  setValidated(state, validated) {
    state.validated = validated
  },
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
  async refreshAccount ({ commit }, account) {
    if (typeof sessionStorage !== 'undefined') {
      if (account == null) {
        account = JSON.parse(sessionStorage.getItem('current_account'));
        if (!account) {
          account = this.$auth.user.accounts[0];
        }
      }

      this.$auth.user.current_account = account;
      sessionStorage.setItem('current_account', JSON.stringify(account));
      commit('setAccount', account)
    }
  },
  async refreshCaptcha ({ commit }, validated) {
    commit('setValidated', validated)
  },
}