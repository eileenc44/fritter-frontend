<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <div v-if="$store.state.username">
            <button v-if="!filterMenuOn" @click="menuToggle">
              Filter
            </button>
            <WordFilterMenu v-else @closeMenu="menuToggle"
              :getWordsToFilter="getWordsToFilter"
            />
          </div>
          <button v-if="followeeFeed" @click="feedToggle">
            Public Feed
          </button>
          <button v-else @click="feedToggle">
            Followee Feed
          </button>
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section
        v-if="followeeFeed && $store.getters.followeeFreets.length"
      >
        <FreetComponent
          v-for="freet in $store.getters.followeeFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <section
        v-else-if="!followeeFeed && $store.getters.publicFreets.length"
      >
        <FreetComponent
          v-for="freet in $store.getters.publicFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import WordFilterMenu from '@/components/WordFilter/WordFilterMenu.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, WordFilterMenu},
  data() {
    return {
      filterMenuOn: false,
      followeeFeed: true,
      alerts: {}
    }
  },
  methods: {
    menuToggle(event) {
      this.filterMenuOn = !this.filterMenuOn;
    },
    feedToggle(event) {
      this.followeeFeed = !this.followeeFeed;
    },
    async getWordsToFilter() {
      const url = '/api/wordFilter';
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateWordFilter', res.map(word => word.word));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  mounted() {
    this.$refs.getFreetsForm.submit();
    if (this.$store.state.username) {
      this.getWordsToFilter();
    }
    else {
      this.$store.commit('updateWordFilter', []);
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
