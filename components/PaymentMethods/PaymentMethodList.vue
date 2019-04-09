<template>
  <div v-if="loaded">
    <v-card color="blue-grey darken-3" class="white--text">
      <v-card-title>
        <h3>Mis tarjetas de crédito y débito</h3>
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

            <template v-if="isAuthorized()">
              <v-list-tile-action v-if="!isDefaultPaymentCard(card)">
                <a v-if="$vuetify.breakpoint.mdAndUp" @click="updateDefaultPaymentCard(card)">
                  definir como predeterminada
                </a>
                <v-btn v-else flat icon color="green" @click="updateDefaultPaymentCard(card)">
                  <v-icon>check</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action>
                <v-btn flat icon color="red" @click="deletePaymentCard(card)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </template>
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
    <v-fab-transition>
      <v-btn
          v-if="isAuthorized()"
          color="primary"
          dark
          absolute
          bottom
          right
          fab
          @click="openDialog"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <add-payment-method-dialog></add-payment-method-dialog>
  </div>
</template>

<script>
  import CardImage from './CardImage'
  import AddPaymentMethodDialog from '~/components/PaymentMethods/AddPaymentMethodDialog'
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
          currentAccount: 'userAccount/currentAccount',
          userAccounts: 'userAccount/userAccounts'
      }),
      paymentCards() {
        return this.$store.state.paymentMethod.paymentCards
      }
    },
    watch: {
      currentAccount: {
          handler: 'loadPaymentCards'
      }
    },
    methods: {
      ...mapActions({
          getPaymentCards: 'paymentMethod/getPaymentCards',
      }),
      openDialog() {
        this.$store.commit('paymentMethod/openDialog')
      },
      isDefaultPaymentCard(paymentCard) {
        if (this.currentAccount.discriminator == 'personal') {
            return this.currentAccount.default_payment_card !== null && this.currentAccount.default_payment_card.uuid === paymentCard.uuid
        } else {
            return this.currentAccount.account.default_payment_card !== null && this.currentAccount.account.default_payment_card.uuid === paymentCard.uuid
        }
      },
      updateDefaultPaymentCard(paymentCard) {
        this.$store.dispatch('paymentMethod/updateDefaultPaymentCard', paymentCard).then(() => {
          this.showUpdatedDefaultPaymentCardSuccessMessage()
        });
      },
      deletePaymentCard(paymentCard) {
        this.$store.dispatch('paymentMethod/deletePaymentCard', paymentCard).then(() => {
          this.showDeletedPaymentCardSuccessMessage()
        }).catch( () => this.showDeletedPaymentCardErrorMessage());
      },
      loadPaymentCards() {
        this.loaded = false;
        this.getPaymentCards().then(() => {
            this.loaded = true;
        });
      },
      isAuthorized() {
          return this.currentAccount.discriminator == 'personal' || (this.currentAccount !== null && (this.currentAccount.role == 'owner' || this.currentAccount.role == 'admin'));
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
      },
      showDeletedPaymentCardErrorMessage: {
        message: 'La tarjeta de crédito no ha podido ser borrada',
        type: 'error'
      }
    },
    components: {
      CardImage,
      AddPaymentMethodDialog
    }
  }
</script>