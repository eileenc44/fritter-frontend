<!-- Form for creating freets (block style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [InlineForm],
  data() {
    return {
      value: "",
      url: '/api/groups',
      method: 'POST',
      hasBody: true,
      callback: () => {
        const message = 'Successfully created a group!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    async submit() {
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify({"name": this.value});
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshGroups');

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
