<template>
  <v-stepper v-model="currentStep" vertical>
      <v-stepper-step :complete="currentStep > 1" step="1">Seleccione un trayecto</v-stepper-step>
      <v-stepper-content step="1">
        <place-autocomplete-field icon="trip_origin" placeholder="Elige un punto de partida" @placeChanged="setPickupPlace($event)"></place-autocomplete-field>
        <place-autocomplete-field icon="pin_drop" placeholder="Elige un destino" @placeChanged="setDestinationPlace($event)"></place-autocomplete-field>

        <v-alert :value="alert" type="error" transition="scale-transition">Trayecto inválido</v-alert>

        <v-btn color="primary" @click.native="handleRoute" :disabled="!isValidStep1">Continuar</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="currentStep > 2" step="2">Seleccione una fecha</v-stepper-step>
      <v-stepper-content step="2">        
        <date-field :value="date" @dateUpdated="date = $event"></date-field>
        <time-field :value="time" :date="date" @timeUpdated="time = $event"></time-field>
        <v-btn color="primary" @click="priceCalculator" @click.native="currentStep = 3" :disabled="!isValidStep2">Continuar</v-btn>
        <v-btn flat @click.native="currentStep = 1">Cancelar</v-btn>
      </v-stepper-content>
      <v-stepper-step step="3">Confirmar la reserva</v-stepper-step>
      <v-stepper-content step="3">
        <v-textarea v-model="notes" label="Comentario" outline></v-textarea>
          <v-card-title>El precio de la reserva es de {{ priceFormat(price) }} €</v-card-title>
          <v-btn color="primary" @click.native="complete">Reservar</v-btn>
          <v-btn flat @click.native="currentStep = 2">Cancelar</v-btn>
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
        console.log(place)
        this.pickupPlace = 'id' in place ? place : null;
      },
      setDestinationPlace (place) {
        console.log(place)
        this.destinationPlace = 'id' in place ? place : null;
      },
      cancelStep1 () {
        this.pickupPlace = this.destinationPlace = null;
      },
      priceFormat(value) {
        if (value) {
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
      },
      handleRoute () {
        var directionsService = new google.maps.DirectionsService;

        directionsService.route({
            origin: { placeId: this.pickupPlace.place_id },
            destination: { placeId: this.destinationPlace.place_id },
            travelMode: google.maps.TravelMode['DRIVING'],
            optimizeWaypoints: true,
            avoidTolls: true,
            avoidFerries: true,
            region: 'es',
            provideRouteAlternatives: true
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
        this.addTrip({
          origin: this.pickupPlace.place_id,
          destination: this.destinationPlace.place_id,
          date: `${this.date} ${this.time}`,
          notes: this.notes  
        })
      },
      
      async addTrip (trip) {
        try {
          let response = await this.$store.dispatch('addTrip', trip);
          this.showTripSuccess();
          this.$router.push({ name: 'app-trips-id', params: {id: response.id} })
        } catch(e) {
          this.showError();
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
                params: {
                    origin: this.pickupPlace.place_id,
                    destination: this.destinationPlace.place_id
                }
            })
        },

        async tripDetail (trip) {
            try {
                let response = await this.$store.dispatch('tripDetail', trip);
                this.price = response.price;
            } catch(e) {
                this.showError();
            }
        },
    },
    notifications: {
      showError: {
        message: 'Error de connexión',
        type: 'error' 
      },
      showTripSuccess: {
        message: 'Viaje privado añadido con éxito',
        type: 'success' 
      }
    }
  }
</script>

<style>
</style>

