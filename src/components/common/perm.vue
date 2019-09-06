<template>
  <span v-if="isShow" class="perm">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'perm',

    props: ['label'],

    data() {
      return {};
    },
    computed: {
      isShow: function () {
        if (this.label === 'show') return true;
        return this.$store.state.permissions.indexOf(this.label) !== -1;
      }
    }
  };
</script>
