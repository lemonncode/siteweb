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
              Fecha caducidad: {{ card.expiration_month }}/{{ card.expiration_year }}
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <a v-if="!isDefaultPaymentCard(card)" @click="updateDefaultPaymentCard(card)">definir como predeterminada</a>
          </v-list-tile-action>

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
          No has añadido una tarjeta todavía.
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  import CardImage from './CardImage'
  import { mapGetters, mapActions } from 'vuex';

  export default {
    mounted() {
      this.loadPaymentCards()
    },
    data() {
      return {
        loaded: false
      }
    },
    computed: {
      ...mapGetters({
          current_account: 'user/current_account',
      }),
      paymentCards() {
        return this.$store.state.paymentMethod.paymentCards
      }
    },
    watch: {
      current_account: {
          handler: 'loadPaymentCards'
      }
    },
    methods: {
      ...mapActions({
          getPaymentCards: 'paymentMethod/getPaymentCards'
      }),
      isDefaultPaymentCard(paymentCard) {
        return this.$auth.user.current_account.default_payment_card !== null && this.$auth.user.current_account.default_payment_card.uuid === paymentCard.uuid
      },
      updateDefaultPaymentCard(paymentCard) {
        this.$store.dispatch('paymentMethod/updateDefaultPaymentCard', paymentCard).then(() => {
          this.showUpdatedDefaultPaymentCardSuccessMessage()
        });
      },
      deletePaymentCard(paymentCard) {
        this.$store.dispatch('paymentMethod/deletePaymentCard', paymentCard).then(() => {
          this.showDeletedPaymentCardSuccessMessage()
        });
      },
      loadPaymentCards() {
        this.loaded = false;
        this.getPaymentCards().then(() => {
            this.loaded = true;
        });
      }
    },
    notifications: {
      showUpdatedDefaultPaymentCardSuccessMessage : {
        message: 'Tarjeta predeterminada actualizada',
        type: 'success'
      },
      showDeletedPaymentCardSuccessMessage: {
        message: 'Tarjeta borrada',
        type: 'success'
      }
    },
    components: {
      CardImage
    }
  }
</script>