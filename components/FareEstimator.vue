<template>
  <v-stepper v-model="currentStep" vertical v-if="currentAccount">
    <v-stepper-step :complete="currentStep > 1" step="1">Seleccione un trayecto</v-stepper-step>
    <v-stepper-content step="1">
      <place-autocomplete-field
          icon="trip_origin"
          placeholder="Punto de partida"
          display-geolocation-button
          display-routes
          display-places
          @changed="setPickupPlace($event)"
      ></place-autocomplete-field>

      <place-autocomplete-field
          icon="pin_drop"
          placeholder="Destino"
          display-places
          @changed="setDestinationPlace($event)"
          v-bind:selected="selectedRoute"
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

    <div v-if="currentAccount != null && currentAccount.discriminator == 'affiliate'">
      <v-stepper-step step="3">Datos pasajero</v-stepper-step>
      <v-stepper-content step="3">
        <v-flex xs12 sm12>
          <v-text-field
              v-model="riderName"
              type="text"
              label="Pasajero"
          ></v-text-field>
          <phone-number-field v-model="riderPhone"></phone-number-field>
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
    <div v-else-if="currentAccount != null && currentAccount.discriminator == 'business' && (userAccount.role == 'owner' || userAccount.role == 'admin')">
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
    <div v-else>
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

  </v-stepper>
</template>

<script>
  import DateField from '~/components/Estimator/DateField'
  import PlaceAutocompleteField from '~/components/Estimator/PlaceAutocompleteField'
  import TimeField from '~/components/Estimator/TimeField'
  import { mapGetters, mapActions } from 'vuex'
  import TripMoreInfo from "./Estimator/TripMoreInfo"
  import PhoneNumberField from '~/components/Fields/PhoneNumberField'

  export default {
    components: {
      TripMoreInfo,
      PlaceAutocompleteField,
      DateField,
      TimeField,
      PhoneNumberField
    },
    mounted() {
      this.stripeApiPublicKey = process.env.STRIPE_API_PUBLIC_KEY;
      this.user = this.$auth.user.id;
    },
    data () {
      return {
        stripeApiPublicKey: null,
        requestId: null,
        requestExpiresAt: null,
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
        selectedRoute: null,
      };
    },
    computed: {
      ...mapGetters({
        currentAccount: 'userAccount/account',
        userAccount: 'userAccount/currentAccount',
      }),
      isValidStep1 () {
        return this.pickupPlace !== null && this.destinationPlace !== null &&
            (this.pickupPlace.location.latitude != this.destinationPlace.location.latitude &&
                this.pickupPlace.location.longitude != this.destinationPlace.location.longitude);
      },
      isValidStep2 () {
        return (this.serviceType == 'asap' || (this.date !== null && this.time !== null));
      },
    },
    methods: {
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
            origin: this.pickupPlace.location.latitude + ',' + this.pickupPlace.location.longitude,
            destination: this.destinationPlace.location.latitude + ',' + this.destinationPlace.location.longitude,
            travelMode: google.maps.TravelMode['DRIVING'],
            optimizeWaypoints: true,
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
          request: this.requestId,
          user: this.user,
          rider: {
            name: this.riderName,
            phoneNumber: this.riderPhone
          },
          accountReferenceNumber: this.reference,
          notes: this.notes
        })

        /*this.addTrip({
          originLocation: this.pickupPlace.location,
          destinationLocation: this.destinationPlace.location,
          date: this.date && this.time ? `${this.date} ${this.time}` : null,
          notes: this.notes,
          serviceType: this.serviceType,
          user: this.user,
          embeddedRider: {name: this.riderName, phoneNumber: this.riderPhone},
          accountReferenceNumber: this.reference,
        })*/
      },

      async addTrip (trip) {
        const response = await this.$store.dispatch('addTripFromRequest', trip)
          .then(response => {
            this.handleNewTrip(response)
          })
          .catch(error => {
            this.currentStep = 2
            this.loading = false;
            this.showAddTripError(error.response !== undefined ? { message: error.response.data.message } : {})
          })
      },

      async handleNewTrip(response) {
        const data = response.data
        const paymentIntent = data.paymentIntent

        if (paymentIntent !== null && paymentIntent.status === 'requires_source_action') {
          let stripe = Stripe(this.stripeApiPublicKey)

          let result = await stripe.handleCardPayment(
            paymentIntent.clientSecret,
            {payment_method: paymentIntent.paymentMethodId}
          )

          if (result.error) {
            this.$router.push({ name: 'app-trips-id', params: {id: data.id} })
            this.showAddTripError({ message: result.error.message })
          } else {
            this.$router.push({ name: 'app-trips-id', params: {id: data.id} })
            this.showTripSuccess()
          }
        } else {
          this.$router.push({ name: 'app-trips-id', params: {id: data.id} })
          this.showTripSuccess()
        }
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
          account: this.currentAccount.id,
          origin: this.pickupPlace.location,
          destination: this.destinationPlace.location,
          startType: this.serviceType,
          date: this.date && this.time ? `${this.date} ${this.time}` : null
        })
      },

      async tripDetail (data) {
        this.$store.dispatch('tripRequest', data)
          .then(data => {
            this.requestId = data.data.id;
            this.requestExpiresAt = data.data.price.toFixed(2);
            this.price = data.data.price.toFixed(2);
          })
          .catch(error => {
            this.currentStep = 1
            //this.showTripDetailErrorMessage(error.response !== undefined ? { message: error.response.data.message } : {})
            this.showTripDetailErrorMessage({})
          })

        /*this.$store.dispatch('tripDetail', data)
          .then(data => {
            this.price = data.price.toFixed(2);
          })
          .catch(error => {
            this.currentStep = 1
            //this.showTripDetailErrorMessage(error.response !== undefined ? { message: error.response.data.message } : {})
            this.showTripDetailErrorMessage({})
          })*/
      },

      updateMoreInfo(data) {
          this.user = data.user;
          this.riderName = data.riderName
          this.riderPhone = data.riderPhone
      },

      setPickupPlace(event) {
          if (event.data && event.data.group == 'route') {
              this.pickupPlace = {description: event.data.originDescription, placeId: event.data.originPlaceId, location: event.data.location}
              this.selectedRoute = event.route;
          } else {
              this.pickupPlace = event.data;
          }
      },
      setDestinationPlace(event) {
          if (event.data) {
              this.destinationPlace = {description: event.data.description, placeId: event.data.placeId, location: event.data.location}
          } else {
              this.destinationPlace = event;
          }
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

