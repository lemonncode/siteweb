<template>
  <div v-if="loaded">
    <v-card color="blue-grey darken-3" class="white--text">
      <v-card-title>
        <h3>Códigos promocionales</h3>
      </v-card-title>
      <v-list three-line v-if="discounts.length > 0">
        <template v-for="(discount, index) in discounts">
          <v-list-tile :key="discount.id" avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span>{{ discount.discount.name }}</span> : <small>Hasta <span class="red--text">{{ discount.discount.value }}% de reducción</span> en tus viajes</small>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                - Código {{ discount.discount.code }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title>
                - Válido del {{ formatedDate(discount.discount.start_date) }} al {{ formatedDate(discount.discount.end_date) }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="discount.discount.uses_limit">
                - Número de usos {{ discount.discount.uses_limit }} / Restante {{ discount.discount.uses_limit - discount.number_of_uses }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < discounts.length" :key="index"></v-divider>
        </template>
      </v-list>
      <v-list v-else>
        <v-list-tile>
          <v-list-tile-content>
            No tienes ningún código promocional activo.
          </v-list-tile-content>
        </v-list-tile>
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
    computed: {
      ...mapGetters({
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