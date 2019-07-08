import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
  uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
  user: {},
  dict: {},
  permissions: [],
  allMenuList: {},
  roleList: {},
  attachmentDialog: {attachmentId: 0, open: false, attachmentList: []},
  dev: {},
  bodySize: {left: '200px'},
  setBodyHeight: 0,
  print: {
    isPrinting: false,
    text: '拼命打印中'
  },
  bodyHeight: 0,
  bottomLoading: false,
  menuParentIds: [], // 所有非叶子节点菜单
  requestingDictAry: []
};

const mutations = {
  initUser: function (state, data) {
    try {
      if (data && data.userId) {
        window.localStorage.setItem('user', JSON.stringify(data));
        state.user = data;
      }
    } catch (e) {

    }
  },
  initCode(state, orgCode) {
    try {
      if (orgCode) {
        window.localStorage.setItem('orgCode', JSON.stringify(orgCode));
        state.orgCode = orgCode;
      }
    } catch (e) {

    }
  },
  initDev(state, data) {
    state.dev = data;
  },
  initDict(state, data) {
    state.dict = data;
  },
  initPermissions(state, data) {
    state.permissions = data;
  },
  initPermList(state, data) {
    state.allMenuList = data;
  },
  changeAttachment(state, data) {
    let currentId;
    if (typeof data === 'object') {
      currentId = data.currentId;
      state.attachmentDialog.attachmentList = data.attachmentList;
    } else {
      currentId = data;
      state.attachmentDialog.attachmentList = [];
    }
    if (state.attachmentDialog.attachmentId === currentId) {
      state.attachmentDialog.open = true;
    } else {
      state.attachmentDialog.attachmentId = currentId;
    }
  },
  closeAttachmentDialog(state) {
    state.attachmentDialog.open = false;
  },
  setBodyHeight(state, data) {
    state.bodyHeight = data;
  },
  initPrint(state, data) {
    data.text = data.text || '拼命打印中';
    state.print = data;
  },
  initMenuParentIds(state, data) {
    state.menuParentIds = data;
  },
  initBottomLoading(state, data) {
    state.bottomLoading = data;
  },
  initRequestingDictAry(state, data) {
    state.requestingDictAry = data;
  },
};

export default new Vuex.Store({
  state,
  mutations
});
