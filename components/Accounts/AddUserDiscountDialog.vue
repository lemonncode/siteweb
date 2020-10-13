<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Añadir un usuario</span>
      </v-card-title>
      <v-card-text>
        <span>Introduce DNI o correo del usuario que quieres añadir:</span>
        <v-text-field
            v-model="user"
            label="DNI o correo"
            required
        ></v-text-field>
        <span class="red--text" v-if="errorMessage">{{errorMessage}}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" text @click.native="addUser">Añadir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        user: '',
        errorMessage: null
      }
    },
    props: ['account', 'discount'],
    methods: {
      closeDialog() {
        this.$store.commit('account/closeAddUserDiscountDialog')
      },
      addUser() {
        let data = {};
        data.account = this.account;
        data.discount = this.discount;

        this.$store.dispatch('account/addUserDiscount', {data: data, account: this.user})
            .then(data => {
                this.closeDialog();
                this.errorMessage = null;
                this.showAddUserSuccessMessage();
            })
            .catch(error => {
                this.showAddUserErrorMessage()
            })
      }
    },
    computed: {
      dialog() {
        return this.$store.state.account.addUserDiscountDialog
      }
    },
    notifications: {
        showAddUserErrorMessage: {
          message: 'Usuario incorrecto, o no existe, o ya tiene el descuento asociado',
          type: 'error'
      },
        showAddUserSuccessMessage: {
          message: 'Descuento añadido correctamente',
          type: 'success'
      }
    },
  }
</script>
