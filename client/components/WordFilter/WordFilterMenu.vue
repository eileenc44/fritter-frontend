<template>
  <main>
    <section class="popup">
      <div class="menu">
        <button @click="closeMenu" class="closeButton"> x </button>
        <AddWordForm :callback="getWordsToFilter"/>
        <section>
          <WordComponent 
            v-for="word in $store.state.wordFilter"
            :key="word.id"
            :word="word"
            :callback="getWordsToFilter"
          />
        </section>
      </div>
    </section>
  </main>
</template>

<script>
import AddWordForm from '@/components/WordFilter/AddWordForm.vue';
import WordComponent from '@/components/WordFilter/WordComponent.vue';

export default {
  name: 'WordFilterMenu',
  components: {AddWordForm, WordComponent},
  props: {
    getWordsToFilter: {
      type: Function,
      required: true
    }
  },
  methods: {
    closeMenu(event) {
      this.$emit('closeMenu', false);
    }
  }
};
</script>

<style>

.popup {
  position: absolute;
  z-index: 99;
  transform: translate(0%, -25%);
  width: 300px;
  text-align: center;
  border-color: black;
  border-style: solid;
  background-color: #fff;
}

.closeButton {
  width: 20px;
  margin: 5px;
  background-color: rgb(205, 10, 23);
}

.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2px;
}

</style>