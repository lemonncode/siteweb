<template>
  <div v-if="loaded">
    <v-card color="blue-grey darken-3" class="white--text">
      <v-card-title>
        <h3>Cuentas de empresa</h3>
      </v-card-title>
      <v-list two-line v-if="userAccounts.length > 0">
        <template v-for="(account, index) in userAccounts">
          <v-list-item :key="account.account.id" avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ account.account.customer.name }}</span>
              </v-list-item-title>
              <v-list-item-sub-title>
                {{ account.account.discriminator == 'business' ? 'Cuenta de empresa' : 'Cuenta de prescriptor' }}
              </v-list-item-sub-title>
            </v-list-item-content>
            <v-list-item-action v-if="account.role == 'owner' || account.role == 'admin'">
              <v-btn text icon @click="viewAccount(account.id)">
                <v-icon>settings</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index + 1 < userAccounts.length" :key="index"></v-divider>
        </template>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            No tienes empresas que administrar.
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-fab-transition>
      <v-btn
          color="primary"
          dark
          absolute
          bottom
          right
          fab
          @click="openAddAccountDialog"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <add-account-dialog></add-account-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import AddAccountDialog from '~/components/Accounts/AddAccountDialog'

  export default {
    name: "AccountsList",
    mounted() {
      this.loadAccounts()
    },
    data() {
      return {
        loaded: false,
      }
    },
    computed: {
      ...mapGetters({
        current_account: 'userAccount/currentAccount',
        userAccounts: 'userAccount/userAccounts'
      }),
    },
    methods: {
      ...mapActions({
        getAccounts: 'userAccount/getUserAccounts'
      }),
      async viewAccount (id) {
        this.$router.push({ name: 'app-accounts-id', params: {id: id} })
      },
      loadAccounts() {
        this.getAccounts().then(() => {
            this.loaded = true
        });
      },
      openAddAccountDialog() {
        this.$store.commit('userAccount/openAddAccountDialog')
      },
    },
    components: {
      AddAccountDialog
    },
  }
</script>
