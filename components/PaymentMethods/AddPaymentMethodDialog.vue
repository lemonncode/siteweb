<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on }">
      <v-fab-transition>
        <v-btn
          v-on="on"
          color="primary"
          dark
          absolute
          bottom
          right
          fab
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
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
        <v-btn flat @click="cancel">Cancelar</v-btn>
        <v-btn v-if="!loading" color="primary" flat @click.native="addCard" :disabled="!complete">Añadir tarjeta
        </v-btn>
        <v-progress-circular ml-4 v-if="loading"
                             indeterminate
                             color="primary"
        ></v-progress-circular>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions} from 'vuex';
  import {Card, handleCardSetup} from 'vue-stripe-elements-plus'

  export default {
    async mounted() {
      this.stripeApiPublicKey = process.env.STRIPE_API_PUBLIC_KEY
    },
    data() {
      return {
        dialog: false,
        stripeApiPublicKey: null,
        complete: false,
        loading: false,
      }
    },
    methods: {
      ...mapActions({
        getSetupIntent: 'paymentMethod/getSetupIntent',
        addPaymentMethod: 'paymentMethod/addPaymentMethod'
      }),
      cancel() {
        this.close()
      },
      async addCard() {
        this.loading = true

        const setupIntent = await this.getSetupIntent()
        let result = await handleCardSetup(setupIntent.clientSecret)

        if (result.error) {
          this.showAddPaymentCardErrorMessage({message: result.error.message})
        } else {
          await this.addPaymentMethod(setupIntent)
          this.showAddPaymentCardSuccessMessage()
          this.close()
        }

        this.loading = false
      },
      close() {
        this.$refs.card.clear()
        this.dialog = false
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
