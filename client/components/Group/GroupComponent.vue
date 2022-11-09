<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="group"
  >
    <header>
      <textarea
          v-if="editing"
          class="name"
          :value="draft"
          @input="draft = $event.target.value"
      />
      <h3 v-else>
        <router-link :to="'/groups/' + group._id">
          {{ group.name }}
        </router-link>
      </h3>
      <p>
        <router-link :to="'/users/' + group.creator">
          @{{ group.creator }}
        </router-link>
      </p>
      <div
        v-if="$store.state.username === group.creator"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteGroup">
          🗑️ Delete
        </button>
      </div>
    </header>
    <p class="info">
      Posted at {{ group.dateModified }}
      <i v-if="group.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'GroupComponent',
  props: {
    // Data from the stored freet
    group: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      editing: false,
      draft: this.group.name,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      this.editing = true; 
      this.draft = this.group.name;
    },
    stopEditing() {
      this.editing = false;
      this.draft = this.group.name;
    },
    deleteGroup() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted group!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      if (this.group.name === this.draft) {
        const error = 'Error: Edited group name should be different than current group content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited group!',
        body: JSON.stringify({name: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the groups's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/groups/${this.group._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshGroups');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.group {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

</style>
  