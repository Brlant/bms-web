import {Contact, costItem, costModel, Department, OrgGoods, project, contractCostModel} from '@/resources';


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
      projectList: [],
      contractCostModelList: [],
      batchNumberList: []
    };
  },
  methods: {
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query,
        orgAuditStatus: 1,
        deleteFlag: false
      };
      this.$http.get('/org-dpr/pager', {params: params}).then(res => {
        this.orgList = res.data.data.list;
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
      let params = typeof query === 'object' ? query : {keyWord: query, billingModelState: '1'};
      costModel.query(params).then(res => {
        if (res.data.code === 200) {
          this.costModelList = res.data.data.list;
        } else {
          this.costModelList = [];
        }
      });
    },
    queryContractCostModelList(query) {
      let params = typeof query === 'object' ? query : {keyWord: query};
      contractCostModel.query(params).then(res => {
        this.contractCostModelList = res.data.data.list;
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
    queryBatchNumberList(query) {
      let params = typeof query === 'object' ? query : {keyWord: query};
      this.$http.get('/batch-number/pager', {params}).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    queryProjectList(query) {
      let params = {keyWord: query, projectState: '1'};
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
