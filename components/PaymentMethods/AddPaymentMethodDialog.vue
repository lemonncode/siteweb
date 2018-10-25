<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Añadir un método de pago</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout>
            <card
                ref='card'
                class='stripe-card'
                :class='{ complete }'
                :stripe='stripeApiPublicKey'
                @change='complete = $event.complete'
                v-if="stripeApiPublicKey !== null"
            />
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" flat @click.native="createToken" :disabled="!complete">Añadir tarjeta</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { Card, createToken } from 'vue-stripe-elements-plus'

  export default {
    mounted() {
      this.stripeApiPublicKey = process.env.STRIPE_API_PUBLIC_KEY
    },
    data() {
      return {
        stripeApiPublicKey: null,
        complete: false
      }
    },
    computed: {
      dialog() {
        return this.$store.state.paymentMethod.dialog
      }
    },
    methods: {
      closeDialog() {
        this.$store.commit('paymentMethod/closeDialog')
      },
      async createToken() {
        await createToken().then(data => {
          if ('error' in data) {
            console.log(data.error.message)
          } else {
            this.addCard(data.token);
          }
        });
      },
      addCard(token) {
        this.$store.dispatch('paymentMethod/addPaymentCard', token.id)
          .then(data => {
            this.$refs.card.clear()
            this.closeDialog()
            this.showAddPaymentCardSuccessMessage()
          })
          .catch(error => {
            this.showAddPaymentCardErrorMessage(error.response !== undefined ? { message: error.response.data.message } : {})
          })
      }
    },
    notifications: {
      showAddPaymentCardErrorMessage: {
        message: 'Tarjeta inválida',
        type: 'error'
      },
      showAddPaymentCardSuccessMessage: {
        message: 'Tarjeta de pago añadida',
        type: 'success'
      }
    },
    components: {
      Card
    }
  }
</script>

<style>
  .stripe-card {
    width: 100%;
  }

  .StripeElement {
    background-color: white;
    height: 40px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }

  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  .StripeElement--invalid {
    border-color: #fa755a;
  }

  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
</style>