<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'AddWordForm',
  mixins: [InlineForm],
  props: {
    callback: Function
  },
  data() {
    return {value: ""};
  },
  methods: {
    async submit() {
      const url = '/api/wordFilter';
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({word: this.value})
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
