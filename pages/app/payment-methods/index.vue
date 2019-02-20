<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <payment-method-list></payment-method-list>
      <v-btn v-if="isAuthorized()" large color="primary" @click="openDialog">Añadir una tarjeta</v-btn>
      <add-payment-method-dialog></add-payment-method-dialog>
    </v-container>
  </v-card>
</template>

<script>
  import PaymentMethodList from '~/components/PaymentMethods/PaymentMethodList'
  import AddPaymentMethodDialog from '~/components/PaymentMethods/AddPaymentMethodDialog'
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        current_account: 'userAccount/currentAccount',
      }),
    },
    methods: {
      openDialog() {
        this.$store.commit('paymentMethod/openDialog')
      },
      isAuthorized() {
        return this.current_account !== null && this.current_account.role == 'owner' || this.current_account.role == 'admin';
      }
    },
    components: {
      PaymentMethodList,
      AddPaymentMethodDialog
    }
  }
</script>