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

    if (account != null) {
      state.currentAccountId = account.discriminator == 'personal' ? account.id: account.account.id
    } else {
      state.currentAccountId = null
    }


    this.$cookies.set('currentAccountId', state.currentAccountId)
  },
  setAccountId(state, id) {
    state.currentAccountId = id
  },
}

export const actions = {
  async setAccount ({ commit }, account) {
    commit('setAccount', account)
  },
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
  async load ({ commit }) {
    if (this.$auth.user == null) {
      return;
    }

    let currentAccountId = this.$cookies.get('currentAccountId')
    if (currentAccountId == null) {
      currentAccountId = this.$auth.user.account.id
    }

    let currentAccount = null
    if (this.$auth.user.account.id == currentAccountId) {
      currentAccount = this.$auth.user.account
    } else {
      this.$auth.user.business_accounts.forEach(businessAccount => {
        if (businessAccount.account.id == currentAccountId) {
          currentAccount = businessAccount
        }
      })
    }

    commit('setAccount', currentAccount)
    commit('setUserAccounts', this.$auth.user.business_accounts)
  }
}