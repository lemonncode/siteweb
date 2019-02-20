<template>
  <v-card color="blue-grey darken-3" class="white--text" v-if="loaded">
    <v-card-title>
      <h3 class="headline">Cuentas de empresa</h3>
    </v-card-title>
    <v-list two-line v-if="userAccounts.length > 0">
      <template v-for="(account, index) in userAccounts">
        <v-list-tile :key="account.account.id" avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <span>{{ account.account.customer.name }}</span>
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="account.role == 'owner' || account.role == 'admin'">
            <v-btn flat icon @click="viewAccount(account.id)">
              <v-icon>settings</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < userAccounts.length" :key="index"></v-divider>
      </template>
    </v-list>
    <v-list v-else>
      <v-list-tile>
        <v-list-tile-content>
          No tienes empresas que administrar.
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex';

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
            this.loaded = true;
        });
      },
    }
  }
</script>
