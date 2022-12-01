<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Borrar usuario</span>
      </v-card-title>
      <v-card-text v-if="user">
        ¿Seguro que quiere borrar el usuario {{user.user.full_name}}?
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
                this.$store.commit('account/closeDeleteUserDialog')
            },
            deleteUser(user) {
                let userAccount = this.usersAccount.find(function (userBusinessAccount) {
                    return userBusinessAccount.user.id == user.user.id;
                });

                this.$store.dispatch('account/deleteUser', {account: this.account, user: userAccount})
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
                user: 'account/deleteUser',
                usersAccount: 'account/usersAccount',
            }),
            dialog() {
                return this.$store.state.account.deleteUserDialog
            }
        },
        notifications: {
            showDeleteUserErrorMessage: {
                message: 'Error al borrar el usuario',
                type: 'error'
            },
            showDeleteUserSuccessMessage: {
                message: 'Usuario borrado correctamente',
                type: 'success'
            }
        },
    }
</script>
