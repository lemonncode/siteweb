<template>
  <v-card color="blue-grey darken-3" class="white--text" v-if="loaded">
    <v-card-title>
      <h3 class="headline">Mis tarjetas de crédito y débito</h3>
    </v-card-title>

    <v-list two-line v-if="paymentCards.length > 0">
      <template v-for="(card, index) in paymentCards">
        <v-list-tile :key="card.id" avatar>
          <v-list-tile-avatar :tile=true size="40x25">
            <card-image :brand="card.brand"></card-image>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              <strong>{{ card.brand }}</strong> <span class="gray"> que termina en {{ card.last_four_digits }}</span>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              Julien Kirsch - Fecha caducidad: {{ card.expiration_month }}/{{ card.expiration_year }}
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <!--
          <v-list-tile-action>
            <v-btn flat icon color="gray">
              <v-icon>done_outline</v-icon>
            </v-btn>
          </v-list-tile-action>
          -->

          <v-list-tile-action>
            <v-btn flat icon color="red" @click="deletePaymentCard(card)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < paymentCards.length" :key="index"></v-divider>
      </template>
    </v-list>
    <v-list v-else>
      <v-list-tile>
        <v-list-tile-content>
          No has añadido una tarjeta de pago todavía.
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  import CardImage from './CardImage'

  export default {
    mounted() {
      this.$store.dispatch('paymentMethod/getPaymentCards').then(() => {
        this.loaded = true;
      })
    },
    data() {
      return {
        loaded: false
      }
    },
    computed: {
      paymentCards() {
        return this.$store.state.paymentMethod.paymentCards
      }
    },
    methods: {
      deletePaymentCard(paymentCard) {
        this.$store.dispatch('paymentMethod/deletePaymentCard', paymentCard).then(() => {
          this.showDeletedPaymentCardSuccessMessage()
        });
      }
    },
    notifications: {
      showDeletedPaymentCardSuccessMessage: {
        message: 'Tarjeta de pago borrada',
        type: 'success'
      }
    },
    components: {
      CardImage
    }
  }
</script>