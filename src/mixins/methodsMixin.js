import {Contact, costItem, costModel, Department, OrgGoods, project} from '@/resources';


export default {
  data() {
    return {
      orgList: [],
      orgGoodsList: [],
      departmentList: [],
      departmentUserList: [],
      costItemList: [],
      costModelList: [],
      contractList: [],
      projectList: []
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
    queryCostItem(query) {
      let params = {keyWord: query};
      costItem.query(params).then(res => {
        if (res.data.code === 200) {
          this.costItemList = res.data.data.list;
        } else {
          this.costItemList = [];
        }
      });
    },
    queryCostModelList(query) {
      let params = typeof query === 'object' ? query : {keyWord: query};
      costModel.query(params).then(res => {
        if (res.data.code === 200) {
          this.costModelList = res.data.data.list;
        } else {
          this.costModelList = [];
        }
      });
    },
    queryContractList(query) {
      let params = {keyWord: query};
      Contact.query(params).then(res => {
        if (res.data.code === 200) {
          this.contractList = res.data.data.list;
        } else {
          this.contractList = [];
        }
      });
    },
    queryOrgGoodsList(params) {
      OrgGoods.query(params).then(res => {
        this.orgGoodsList = res.data.list;
      });
    },
    queryProjectList(query) {
      let params = {keyWord: query};
      project.query(params).then(res => {
        if (res.data.code === 200) {
          this.projectList = res.data.data.list;
        } else {
          this.projectList = [];
        }
      });
    }
  }
};
