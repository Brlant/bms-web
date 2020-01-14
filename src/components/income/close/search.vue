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
                       filterable clearable remote :remote-method="queryContractList" @focus="queryContractList()">
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
          <oms-form-row label="项目" :span="5">
            <el-select filterable remote placeholder="请选择项目" :remote-method="queryProjectList"
                       @focus="queryProjectList()"
                       :clearable="true" v-model="searchCondition.projectId" popperClass="good-selects">
              <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                         v-for="item in projectList">
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="结算单号" :span="5">
            <oms-input placeholder="请输入结算单号" type="input" v-model="searchCondition.statementNo"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="对账单号" :span="5">
            <oms-input placeholder="请输入对账单号" type="input" v-model="searchCondition.accountCheckNo"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="结算时间" :span="5">
            <el-date-picker v-model="statementTime" type="datetimerange"  :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="回款时间" :span="5">
            <el-date-picker v-model="backAmountTime" type="datetimerange"  :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="开票时间" :span="5">
            <el-date-picker v-model="invoiceTime" type="datetimerange"  :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="状态" :span="5">
            <el-select  placeholder="请选择状态" multiple
                       :clearable="true" v-model="searchCondition.statementType" popperClass="good-selects">
              <el-option :label="item.title" :value="item.statementType" :key="item.statementType"
                         v-for="item in curStatusList">
              </el-option>
            </el-select>
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
    props: {
      statusList: Object
    },
    data: function () {
      return {
        searchCondition: {
          contractId: '',
          customerId: '',
          statementNo: '',
          accountCheckNo: '',
          projectId: '',
          startStatementTime: '',
          endStatementTime: '',
          startBackAmountTime: '',
          endBackAmountTime: '',
          startInvoiceTime: '',
          endInvoiceTime: '',
          statementType: []
        },
        showSearch: false,
        list: [],
        times: [],
        statementTime: '',
        backAmountTime: '',
        invoiceTime: ''
      };
    },
    computed: {
      curStatusList() {
        return Object.values(this.statusList).slice(1);
      }
    },
    mounted() {

    },
    methods: {
      setSearchCondition() {
        this.searchCondition.startStatementTime = this.statementTime && this.statementTime[0] || '';
        this.searchCondition.endStatementTime = this.statementTime && this.statementTime[1] || '';
        this.searchCondition.startBackAmountTime = this.backAmountTime && this.backAmountTime[0] || '';
        this.searchCondition.endBackAmountTime = this.backAmountTime && this.backAmountTime[1] || '';
        this.searchCondition.startInvoiceTime = this.invoiceTime && this.invoiceTime[0] || '';
        this.searchCondition.endInvoiceTime = this.invoiceTime && this.invoiceTime[1] || '';
      },
      search() {
        this.setSearchCondition();
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          contractId: '',
          customerId: '',
          statementNo: '',
          accountCheckNo: '',
          projectId: '',
          startStatementTime: '',
          endStatementTime: '',
          startBackAmountTime: '',
          endBackAmountTime: '',
          startInvoiceTime: '',
          endInvoiceTime: '',
          statementType: []
        };
        this.statementTime = '';
        this.backAmountTime = '';
        this.invoiceTime = '';
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
