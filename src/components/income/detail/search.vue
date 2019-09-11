<style lang="scss" scoped>
  .el-form::after {
    content: '';
    clear: both;
    display: table;
  }
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-col :span="8">
          <oms-form-row label="合同" :span="5">
            <el-select placeholder="请输入名称搜索合同" v-model="searchCondition.contractId"
                       filterable clearable remote :remote-method="queryContractList">
              <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                         v-for="item in contractList"></el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="甲方" :span="5">
            <org-select :list="orgList"
                        :remoteMethod="queryAllOrg"
                        placeholder="请输入名称搜索甲方" v-model="searchCondition.customerId"></org-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="订单号" :span="5">
            <oms-input placeholder="请输入订单号" type="input" v-model="searchCondition.orderNumber"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="对账单号" :span="5">
            <oms-input placeholder="请输入对账单号" type="input" v-model="searchCondition.accountCheckNo"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="" :span="5">
            <el-checkbox style="margin-top: 8px" v-model="searchCondition.noStatementType" true-label="1">存在未结算款</el-checkbox>
          </oms-form-row>
        </el-col>
      </el-form>
    </template>
  </search-template>
</template>
<script>

  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data: function () {
      return {
        searchCondition: {
          contractId: '',
          customerId: '',
          accountCheckNo: '',
          orderNumber: '',
          noStatementType: ''
        },
        showSearch: false,
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {
      let no = this.$route.query.no;
      if (!no) return;
      this.searchCondition.no = no;
      this.search();
    },
    methods: {
      queryAllOrg: function (query) {// 查询货主
        let params = {keyWord: query};
        this.$http.get('/orgs/pager', {params: params}).then(res => {
          this.orgList = res.data.list;
        });
      },
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          contractId: '',
          customerId: '',
          accountCheckNo: '',
          orderNumber: '',
          noStatementType: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
