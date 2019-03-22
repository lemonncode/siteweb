<template>
  <div>
    <v-autocomplete
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
        append=false
        @change="change"
        v-if="currentAccount"
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
            <v-list-tile-title v-html="data.item.description"></v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>
      <template slot="append" v-if="displayGeolocationButton">
        <geolocation-button @geolocalized="geolocalized($event)"></geolocation-button>
      </template>
    </v-autocomplete>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import GeolocationButton from './GeolocationButton'

  export default {
    props: {
      placeholder: String,
      icon: String,
      displayGeolocationButton: Boolean
    },
    data () {
      return {
        value: null,
        geolocation: null,
        search: null,
        places: [],
        predictions: [],
        isLoadingPlaces: false,
        isLoadingPredictions: false,
        avatars: {
          'location': { color: 'deep-orange darken-4', icon: 'near_me' },
          'favorite': { color: 'purple darken-3', icon: 'favorite' },
          'google': { color: 'light-blue darken-3', icon: 'place' }
        }
      };
    },
    computed: {
      ...mapGetters({
        currentAccount: 'userAccount/currentAccount',
      }),
      items () {
        var items = [];

        if (this.geolocation) {
          items.push({header: 'Ubicación actual'})
          items.push({ description: this.geolocation.description, placeId: this.geolocation.placeId, group: 'location' });
        }

        if (this.places.length) {
          items.push({header: 'Favoritos'})

          this.places.forEach((place) => {
            items.push({ description: place.name, placeId: place.place.google_id, group: 'favorite' });
          })
        }

        if (this.predictions.length) {
          items.push({ header: 'Sugerencias Google' });

          this.predictions.forEach((prediction) => {
            items.push({ description: prediction.description, placeId: prediction.place_id, group: 'google' });
          })
        }

        return items;
      },
    },
    watch: {
      currentAccount (val) {
        if (val) {
          this.searchPlaces('');
        }
      },
      search (val) {
        this.searchPlaces(val)
        this.searchPredictions(val)
      }
    },
    methods: {
      change () {
        this.$emit('changed', this.value)
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
      geolocalized (place) {
        this.geolocation = {
          description: place.formatted_address,
          placeId: place.place_id
        }

        this.value = this.geolocation
      }
    },
    components: {
      GeolocationButton,
    },
  }
</script>