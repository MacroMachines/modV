<template>
  <div>
    <context-menu
      v-for="menu, idx in activeMenus"
      :options="menu"
      :key="idx"
    ></context-menu>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Menu from './Menu';

  export default {
    name: 'contextMenuHandler',
    data() {
      return {
        offsetWidth: 0,
        offsetHeight: 0,
      };
    },
    computed: {
      ...mapGetters('contextMenu', [
        'activeMenus',
      ]),
    },
    components: {
      contextMenu: Menu,
    },
  };
</script>

<style scoped lang='scss'>

</style>
