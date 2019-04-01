<template>
    <v-autocomplete
        v-if="currentAccount"
        v-model="value"
        :items="items"
        :loading="isLoadingPlaces || isLoadingPredictions"
        :search-input.sync="search"
        color="primary"
        hide-no-data
        no-filter
        item-text="description"
        item-value="placeId"
        :placeholder="placeholder"
        :prepend-icon="icon"
        return-object
        single-line
        clearable
        @change="change"
        :menu-props="{ 'allow-overflow': true }"
    >
      <template slot="item" slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-avatar :color="avatars[data.item.group]['color']" size="30">
            <v-icon small dark>{{ avatars[data.item.group]['icon'] }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-if="data.item.group == 'route'" v-html="data.item.displayDescription"></v-list-tile-title>
            <v-list-tile-title v-else v-html="data.item.description"></v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>
      <template slot="append" v-if="displayGeolocationButton">
        <geolocation-button @geolocalized="geolocalized($event)"></geolocation-button>
      </template>
    </v-autocomplete>
</template>

<script>
  import { mapGetters } from 'vuex';
  import GeolocationButton from './GeolocationButton'

  export default {
    props: {
      placeholder: String,
      icon: String,
      displayGeolocationButton: Boolean,
      displayRoutes: Boolean,
      displayPlaces: Boolean,
      selected: Object,
    },
    data () {
      return {
        value: null,
        geolocation: null,
        search: null,
        places: [],
        predictions: [],
        routes: [],
        isLoadingPlaces: false,
        isLoadingPredictions: false,
        isLoadingRoutes: false,
        avatars: {
          'location': { color: 'deep-orange darken-4', icon: 'near_me' },
          'favorite': { color: 'purple darken-3', icon: 'favorite' },
          'google': { color: 'light-blue darken-3', icon: 'place' },
          'route': { color: 'green darken-3', icon: 'map' },
        },
        routeSelected: null,
      };
    },
    mounted () {
      this.searchPlaces('');
      this.searchRoutes('');
    },
    computed: {
      ...mapGetters({
        currentAccount: 'userAccount/account',
      }),
      items () {
        var items = [];

        if (this.geolocation) {
          items.push({header: 'Ubicación actual'})
          items.push({ description: this.geolocation.description, placeId: this.geolocation.placeId, group: 'location' });
        }

        if (this.places.length && this.displayPlaces) {
          items.push({header: 'Favoritos'})

          this.places.forEach((place) => {
            items.push({ description: place.name, placeId: place.place.google_id, group: 'favorite' });
          })
        }

        if (this.routes.length && this.displayRoutes) {
          items.push({header: 'Rutas'})

          this.routes.forEach((route) => {
            items.push({ displayDescription: route.name,
              description: route.origin.autocomplete,
              originDescription: route.origin.autocomplete,
              originPlaceId: route.origin.google_id,
              destinationDescription: route.destination.autocomplete,
              destinationPlaceId: route.destination.google_id,
              group: 'route' });
          })
        }

        if (this.predictions.length) {
          items.push({ header: 'Sugerencias Google' });

          this.predictions.forEach((prediction) => {
            items.push({ description: prediction.description, placeId: prediction.place_id, group: 'google' });
          })
        }

        if (this.routeSelected) {
          if (this.displayRoutes) {
            items.push({ description: this.routeSelected.origin.description, placeId: this.routeSelected.origin.placeId, group: 'google' });
          } else {
            items.push({ description: this.routeSelected.destination.description, placeId: this.routeSelected.destination.placeId, group: 'google' });
          }
        }

        return items;
      },
    },
    watch: {
      currentAccount (val) {
        if (val) {
          this.searchPlaces('');
          this.searchRoutes('');
        }
      },
      search (val) {
        this.searchPlaces(val)
        this.searchPredictions(val)
        this.searchRoutes(val)
      },
      selected (val) {
        this.searchSelected(val)
      }
    },
    methods: {
      change () {
        if (this.value && this.value.group == 'route') this.setRouteSelected(this.value)
        this.$emit('changed', { data: this.value, route: this.routeSelected })
      },
      searchPlaces (val) {
        if (this.isLoadingPlaces) {
          return
        }

        this.isLoadingPlaces = true

        this.$axios.$get(`/accounts/${this.currentAccount.id}/places?query=${val}`).then(data => {
          this.places = data
          this.isLoadingPlaces = false
        })
      },
      searchPredictions (val) {
        if (this.isLoadingPredictions) {
          return
        }

        if (!val || val.length <= 3) {
          this.predictions = [];

          return;
        }

        this.isLoadingPredictions = true
        var service = new google.maps.places.AutocompleteService()

        service.getPredictions({ input: val, componentRestrictions: { country: 'es'} }, (predictions, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            this.predictions = predictions
          }

          this.isLoadingPredictions = false
        });
      },
      searchRoutes (val) {
        if (this.isLoadingRoutes) {
          return
        }

        this.isLoadingRoutes = true

        this.$axios.$get(`/accounts/${this.currentAccount.id}/routes?query=${val}`).then(data => {
          this.routes = data
          this.isLoadingRoutes = false
        })
      },
      searchSelected (val) {
        if (this.selected) {
          this.routeSelected = val;
          this.value = val.destination
            this.change()

        }
      },
      geolocalized (place) {
        this.geolocation = {
          description: place.formatted_address,
          placeId: place.place_id
        }

        this.value = this.geolocation
        this.change()
      },
      setRouteSelected (route) {
        let origin = {description: route.originDescription, placeId: route.originPlaceId};
        let destination = {description: route.destinationDescription, placeId: route.destinationPlaceId};
        this.routeSelected = {origin, destination};
      }
    },
    components: {
      GeolocationButton,
    },
  }
</script>