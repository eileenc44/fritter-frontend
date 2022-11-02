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
        v-for="follower in $store.state.followers"
        :key="follower.id"
        :follow="follower.follower"
      />
      <header v-if="$store.state.username == $route.params.id">
        <h2>Your Followees</h2>
      </header>
      <header v-else>
        <h2>{{$route.params.id}}'s Followees</h2>
      </header>
      <FollowComponent
        v-for="followee in $store.state.followees"
        :key="followee.id"
        :follow="followee.followee"
      />
    </section>
    <section>
      <header v-if="$store.state.username != $route.params.id">
        <FollowUnfollowButton v-if="!isFollowing"
          :title="'Follow'"
          :url="'/api/follow'"
          :method="'POST'"
          :hasBody="true"
          :fields="{'followeeName': $route.params.id}"
          :alerts={}
          :callback="getFollowers"
        />
        <FollowUnfollowButton v-else
          :title="'Unfollow'"
          :url="'/api/follow/' + $route.params.id"
          :method="'DELETE'"
          :hasBody="false"
          :alerts={}
          :callback="getFollowers"
        />
      </header>
    </section>
  </main>
</template>

<script>
import FollowComponent from '@/components/Follow/FollowComponent.vue';
import FollowUnfollowButton from '@/components/Follow/FollowUnfollowButton.vue';

export default {
  name: 'ProfilePage',
  components: {FollowComponent, FollowUnfollowButton},
  data() {
    return {
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

        this.$store.commit('updateFollowers', res);
        this.findIfFollowing();
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

        this.$store.commit('updateFollowees', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    findIfFollowing() {
      const result = this.$store.state.followers.find(({ follower }) => follower === this.$store.state.username);
      this.isFollowing = result ? true : false;
    }
  },
  mounted() {
    this.getFollowers();
    this.getFollowees();
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.getFollowers();
        this.getFollowees();
      }
    )
  }
};
</script>
  