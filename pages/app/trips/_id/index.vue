<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="12"
    :options="options"
    style="width: 100%; height: 100%;"
  >
    <v-container slot="visible" fluid>
      <v-card style="width:400px">
        <v-card-title class="primary lighten-2">
          <span class="headline white--text">Resumen del viaje</span>
        </v-card-title>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>phone</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-container>
  </GmapMap>
</template>

<script>
  export default {
    validate ({ params, query, store }) {
      return /^\d+$/.test(params.id)
    },
    mounted () {
      this.loadTrip(this.$route.params.id)
    },
    data () {
      return {
        trip: null,
        mapLoaded: false,
        center: {lat: 40.42, lng: -3.70},
        options: {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }
      }
    },
    methods: {
      async loadTrip (id) {
        this.trip = await this.$store.dispatch('getTrip', id)
      },
    }
  }
</script>
