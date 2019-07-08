import moment from 'moment';

export function init(Vue) {
  //权限指令
  Vue.directive('has', {
    inserted: function (el, binding) {
      // if (!(Vue.prototype.$_has && Vue.prototype.$_has(binding.value))) {
      //   el.parentNode && el.parentNode.removeChild(el);
      // }
    }
  });
  Vue.filter('date', function (dateTime) {
    if (!dateTime) return '';
    return moment(dateTime).format('YYYY-MM-DD');
  });
  Vue.filter('time', function (dateTime) {
    if (!dateTime) return '';
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
  });
  Vue.filter('minute', function (dateTime) {
    if (!dateTime) return '';
    return moment(dateTime).format('YYYY-MM-DD HH:mm');
  });
  Vue.filter('timeNoDate', function (dateTime) {
    if (!dateTime) return '';
    return moment(dateTime).format('HH:mm:ss');
  });

  Vue.filter('formatMonitoringStatus', function (val) {
    return val === '1' ? '激活' : '未激活';
  });

  Vue.filter('formatUseStatus', function (val) {
    return val === '1' ? '启用' : '停用';
  });

  Vue.filter('formatAlarmStatus', function (val) {
    return val === '1' ? '告警' : '正常';
  });

  Vue.filter('formatConfirmStatus', function (val) {
    return val === '1' ? '已确认' : val === '0' ? '未确认' : '';
  });

  Vue.filter('formatStatus', function (key) {
    let reStr;
    let arr = {
      0: '否',
      1: '是'
    };

    if (key === true) {
      reStr = '是';
    } else if (key === false) {
      reStr = '否';
    } else if (!key) {
      reStr = '否';
    } else {
      reStr = arr[key];
    }
    return reStr;
  });
  Vue.filter('nl2br', function (textAreaContent) {
    return textAreaContent.replace(/\n/g, '<br>');
  });
  Vue.filter('formatMoney', function (val) {
    let num = '';
    if (typeof val === 'string') {
      num = val;
    } else if (typeof val === 'number') {
      num = val.toFixed(2).toString();
    }
    if (num) {
      // 整数部分进行千分位分割
      let arr = num.split('.');
      num = arr[0];
      let result = '';
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      // 拼接小数位
      result = result + '.' + arr[1];
      return result;
    }
  });

  // 滚动加载
  Vue.prototype.$scrollLoadingData = function (event) {
    let e = event ? event : window.event;
    let target = e.target || e.srcElement;
    if (!target) return false;
    let difference = 20;
    let height = target.scrollHeight - target.clientHeight;
    let scrollTop = target.scrollTop;
    if (height > 0 && height - scrollTop < difference) {
      if (this.getMore && this.pager.currentPage < this.pager.totalPage && !this.$store.state.bottomLoading) {
        this.$store.commit('initBottomLoading', true);
        this.getMore();
      }
    }
  };
  // 取字典
  Vue.prototype.$getDict = function (groupName) {
    if (!groupName) return;
    const state = this.$store.state;
    if (state.dict[groupName]) {
      return state.dict[groupName];
    } else {
      const ary = state.requestingDictAry;
      if (ary.includes(groupName)) return;
      ary.push(groupName);
      this.$store.commit('initRequestingDictAry', ary);
      this.$http.get(`/dictGroup/${groupName}/items`).then(res => {
        state.dict[groupName] = res.data;
        this.$store.commit('initDict', state.dict);
        const ary_new = state.requestingDictAry;
        let index = ary_new.indexOf(groupName);
        if (index !== -1) {
          ary_new.splice(index, 1);
        }
        this.$store.commit('initRequestingDictAry', ary_new);
      });
      return [];
    }
  };

  // 确认框方法
  Vue.prototype.$confirmOpera = function (tip, callback) {
    this.$confirm(tip, '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      callback();
    });
  };

  // 通用请求方法
  Vue.prototype.$httpRequestOpera = function (httpPromise, option = {
    successTitle: '',
    errorTitle: '',
    success: res => {
    },
    error: res => {
    }
  }) {
    const {successTitle, errorTitle, success, error} = option;
    httpPromise.then(res => {
      if (res.data.code) {
        if (res.data.code === 200) {
          successTitle && this.$notify.success({
            duration: 2000,
            message: successTitle
          });
          success(res);
        } else {
          error(res);
        }
      } else {
        successTitle && this.$notify.success({
          duration: 2000,
          message: successTitle
        });
        success(res);
      }
    }).catch(e => {
      this.$notify.error({
        duration: 2000,
        message: e.response && e.response.data && e.response.data.msg || errorTitle || '操作失败'
      });
      error(e);
    });
  };

  //格式化历史数据方法
  Vue.prototype.$formatDevData = function (item, type) {
    let unit = ['', '℃', '%', 'V'];
    let prop = ['', 'temperature', 'humidity', 'voltage'];
    if (!item[prop[type]]) return '';
    return item[prop[type]].toFixed(2) + unit[type];
  };

  // 格式化设备首页数据
  Vue.prototype.$formatDevIndexData = function (item, devType) {
    let unit = ['', '℃', '%', 'V'];
    let prop = ['', 'temperature', 'humidity', 'voltage'];
    if (devType && devType === '4') {
      if (!item[prop[2]]) return '';
      return item[prop[2]].toFixed(2) + unit[2];
    } else {
      if (!item[prop[1]]) return '';
      return item[prop[1]].toFixed(2) + unit[1];
    }
  };

  //格式化历史数据类型
  Vue.prototype.$formatDevType = function (item) {
    return item.devType === '4' ? '2' : '1';
  };

  //跳转到历史数据查询
  Vue.prototype.$turnDevDate = function (item, type) {
    let devCode = item.devCode;
    let id = item.ccsDevId;
    let devName = item.devName || item.ccsDevName;
    this.$router.push({path: '/monitoring/temp', query: {id, type}});
  };

  Vue.prototype.$formatAryTime = function (ary, index, str = 'YYYY-MM-DD HH:mm:ss') {
    return Array.isArray(ary) && ary[index] ? this.$moment(ary[index]).format(str) : '';
  };
}
