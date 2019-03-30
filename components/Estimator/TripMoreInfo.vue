<template>
  <v-flex xs12 sm12 d-flex mb-1>
    <v-tabs
        text
    >
      <v-tab href="#tab-1" class="caption" @click="resetValues">
        Para mí
      </v-tab>

      <v-tab href="#tab-2" class="caption" @click="resetValues">
        Otro usuario
      </v-tab>

      <v-tab href="#tab-3" class="caption" @click="resetValues">
        Otro pasajero
      </v-tab>

      <v-tab-item
          v-for="number in 3"
          :value="'tab-' + number"
          :key="number"
      >
        <v-card flat v-if="number == 1">
        </v-card>
        <v-card flat v-if="number == 2">
          <v-flex xs12 sm12 d-flex mt-2>
            <v-select
                v-model="user"
                :items="usersAccount"
                item-text="user.full_name"
                item-value="user.id"
                label="Usuarios"
                @change="updateData"
            ></v-select>
          </v-flex>
        </v-card>
        <v-card flat v-if="number == 3">
          <v-flex xs12 sm12>
            <v-text-field
                v-model="riderName"
                type="text"
                label="Pasajero"
                @change="updateData"
            ></v-text-field>
            <v-text-field
                v-model="riderPhone"
                type="text"
                label="Teléfono del pasajero"
                @change="updateData"
            ></v-text-field>
          </v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-flex>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "TripMoreInfo",
        data () {
            return {
                riderName: null,
                riderPhone: null,
                user: null,
            }
        },
        computed: {
            ...mapGetters({
                usersAccount: 'account/currentUsersAccount',
            }),
        },
        methods: {
            updateData () {
                this.$emit('change', {riderName: this.riderName,  riderPhone: this.riderPhone, user: this.user})
            },

            resetValues () {
                this.riderName = null;
                this.riderPhone = null;
                this.user = null;
                this.updateData();
            }
        }
    }
</script>

<style scoped>

</style>