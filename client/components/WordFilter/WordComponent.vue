<template>
  <main class="word">
    <section>
      - {{word}}
      <button @click="removeWord">
        Remove
      </button>
    </section>
  </main>
</template>

<script>

export default {
  name: 'WordComponent',
  props: {
    word: {
      type: String,
      required: true
    },
    alerts: Object,
    callback: Function
  },
  methods: {
    async removeWord() {
      const url = `/api/wordFilter/${this.word}`;
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
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

<style>

.word {
  padding: 5px 5px 5px;
}

</style>