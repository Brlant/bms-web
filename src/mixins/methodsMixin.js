import {Department} from '@/resources';


export default {
  data() {
    return {
      orgList: [],
      departmentList: [],
      departmentUserList: []
    };
  },
  methods: {
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query};
      this.$http.get('/orgs/pager', {params: params}).then(res => {
        this.orgList = res.data.list;
      });
    },
    queryDepartment(query) {
      let params = {
        keyword: query,
        pageSize: 1000
      };
      Department.getPage(params).then(res => {
        this.departmentList = res.data.list;
      });
    },
    queryDepartmentUser(params) {
      if (!params) return;
      return Department.getOnesMember(params.id, params).then(res => {
        this.departmentUserList = res.data.list;
      });
    },
    queryCostItem() {

    }
  }
};
