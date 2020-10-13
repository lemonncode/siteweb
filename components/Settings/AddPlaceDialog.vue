<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Añadir un favorito</span>
      </v-card-title>
      <v-card-text>
        <v-layout row>
          <v-flex xs12 sm6>
            <v-text-field
                v-model="name"
                label="Nombre"
                required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <place-autocomplete-field
                icon="trip_origin"
                placeholder="Favorito"
                display-geolocation-button
                @changed="setPlace($event)"
            ></place-autocomplete-field>
          </v-flex>
        </v-layout>
        <span class="red--text" v-if="errorMessage">{{errorMessage}}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" text @click.native="addPlace">Añadir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import PlaceAutocompleteField from '~/components/Estimator/PlaceAutocompleteField'

  export default {
    data () {
      return {
        name: '',
        place: '',
        errorMessage: null
      }
    },
    methods: {
      closeDialog() {
        this.$store.commit('accountPlace/closeAddPlaceDialog')
      },
      addPlace() {
        this.$store.dispatch('accountPlace/addPlace', {name: this.name, location: this.place.location})
            .then(data => {
                this.closeDialog();
                this.name = '';
                this.place = '';
                this.errorMessage = null;
                this.showAddPlaceSuccessMessage();
            })
            .catch(error => {
                this.errorMessage = error.response.data.errors.children.user.errors[0];
                this.showAddPlaceErrorMessage()
            })
      },
      setPlace(event) {
        this.place = event.data;
      },
    },
    computed: {
      dialog() {
        return this.$store.state.accountPlace.addPlaceDialog
      }
    },
    notifications: {
        showAddPlaceErrorMessage: {
          message: 'Favorito incorrecto, o no existe, o ya está en esta cuenta',
          type: 'error'
      },
        showAddPlaceSuccessMessage: {
          message: 'Favorito añadido correctamente',
          type: 'success'
      }
    },
    components: {
      PlaceAutocompleteField,
    }
  }
</script>
