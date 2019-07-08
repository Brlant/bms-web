import Notification from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import WholeErrorSignHandle from '@/tools/whole-error-sign-handle';

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});

http.interceptors.response.use(response => {
  if (response.data.code) {
    switch (response.data.code) {
      case 200 :
        return response;
      case 401:
        window.location.href = '#/login';
        return response;
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        return response;
      case 400:
        Notification.error({
          message: response.data.msg,
        });
        return response;
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


export const temperatureRecord = {
  add(obj) {
    return http.post('/temperature-measurement-record', obj);
  },
  query(params) {
    return http.post('/temperature-measurement-record/list', params);
  }
};

// 告警设备
export const monitorRelation = resource('/monitor-relation', http, {
  query(params) {
    return http.post('/monitor-relation/page', params);
  },
  stop(id) {
    return http.put(`/gateway/disable/${id}`);
  },
  start(id) {
    return http.put(`/gateway/active/${id}`);
  }
});


// 告警通知
export const NotifyRecord = resource('/alarm-notice-record', http, {
  query(params) {
    return http.post('/alarm-notice-record/page', params);
  }
});


// 告警事件
export const alarmEvent = resource('/alarm-event', http, {
  query(params) {
    return http.post('/alarm-event/page', params);
  },
  batchConfirmItem(obj) {
    return http.put('/alarm-event/handle', obj);
  }
});


// 告警测试
export const AlarmTest = resource('/alarm-test-log', http, {
  query(params) {
    return http.post('/alarm-test-log/page', params);
  },
  update(obj) {
    return http.put('/alarm-test-log', obj);
  },
  confirm(obj) {
    return http.put('/alarm-test-log/confirm', obj);
  }
});

// 告警通知组
export const AlarmNotifyGroup = resource('/alarm-notice-group', http, {
  query(params) {
    return http.post('/alarm-notice-group/page', params);
  },
  update(obj) {
    return http.put('/alarm-notice-group', obj);
  }
});


// 告警规则
export const AlarmRule = resource('/alarm-rule', http, {
  query(params) {
    return http.post('/alarm-rule/page', params);
  },
  update(obj) {
    return http.put('/alarm-rule', obj);
  }
});


//冷链设备管理
export const gateway = resource('/gateway', http, {
  query(params) {
    return http.post('/gateway/page', params);
  },
  update(obj) {
    return http.put('//gateway', obj);
  },
  queryStateNum(params) {
    return http.post('/gateway/count', params);
  },
  stop(id) {
    return http.put(`/gateway/disable/${id}`);
  },
  start(id) {
    return http.put(`/gateway/active/${id}`);
  }
});


//冷链设备管理
export const cool = resource('/freezer-dev', http, {
  query(params) {
    return http.post('/freezer-dev/page', params);
  },
  update(obj) {
    return http.put('/freezer-dev', obj);
  },
  queryStateNum(params) {
    return http.post('/freezer-dev/count', params);
  }
});


//探头管理
export const probe = resource('/sensor', http, {
  query(params) {
    return http.post('/sensor/page', params);
  },
  update(obj) {
    return http.put('/sensor', obj);
  },
  queryStateNum(params) {
    return http.post('/sensor/count', params);
  },
  stop(id) {
    return http.put(`/sensor/disable/${id}`);
  },
  start(id) {
    return http.put(`/sensor/active/${id}`);
  }
});


// warehouseDevImage
export const warehouseDevImage = resource('/warehouseDevImage', http, {});

export const DevBackUp = resource('/ccsDevBackup', http, {});

export const OrgUser = resource('/oms/user/org', http, {
  queryOrgInfo: (id, params) => {
    return http.get('/oms/user/org/' + id, {params});
  }
});

// 绑定规则信息
export const BindRule = resource('/ccsNotifyPlan', http, {
  bindCcsNotifyPlan(obj) {
    return http.post('/ccsNotifyPlan/bindCcsNotifyPlan', obj);
  },
  bindCcsNotifyPlans(obj) {
    return http.post('/ccsNotifyPlan/bindCcsNotifyPlans', obj);
  }
});

// 设备监控对象组
export const MonitoringObjGroup = resource('/ccsMonitorRelation', http, {
  queryStateNum: (params) => {
    return http.get('/ccsMonitorRelation/countMonitorRelationGroup', {params});
  },
  modifyMonitorStatus(obj) {
    return http.put('/ccsMonitorRelation/activeRelation', obj);
  },
  modifyMonitorStatusSingle(obj) {
    return http.put('/ccsMonitorRelation/activeRelations', obj);
  },
  addCcsOrderDevMonitorRelation: (params) => {
    return http.post('/ccsMonitorRelation/ccs-order-thermometer', params);
  },
  deleteCcsMonitorRelationByMonitorTargetIdAndDevCode: (ccsOrderId, obj) => {
    return http.post('/ccsMonitorRelation/ccs-order-thermometer/' + ccsOrderId, obj);
  }
});

// 设备运单监控对象
export const waybillMonitoring = resource('/ccsOrder', http, {});

// 设备监控对象
export const DevMonitoring = resource('/ccsMonitordev', http, {
  queryStateNum: (params) => {
    return http.get('/ccsMonitordev/countMonitordevGroup', {params});
  }
});

// 仓位设备关系对象
export const WarehouseDevRelation = resource('/ccsWarehouseDevRelation', http, {
  queryWareHouseAllDevs(id) {
    return http.get(`/ccsWarehouseDevRelation/gainWarehouseAllDevRelationList/${id}`);
  }
});

// 仓位
export const CcsWarehouse = resource('/ccsWarehouse', http, {
  queryAllList(params) {
    return http.get('/ccsWarehouse/gainAllWarehouseList', {params});
  }
});

// dev设备对象
export const TempDev = resource('/ccsDevice', http, {
  queryStateNum: (params) => {
    return http.get('/ccsDevice/countDeviceGroup', {params});
  },
  queryTempData(params) {
    return http.get('/ccsDevice/gainDeviceReportDatas', {params});
  },
  queryALLTempByLike(params) {
    return http.get('/ccsDevice/queryDevListFuzzy', {params});
  },
  exportDevInfo(params) {
    return http.get('/ccsDevice/export-dev', {params});
  }
});

export const HandoverData = resource('/handover-data', http, {
  queryHandoverDataByDevNo: (devNo, params) => {
    return http.get(`/handover-data/${devNo}/info`, {params});
  }
});

// tmsOrder 对象
export const TmsOrder = resource('/stock-in', http, {
  queryStateNum: (params) => {
    return http.get('//stock-in/count', {params});
  }
});

// 车辆档案对象
export const CarArchives = resource('/car-archives', http, {
  checkPlateNumber: (params) => {
    return http.get('/car-archives/check/plate-number', {params});
  }
});

// 库存移库记录对象
export const StockMoveLog = resource('/stock-move-log', http, {});

// logisticsCenter物流中心对象
export const LogisticsCenter = resource('/logisticsCenter', http, {});

// store存储位对象
export const Store = resource('/store', http, {
  // 查询库位下的批次信息
  queryStockBatches: (id) => {
    return http.get('/store/' + id + '/batches', {});
  },
  // 过滤移出库位
  filterOutStore: (params) => {
    return http.get('/store/filter/outStore', {params});
  },
  // 过滤移出库区
  filterOutArea: (params) => {
    return http.get('/store/filter/outArea', {params});
  },
  batchStopStore: (params) => {
    return http.put('/store/batch/stop', params);
  },
  batchStartStore: (params) => {
    return http.put('/store/batch/start', params);
  },
  checkCode: (params) => {
    return http.get('/store/code', {params});
  }
});

// 部门对象
export const Department = resource('oms/department', http, {
  getPage: (params) => {
    return http.get('oms/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('oms/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('oms/department/members', {params});
  },
  queryStateNum: (params) => {
    return http.get('/oms/department/member/count', {params});
  }
});

// dev设备对象
export const Dev = resource('/dev', http, {});

// devDetail设备详情对象
export const DevDetail = resource('/dev-detail', http, {
  checkDevNo: (devNo, id, devId) => {
    return http.get('/dev-detail/devNo', {
      params: {devNo: devNo, id: id, devId: devId}
    });
  },
  getLogPageByDevDetailId: (devDetailId, params) => {
    return http.get(`/dev-detail/${devDetailId}/page`, {params});
  }
});

// devStore设备存储对象
export const DevStore = resource('/dev-store', http, {
  queryDevPager: (id, params) => {
    return http.get('/dev-store/dev/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
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

// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: () => {
    return http.get('/oms/access/menus/tree', {params: {objectId: 'hmcc-system'}});
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
    return http.get('/oms/access/permissions', {params: {objectId: 'ccs-system'}}); //
  }
};

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

// 货品管理
export const Goods = resource('/goods', http, {
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
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

// 货主货品
export const OrgGoods = resource('/org/goods', http, {
  queryOneGoods: (id) => {
    return http.get('/orgs/goods/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/org/goods/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/goods/count', {params});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核组织基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
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
