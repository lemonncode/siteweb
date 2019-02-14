<template>
  <div style="width: 100%; height: 100%;" class="marco">
    <trip-map style="width: 100%; height: 100%;" v-show="$vuetify.breakpoint.mdAndUp" class="hidden-sm-and-down"></trip-map>
    <trip-map style="width: 100%; height: 60%;" v-show="$vuetify.breakpoint.smAndDown" class="hidden-md-and-up"></trip-map>
    <v-container v-show="$vuetify.breakpoint.smAndDown" class="hidden-md-and-up" slot="visible" :class="{'px-0': $vuetify.breakpoint.xsOnly }">
      <trip-summary style="padding: 0; width: 100%; height: 40%; position: absolute; bottom: 0;"></trip-summary>
    </v-container>
  </div>
</template>

<script>
  import TripSummary from '~/components/Trips/TripSummary'
  import TripMap from '~/components/Trips/TripMap'

  export default {
    components: {
      TripSummary,
      TripMap
    },

    async asyncData({app, params, error}) {
      if (app.store.$auth.user.current_account) {
        return app.$axios.$get(`/accounts/${app.store.$auth.user.current_account.id}/trips/${params.id}`).catch(e => {
            error({ statusCode: 404 })
        })
      }
    },
  }
</script>
