<template>
  <div v-if="loaded">
    <v-card color="blue-grey darken-3" class="white--text">
      <v-card-title>
        <h3>Códigos promocionales</h3>
      </v-card-title>
      <v-list three-line v-if="discounts.length > 0">
        <template v-for="(discount, index) in discounts">
          <v-list-item :key="discount.id" avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ discount.discount.name }}</span> : <small>Hasta <span class="red--text">{{ discount.discount.value }}% de reducción</span> en tus viajes</small>
              </v-list-item-title>
              <v-list-item-sub-title>
                - Código {{ discount.discount.code }}
              </v-list-item-sub-title>
              <v-list-item-sub-title>
                - Válido del {{ formatedDate(discount.discount.start_date) }} al {{ formatedDate(discount.discount.end_date) }}
              </v-list-item-sub-title>
              <v-list-item-sub-title>
                - Condiciones
                <v-chip small v-if="discount.discount.uses_limit">
                  Número de usos {{ discount.discount.uses_limit }} / Restante {{ discount.discount.uses_limit - discount.number_of_uses }}
                </v-chip>
                <v-chip small v-if="discount.discount.maximum_amount > 0">
                  Importe máximo {{ discount.discount.maximum_amount }} €
                </v-chip>
              </v-list-item-sub-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="index + 1 < discounts.length" :key="index"></v-divider>
        </template>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            No tienes ningún código promocional activo.
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <add-discount-dialog></add-discount-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import AddDiscountDialog from './AddDiscountDialog'

  export default {
    mounted() {
      this.loadDiscounts()
    },
    data() {
      return {
        loaded: false,
      }
    },
    watch: {
      account: {
        handler: 'loadDiscounts'
      }
    },
    computed: {
      ...mapGetters({
        account: 'userAccount/currentAccount',
        discounts: 'discount/discounts'
      })
    },
    methods: {
      ...mapActions({
        getDiscounts: 'discount/getDiscounts'
      }),
      loadDiscounts() {
        this.getDiscounts().then(() => {
          this.loaded = true
        });
      },
      formatedDate (date) {
        return moment(date).locale('es').format('LL')
      }
    },
    components: {
      AddDiscountDialog
    },
  }
</script>
