<template>
  <v-layout justify-center>
    <v-flex xs12 sm6 v-if="userAccount != null">
      <v-card class="ma-2">
        <v-card-title class="blue-grey darken-3">
          <span class="title white--text">{{ userAccount.account.customer.name }}</span>
        </v-card-title>

        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>account_balance_wallet</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ userAccount.account.customer.identification_number }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ userAccount.account.customer.email }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>phone</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ userAccount.account.customer.phone_number }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title v-if="userAccount.account.customer.billing_address">{{ userAccount.account.customer.billing_address.street }}, {{ userAccount.account.customer.billing_address.zip_code }}, {{ userAccount.account.customer.billing_address.city }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <edit-account-dialog :account="userAccount"></edit-account-dialog>
      <v-card class="ma-2">
        <v-card-title class="blue-grey darken-3">
          <span class="title white--text">Usuarios</span>
        </v-card-title>

        <v-list v-if="usersAccount.length > 0">
          <v-list-tile v-for="account in usersAccount" :key="account.id" >
            <v-list-tile-content>
              <v-list-tile-title>{{ account.user.full_name }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="!isCurrentUser(account.user)">
              <v-icon @click="openDeleteUserDialog(account.user)" color="#FF5252">delete</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <delete-user-dialog :account="userAccount"></delete-user-dialog>
        </v-list>
        <v-list v-else>
          <v-list-tile>
            <v-list-tile-content>
              No existen usuarios en esta cuenta.
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-btn @click="openAddUserDialog" class="right mt-4" fab dark small color="#FF5252">
          <v-icon class="right" dark>add</v-icon>
        </v-btn>
        <add-user-dialog :account="userAccount"></add-user-dialog>
      </v-card>

    </v-flex>

  </v-layout>
</template>

<script>
    import AddUserDialog from '~/components/Accounts/AddUserDialog'
    import DeleteUserDialog from '~/components/Accounts/DeleteUserDialog'
    import EditAccountDialog from '~/components/Accounts/EditAccountDialog'
    import { mapGetters } from 'vuex';

    export default {
        name: "Account",
        computed: {
            ...mapGetters({
                userAccount: 'userAccount/userAccount',
                usersAccount: 'account/usersAccount',
            }),
        },
        methods: {
          openAddUserDialog() {
            this.$store.commit('account/openAddUserDialog')
          },
          openEditAccountDialog() {
              this.$store.commit('userAccount/openEditAccountDialog')
          },
          openDeleteUserDialog(user) {
            this.$store.commit('account/openDeleteUserDialog', user)
          },
          isCurrentUser(user) {
              return user.id == this.$auth.user.id
          }
        },
        components: {
          AddUserDialog,
          DeleteUserDialog,
          EditAccountDialog
        }
    }
</script>

<style scoped>

</style>