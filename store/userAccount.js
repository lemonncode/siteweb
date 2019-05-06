import { firestore } from '~/plugins/firebase.js'

export const state = () => ({
  editAccountDialog: false,
  addAccountDialog: false,
  userAccounts: [],
  userAccount: null,
  userSelected: null,
  currentAccount: null,
  currentAccountId: null,
  activeTripsList: [],
})

export const getters = {
  account: state => state.account,
  currentAccount: state => state.currentAccount,
  currentAccountId: state => state.currentAccountId,
  userAccounts: state => state.userAccounts,
  userAccount: state => state.userAccount,
  editAccountDialog: state => state.editAccountDialog,
  addAccountDialog: state => state.addAccountDialog,
  userSelected: state => state.userSelected,
  activeTripsList: state => state.activeTripsList,
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
      state.account = account.discriminator == 'personal' ? account : account.account
    } else {
      state.currentAccountId = null
    }


    this.$cookies.set('currentAccountId', state.currentAccountId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 31
    })
  },
  setAccountId(state, id) {
    state.currentAccountId = id
  },
  setActiveTripsList(state, trips) {
    state.activeTripsList = trips
  },
}

export const actions = {
  async setAccount ({ commit, dispatch }, account) {
    commit('setAccount', account)
    dispatch('getActiveTrips', account)
    if (account && account.account && account.account.discriminator == 'business') {
      dispatch('account/getCurrentUsers', account.account.id, {root:true})
    }
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
  async load ({ commit, dispatch }) {
    if (this.$auth.user == null) {
      return;
    }

    let currentAccountId = this.$cookies.get('currentAccountId') ? this.$cookies.get('currentAccountId') : null;
    if (!currentAccountId) {
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

    dispatch('setAccount', currentAccount)
    await dispatch('getActiveTrips', currentAccount)
    commit('setUserAccounts', this.$auth.user.business_accounts)


    return currentAccount;
  },
  async getActiveTrips ({ commit, dispatch }, account) {
    if (!account) {
      return;
    }

    account = account.discriminator == 'personal' ? account : account.account;

    await firestore.collection('trips').where("account_id", "==", account.id)
      .get()
      .then(function (querySnapshot) {
        let tripsList = [];
        querySnapshot.forEach(function (doc) {
          if (doc.data().status != 'done' && doc.data().status != 'finished' && doc.data().status != 'canceled' && doc.data().status != 'finalized' && doc.data().status != 'no-assignment') {
            tripsList.push(doc.data());
          }
        });

        tripsList.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
        commit('setActiveTripsList', tripsList);

        return true;
      }, function(error) {
        //...
      });
  },
  async activeTripsListener ({ commit, state }) {
    let account = state.account;
    firestore.collection('trips').where("account_id", "==", account.id)
      .onSnapshot(function(querySnapshot) {
        let tripsList = [];
        querySnapshot.forEach(function (doc) {
          if (doc.data().status != 'done' && doc.data().status != 'finished' && doc.data().status != 'canceled' && doc.data().status != 'finalized' && doc.data().status != 'no-assignment') {
            tripsList.push(doc.data());
          }
        });

        tripsList.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
        commit('setActiveTripsList', tripsList);

        return true;
      }, function(error) {
        //...
      });
  }
}