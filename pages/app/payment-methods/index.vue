<template>
  <v-card class="pb-5">
    <v-card-title>
      <h3 class="headline">Métodos de pago</h3>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <div v-if="account.payment_method == 'stripe'">
        <payment-method-list></payment-method-list>
      </div>
      <div v-else-if="account.payment_method == 'transfer'">
        <transfer-payment-method></transfer-payment-method>
      </div>
      <div v-else>
        <cash-payment-method></cash-payment-method>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PaymentMethodList from '~/components/PaymentMethods/PaymentMethodList'
  import TransferPaymentMethod from '~/components/PaymentMethods/TransferPaymentMethod'
  import CashPaymentMethod from '~/components/PaymentMethods/CashPaymentMethod'

  export default {
    computed: {
      ...mapGetters({
        account: 'userAccount/account',
      }),
    },
    components: {
      PaymentMethodList,
      TransferPaymentMethod,
      CashPaymentMethod
    }
  }
</script>