<template>
  <vue-recaptcha
      @verify="onVerify"
      sitekey="6Lf-LIwUAAAAAAnh9gTNEEUV1VaCJkwLmChSUetg">
  </vue-recaptcha>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha';
    import { mapActions } from 'vuex';

    export default {
        name: "Captcha",
        components: {
            VueRecaptcha
        },
        mounted () {
            // render the recaptcha widget when the component is mounted
            this.render()
        },
        methods: {
            ...mapActions({
                setValidated: 'user/refreshCaptcha'
            }),
            onVerify: function () {
                this.setValidated(true);
            },
            render: function () {
                this.setValidated(true);
            }
        },
    }
</script>