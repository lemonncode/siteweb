<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <payment-method-list></payment-method-list>
      <v-btn large color="primary" @click="openDialog">Añadir una tarjeta</v-btn>
      <add-payment-method-dialog></add-payment-method-dialog>
    </v-container>
  </v-card>
</template>

<script>
  import PaymentMethodList from '~/components/PaymentMethods/PaymentMethodList'
  import AddPaymentMethodDialog from '~/components/PaymentMethods/AddPaymentMethodDialog'

  export default {
    methods: {
      openDialog() {
        this.$store.commit('paymentMethod/openDialog')
      }
    },
    components: {
      PaymentMethodList,
      AddPaymentMethodDialog
    }
  }
</script>