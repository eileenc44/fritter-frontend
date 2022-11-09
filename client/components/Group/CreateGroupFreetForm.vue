<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupFreetForm',
  mixins: [BlockForm],
  props: {
    groupId: {
        type: String,
        required: true
    },
    refreshGroup: Function
  },
  data() {
    return {
      url: `/api/groups/${this.groupId}/addFreet`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      booleanFields: [
        {id: 'anonymous', label: 'Anonymous', value: false}
      ],
      title: 'Create a group freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a group freet!';
        this.refreshGroup();
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
