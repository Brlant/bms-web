import {Access} from '@/resources.js';

/**
 * 得到登录用户权限，放到vuex，并给当前vue实例添加一个属性,存储用户权限
 * @param vm
 * @param property
 */
export function getRoleMenus(vm, property) {
  let menu = vm.$store.state.allMenuList;
  if (menu && menu.length) {
    vm[property] = menu;
    return;
  }
  Access.getRoleMenus().then(res => {
    vm.$store.commit('initPermList', JSON.parse(JSON.stringify(res.data)));
    setParentIds(vm, res.data);
    vm[property] = res.data;
  });
}

/**
 * 把所有父节点,放进vuex
 * @param vm
 * @param menus
 */
function setParentIds(vm, menus) {
  let parentIds = [];
  getParentIds(menus, parentIds);
  vm.$store.commit('initMenuParentIds', parentIds);
}

/**
 * 得到父节点
 * @param menus
 * @param parentsIds
 */
function getParentIds(menus, parentsIds) {
  menus.forEach(i => {
    if (i.children) {
      parentsIds.push(i.id);
      getParentIds(i.children, parentsIds);
    }
  });
}

