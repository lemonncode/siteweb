<template>
  <v-card class="pb-5">
    <v-card-title>
      <h3 class="headline">Configuración</h3>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <user-settings></user-settings>
    </v-container>
  </v-card>
</template>

<script>
    import UserSettings from '~/components/Settings/User'

    export default {
        components: {
            UserSettings
        },
    }
</script>