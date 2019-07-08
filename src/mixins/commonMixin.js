export default {
  data() {
    return {
      loadingData: false,
      activeStatus: 0,
      dataList: [],
      showIndex: -1,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      currentItem: {},
      currentItemId: {},
      currentPart: null,
      form: {},
      nowTime: ''
    };
  },
  methods: {

    queryUtil(http, pageNo, beforeRequest, success) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      beforeRequest && beforeRequest();
      let nowTime = new Date();
      this.nowTime = nowTime;
      http(params).then(res => {
        if (this.nowTime > nowTime) return;
        if(res.data.code) res.data = res.data.data;
        this.dataList = res.data.list || [];
        this.pager.count = res.data.count;
        this.loadingData = false;
        success && success();
      });
      return params;
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.queryList(1);
    },
    handleCurrentChange(val) {
      this.queryList(val);
    },
    queryStatusNumUtil(http, params, statusType, response) {
      http(params).then(res => {
        Object.keys(statusType).forEach(key => {
          statusType[key].num = res.data.data[statusType[key].status] || 0;
        });
      });
    },
    formatRowClass(status, statusType) {
      let index = -1;
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            index = k;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            index = k;
          }
        }
      });
      index = index !== -1 ? 'status-' + index : '';
      return index;
    },
    formatStatus(status, statusType) {
      let title = '';
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            title = statusType[k].title;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            title = statusType[k].title;
          }
        }
      });
      return title;
    },
    formatTimeAry(times, index) {
      if (!times) return;
      return times[index];
    },
    formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
      return time ? this.$moment(time).format(str) : '';
    },
    ruleConfig(item) {
      this.currentItemId = item;
      this.$store.commit('initUnitId', item);
    }
  }
};
