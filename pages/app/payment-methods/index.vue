<template>
  <v-card class="pb-5">
    <v-card-title>
      <h3 class="headline">Métodos de pago</h3>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <div v-if="account.payment_method == 'stripe'">
        <payment-method-list></payment-method-list>
      </div>
      <div v-else>
        <transfer-payment-method></transfer-payment-method>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PaymentMethodList from '~/components/PaymentMethods/PaymentMethodList'
  import TransferPaymentMethod from '~/components/PaymentMethods/TransferPaymentMethod'

  export default {
    computed: {
      ...mapGetters({
        account: 'userAccount/account',
      }),
    },
    components: {
      PaymentMethodList,
      TransferPaymentMethod
    }
  }
</script>