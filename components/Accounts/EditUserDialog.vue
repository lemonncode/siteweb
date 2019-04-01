<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar rol de usuario</span>
      </v-card-title>
      <v-card-text>
        <v-select
            v-model="role"
            :items="roles"
            item-text="name"
            item-value="value"
            label="Rol"
            solo
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" flat @click.native="editUser">Editar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data () {
      return {
        role: '',
        roles: [
            { name: 'Usuario', value: 'user' },
            { name: 'Administrador', value: 'admin' }
        ]
      }
    },
    props: ['account'],
    methods: {
      closeDialog() {
        this.$store.commit('account/closeEditUserDialog')
      },
      editUser() {
        this.$store.dispatch('account/editUser', {account: this.account, user: this.user, role: this.role})
            .then(data => {
                this.closeDialog();
                this.showEditUserSuccessMessage();
            })
            .catch(error => {
                this.errorMessage = error.response.data.errors.children.user.errors[0];
                this.showEditUserErrorMessage()
            })
      }
    },
    computed: {
      ...mapGetters({
          user: 'account/editUser',
      }),
      dialog() {
        return this.$store.state.account.editUserDialog
      }
    },
    notifications: {
        showEditUserErrorMessage: {
          message: 'Error al cambiar el rol',
          type: 'error'
      },
        showEditUserSuccessMessage: {
          message: 'Usuario modificado correctamente',
          type: 'success'
      }
    },
  }
</script>