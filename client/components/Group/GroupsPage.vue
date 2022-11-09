<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2> Fritter Groups </h2>
      </header>
      <header>
        <h3> Create a Group</h3>
      </header>
      <CreateGroupForm 
        value="name"
        placeholder="Group Name"
        button="Create Group"
      />
    </section>
    <section>
      <header>
        <div class="left">
          <h4>
            Viewing all groups
            <span v-if="$store.state.groupsFilter">
              with name: {{ $store.state.groupsFilter }}
            </span>
          </h4>
        </div>
        <div class="right">
          <GetGroupsForm
            ref="getGroupsForm"
            value="name"
            placeholder="🔍 Filter by name (optional)"
            button="🔄 Get groups"
          />
        </div>
      </header>
      <section
        v-if="$store.state.groups.length"
      >
        <GroupComponent
          v-for="group in $store.state.groups"
          :key="group.id"
          :group="group"
        />
      </section>
      <article
        v-else
      >
        <h3>No groups found.</h3>
      </article>
    </section>
  </main>
</template>
  
<script>
import CreateGroupForm from '@/components/Group/CreateGroupForm.vue';
import GetGroupsForm from '@/components/Group/GetGroupsForm.vue';
import GroupComponent from '@/components/Group/GroupComponent.vue';

export default {
  name: 'GroupsPage',
  components: {GetGroupsForm, CreateGroupForm, GroupComponent},
  data() {
    return {
      filterMenuOn: false
    }
  },
  mounted() {
    this.$refs.getGroupsForm.submit();
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
