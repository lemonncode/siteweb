<template>
  <v-layout justify-center>
    <v-flex xs12 sm6 v-if="userAccount != null">
      <v-card class="ma-2">
        <v-card-title class="blue-grey darken-3 pa-2">
          <span class="title white--text pa-2">{{ userAccount.account.customer.name }}</span>
        </v-card-title>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-icon>account_balance_wallet</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ userAccount.account.customer.identification_number }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-action>
              <v-icon>mail</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ userAccount.account.customer.email }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-action>
              <v-icon>phone</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ userAccount.account.customer.phone_number }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-action>
              <v-icon>location_on</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title v-if="userAccount.account.customer.billing_address">{{ userAccount.account.customer.billing_address.street }}, {{ userAccount.account.customer.billing_address.zip_code }}, {{ userAccount.account.customer.billing_address.city }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon @click="openEditAccountDialog">edit</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
      <edit-account-dialog :account="userAccount"></edit-account-dialog>
      <v-card class="ma-2">
        <v-card-title class="blue-grey darken-3 pa-2">
          <span class="title white--text pa-2">Usuarios</span>
        </v-card-title>
        <div>
          <v-app-bar text color="white">
            <v-spacer></v-spacer>
            <v-btn @click="openAddUserDialog()" color="primary" dark class="mb-2">Añadir Usuario</v-btn>
          </v-app-bar>
          <v-data-table
              :headers="headers"
              :items="users"
              class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.user.full_name }}</td>
              <td class="text-left">{{ props.item.role | roleTranslation }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                    v-if="!isOwner(props.item)"
                    small
                    class="mr-2"
                    @click="openEditUserDialog(props.item)"
                >
                  edit
                </v-icon>
                <v-icon v-if="!isOwner(props.item) && !isCurrentUser(props.item)"
                    small
                    @click="deleteItem(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>

            <template slot="no-data">
              <v-btn color="primary" @click="initialize">Actualizar</v-btn>
            </template>
          </v-data-table>
        </div>
      </v-card>
      <delete-user-dialog :account="userAccount"></delete-user-dialog>
      <add-user-dialog :account="userAccount"></add-user-dialog>
      <edit-user-dialog :account="userAccount"></edit-user-dialog>





      <v-card class="ma-2" v-if="accountDiscount != ''">
        <v-card-title class="blue-grey darken-3 pa-2">
          <span class="title white--text pa-2">Descuentos</span>
          <v-spacer></v-spacer>
        </v-card-title>

        <div>

          <v-app-bar text color="white">
            <v-text-field
              class="mb-4"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn @click="openAddUserDiscountDialog()" color="primary" dark class="mb-2">Añadir descuento</v-btn>
          </v-app-bar>
          <v-data-table
            :headers="discountHeaders"
            :items="discounts"
            :search="search"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.account.name }}</td>
              <td class="text-left">{{ props.item.account.document_number }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                        small
                        @click="deleteUserDiscount(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>

            <template slot="no-data">
              <v-btn color="primary" @click="initialize">Actualizar</v-btn>
            </template>
          </v-data-table>
        </div>
      </v-card>
      <delete-user-discount-dialog :account="userAccount"></delete-user-discount-dialog>
      <add-user-discount-dialog :account="userAccount" :discount="accountDiscount"></add-user-discount-dialog>
    </v-flex>

  </v-layout>
</template>

<script>
    import AddUserDialog from '~/components/Accounts/AddUserDialog'
    import AddUserDiscountDialog from '~/components/Accounts/AddUserDiscountDialog'
    import DeleteUserDialog from '~/components/Accounts/DeleteUserDiscountDialog'
    import DeleteUserDiscountDialog from '~/components/Accounts/DeleteUserDialog'
    import EditAccountDialog from '~/components/Accounts/EditAccountDialog'
    import EditUserDialog from '~/components/Accounts/EditUserDialog'
    import { mapGetters } from 'vuex';

    export default {
        name: "Account",
        data: () => ({
            search: '',
            dialog: false,
            headers: [
                { text: 'Nombre', sortable: false, align: 'left', value: 'full_name', width: '50%' },
                { text: 'Rol', value: 'role', width: '30%' },
                { text: 'Acciones', value: 'full_name', sortable: false }

            ],
            discountHeaders: [
              { text: 'Nombre', sortable: false, align: 'left', value: 'name', width: '70%' },
              { text: 'DNI', value: 'role', width: '20%' },
              { text: 'Acciones', value: 'name', sortable: false }
            ],
            users: [],
            discounts: [],
        }),
        computed: {
            ...mapGetters({
                userAccount: 'userAccount/userAccount',
                usersAccount: 'account/usersAccount',
                accountDiscount: 'account/accountDiscount',
                usersByDiscount: 'account/usersByDiscount',
            }),
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            usersAccount () {
                this.initialize();
            },
            usersByDiscount () {
                this.discounts = this.usersByDiscount;
            }
        },
        methods: {
            initialize() {
                this.users = this.usersAccount;
                this.discounts = this.usersByDiscount;
            },
            deleteItem(item) {
                this.$store.commit('account/openDeleteUserDialog', item)
            },
            deleteUserDiscount(item) {
              this.$store.commit('account/openDeleteUserDiscountDialog', item)
            },
            openAddUserDialog() {
              this.$store.commit('account/openAddUserDialog')
            },
            openAddUserDiscountDialog() {
              this.$store.commit('account/openAddUserDiscountDialog')
            },
            openEditAccountDialog(item) {
              this.$store.commit('userAccount/openEditAccountDialog', item)
            },
            openEditUserDialog(item) {
              this.$store.commit('account/openEditUserDialog', item)
            },
            isCurrentUser(user) {
              return user.id == this.$auth.user.id
            },
            isOwner(account) {
              return account.role == 'owner';
            },
            isAdmin(account) {
              return account.role == 'admin';
            }
        },
        components: {
          AddUserDialog,
          DeleteUserDialog,
          EditAccountDialog,
          EditUserDialog,
          AddUserDiscountDialog,
          DeleteUserDiscountDialog,
        },
        filters: {
          roleTranslation(role)
          {
            let translation = "Usuario";
            switch (role) {
              case "owner":
                translation = "Propietario";
                break;
              case "admin":
                translation = "Administrador";
                break;
              case "user":
                translation = "Usuario";
                break;
              case "manager":
                translation = "Manager";
                break;
            }

            return translation;

          }
        }
    }

</script>

<style scoped>
  >>> .v-list__tile {
    font-size: 14px;
  }

  >>> .v-card__title {
    padding: 16px 16px 2px 14px;
  }

  >>> .v-icon {
    font-size: 18px;
  }

  >>> .v-tabs__div {
    font-size: 14px;
  }
</style>
