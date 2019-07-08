import menuTree from '@/components/system/role/menu';

export default {
  mounted() {

  },
  methods: {
    getRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allMenuList;
        if (noCache === false && menu && menu.data.length) {
          resolve(menu);
        } else {
          let res = {
            data: menuTree
          };
          this.$store.commit('initPermList', res);
          resolve(res);
          let getParentIds = (menus, parentsIds) => {
            menus.forEach(i => {
              if (i.children) {
                parentsIds.push(i.id);
                getParentIds(i.children, parentsIds);
              }
            });
          };
          let setParentIds = (menus) => {
            let parentIds = [];
            getParentIds(menus, parentIds);
            this.$store.commit('initMenuParentIds', parentIds);
          };
          setParentIds(res.data);
        }
      });
    }
  }
};
