<template>
  <transition appear mode="out-in" name="scale">
    <router-view></router-view>
  </transition>
</template>
<script>
  const routes = ['/dashboard', '/monitoring', '/alarm', '/temp', '/configuration', '/permission'];
  export default {
    watch: {
      $route() {
        this.goPath();
      }
    },
    mounted() {
      this.goPath();
    },
    methods: {
      goPath() {
        let path = this.$route.path.replace(/\/$/, '');
        let isHas = routes.some(s => {
          return s === path;
        });
        if (!isHas) return;
        this.$router.push('/');
      }
    }
  };
</script>
