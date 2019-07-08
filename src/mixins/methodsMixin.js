import {AlarmNotifyGroup, cool, probe, BaseInfo} from '@/resources';


export default {
  data() {
    return {
      probeList: [],
      orgList: [],
      notifyList: [],
      coolList: [],
      povList: []
    };
  },
  methods: {
    queryProbeList(query) {
      let params = {keyWord: query};
      probe.query(params).then(res => {
        this.probeList = res.data.data.list;
      });
    },
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query};
      this.$http.get('/orgs/pager', {params: params}).then(res => {
        this.orgList = res.data.list;
      });
    },
    queryNotifyList(query) {
      let params = {
        keyWord: query,
      };
      if (typeof query === 'object') {
        params = query;
      }
      AlarmNotifyGroup.query(params).then(res => {
        this.notifyList = res.data.data.list;
      });
    },
    queryCoolList(query) {
      let params = {
        keyWord: query,
      };
      if (typeof query === 'object') {
        params = query;
      }
      cool.query(params).then(res => {
        this.coolList = res.data.data.list;
      });
    },
    filterPOV: function (query) {// 过滤POV
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {
        keyWord: query,
        relation: '0'
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.povList = res.data;
      });
    }
  }
};
