<template>
  <v-snackbar 
    v-model="show"
    :color="color"
    :bottom="true"
    :left="true"
  >
    {{ message }}
    <v-btn flat color="white" @click.native="show = false">Cerrar</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
    }
  },
  created: function () {
    this.$store.watch(state => state.snackbar.snack, () => {
      console.log('COMMIT')
      console.log(this.$store.state.snackbar.snack.message)
      if (this.$store.state.snackbar.snack.message !== '') {
        this.show = true
        console.log(this.show)
        const { message, color } = this.$store.state.snackbar.snack
        this.message = message
        this.color = color

        /*this.$store.dispatch('snackbar/setSnack', {
          message: '',
          color: ''
        })*/
      }
    })
  }
}
</script>