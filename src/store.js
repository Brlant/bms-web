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
  requestingDictAry: [],
  costTypes: [
    {
      id: '0',
      name: '订单处理',
      bizTypes: [],
      ladderState: false,
      items: [
        {name: '订单总单处理', id: 'A1', unit: '元/张', rule: '订单总单数量 X 计费单价', bind: false},
        {name: '订单细单处理', id: 'A2', unit: '元/条', rule: '订单细单数量 X 计费单价', bind: true}
      ]
    },
    {
      id: '1',
      name: '入库作业',
      ladderState: false,
      bizTypes: [
        {name: '采购入库', id: '1-0'},
        {name: '销退入库', id: '1-1'},
        {name: '调拨入库', id: '1-3'},
      ],
      items: [
        {name: '整件入库货品体积', id: 'A3', unit: '元/m³', rule: '每个品种的体积总数 X 计费单价', bind: true},
        {name: '整件入库整件数量', id: 'A4', unit: '元/箱', rule: '每个品种的整件总数 X 计费单价', bind: true},
        {name: '整件入库基本单位数', id: 'A14', unit: '元/基本单位', rule: '每个品种的基本单位总数 X 计费单价', bind: true},
        {name: '散件入库基本单位数', id: 'A5', unit: '元/基本单位', rule: '每个品种的基本单位总数 X 计费单价', bind: true}
      ]
    },
    {
      id: '2',
      name: '出库作业',
      ladderState: false,
      bizTypes: [
        {name: '销售出库', id: '2-0'},
        {name: '调拨出库', id: '2-3'},
        {name: '采退出库', id: '2-1'},
      ],
      items: [
        {name: '整件出库货品体积', id: 'A6', unit: '元/m³', rule: '每个品种的体积总数 X 计费单价', bind: true},
        {name: '整件出库整件数量', id: 'A7', unit: '元/箱', rule: '每个品种的整件总数 X 计费单价', bind: true},
        {name: '整件出库基本单位数', id: 'A15', unit: '元/基本单位', rule: '每个品种的基本单位总数 X 计费单价', bind: true},
        {name: '散件出库基本单位数', id: 'A8', unit: '元/基本单位', rule: '每个品种的基本单位总数 X 计费单价', bind: true},
        {name: '散件出库周转（包装）箱数', id: 'A9', unit: '元/箱', rule: '每个品种的整件总数 X 计费单价', bind: false}
      ]
    },
    {
      id: '3',
      name: '库内作业',
      ladderState: false,
      bizTypes: [
        {name: '扫码复核', id: '0', itemId: 'A10'},
        {name: '拆零作业', id: '1', itemId: 'A11'},
      ],
      items: [
        {name: '扫码复核费', id: 'A10', unit: '元/个', rule: '每个品种的码总数 X 计费单价', bind: true},
        {name: '拆零作业', id: 'A11', unit: '元/箱', rule: '每个品种的整件总数 X 计费单价', bind: true},
      ]
    },
    {
      id: '4',
      name: '耗材使用',
      ladderState: false,
      bizTypes: [
        {name: '保温箱', id: '0', itemId: 'A12'},
        {name: '温度计', id: '1', itemId: 'A13'},
      ],
      items: [
        {name: '保温箱', id: 'A12', unit: '元/个', rule: '保温箱总数 X 计费单价', bind: false},
        {name: '温度计', id: 'A13', unit: '元/个', rule: '温度计使用总数 X 计费单价', bind: false},
      ]
    },
    {
      id: '5',
      name: '库内存储',
      ladderState: true,
      bizTypes: [
        {name: '合格', id: '0'},
        {name: '不合格', id: '1'},
      ],
      items: [
        {name: '存储整件货位数', id: 'B1', unit: '元/个', rule: '每个品种的整件货位总数 X 计费单价', bind: true},
        {name: '存储整件货位体积', id: 'B2', unit: '元/m³', rule: '每个品种的整件体积 X 计费单价', bind: true},
        {name: '存储整件包装数', id: 'B3', unit: '元/箱', rule: '每个品种的整件包装数 X 计费单价', bind: true},
        {name: '存储散件货位数', id: 'B4', unit: '元/个', rule: '每个品种的散件货位总数 X 计费单价', bind: true},
        {name: '存储散件货位体积', id: 'B5', unit: '元/m³', rule: '每个品种的散件体积 X 计费单价', bind: true}
      ]
    }
  ],
  invoiceTypes: [
    {key: '0', label: '增值税普通发票'},
    {key: '1', label: '增值税专用发票'},
    {key: '2', label: '增值税电子普通发票'}
  ],
  closeTypes: [
    {key: '0', label: '电汇'},
    {key: '1', label: '支票'},
    {key: '2', label: '现金'}
  ],
  billItemList: []
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
  initBillItemList(state, data) {
    state.billItemList = data;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
