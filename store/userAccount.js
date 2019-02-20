export const state = () => ({
  editAccountDialog: false,
  addAccountDialog: false,
  userAccounts: [],
  userAccount: null,
  userSelected: null,
  currentAccount: null,
  currentAccountId: null,
})

export const getters = {
  currentAccount: state => state.currentAccount,
  currentAccountId: state => state.currentAccountId,
  userAccounts: state => state.userAccounts,
  userAccount: state => state.userAccount,
  editAccountDialog: state => state.editAccountDialog,
  addAccountDialog: state => state.addAccountDialog,
  userSelected: state => state.userSelected,
}

export const mutations = {
  openEditAccountDialog(state) {
    state.editAccountDialog = true
  },
  closeEditAccountDialog(state) {
    state.editAccountDialog = false
  },
  openAddAccountDialog(state) {
    state.addAccountDialog = true
  },
  closeAddAccountDialog(state) {
    state.addAccountDialog = false
  },
  setUserAccounts(state, accounts) {
    state.userAccounts = accounts
  },
  addUserAccount(state, account) {
    state.userAccounts.push(account)
  },
  setUserAccount(state, account) {
    state.userAccount = account
  },
  addUserSelected(state, user) {
    state.userSelected = user;
  },
  setAccount(state, account) {
    state.currentAccount = account
  },
  setAccountId(state, id) {
    state.currentAccountId = id
  },
}

export const actions = {
  async getUserAccounts({ commit }) {
    return this.$axios.$get(`/user/business-accounts`).then(data => {
      commit('setUserAccounts', data)
      return data;
    })
  },
  async getUserAccount({ dispatch, commit }, id) {
    return this.$axios.$get(`/user/business-accounts/${id}`).then(data => {
      commit('setUserAccount', data);
      return data;
    })
  },
  async addUserAccount({ commit }, account) {
    return this.$axios.$post(`/user/business-accounts`, account)
      .then(data => {
        return commit('addUserAccount', data)
      })
  },
  async editUserAccount ({}, {values, id}) {
    return this.$axios.$patch(`/user/business-accounts/${id}`, values)
        .then(data => {
          this.$router.push({ name: 'app-accounts-id', params: {id: data.id} })
        })
  },
  async refreshAccount ({ commit, dispatch }, [account, accounts]) {
    if (typeof sessionStorage !== 'undefined') {
      if (account == null) {
        account = JSON.parse(sessionStorage.getItem('current_account'));
        if (!account) {
          account = this.$auth.user.account;
        }
      }

      sessionStorage.setItem('current_account', JSON.stringify(account));
      let accountId = account.discriminator == 'personal' ? account.id: account.account.id;

      commit('setAccountId', accountId)
      commit('setAccount', account)

      return account;
    }
  },
}