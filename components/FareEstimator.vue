<template>
  <v-stepper v-model="currentStep" vertical>
      <v-stepper-step :complete="currentStep > 1" step="1">Seleccione un trayecto</v-stepper-step>
      <v-stepper-content step="1">
        <place-autocomplete-field icon="trip_origin" placeholder="Elige un punto de partida" @placeChanged="setPickupPlace($event)"></place-autocomplete-field>
        <place-autocomplete-field icon="pin_drop" placeholder="Elige un destino" @placeChanged="setDestinationPlace($event)"></place-autocomplete-field>

        <v-alert :value="alert" type="error" transition="scale-transition">Trayecto inválido</v-alert>

        <v-btn color="primary" @click.native="handleRoute" :disabled="!isValidStep1">Continue</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="currentStep > 2" step="2">Seleccione una fecha</v-stepper-step>
      <v-stepper-content step="2">        
        <date-field :value="date" @dateUpdated="date = $event"></date-field>
        <time-field :value="time" @timeUpdated="time = $event"></time-field>
        <v-btn color="primary" @click.native="currentStep = 3" :disabled="!isValidStep2">Continue</v-btn>
        <v-btn flat @click.native="currentStep = 1">Cancel</v-btn>
      </v-stepper-content>
      <v-stepper-step step="3">Confirmar la reserva</v-stepper-step>
      <v-stepper-content step="3">
        <v-textarea v-model="notes" label="Comentario" outline></v-textarea>
        <v-card>Precio {{ price }} €</v-card>
          <v-btn color="primary" @click.native="complete">Reservar</v-btn>
          <v-btn flat @click.native="currentStep = 2">Cancel</v-btn>
      </v-stepper-content>
  </v-stepper>
</template>

<script>
  import PlaceAutocompleteField from './PlaceAutocompleteField'
  import DateField from '~/components/Estimator/DateField'
  import TimeField from '~/components/Estimator/TimeField'

  export default {
    components: {
      PlaceAutocompleteField,
      DateField,
      TimeField,
    },
    data () {
      return {
        date: null,
        time: null,
        currentStep: 1,
        pickupPlaceAutocomplete: null,
        destinationPlaceAutocomplete: null,
        pickupPlace: null,
        destinationPlace: null,
        route: null,
        price: null,
        alert: false,
        notes: null,
      };
    },
    mounted () {
      /*this.pickupPlaceAutocomplete = new google.maps.places.Autocomplete(
        this.$refs.pickupAutocomplete.$el.querySelector('input'), 
        {types: ['geocode'] }
      );

      this.destinationPlaceAutocomplete = new google.maps.places.Autocomplete(
        this.$refs.destinationAutocomplete.$el.querySelector('input'), 
        {types: ['geocode']}
      );

      this.pickupPlaceAutocomplete.addListener('placeChanged', () => {
        console.log(this.pickupPlaceAutocomplete.getPlace());
        this.$emit('placeChanged', this.pickupPlaceAutocomplete.getPlace())
      })*/
    },
    computed: {
      isValidStep1 () {
        return this.pickupPlace !== null && this.destinationPlace !== null;
      },
      isValidStep2 () {
        return this.date !== null && this.time !== null;
      }
    },
    methods: {
      setPickupPlace (place) {
        this.pickupPlace = 'id' in place ? place : null;
      },
      setDestinationPlace (place) {
        this.destinationPlace = 'id' in place ? place : null;
      },
      cancelStep1 () {
        this.pickupPlace = this.destinationPlace = null;
      },
      handleRoute () {
        var directionsService = new google.maps.DirectionsService;

        directionsService.route({
          origin: this.pickupPlace.formatted_address,
          destination: this.destinationPlace.formatted_address,
          travelMode: google.maps.TravelMode['DRIVING'],
          optimizeWaypoints: true
          }, (response, status) => {
            if (response.status !== 'OK') {
              this.alert = true;
              return;
            }

            this.route = response.routes[0].legs[0];
            this.price = ((this.route.distance.value/1000) * 1.5).toFixed(2);
            this.currentStep = 2;

            this.$emit('fareEstimatorRouteSet', response);
          }
        );
      },
      complete () {        
        this.addTrip({
          origin: this.pickupPlace.formatted_address,
          destination: this.destinationPlace.formatted_address,
          departureTime: `${this.date}T${this.time}:00Z`,
          notes: this.notes  
        })
      },
      addTrip (trip) {
        this.$store.dispatch('addTrip', trip) 
          .then(response => {
            this.$store.commit('snackbar/setSnack', {
              message: 'El viaje ha sido reservado',
              color: 'success'
            })

            this.$router.push({ name: 'app-trips-id', params: {id: response.id} })
          })
          .catch(e => {
            // todo snack
          })
      }
    }
  }
</script>

<style>
</style>

