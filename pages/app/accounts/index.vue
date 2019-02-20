<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <accounts-list></accounts-list>
      <v-btn large color="primary" @click="openAddAccountDialog">Crear una cuenta</v-btn>
      <add-account-dialog></add-account-dialog>
    </v-container>
    <add-account-dialog></add-account-dialog>
  </v-card>
</template>

<script>
  import AccountsList from '~/components/Accounts/AccountsList'
  import AddAccountDialog from '~/components/Accounts/AddAccountDialog'

  export default {
    methods: {
        openAddAccountDialog() {
            this.$store.commit('userAccount/openAddAccountDialog')
        },
    },
    components: {
        AccountsList,
        AddAccountDialog,
    },
  }
</script>