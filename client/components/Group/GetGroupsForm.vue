<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetGroupsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.groupsFilter};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/groups?groupName=${this.value}` : '/api/groups';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateGroupsFilter', this.value);
        this.$store.commit('updateGroups', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
