<template>
    <v-tabs
      fixed-tabs
    >
      <v-tabs-slider color="#ed6363"></v-tabs-slider>

      <v-tab href="#tab-1" class="caption" @click="resetValues">
        Para mí
      </v-tab>

      <v-tab href="#tab-2" class="caption" @click="resetValues">
        Usuario
      </v-tab>

      <v-tab href="#tab-3" class="caption" @click="resetValues">
        Pasajero
      </v-tab>

      <v-tab-item
          v-for="number in 3"
          :value="'tab-' + number"
          :key="number"
      >
        <v-card text v-if="number == 1">
        </v-card>
        <v-card flat v-if="number == 2">

            <v-select
                v-model="user"
                :items="usersAccount"
                item-text="user.full_name"
                item-value="user.id"
                label="Usuarios"
                @change="updateData"
            ></v-select>
        </v-card>
        <v-card flat text v-if="number == 3">
          <v-flex xs12 sm12>
            <v-text-field
                v-model="riderName"
                type="text"
                label="Pasajero"
                @change="updateData"
            ></v-text-field>
            <phone-number-field v-model="riderPhone" @input="updateData"></phone-number-field>
          </v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import PhoneNumberField from '~/components/Fields/PhoneNumberField'

    export default {
        name: "TripMoreInfo",
        props: ['currentAccount'],
        created() {
          if (this.current_account.discriminator !== 'personal') {
            this.getCurrentUsers(this.current_account.account.id)
          }
        },
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
              current_account: 'userAccount/currentAccount'
            }),
        },
        watch: {
            currentAccount (val) {
                if (val) {
                    this.getCurrentUsers(val.id);
                }
            }
        },
        methods: {
            ...mapActions({
              getCurrentUsers: 'account/getCurrentUsers'
            }),
            updateData () {
                this.$emit('change', {riderName: this.riderName,  riderPhone: this.riderPhone, user: this.user})
            },

            resetValues () {
                this.riderName = null;
                this.riderPhone = null;
                this.user = null;
                this.updateData();
            }
        },
        components: {
          PhoneNumberField
        }
    }
</script>

<style scoped>

</style>
