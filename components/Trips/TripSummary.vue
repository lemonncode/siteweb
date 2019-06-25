<template>
  <v-card style="width:400px" v-if="trip">
    <v-card-title class=" lighten-2">
      <v-layout row wrap>
        <v-flex xs12>
          <div class="title gray--text text-md-left">
            Resumen del viaje
            <trip-status-label :status="trip.status" style="float: right"></trip-status-label>
          </div>
          <span class="caption grey--text text-lg-left">{{ formatedDated }}</span>
        </v-flex>
        <v-flex xs12>
          <span class="caption text-lg-right" v-if="waitTime && trip.status == 'started'">El conductor llegará en {{ waitTime | toMinutes }} min</span><trip-progress-bar :status="trip.status"></trip-progress-bar>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-tabs
        centered
        text
    >
      <v-tabs-slider color="#ed6363"></v-tabs-slider>

      <v-tab href="#tab-1">
        Viaje
      </v-tab>

      <v-tab href="#tab-2">
        Vehículo
      </v-tab>

      <v-tab href="#tab-3">
        Conductor
      </v-tab>

      <v-tab-item
          v-for="number in 3"
          :value="'tab-' + number"
          :key="number"
      >
        <v-card flat v-if="number == 1">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>trip_origin</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.origin_location ? trip.origin_location.formatted_address : trip.origin.autocomplete }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>pin_drop</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.destination_location ? trip.destination_location.formatted_address : trip.destination.autocomplete }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>credit_card</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.price }} €</v-list-tile-title>
            </v-list-tile-content>
            <v-btn v-if="trip.status !== 'done' && trip.status !== 'finalized'
                && trip.status !== 'canceled' && trip.status !== 'pickedup'" @click="cancelTrip(trip)" round small color="#ed6363" dark>Cancelar</v-btn>
          </v-list-tile>
        </v-card>
        <v-card flat v-if="number == 2">
          <v-list-tile v-if="trip.vehicle_plate">
            <v-list-tile-action>
              <v-icon>local_taxi</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.vehicle_plate }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="trip.vehicle_model">
            <v-list-tile-action>
              <v-icon>settings_overscan</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="trip.vehicle_model">{{ trip.vehicle_model }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="trip.vehicle_color">
            <v-list-tile-action>
              <v-icon>invert_colors</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.vehicle_color }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="!trip.vehicle_plate">
            <v-list-tile-action>
              <v-icon>person_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Todavía no tiene vehículo asignado</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-card>
        <v-card flat v-if="number == 3">
          <v-list-tile v-if="trip.driver_name">
            <v-list-tile-action>
              <v-icon>person_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ trip.driver_name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="trip.phone_number">
            <v-list-tile-action>
              <v-icon>phone_iphone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><a :href="'tel:' + trip.phone_number" class="blue--text">{{ trip.phone_number }}</a></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="!trip.driver_name">
            <v-list-tile-action>
              <v-icon>person_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Todavía no tiene conductor asignado</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog
        v-if="trip.status == 'no-assignment' && dialog"
        v-model="dialog"
        max-width="290"
    >
      <v-card>
        <v-card-title class="headline">No ha sido posible encontrar conductor</v-card-title>

        <v-card-text>
          Lo sentimos, pero en estos momentos no tenemos conductores disponibles. Puede cancelar el viaje o volver a intentar la búsqueda.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              color="#ed6363"
              flat="flat"
              @click="cancelTrip(trip)"
          >
            Cancelar
          </v-btn>

          <v-btn
              color="#ed6363"
              flat="flat"
              @click="reassignTrip(trip)"
          >
            Volver a intentar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
    import moment from 'moment'
    import TripStatusLabel from '~/components/Trips/TripStatusLabel'
    import TripProgressBar from '~/components/Trips/TripProgressBar'
    import { mapGetters, mapActions } from 'vuex';

    export default {
      name: "TripSummary",
      data () {
        return {
          dialog: true
        }
      },
      components: {
        TripStatusLabel,
        TripProgressBar
      },
      created() {
        this.loadTrip(this.$route.params.id)
      },
      computed: {
        ...mapGetters({
          trip: 'trip/trip',
          waitTime: 'map/waitTime',
          currentAccountId: 'userAccount/currentAccountId'
        }),
        formatedDated () {
          let date = this.trip.date;
          if (typeof this.trip.date !== 'string') {
              date = date.toDate()
          }

          return moment(date).locale('es').format('LLL')
        },
      },
      mounted() {
          this.scrollToEnd();
      },
      watch: {
        trip: {
          handler: 'scrollToEnd'
        },
        currentAccountId () {
            this.loadTrip(this.$route.params.id)
        }
      },
      methods: {
        ...mapActions({
            loadTrip: 'trip/loadTrip',
        }),

        scrollToEnd() {
          var container = document.querySelector("html");
          var scrollHeight = container.scrollHeight;
          container.scrollTop = scrollHeight;
        },
        async cancelTrip (trip) {
          this.dialog = false;
          let confirmation = confirm('Estas seguro que quieres cancelar este viaje ?')
          if (!confirmation) {
            return
          }
          await this.$store.dispatch('cancelTrip', trip)
            .then(() => {
              this.showCanceledTripSuccessMessage();
            })
            .catch(e => {

            })
          ;
        },
        async reassignTrip (trip) {
          this.dialog = false;
          await this.$store.dispatch('reassignTrip', trip);
        },
      },
      notifications: {
        showCanceledTripSuccessMessage: {
            message: 'Viaje privado cancelado',
            type: 'success'
        }
      },
      filters: {
          toMinutes(seconds) {
              return Math.floor(seconds / 60);
          }
      }
    }
</script>

<style scoped>
  >>> .v-list__tile {
    font-size: 14px;
  }

  >>> .v-card__title {
    padding: 16px 16px 2px 14px;
  }

  >>> .v-icon {
    font-size: 18px;
  }

  >>> .v-tabs__div {
    font-size: 14px;
  }
</style>