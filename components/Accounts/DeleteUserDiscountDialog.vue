<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Borrar usuario</span>
      </v-card-title>
      <v-card-text v-if="user">
        ¿Seguro que quiere borrar el descuento al usuario {{user.account.name}}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" text @click.native="deleteUser(user)">Borrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: ['account'],
        methods: {
            closeDialog() {
                this.$store.commit('account/closeDeleteUserDiscountDialog')
            },
            deleteUser(discount) {
                this.$store.dispatch('account/deleteUserDiscount', {account: discount.account, discount: discount})
                    .then(data => {
                        this.closeDialog()
                        this.showDeleteUserSuccessMessage()
                    })
                    .catch(error => {
                        this.showDeleteUserErrorMessage()
                    })
            }
        },
        computed: {
            ...mapGetters({
                user: 'account/deleteUserDiscount',
                usersAccount: 'account/usersAccount',
            }),
            dialog() {
                return this.$store.state.account.deleteUserDiscountDialog
            }
        },
        notifications: {
            showDeleteUserErrorMessage: {
                message: 'Error al borrar el descuento del usuario',
                type: 'error'
            },
            showDeleteUserSuccessMessage: {
                message: 'Descuento borrado correctamente',
                type: 'success'
            }
        },
    }
</script>
