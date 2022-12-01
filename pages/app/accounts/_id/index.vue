<template>
  <account></account>
</template>

<script>
  import Account from '~/components/Accounts/Account'
  import { mapActions } from 'vuex';

  export default {
    components: {
      Account,
    },
    created() {
        let _self = this;
        this.getUserAccount(this.$route.params.id).then( (data) => {
          _self.getUsers(data.account.id);
          _self.getDiscounts(data.account.id);
        });
    },
    methods: {
      ...mapActions({
          getUserAccount: 'userAccount/getUserAccount',
          getUsers: 'account/getUsers',
          getDiscounts: 'account/getDiscounts'
      }),
    },
  }
</script>
