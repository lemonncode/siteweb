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
        <v-btn text @click.native="closeDialog">Cancelar</v-btn>
        <v-btn v-if="!loading" color="primary" text @click.native="test" :disabled="!complete">Añadir tarjeta</v-btn>
        <v-progress-circular ml-4 v-if="loading"
                             indeterminate
                             color="primary"
        ></v-progress-circular>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import { Card, handleCardPayment } from 'vue-stripe-elements-plus'

    export default {
        mounted() {
            this.stripeApiPublicKey = process.env.STRIPE_API_PUBLIC_KEY
        },
        data() {
            return {
                stripeApiPublicKey: null,
                complete: false,
                loading: false,
                dialog: true
            }
        },
        methods: {
            test() {

                handleCardPayment('src_client_secret_FkpGJfBTWr0nDaJ7P95M3GTm').then(data => console.log(data))

                return


                let stripe = Stripe(this.stripeApiPublicKey)

                stripe.handleCardPayment(
                    'src_client_secret_FkW84KZIm2RqHztOyp3cshgT',
                    this.$refs.card.$createElement()
                ).then(function(result) {
                    console.log(result)
                });

                return


                /*await stripe.handleCardPayment(
                    'src_client_secret_FkW84KZIm2RqHztOyp3cshgT', this.$refs.card, {
                        payment_method_data: {
                            billing_details: {name: 'julien'}
                        }
                    }
                ).then(function(result) {
                    console.log(result)
                });*/
            },
            addCard(token) {

            }
        },
        components: {
            Card
        }
    }
</script>

<style scoped>
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
