<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="12"
    :options="options"
    style="width: 100%; height: 100%;"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    />

    <v-container slot="visible" container--fluid v-if="mapLoaded">
      <fare-estimator v-if="$vuetify.breakpoint.mdAndUp" style="width:400px" @fareEstimatorRouteSet="handleNewRoute($event)"></fare-estimator>
      <fare-estimator v-if="$vuetify.breakpoint.mdAndDown" style="width:100%" @fareEstimatorRouteSet="handleNewRoute($event)"></fare-estimator>
    </v-container>
  </GmapMap>
</template>

<script>
  import FareEstimator from '~/components/FareEstimator';
  import { mapActions } from 'vuex';
  import StripeCard from '~/components/StripeCard'

  export default {
    mounted () {
      this.resetTrip();
      this.resetDriver();

      let vm = this;

      this.$refs.map.$mapPromise.then((map) => {
        this.mapLoaded = true;

        if (!navigator.geolocation) {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({'address': 'Madrid'}, function(results, status) {
              if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
              }
            });

          return;
        }
      })
    },
    data () {
      return {
        mapLoaded: false,
        center: {lat: 40.42, lng: -3.70},
        markers: [],
        options: {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        },
        route: null
      }
    },
    methods: {
      ...mapActions({
        resetTrip: 'trip/resetTrip',
        resetDriver: 'map/resetDriver',
      }),
      handleNewRoute(route) {
         let directionsDisplay = new google.maps.DirectionsRenderer({
           map: this.$refs.map.$mapObject,
         });
         directionsDisplay.setDirections(route);
      }
    },
    components: {
      FareEstimator,
        StripeCard
    },
  }
</script>
