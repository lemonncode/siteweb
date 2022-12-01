<template>
  <div v-if="loaded">
    <v-card color="blue-grey darken-3" class="white--text">
      <v-card-title>
        <h3>Mis tarjetas de crédito y débito</h3>
      </v-card-title>

      <v-list two-line v-if="paymentMethods.length > 0">
        <template v-for="(paymentMethod, index) in paymentMethods">
          <v-list-item avatar>
            <v-list-item-avatar :tile=true size="40x25">
              <card-image :brand="paymentMethod.card.brand"></card-image>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ paymentMethod.card.brand }}</strong> <span class="gray"> que termina en {{ paymentMethod.card.lastFourDigits }}</span>
              </v-list-item-title>
              <v-list-item-sub-title>
                Fecha caducidad: {{ paymentMethod.card.expirationMonth }}/{{ paymentMethod.card.expirationYear }}
              </v-list-item-sub-title>
            </v-list-item-content>
            <template v-if="isAuthorized()">
              <v-list-item-action v-if="!paymentMethod.default">
                <a v-if="$vuetify.breakpoint.mdAndUp" @click="updateDefaultPaymentMethod(paymentMethod)">
                  definir como predeterminada
                </a>
                <v-btn v-else text icon color="green" @click="updateDefaultPaymentMethod(paymentMethod)">
                  <v-icon>check</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn text icon color="red" @click="removePaymentMethod(paymentMethod)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider v-if="index + 1 < paymentMethods.length" :key="index"></v-divider>
        </template>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            No has añadido una tarjeta todavía.
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <add-payment-method-dialog v-if="isAuthorized()"></add-payment-method-dialog>
  </div>
</template>

<script>
  import CardImage from './CardImage'
  import AddPaymentMethodDialog from '~/components/PaymentMethods/AddPaymentMethodDialog'
  import {mapGetters, mapActions} from 'vuex';

  export default {
    async mounted() {
      await this.getPaymentMethods()
      this.loaded = true
    },
    data() {
      return {
        loaded: false
      }
    },
    computed: {
      ...mapGetters({
        paymentMethods: 'paymentMethod/paymentMethods',
        currentAccount: 'userAccount/currentAccount',
        userAccounts: 'userAccount/userAccounts',
      }),
    },
    methods: {
      ...mapActions({
        getPaymentMethods: 'paymentMethod/getPaymentMethods',
        deletePaymentMethod: 'paymentMethod/deletePaymentMethod',
        setDefaultPaymentMethod: 'paymentMethod/setDefaultPaymentMethod'
      }),
      async updateDefaultPaymentMethod(paymentMethod) {
        await this.setDefaultPaymentMethod(paymentMethod)
        this.showUpdatedDefaultPaymentMethodSuccessMessage()
      },
      removePaymentMethod(paymentMethod) {
        this.deletePaymentMethod(paymentMethod)
          .then(() => this.showDeletedPaymentMethodSuccessMessage())
          .catch(() => this.showDeletedPaymentMethodErrorMessage())
      },
      isAuthorized() {
        return this.currentAccount.discriminator == 'personal' || (this.currentAccount !== null && (this.currentAccount.role == 'owner' || this.currentAccount.role == 'admin'))
      }
    },
    notifications: {
      showUpdatedDefaultPaymentMethodSuccessMessage: {
        message: 'Método de pago predeterminado actualizado',
        type: 'success'
      },
      showDeletedPaymentMethodSuccessMessage: {
        message: 'método de pago borrado',
        type: 'success'
      },
      showDeletedPaymentMethodErrorMessage: {
        message: 'No es posible eliminar el método de pago mientras exista un viaje activo',
        type: 'error'
      }
    },
    components: {
      CardImage,
      AddPaymentMethodDialog
    }
  }
</script>
