<template>
    <v-icon @click.stop="getGeolocation">gps_fixed</v-icon>
</template>

<script>
  export default {
    data () {
      return {
        place: null
      }
    },
    methods: {
      getGeolocation () {
        if (!navigator.geolocation) {
          return
        }

        navigator.geolocation.getCurrentPosition(position => {
          this.updateGooglePlace({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        })
      },
      updateGooglePlace (location) {
        let geocoder = new google.maps.Geocoder()

        geocoder.geocode({ 'location': location }, (results, status) => {
          if (status !== 'OK' || !results[0]) {
            return
          }

          this.place = results[0]
          this.$emit('geolocalized', this.place)
        })
      }
    }
  }
</script>
