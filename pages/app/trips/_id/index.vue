<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="12"
    :options="options"
    style="width: 100%; height: 100%;"
  >
    <v-container slot="visible" fluid>
      <v-card style="width:400px" v-if="trip">
        <v-card-title class=" lighten-2">
          <v-layout row wrap>
              <v-flex xs12>
                <div class="headline gray--text text-lg-left">
                  Résumen del viaje
                  <trip-status-label :status="trip.status" style="float: right"></trip-status-label>
                </div>
                <span class="grey--text text-lg-left">{{ formatedDated }}</span>
              </v-flex>
              <v-flex xs12>
                <trip-progress-bar :status="trip.status"></trip-progress-bar>
              </v-flex>
          </v-layout>
        </v-card-title>
        <v-list style="background-color: #f8fafb;">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>trip_origin</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.origin.autocomplete }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>pin_drop</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.destination.autocomplete }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

           <v-list-tile v-if="trip.vehicle_plate">
            <v-list-tile-action>
              <v-icon>local_taxi</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.vehicle_plate }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>   

          <v-list-tile v-if="trip.driver_name">
            <v-list-tile-action>
              <v-icon>person_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.driver_name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>   

          <v-divider inset></v-divider>      
          
          <v-list-tile v-if="trip.driver_name">
            <v-list-tile-action>
              <v-icon>phone_iphone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.phone_number }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>   

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>credit_card</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.price }} €</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>    
        </v-list>
      </v-card>
    </v-container>
  </GmapMap>
</template>

<script>
  import moment from 'moment'
  import TripStatusLabel from '~/components/Trips/TripStatusLabel'
  import TripProgressBar from '~/components/Trips/TripProgressBar'

  export default {
    components: {
      TripStatusLabel,
      TripProgressBar
    },
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
    computed: {
      formatedDated () {
        return moment(this.trip.date).locale('es').format('LLL')
      }
    },
    methods: {
      async loadTrip (id) {
        this.$store.dispatch('getTrip', id)
          .then(response => {
            this.trip = response
            this.displayTripOnMap()
          })
      },
      async displayTripOnMap () {
        var directionsService = new google.maps.DirectionsService

        directionsService.route({
          origin: { placeId: this.trip.origin.google_id },
          destination: { placeId: this.trip.destination.google_id },
          travelMode: google.maps.TravelMode['DRIVING'],
          optimizeWaypoints: true
          }, (response, status) => {
            if (response.status !== 'OK') {
              return;
            }
            
            let directionsDisplay = new google.maps.DirectionsRenderer({
              map: this.$refs.map.$mapObject,
            });

            directionsDisplay.setDirections(response);
          });
        }
      }
    }
</script>
