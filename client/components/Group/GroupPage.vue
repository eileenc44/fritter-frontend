<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <h2>Group {{ group.name }}</h2>
      <button v-if="!isUserInGroup" @click="joinGroup">
        Join Group
      </button>
      <button v-else @click="leaveGroup">
        Leave Group
      </button>
    </header>
    <CreateGroupFreetForm v-if="isUserInGroup"
      :groupId="$route.params.id"
      :refreshGroup="getGroupInfo"
    />
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets in {{group.name}}
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <button v-if="!filterMenuOn" @click="menuToggle">
            Filter
          </button>
          <WordFilterMenu v-else @closeMenu="menuToggle"
            :getWordsToFilter="getWordsToFilter"
          />
        </div>
      </header>
      <section
        v-if="freets.length"
      >
        <FreetComponent
          v-for="freet in freets"
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
import CreateGroupFreetForm from '@/components/Group/CreateGroupFreetForm.vue';
import WordFilterMenu from '@/components/WordFilter/WordFilterMenu.vue';

export default {
  name: 'GroupPage',
  components: {FreetComponent, CreateGroupFreetForm, WordFilterMenu},
  data() {
    return {
      group: {},
      freets: [],
      filterMenuOn: false,
      alerts: {},
      isUserInGroup: false
    }
  },
  methods: {
    menuToggle(event) {
      this.filterMenuOn = !this.filterMenuOn;
    },
    async getGroupInfo() {
      const url = '/api/groups?groupId=' + this.$route.params.id;
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
        this.group = res;
        this.freets = this.group.freets.map(freet => {
          freet.author = freet.authorId.username;
          return freet;
        });
        this.isUserInGroup = this.group.members.includes(this.$store.state.username);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async joinGroup() {
      const url = `/api/groups/${this.$route.params.id}/join`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getGroupInfo();
        this.isUserInGroup = true;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async leaveGroup() {
      const url = `/api/groups/${this.$route.params.id}/leave`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getGroupInfo();
        this.isUserInGroup = true;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
    this.getGroupInfo();
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
