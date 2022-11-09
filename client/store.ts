import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    followers: [], // All of the user's followers
    followees: [], // All of the user's followees
    wordFilter: [], // All words to filter
    groupsFilter: null,
    groups: [],
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateGroupsFilter(state, groupsFilter) {
      state.groupsFilter = groupsFilter;
    },
    updateGroups(state, groups) {
      state.groups = groups;
    },
    async refreshGroups(state) {
      const url = state.groupsFilter ? `/api/groups/groupName=${state.groupsFilter}` : '/api/groups';
      const res = await fetch(url).then(async r => r.json());
      state.groups = res;
    },
    updateFollowers(state, followers) {
      state.followers = followers;
    },
    updateFollowees(state, followees) {
      state.followees = followees;
    },
    updateWordFilter(state, wordFilter) {
      state.wordFilter = wordFilter;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
