<!-- Reusable component representing a single follower or followee -->

<template>
  <header>
    {{follow}}
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
