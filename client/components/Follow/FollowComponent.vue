<!-- Reusable component representing a single follower or followee -->

<template>
  <header>
    <router-link :to="'/users/' + follow">
      @{{follow}}
    </router-link>
  </header>
</template>

<script>

export default {
  name: 'FollowComponent',
  props: {
    follow: {
      type: String,
      required: true
    }
  },
};
</script>
