<template>
  <GmapMap
     ref="map"
     :center="center ? center: updateCenter"
     :zoom="12"
     :options="options"
  >
    <v-container v-show="$vuetify.breakpoint.mdAndUp" class="hidden-sm-and-down pl-2" slot="visible" fluid>
      <trip-summary></trip-summary>
    </v-container>
    <GmapMarker v-if="driver && showMarkers"
      :ref="driver.fullName"
      :position="driver.position"
      :clickable="true"
      :icon="{ url:  '/images/' +driver.icon}"
      @click="toggleDriverInfoWindow(driver)">
    </GmapMarker>
    <gmap-info-window v-if="driver && showMarkers" :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
      <div v-html="infoContent"></div>
    </gmap-info-window>
  </GmapMap>
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import TripSummary from '~/components/Trips/TripSummary'

  export default {
    name: "TripMap",
    data () {
      return {
        infoWindowPos: null,
        infoWinOpen: false,
        infoContent: '',
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -25
          }
        },
        showMarkers: true,
        mapLoaded: false,
        options: {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        },
        center: { lat: 30.4169751, lng: -3.6924527 }
      }
    },
    components: {
        TripSummary
    },
    computed: {
      ...mapGetters({
        trip: 'trip/trip',
        driver: 'map/driver',
      }),
      updateCenter () {
        var center = { lat: 40.4169751, lng: -3.6924527 };

        if (this.driver) {
          center = this.driver.position;
          if (!this.infoWinOpen) {
            this.toggleDriverInfoWindow(this.driver)
          }
        }

        if (this.center) {
            center = this.center;
        }

        return center;
      }
    },
    watch : {
      trip:function(val) {
        if (val) {
          this.displayTripOnMap();
          if (val.driver_uuid && (val.status == 'pending' || val.status == 'asigned' || val.status == 'started' || val.status == 'pickedup' || val.status == 'arrived')) {
              this.showMarkers = true;
              this.getDriver(val.driver_uuid);
          }

          if (val && (val.status == 'done' || val.status == 'canceled' || val.status == 'finished' || val.status == 'finalized')) {
              this.showMarkers = false
          }
        }
      },
      driver:function(val) {
        if (val) {

            if (this.trip && this.trip.status == 'started') {
                this.estimatedTime({'trip': this.trip, driver: val});
            }
        }
      }
    },
    methods: {
      ...mapActions({
        getDriver: 'map/getDriver',
        estimatedTime: 'map/estimatedTime'
      }),
      async displayTripOnMap () {
        var directionsService = new google.maps.DirectionsService

        directionsService.route({
          origin: { placeId: this.trip.origin.google_id },
          destination: { placeId: this.trip.destination.google_id },
          travelMode: google.maps.TravelMode['DRIVING'],
          optimizeWaypoints: true
        }, (response, status) => {
          if (response && response.status !== 'OK') {
              return;
          }

          let directionsDisplay = new google.maps.DirectionsRenderer({
              map: this.$refs.map.$mapObject,
          });

          if (response) {
              directionsDisplay.setDirections(response);
          }

        });
      },
      toggleDriverInfoWindow: function(marker) {
        var contentString = '<p>' + marker.fullName + '</p>' +
            '<p>' + marker.licensePlateNumber + '</p>';
        this.infoWindowPos = marker.position;
        this.infoContent = contentString;
        this.infoWinOpen = !this.infoWinOpen;
      },
    }
  }
</script>