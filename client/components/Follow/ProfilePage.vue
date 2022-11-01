<!-- Page for user viewing followers and followees or for following and unfollowing other users -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header v-if="$store.state.username == $route.params.id">
        <h2>Your Followers</h2>
      </header>
      <header v-else>
        <h2>{{$route.params.id}}'s Followers</h2>
      </header>
      <FollowComponent
        v-for="follower in followers"
        :key="follower.id"
        :follow="follower.follower"
      />
      <header v-if="$store.state.username == $route.params.id">
        <h2>Your Followees</h2>
      </header>
      <header v-else>
        <h2>{{$route.params.id}}'s Followers</h2>
      </header>
      <FollowComponent
        v-for="followee in followees"
        :key="followee.id"
        :follow="followee.followee"
      />
    </section>
    <section>
      <header v-if="$store.state.username != $route.params.id">
        <button
          v-if="!isFollowing"
          type="submit"
        >
          Follow {{ $route.params.id }}
        </button>
        <button
          v-else
          type="submit"
        >
          Unfollow {{ $route.params.id }}
        </button>
      </header>
    </section>
  </main>
</template>

<script>
import FollowComponent from '@/components/Follow/FollowComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FollowComponent},
  data() {
    return {
      followers: [],
      followees: [],
      isFollowing: false
    };
  },
  methods: {
    async getFollowers() {
      const url = `/api/follow?followee=${this.$route.params.id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.followers = res;
        this.$store.commit('updateFollowers', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async getFollowees() {
      const url = `/api/follow?follower=${this.$route.params.id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.followees = res;
        this.findIfFollowing();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    findIfFollowing() {
      const result = this.followees.find(({ followee }) => followee === this.$store.state.username);
      this.isFollowing = result ? true : false;
    }
  },
  mounted() {
    this.getFollowers();
    this.getFollowees();
  }
};
</script>
  