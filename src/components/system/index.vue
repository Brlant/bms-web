<template>
  <transition appear mode="out-in" name="scale">
    <router-view></router-view>
  </transition>
</template>

<script>
  import {routes} from '../../routers';
  import {Access} from '@/resources';

  export default {
    data: function () {
      return {};
    },
    computed: {
      activeMould: function () {
        return this.$route.meta.moduleId;
      },
      firstMenu: function () {
        let menuArr = routes[0].children.filter(item => item.meta.moduleId === this.activeMould);
        let item = menuArr[0];
        item.subMenu = item.children.filter(child => child.meta.perm === 'show' || this.$store.state.permissions.includes(child.meta.perm));
        if (item.subMenu && item.subMenu.length > 0) {
          return item.subMenu[0];
        }
        return {};
      }
    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        if (!vm.firstMenu.path) return;
        let route = to.path === '/' + vm.activeMould ? vm.firstMenu : {path: to.path};
        if (to.meta.activePath) {
          vm.activePath = to.meta.activePath;
        } else {
          vm.activePath = route.path;
        }
        vm.go(route);
      });
    },
    beforeRouteUpdate(to, from, next) {
      let routePath = to.path;
      if (routePath === '/' + this.$route.meta.moduleId) {
        this.go(this.firstMenu);
      } else {
        next();
      }
    },
    methods: {
      go: function (item) {
        if (!item) return false;
        this.$router.push({path: item.path});
      }
    },
    mounted: function () {
      // Access.getRoleMenus().then(res => {
      //   let menuData = res.data;
      //   let menuList = {};
      //   res.data.menuList.forEach(item => {
      //     menuList[item.id] = item.name;
      //   });
      //   menuData.menuList = menuList;
      //   this.$store.commit('initPermList', menuData);
      // });
    }

  };
</script>


