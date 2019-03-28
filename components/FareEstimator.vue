<template>
  <v-stepper v-model="currentStep" vertical>
    <v-stepper-step :complete="currentStep > 1" step="1">Seleccione un trayecto</v-stepper-step>
    <v-stepper-content step="1">
      <place-autocomplete-field
          icon="trip_origin"
          placeholder="Punto de partida"
          display-geolocation-button
          @changed="pickupPlace = $event"
      ></place-autocomplete-field>

      <place-autocomplete-field
          icon="pin_drop"
          placeholder="Destino"
          @changed="destinationPlace = $event"
      ></place-autocomplete-field>

      <v-alert :value="alert" type="error" transition="scale-transition">Trayecto inválido</v-alert>

      <v-btn color="primary" @click.native="handleRoute" :disabled="!isValidStep1">Continuar</v-btn>
    </v-stepper-content>
    <v-stepper-step :complete="currentStep > 2" step="2">
        Seleccione una fecha
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-radio-group v-model="serviceType" row>
        <v-radio label="Ahora" value="asap"></v-radio>
        <v-radio label="Reserva" value="reservation"></v-radio>
      </v-radio-group>
      <date-field v-if="serviceType != 'asap'" :value="date" @dateUpdated="date = $event"></date-field>
      <time-field v-if="serviceType != 'asap'" :value="time" :date="date" @timeUpdated="time = $event"></time-field>
      <v-btn color="primary" @click="priceCalculator" @click.native="currentStep = 3" :disabled="!isValidStep2">Continuar</v-btn>
      <v-btn flat @click.native="currentStep = 1">Cancelar</v-btn>
    </v-stepper-content>


    <div v-if="current_account != null && current_account.discriminator == 'personal' || (current_account != null && current_account.role != 'owner' && current_account.role != 'admin')">
      <v-stepper-step step="3">Confirmar la reserva</v-stepper-step>
      <v-stepper-content step="3">
        <v-textarea v-model="notes" label="Comentario" outline></v-textarea>
          <v-card-title>El precio de la reserva es de {{ priceFormat(price) }} €</v-card-title>
          <v-btn v-if="!loading" color="primary" @click.native="complete">{{ getButtonLabel() }}</v-btn>
          <v-progress-circular v-if="loading"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <v-btn flat @click.native="currentStep = 2">Cancelar</v-btn>
      </v-stepper-content>
    </div>
    <div v-else>
      <v-stepper-step step="3">Seleccionar usuario y confirmar</v-stepper-step>
      <v-stepper-content step="3">
        <trip-more-info @change="updateMoreInfo($event)"></trip-more-info>
        <v-flex xs12 sm12>
          <v-text-field
              v-model="reference"
              type="text"
              label="Referencia (optativo)"
              required
          ></v-text-field>
        </v-flex>
        <v-textarea v-model="notes" label="Comentario" outline></v-textarea>
        <v-card-title>El precio de la reserva es de {{ priceFormat(price) }} €</v-card-title>
        <v-btn v-if="!loading" color="primary" @click.native="complete">{{ getButtonLabel() }}</v-btn>
        <v-progress-circular v-if="loading"
                             indeterminate
                             color="primary"
        ></v-progress-circular>
        <v-btn flat @click.native="currentStep = 2">Cancelar</v-btn>
      </v-stepper-content>
    </div>

  </v-stepper>
</template>

<script>
  import DateField from '~/components/Estimator/DateField'
  import PlaceAutocompleteField from '~/components/Estimator/PlaceAutocompleteField'
  import TimeField from '~/components/Estimator/TimeField'
  import { mapGetters, mapActions } from 'vuex'
  import TripMoreInfo from "./Trips/TripMoreInfo";

  export default {
    components: {
        TripMoreInfo,
      PlaceAutocompleteField,
      DateField,
      TimeField,
    },
    data () {
      return {
        date: null,
        time: null,
        currentStep: 1,
        pickupPlace: null,
        destinationPlace: null,
        route: null,
        price: null,
        alert: false,
        notes: null,
        serviceType: 'asap',
        loading: false,
        geolocation: {
            geocoder: null,
            loc: null,
            position: null
        },
        geolocationOptions: {
          type: Object,
          default: null
        },
        user: null,
        riderName: null,
        riderPhone: null,
        reference: null,
      };
    },
    mounted () {
        this.setAccount(this.current_account)
    },
    computed: {
      ...mapGetters({
        current_account: 'userAccount/currentAccount',
      }),
      isValidStep1 () {
        return this.pickupPlace !== null && this.destinationPlace !== null;
      },
      isValidStep2 () {
        return (this.serviceType == 'asap' || (this.date !== null && this.time !== null));
      },
    },
    methods: {
      ...mapActions({
          setAccount: 'userAccount/setAccount'
      }),
      cancelStep1 () {
        this.pickupPlace = this.destinationPlace = null;
      },
      priceFormat(value) {
        if (value) {
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
      },
      getButtonLabel () {
        return this.serviceType == 'asap' ? 'Pedir ahora' : 'Reservar'
      },
      handleRoute () {
        var directionsService = new google.maps.DirectionsService;

        directionsService.route({
            origin: { placeId: this.pickupPlace.placeId },
            destination: { placeId: this.destinationPlace.placeId },
            travelMode: google.maps.TravelMode['DRIVING'],
            optimizeWaypoints: true,
            avoidTolls: true,
            avoidFerries: true,
            region: 'es',
            provideRouteAlternatives: true,
          }, (response, status) => {

            if (response.status !== 'OK') {
              this.alert = true;
              return;
            }

            let shortestRoute = this.getShortestRoute(response.routes)
            this.route = shortestRoute.legs[0]
            //this.price = ((this.route.distance.value/1000) * 1.5).toFixed(2);
            this.currentStep = 2;

            response.routes = [shortestRoute]

            this.$emit('fareEstimatorRouteSet', response)
          }
        );
      },
      complete () {
        this.loading = true;
        this.addTrip({
          origin: this.pickupPlace.placeId,
          destination: this.destinationPlace.placeId,
          date: this.date && this.time ? `${this.date} ${this.time}` : null,
          notes: this.notes,
          serviceType: this.serviceType,
          user: this.user,
          embeddedRider: {name: this.riderName, phoneNumber: this.riderPhone},
          accountReferenceNumber: this.reference,
        })
      },

      addTrip (trip) {
        this.$store.dispatch('addTrip', trip)
          .then(response => {
            this.$router.push({ name: 'app-trips-id', params: {id: response.id} })
            this.showTripSuccess()
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.showAddTripError(error.response !== undefined ? { message: error.response.data.message } : {})
          })
      },

      getShortestRoute(routes) {
        let shortestRoute = routes[0]
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].legs[0].distance.value < shortestRoute.legs[0].distance.value) {
            shortestRoute = routes[i]
          }
        }

        return shortestRoute
      },

      priceCalculator () {
          this.tripDetail({
              params: {
                  origin: this.pickupPlace.placeId,
                  destination: this.destinationPlace.placeId
              }
          })
      },

      async tripDetail (trip) {
        this.$store.dispatch('tripDetail', trip)
          .then(data => {
            this.price = data.price;
          })
          .catch(error => {
            this.currentStep = 1
            //this.showTripDetailErrorMessage(error.response !== undefined ? { message: error.response.data.message } : {})
            this.showTripDetailErrorMessage({})
          })
      },

      updateMoreInfo(data) {
          this.user = data.user;
          this.riderName = data.riderName;
          this.riderPhone = data.riderPhone;
      }
    },
    notifications: {
      showTripDetailErrorMessage: {
        message: 'Lo sentimos, el precio del viaje solicitado no se puede calcular, por favor pongáse en contacto con nosotros',
        type: 'error'
      },
      showAddTripError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showTripSuccess: {
        message: 'Viaje privado añadido con éxito',
        type: 'success'
      },
      showNoResultForGeolocation: {
        message: 'No se han encontrado resultados para sus coordenadas',
        type: 'error'
      },
      showErrorForGeolocation: {
          message: 'Error al intentar obtener sus coordenadas',
          type: 'error'
      },
      showNavigatorError: {
          message: 'Debe activar el permiso de geolocalización de su navegador',
          type: 'error'
      }
    }
  }
</script>

<style>
</style>

