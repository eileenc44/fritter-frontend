<template>
  <form @submit.prevent="submit">
    <button
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'FollowUnfollowButton',
  props: {
    title: String,
    url: String, // Url to submit form to
    method: String, // Form request method
    hasBody: Boolean, // Whether or not form request has a body
    fields: Object,
    alerts: Object, // Displays success/error messages encountered during form submission
    callback: Function // Function to run after successful form submission
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from props.
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(this.fields);
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>