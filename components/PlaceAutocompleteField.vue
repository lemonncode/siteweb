<template>
  <v-text-field 
    ref="input" 
    :prepend-icon="icon" 
    :value="this.value"
    required
    :placeholder="placeholder"
    :append-outer-icon="(icon == 'trip_origin') ? 'gps_fixed': ''"
    @click:append-outer="getGeoposition"
  >
  </v-text-field>
</template>

<script>
  export default {
    props: ['placeholder', 'icon'],
    mounted () {
      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input.$el.querySelector('input'));
      this.$autocomplete.setComponentRestrictions({'country': ['es']});

      this.$autocomplete.addListener('place_changed', () => {
        this.value = this.$autocomplete.getPlace().name;

        this.$emit('placeChanged', this.$autocomplete.getPlace())
      })
    },
    data () {
      return {
        value: null
      }
    },
    methods: {
        getGeoposition() {
            this.updateGeolocation ((geolocation) => {
                this.updateCoordinates(geolocation)
            })
        },

        updateCoordinates (value) {
            if (!value && !(value.lat || value.lng)) return;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': value}, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.value = results[0].formatted_address;
                        this.$emit('placeChanged', results[0])
                    } else {
                        this.showNoResultForGeolocation;
                    }
                } else {
                    this.showErrorForGeolocation;
                }
            })
        },

        updateGeolocation (callback = null) {
            if (navigator.geolocation) {
                let options = {};
                if(this.geolocationOptions) Object.assign(options, this.geolocationOptions);
                navigator.geolocation.getCurrentPosition(position => {
                    let geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    if (callback) callback(geolocation);
                }, err => {
                    this.showNavigatorError;
                }, options);
            }
        },
    },
  }
</script>
