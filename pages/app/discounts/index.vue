<template>
  <v-card class="pb-5">
    <v-card-title>
      <h3 class="headline">Descuentos</h3>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <discount-list></discount-list>
    </v-container>
  </v-card>
</template>

<script>
  import DiscountList from '~/components/Discounts/DiscountList'

  export default {
    components: {
      DiscountList
    },
  }
</script>