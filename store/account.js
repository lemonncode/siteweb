export const state = () => ({
  addUserDialog: false,
  editUserDialog: false,
  deleteUserDialog: false,
  usersAccount: [],
  currentUsersAccount: [],
  deleteUser: null,
  editUser: null
});

export const getters = {
  addUserDialog: state => state.addUserDialog,
  editUserDialog: state => state.editUserDialog,
  deleteUserDialog: state => state.deleteUserDialog,
  account: state => state.account,
  usersAccount: state => state.usersAccount,
  deleteUser: state => state.deleteUser,
  editUser: state => state.editUser,
  currentUsersAccount: state => state.currentUsersAccount,
};

export const mutations = {
  openAddUserDialog(state) {
    state.addUserDialog = true
  },
  closeAddUserDialog(state) {
    state.addUserDialog = false
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
  closeDeleteUserDialog(state) {
    state.deleteUserDialog = false
  },
  setUsersAccount(state, users) {
    state.usersAccount = users
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
  }
};