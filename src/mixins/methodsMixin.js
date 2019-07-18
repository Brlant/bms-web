import {AlarmNotifyGroup, cool, probe, BaseInfo} from '@/resources';


export default {
  data() {
    return {
      orgList: []
    };
  },
  methods: {
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query};
      this.$http.get('/orgs/pager', {params: params}).then(res => {
        this.orgList = res.data.list;
      });
    }
  }
};
