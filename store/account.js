export const state = () => ({
  addUserDialog: false,
  addUserDiscountDialog: false,
  editUserDialog: false,
  deleteUserDialog: false,
  deleteUserDiscountDialog: false,
  usersAccount: [],
  currentUsersAccount: [],
  deleteUser: null,
  deleteUserDiscount: null,
  editUser: null,
  accountDiscount: null,
  usersByDiscount: [],
});

export const getters = {
  addUserDialog: state => state.addUserDialog,
  addUserDiscountDialog: state => state.addUserDiscountDialog,
  editUserDialog: state => state.editUserDialog,
  deleteUserDialog: state => state.deleteUserDialog,
  deleteUserDiscountDialog: state => state.deleteUserDiscountDialog,
  account: state => state.account,
  usersAccount: state => state.usersAccount,
  deleteUser: state => state.deleteUser,
  deleteUserDiscount: state => state.deleteUserDiscount,
  editUser: state => state.editUser,
  currentUsersAccount: state => state.currentUsersAccount,
  accountDiscount: state => state.accountDiscount,
  usersByDiscount: state => state.usersByDiscount,
};

export const mutations = {
  openAddUserDialog(state) {
    state.addUserDialog = true
  },
  openAddUserDiscountDialog(state) {
    state.addUserDiscountDialog = true
  },
  closeAddUserDialog(state) {
    state.addUserDialog = false
  },
  closeAddUserDiscountDialog(state) {
    state.addUserDiscountDialog = false
  },
  openEditUserDialog(state, user) {
    state.editUserDialog = true;
    state.editUser = user;
  },
  closeEditUserDialog(state) {
    state.editUserDialog = false
  },
  openDeleteUserDialog(state, user) {
    state.deleteUserDialog = true;
    state.deleteUser = user;
  },
  openDeleteUserDiscountDialog(state, user) {
    state.deleteUserDiscountDialog = true;
    state.deleteUserDiscount = user;
  },
  closeDeleteUserDialog(state) {
    state.deleteUserDialog = false
  },
  closeDeleteUserDiscountDialog(state) {
    state.deleteUserDiscountDialog = false
  },
  setUsersAccount(state, users) {
    state.usersAccount = users
  },
  setAccountDiscount(state, discount) {
    state.accountDiscount = discount
  },
  setUsersByDiscount(state, users) {
    state.usersByDiscount = users
  },
  setCurrentUsersAccount(state, users) {
    state.currentUsersAccount = users
  },
  removeUser(state, user) {
    state.usersAccount.splice(state.usersAccount.indexOf(user), 1)
  },
  addUser(state, user) {
    state.usersAccount.push(user)
  },
  removeUserDiscount(state, user) {
    state.usersByDiscount.splice(state.usersByDiscount.indexOf(user), 1)
  },
  addUserDiscount(state, user) {
    state.usersByDiscount.push(user)
  },
};

export const actions = {
  async getUsers({ commit, dispatch }, id) {
    return this.$axios.$get( `/business-accounts/${id}/users`)
        .then( data => {
          commit('setUsersAccount', data)
        })
        .catch(data => {
          commit('setUsersAccount', [])
        })
  },
  async getDiscounts({ commit, dispatch }, id) {
    return this.$axios.$get( `/discounts/account/${id}`)
      .then( data => {
        commit('setAccountDiscount', data)
        if (data) {
          dispatch('getUsersByDiscount', data)
        }
      })
      .catch(data => {
        commit('setAccountDiscount', [])
      })
  },
  async getUsersByDiscount({ commit, dispatch }, data) {
    return this.$axios.$get( `/accounts/${data.business_account.id}/discounts/${data.id}`)
      .then( data => {
        commit('setUsersByDiscount', data)
      })
      .catch(data => {
        commit('setUsersByDiscount', [])
      })
  },
  async getCurrentUsers({ commit, dispatch }, id) {
    return this.$axios.$get( `/business-accounts/${id}/users`)
        .then( data => {
          commit('setCurrentUsersAccount', data)
        })
        .catch(data => {
          commit('setCurrentUsersAccount', [])
        })
  },
  async deleteUser({ commit }, {account, user}) {
    return this.$axios.$delete(`/business-accounts/${account.account.id}/users/${user.id}`).then(() => {
      commit('removeUser', user)
    })
  },
  async addUser({ commit }, {account, user}) {
    return this.$axios.$post(`/business-accounts/${account.account.id}/users`, {user: user,  role: 'user'})
      .then((data) => {
        commit('addUser', data)
      })
  },
  async editUser({ dispatch }, {account, user, role}) {
    return this.$axios.$patch(`/business-accounts/${account.account.id}/users/${user.id}`, { role: role })
        .then((data) => {
          dispatch('getUsers', account.account.id)
        })
  },
  async deleteUserDiscount({ commit }, {account, discount}) {
    return this.$axios.$delete(`/accounts/${account.id}/discounts/${discount.id}`).then(() => {
      commit('removeUserDiscount', discount)
    })
  },
  async addUserDiscount({ commit }, {data, account}) {
    return this.$axios.$post(`/accounts/${data.account.account.id}/discounts/${data.discount.id}`, {account: account})
      .then((data) => {
        commit('addUserDiscount', data)
      })
  },
};
