import Notification from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';
import WholeErrorSignHandle from '@/tools/whole-error-sign-handle';

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});

function isNewReturnType(data) {
  let keys = Object.keys(data);
  if (keys.length !== 3) return false;
  return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

http.interceptors.response.use(response => {
  if (isNewReturnType(response.data)) {
    switch (response.data.code) {
      case 200 :
        return response;
      case 401:
        window.location.href = '#/login';
        return Promise.reject({response});
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        return Promise.reject({response});
      case 400:
        return Promise.reject({response});
      default:
        return Promise.reject({response});
    }
  } else {
    return response;
  }
}, error => {
  // 清空标志
  WholeErrorSignHandle.clear();

  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  if (notice === '1' && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }
  if (!response || response.status === 500) {
    Notification.warning({
      message: '服务器太久没有响应, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
    return Promise.reject(error);
  }
  if (response.status === 401) { //  Unauthorized, redirect to login
    let lastUrl = window.localStorage.getItem('lastUrl');
    if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
    }
    window.location.href = '#/login';
    return Promise.reject(error);
  }
  if (response.status === 403) {
    Notification.error({
      message: '您没有权限请求信息，请联系管理员。',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
  }

  if (response.status === 502) {
    Notification.error({
      message: '系统请求失败',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http;

// 合同绑定货品
export const contractBindGoods = resource('', http, {
  save(obj) {
    return http.post('/bms-cgbm/add', obj);
  },
  query(obj) {
    return http.post('/bms-cgbm/query', obj);
  }
});

// 合同关联计费模型
export const contractCostModel = resource('/bms-cbmi', http, {
  save(obj) {
    return http.post('/bms-cbmi/add', obj);
  },
  update(obj) {
    return http.put('/bms-cbmi/edit', obj);
  },
  query(obj) {
    return http.post('/bms-cbmi/query/page', obj);
  },
  queryDetail(obj) {
    return http.post(`/bms-cbmi/query/${obj.contractBillingModelId}`);
  }
});


// 计费项
export const costItem = resource('/bms-billing-item/add-billing-item', http, {
  save(obj) {
    return http.post('/bms-billing-item/add-billing-item', obj);
  },
  queryStateNum: (params) => {
    return http.post('/bms-billing-item/count', params);
  },
  start(obj) {
    return http.put('/bms-billing-item/enable-billing-item', obj);
  },
  stop(obj) {
    return http.put('/bms-billing-item/disable-billing-item', obj);
  },
  update(obj) {
    return http.put('/bms-billing-item/edit-billing-item', obj);
  },
  query(obj) {
    return http.post('/bms-billing-item/query-billing-item/page', obj);
  }

});

// 计费模型
export const costModel = resource('/bms-bm', http, {
  save(obj) {
    return http.post('/bms-bm/add', obj);
  },
  queryStateNum: (params) => {
    return http.post('/bms-bm/count', params);
  },
  start(obj) {
    return http.put('/bms-bm/enable', obj);
  },
  stop(obj) {
    return http.put('/bms-bm/disable', obj);
  },
  update(obj) {
    return http.put('/bms-bm/edit', obj);
  },
  query(obj) {
    return http.post('/bms-bm/query-billing-model/page', obj);
  },
  queryDetail(obj) {
    return http.post('/bms-bm/query/info', obj);
  }
});

// 合同信息
export const Contact = resource('/bms-contract', http, {
  save(obj) {
    return http.post('/bms-contract/add-contract', obj);
  },
  queryStateNum: (params) => {
    return http.post('/bms-contract/count', params);
  },
  start(obj) {
    return http.put('/bms-contract/enable-contract', obj);
  },
  stop(obj) {
    return http.put('/bms-contract/disable-contract', obj);
  },
  update(obj) {
    return http.put('/bms-contract/edit-contract', obj);
  },
  query(obj) {
    return http.post('/bms-contract/query-contract/page', obj);
  }
});

// 项目信息
export const project = resource('/bms-project', http, {
  save(obj) {
    return http.post('/bms-project/add-project', obj);
  },
  queryStateNum: (params) => {
    return http.post('/bms-project/count', params);
  },
  start(obj) {
    return http.put('/bms-project/enable-project', obj);
  },
  stop(obj) {
    return http.put('/bms-project/disable-project', obj);
  },
  update(obj) {
    return http.put('/bms-project/edit-project', obj);
  },
  query(obj) {
    return http.post('/bms-project/query-project/page', obj);
  }
});

// 账户流水明细
export const AccountTurnover = resource('/bms-otd/add-org-turnover-details', http, {
  query(obj) {
    return http.post('/bms-otd/query-org-turnover-details/page', obj);
  }
});

// 单位资金账户
export const capitalAccount = resource('/bms-oa', http, {
  save(obj) {
    return http.post('/bms-oa/add-org-account', obj);
  },
  query(obj) {
    return http.post('/bms-oa/query-org-account/page', obj);
  },
  delete(key) {
    return http.delete(`/bms-oa/del-org-account/${key}`);
  },
  update(obj) {
    return http.put('/bms-oa/edit-org-account', obj);
  }
});

// 货主随货通行单模板
export const FollowSheet = resource('/followCargoSheet', http, {
  stop(id) {
    return http.put(`/followCargoSheet/${id}/forbid`);
  },
  start(id) {
    return http.put(`/followCargoSheet/${id}/start`);
  },
  queryStateNum(params) {
    return http.get('/followCargoSheet/count', {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
  }

});

// OmsStock对象
export const batchNumber = resource('/batch-number', http, {});

// OmsStock对象
export const OmsStock = resource('/stock-batch', http, {
  queryBatches: (id, params) => {
    return http.get(`/stock-batch/org/${id}`, {params});
  }
});

// 证照对象
export const orgLicence = resource('/order-licence', http, {
  queryPager: (params) => {
    return http.get('/order-licence/page', {params});
  },
  queryStateNum: (params) => {
    return http.get('/order-licence/count', {params});
  }
});

// 对象字段编号记录对象
export const pojoLog = resource('/pojo-log', http, {
  queryPojoLog: (objId, objType) => {
    return http.get('/pojo-log/type/' + objType + '/id/' + objId, {});
  }
});

// 合同对象
export const Contract = resource('/contract', http, {
  forbid: (id) => {
    return http.put('/contract/' + id + '/forbid', {});
  },
  start: (id) => {
    return http.put('/contract/' + id + '/start', {});
  },
  check: (id, obj) => {
    return http.put('/contract/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/contract/count', {params});
  }
});

// 合同对象
export const RefuseOrderInfo = resource('/order-refuse', http, {});

// 单位合同对象
export const CusContract = resource('/cusContract', http, {
  queryPager: (orgId, params) => {
    return http.get('/cusContract/' + orgId, {params});
  },
  forbid: (id) => {
    return http.put('/cusContract/' + id + '/forbid', {});
  },
  start: (id) => {
    return http.put('/cusContract/' + id + '/start', {});
  },
  check: (id, obj) => {
    return http.put('/cusContract/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/cusContract/count', {params});
  }
});

// 单位银行对象
export const CusBankInfo = resource('/cusBankInfo', http, {
  queryList: (orgId, params) => {
    return http.get('/cusBankInfo/' + orgId, {params});
  },
  check: (id, obj) => {
    return http.put('/cusBankInfo/' + id + '/check', obj);
  },
  auditInfo: (id, obj) => {
    return http.put('/cusBankInfo/orgs/' + id + '/check', obj);
  },
  forbid: (id) => {
    return http.put('/cusBankInfo/' + id + '/forbid', {});
  },
  start: (id) => {
    return http.put('/cusBankInfo/' + id + '/start', {});
  },
  queryStateNum: (params) => {
    return http.get('/cusBankInfo/count', {params});
  }
});

// 物流中心对象
export const LogisticsCenter = resource('/logisticsCenter', http, {
  start: (id) => {
    return http.put('/logisticsCenter/' + id + '/start', {});
  },
  forbid: (id) => {
    return http.put('/logisticsCenter/' + id + '/forbid', {});
  },
  queryStateNum: (params) => {
    return http.get('/logisticsCenter/count', {params});
  }
});

// 计费项目对象
export const CostItem = resource('/costItem', http, {});

// 质量异常类型对象
export const QualityExceptionType = resource('/qualityExceptionType', http, {
  start: (id) => {
    return http.put('/qualityExceptionType/' + id + '/start', {});
  },
  forbid: (id) => {
    return http.put('/qualityExceptionType/' + id + '/forbid', {});
  },
  queryStateNum: (params) => {
    return http.get('/qualityExceptionType/count', {params});
  },
  querylinkException: function (params) {
    return http.get('/qualityExceptionType/link', {params});
  }
});

// 质检方案
export const QualityProgramme = resource('/qualityProgramme', http, {
  getList: (orgId, params) => {
    return http.get('/qualityProgramme/' + orgId, {params});
  },
  getRow: (id => {
    return http.get('/qualityProgramme/detail', {
      params: {
        id: id
      }
    });
  }),
  start: (id, obj) => {
    return http.put('/qualityProgramme/' + id + '/start', obj);
  },
  forbid: (id) => {
    return http.put('/qualityProgramme/' + id + '/forbid', {});
  },
  queryStateNum: (params) => {
    return http.get('/qualityProgramme/count', {params});
  }
});

// 质检方案对象
export const QualityItem = resource('/qualityItem', http, {
  queryList: () => {
    return http.get('/qualityItem/list', {
      params: {deleteFlag: false, status: '1'}
    });
  },
  start: (id) => {
    return http.put('/qualityItem/' + id + '/start', {});
  },
  forbid: (id) => {
    return http.put('/qualityItem/' + id + '/forbid', {});
  },
  queryStateNum: (params) => {
    return http.get('/qualityItem/count', {params});
  }
});

// 部门对象
export const Department = resource('/department', http, {
  getPage: (params) => {
    return http.get('/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('/department/members', {params});
  },
  queryStateNum: (params) => {
    return http.get('/department/member/count', {params});
  }
});

// 受控法规对象
export const ControlledLegislation = resource('/controlledLegislation', http, {
  start: (id) => {
    return http.put('/controlledLegislation/' + id + '/start', {});
  },
  forbid: (id) => {
    return http.put('/controlledLegislation/' + id + '/forbid', {});
  },
  queryStateNum: (params) => {
    return http.get('/controlledLegislation/count', {params});
  }
});

// 设备资料对象
export const Dev = resource('/oms-dev', http, {});

// 数据字典组对象
export const DictGroup = resource('/dictGroup', http, {
  checkGroupName: (groupName, groupId) => {
    return http.get('/dictGroup/name', {
      params: {groupName: groupName, groupId: groupId}
    });
  },
  checkItemKey: (key, itemId, groupId) => {
    return http.get('/dictItem/key', {
      params: {key: key, itemId: itemId, groupId: groupId}
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      http.get('/dictGroups').then(res => {
        let data = {};
        let groupItem;
        let item;
        for (let i = 0, len = res.data.length; i < len; i++) {
          groupItem = res.data[i];
          data[groupItem.group.name] = [];
          for (let j = 0, len1 = groupItem.items.length; j < len1; j++) {
            item = groupItem.items[j];
            data[groupItem.group.name].push({key: item.key, label: item.label});
          }
        }
        resolve(data);
      });
    });
  }
});

// 财务信息对象
export const Finance = resource('/org-finance', http, {
  queryInfo: (orgId) => {
    return http.get('/org-finance/orgs/' + orgId, {});
  },
  check: (id, obj) => {
    return http.put('/org-finance/' + id + '/check', obj);
  }
});

// 货主车牌信息
export const plateNumber = resource('/org-plate', http, {
  batchAddPlateNumber(obj) {
    return http.post('/org-plate/batch', obj);
  }
});

// 数据字典项对象
export const DictItem = resource('/dictItem', http, {});

// 受控法规对象
export const Material = resource('/material', http, {});

// 委托方对象
export const EntrustOrg = resource('/entrust-org', http, {
  queryPager: (params) => {
    return http.get('/entrust-org', {params});
  },
  forbid: function (id) {
    return http.put('/entrust-org/' + id + '/stop', {});
  },
  start: function (id) {
    return http.put('/entrust-org/' + id + '/enable', {});
  },
  audit: function (id, params) {
    return http.put('/entrust-org/' + id + '/audit', params);
  },
  queryStateNum: (params) => {
    return http.get('/entrust-org/count', {params});
  },
  checkOrgId: (orgId, id) => {
    return http.get('/entrust-org/org-check', {
      params: {orgId, id}
    });
  },
  queryGroupBy: (params) => {
    return http.get('/entrust-org/group-by', {params});
  }
});

// 平台用户权限对象
export const User = resource('/oms/user', http, {
  checkEmail: (email, userId, orgId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId, orgId: orgId}
    });
  },
  checkPhone: (phone, userId, orgId) => {
    return http.get('/oms/user/phone', {
      params: {phone: phone, userId: userId, orgId: orgId}
    });
  },
  resetPsw: (Obj) => {
    return http.put('/oms/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('/oms/user/password/verifyMail', obj);
  },
  stopUser: (userId) => {
    return http.put(`/oms/user/${userId}/stop`);
  },
  enableUser: (userId) => {
    return http.put(`/oms/user/${userId}/enablement`);
  }
});
// 货主用户权限对象
export const OrgUser = resource('/oms/user/org', http, {
  queryOrgInfo: (id, params) => {
    return http.get('/oms/user/org/' + id, {params});
  }
});
// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: () => {
    return http.get('/oms/access/menus/tree', {params: {objectId: 'oms-system'}});
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  queryStateNum: (params) => {
    return http.get('/oms/access/platform/count', {params});
  }
});

// 货品管理
export const Goods = resource('/goods', http, {
  importExcelToAddGoods: (params) => {
    return http.post('/goods/import', params);
  },
  importExcelToAddorgGoods: (params) => {
    return http.post('/orgs/import', params);
  },
  importExcelToAddrelationGoods: (params) => {
    return http.post('/bizRelation/import', params);
  },
  filterDhsGoods: (params) => {
    return http.get('/goods/dhs/pager', {params});
  },
  filterDhsGoodsByGoodsId: (goodsId) => {
    return http.get('/goods/dhs/' + goodsId, {});
  },
  filterOrg: (orgId, params) => {
    return http.get('/goods/orgs/' + orgId, {params});
  },
  check: (id, obj) => {
    return http.put('/goods/' + id + '/check', obj);
  },
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
  },
  queryStateNum: (params) => {
    return http.get('/goods/count', {params});
  },
  checkCode: (params) => {
    return http.get('/goods/check/code', {params});
  },
  checkGoodsCode: (params) => {
    return http.get('/goods/check/goodsCode', {params});
  },
  queryPagerByApprovalNumberDate: (params) => {
    return http.get('/goods/approvalNOValidity', {params});
  },
  queryPagerNumberByApprovalNumberDate: (params) => {
    return http.get('/goods/approvalNOValidity/count', {params});
  }
});

// 审核对象
export const Audit = resource('/audit', http, {
  // 查询某一单位的当前审核流程信息
  queryAuditStatus: (orgId) => {
    return http.get('/audit/orgs/' + orgId, {});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  // 根据单位机构关系类型列表分页查询单位信息
  queryByOrgRelationTypeList: (params) => {
    return http({
      url: '/orgs/relationType',
      params,
      paramsSerializer(params) {
        return qs.stringify(params, {indices: false});
      }
    });
  },
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 查询dhs的平台单位
  queryDhsOrgs: (params) => {
    return http.get('/orgs/dhs', {params});
  },
  filterDhsOrgById: (orgId) => {
    return http.get('/orgs/dhs/' + orgId, {});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核单位基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
  },
  // 校验邮箱
  checkEmail: (email, userId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId}
    });
  },
  // 校验名字
  checkName: (name, orgId) => {
    return http.get('/orgs/name', {
      params: {name, orgId}
    });
  },
  // 校验身份证
  checkCreditCode: (creditCode, orgId) => {
    return http.get('/orgs/creditCode', {
      params: {creditCode, orgId}
    });
  },
  // 校验oms代码唯一性
  checkManufacturerCode: (code, orgId) => {
    return http.get('/orgs/manufacturerCode', {
      params: {code, orgId}
    });
  },
  // 校验管理员账户唯一性
  checkAdminAccount: (account, orgId) => {
    return http.get('/orgs/account', {
      params: {account, orgId}
    });
  },

  // 货主基本信息
  queryBaseInfo: (orgid) => {
    return http.get('/orgs/' + orgid);
  },
  // 删除客服人员
  deleteCus: (id) => {
    return http.delete('/cusService/' + id, {});
  },
  // 添加客服人员
  addCus: (obj) => {
    return http.post('/cusService', obj);
  },
  // 添加货主经营范围
  addOrgScope: (obj) => {
    return http.post('/orgScope', obj);
  },
  // 删除货主经营范围
  deleteOrgScope: (id) => {
    return http.delete('/orgScope/' + id);
  },
  // 查询其他客服人员
  queryOtherCus: (obj) => {
    return http.get('/cusService/orgs/' + obj.orgId + '/users', {obj});
  },
  // 新增受控法规
  addFg: (obj) => {
    return http.post('/bizLegislation', obj);
  },
  // 删除受控法规
  deleteFg: (id) => {
    return http.delete('/bizLegislation/' + id);
  }
});
// 业务关系
export const bizRelation = resource('/bizRelation', http, {
  queryRelationorg: (id) => {
    return http.get('/bizRelation/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/bizRelation/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/bizRelation/count', {params});
  }
});

// 委托货品
export const EntrustOrgGoods = resource('/entrust-org-goods', http, {
  queryStateNum: (params) => {
    return http.get('/entrust-org-goods/count', {params});
  },
  forbid: function (id) {
    return http.put('/entrust-org-goods/' + id + '/stop', {});
  },
  start: function (id) {
    return http.put('/entrust-org-goods/' + id + '/enable', {});
  },
  audit: function (id, params) {
    return http.put('/entrust-org-goods/' + id + '/audit', params);
  },
  filterOrg: (orgId, params) => {
    return http.get('/entrust-org-goods/orgs/' + orgId, {params});
  }
});

// 货主货品
export const OrgGoods = resource('/org/goods', http, {
  importExcelToAddOrgGoods: (params) => {
    return http.post('/org/goods/import', params);
  },
  queryOneGoods: (id) => {
    return http.get('/orgs/goods/' + id, {});
  },
  queryPagerWithDetailInfo: (params) => {
    return http.get('/org/goods/page', {params});
  },
  check: (id, obj) => {
    return http.put('/org/goods/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/goods/count', {params});
  },
  checkGoodsCode: (params) => {
    return http.get('/org/goods/check/code', {params});
  },
  start: (id) => {
    return http.put('/org/goods/start/' + id, {});
  }
});

// 仓库地址
export const Address = resource('/orgAddressInfo', http, {
  queryAddress: (id, params) => {
    return http.get('/orgAddressInfo/' + id, {params});
  },
  updateAddress: function (obj) {
    return http.put('/orgAddressInfo', obj);
  },
  check: (id, obj) => {
    return http.put('/orgAddressInfo/' + id + '/check', obj);
  },
  forbid: function (id) {
    return http.put('/orgAddressInfo/' + id + '/forbid', {});
  },
  bizForbid: function (id) {
    return http.put('/orgAddressInfo/' + id + '/bizForbid', {});
  },
  start: function (id) {
    return http.put('/orgAddressInfo/' + id + '/start', {});
  },
  auditInfo: (id, obj) => {
    return http.put('/orgAddressInfo/orgs/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/orgAddressInfo/count', {params});
  }
});
// 计费方案
export const Case = resource('/org/costItem', http, {
  check: (id, obj) => {
    return http.put('/org/costItem/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/costItem/count', {params});
  }
});

// order-sample

// 抽样信息
export const orderSample = resource('/order-sample', http, {
  querySampInfoByDetailId(id) {
    return http.get(`/order-sample/order-detail/${id}`);
  }
});

// 收货信息
export const receiptApi = resource('/receipt', http, {
  batchReceipt(obj) {
    return http.post('/receipt/batch', obj);
  },
  changeReceipt(obj) {
    return http.post('/receipt/order-detail/change', obj);
  },
  queryHistoryInfo(detailId) {
    return http.get(`/receipt/order-detail/${detailId}/history`);
  },
  checkPass(checkId) {
    return http.post(`/receipt/audit/${checkId}/success`);
  },
  checkNoPass(checkId) {
    return http.post(`/receipt/audit/${checkId}/fail`);
  }
});

// 订单
export const Order = resource('/order', http, {
  get: (id, params) => http.get('/order' + '/' + id, {params}),
  check: (orderId, obj) => {
    return http.put('/order/' + orderId + '/check', obj);
  },

  confirmOrder: (orderId) => {// 确认订单
    return http.put('/order-status/' + orderId + '/confirm');
  },
  cancelOrder: (orderId, obj) => {// 取消订单
    return http.put('/order-status/' + orderId + '/cancel', obj);
  },

  // 订单
  examineOrder: (orderId, obj) => {// 审单
    return http.put('/order-status/' + orderId + '/examine', obj);
  },
  receiptOrder: (orderId) => {// 确认收货
    return http.put('/order-status/' + orderId + '/receipt');
  },
  acceptanceOrder: (orderId) => {// 验收通过
    return http.put('/order-status/' + orderId + '/acceptance');
  },
  checkSitePass: (orderId) => {// 现场验收通过
    return http.put('/order-status/' + orderId + '/check/on-site');
  },
  checkFilePass: (orderId) => {// 文件验收通过
    return http.put('/order-status/' + orderId + '/check/by-file');
  },
  rejectionOrder: (orderId, obj) => {// 拒收
    return http.put('/order-status/' + orderId + '/rejection', obj);
  },

  rejectionReviewOrder: (orderId, obj) => {// 确认复核
    return http.put('/order-status/' + orderId + '/rejection-review/reject', obj);
  },
  terminationRejection: (orderId, obj) => {// 中止拒收
    return http.put('/order-status/' + orderId + '/rejection-review/stop', obj);
  },
  agreementReceiptOrder: (orderId, obj) => {// 取消拒收
    return http.put('/order-status/' + orderId + '/check-receipt', obj);
  },
  affirmRejectionOrder: (orderId, obj) => {// 确认拒收
    return http.put('/order-status/' + orderId + '/check-rejection', obj);
  },
  stockOrder: (orderId) => {// 货品上架
    return http.put('/order-status/' + orderId + '/stock');
  },
  // 出库单
  pickingOutOrder: (orderId) => {// 货品下架
    return http.put('/order-status/' + orderId + '/picking-out');
  },
  generationOrder: (orderId) => {// 生成出库单
    return http.put('/order-status/' + orderId + '/generation');
  },
  packageOrder: (orderId) => {// 出库单打包
    return http.put('/order-status/' + orderId + '/package');
  },
  outgoingCompletedOrder: (orderId) => {// 确认出库
    return http.put('/order-status/' + orderId + '/outgoing-completed');
  },
  distributionOrder: (orderId) => {// 确认配送
    return http.put('/order-status/' + orderId + '/distribution');
  },
  signOrder: (orderId, obj) => {// 客户签收
    return http.put('/order-status/' + orderId + '/sign-order', obj);
  },
  // 查询异常
  queryOrderExcepiton: (params) => {
    return http.get('/order/quality-exception', {params});
  },
  queryStateNum: function (params) {
    return http.get('/order/count/', {params});
  },
  returnToExamine(orderId) {
    return http.put(`/order-status/${orderId}/fallback`);
  }
});

// 异常管理
export const QualityException = resource('/quality-exception', http, {
  queryPager(params) {
    return http.get('/quality-exception/pager', {params});
  },
  queryExceptionPager(params) {
    return http.get('/quality-exception/comment/pager', {params});
  }
});

export const Notice = resource('notice', http, {
  queryPager(params) {
    return http.get('/notice', {params});
  },
  edit(id, obj) {
    return http.put('/notice/' + id, obj);
  },
  start(id) {
    return http.put('/notice/issue/' + id);
  },
  queryStateNum(params) {
    return http.get('/notice/count', {params});
  },
  forbid(id) {
    return http.put('notice/disable/' + id);
  }
});

export const Dict = resource('/dict', http, {
  byCode: (code) => http.get(`/dict/bycode?code=${code}`)
});

export const Auth = {
  checkLogin: () => {
    return http.get('/userinfo');
  },
  login: (data) => {
    return http.post('/login', data);
  },
  logout: () => {
    return http.get('/logout');
  },
  isLogin() {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/oms/access/permissions', {params: {objectId: 'oms-system'}});
  }
};

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource(path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}
