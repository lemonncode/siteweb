<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="time"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
  >
    <v-text-field slot="activator" v-model="time" label="Hora" prepend-icon="access_time" readonly></v-text-field>
    <v-time-picker v-model="time" format="24hr" scrollable @change="$refs.menu.save(time)" :allowed-hours="allowedHours"></v-time-picker>
  </v-menu>
</template>

<script>
  export default {
    props: ['value', 'date'],
    watch: {
      time (time) {
        this.$emit('timeUpdated', time);
      }
    },
    data () {
      return {
        time: this.value,
        menu: false
      };
    },
    methods: {
      allowedHours: (value) => {

        return true;
      },
    }
  }
</script>

