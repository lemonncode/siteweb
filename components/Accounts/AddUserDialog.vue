<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Añadir un usuario</span>
      </v-card-title>
      <v-card-text>
        <span>Introduce DNI o correo del usuario que quieres añadir:</span>
        <v-text-field
            v-model="username"
            label="DNI o correo"
            required
        ></v-text-field>
        <span class="red--text" v-if="errorMessage">{{errorMessage}}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" flat @click.native="addUser">Añadir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        username: '',
        errorMessage: null
      }
    },
    props: ['account'],
    methods: {
      closeDialog() {
        this.$store.commit('account/closeAddUserDialog')
      },
      addUser() {
        this.$store.dispatch('account/addUser', {account: this.account, user: this.username})
            .then(data => {
                this.closeDialog();
                this.errorMessage = null;
                this.showAddUserSuccessMessage();
            })
            .catch(error => {
                this.errorMessage = error.response.data.errors.children.user.errors[0];
                this.showAddUserErrorMessage()
            })
      }
    },
    computed: {
      dialog() {
        return this.$store.state.account.addUserDialog
      }
    },
    notifications: {
        showAddUserErrorMessage: {
          message: 'Usuario incorrecto, o no existe, o ya está en esta cuenta',
          type: 'error'
      },
        showAddUserSuccessMessage: {
          message: 'Usuario añadido correctamente',
          type: 'success'
      }
    },
  }
</script>