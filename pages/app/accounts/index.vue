<template>
  <v-card class="pb-5">
    <v-card-title>
      <h3 class="headline">Cuentas de empresa</h3>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <accounts-list></accounts-list>
    </v-container>
  </v-card>
</template>

<script>
  import AccountsList from '~/components/Accounts/AccountsList'

  export default {
    components: {
        AccountsList
    },
  }
</script>