<template>
  <v-text-field 
    ref="input" 
    :prepend-icon="icon" 
    :value="this.value" 
    required
    :placeholder="placeholder"
  >
  </v-text-field>
</template>

<script>
  export default {
    props: ['placeholder', 'icon'],
    mounted () {
      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input.$el.querySelector('input'));
      //this.$autocomplete.setComponentRestrictions({'country': ['es']});

      this.$autocomplete.addListener('place_changed', () => {
        this.value = this.$autocomplete.getPlace().formatted_address;
        this.$emit('placeChanged', this.$autocomplete.getPlace())
      })
    },
    data () {
      return {
        value: null
      }
    }
  }
</script>
