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
        <el-row>
          <el-col :span="12">
            <oms-form-row label="甲方" :span="4">
              <el-select placeholder="请输入名称搜索甲方" v-model="searchCondition.customerId" multiple
                         filterable clearable remote :remote-method="queryAllOrg" @focus="queryAllOrg()">
                <el-option :label="item.name" :value="item.id" :key="item.id"
                           v-for="item in orgList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row label="合同" :span="4">
              <el-select placeholder="请输入名称搜索合同" v-model="searchCondition.contractId" multiple
                         filterable clearable remote :remote-method="queryContractList" @focus="queryContractList()">
                <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                           v-for="item in contractList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <oms-form-row label="项目" :span="4">
              <el-select filterable remote placeholder="请选择项目" :remote-method="queryProjectList"
                         @focus="queryProjectList()" multiple
                         :clearable="true" v-model="searchCondition.projectId" popperClass="good-selects">
                <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                           v-for="item in projectList">
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row label="创建时间" :span="5">
              <el-date-picker v-model="createTime" type="datetimerange"  :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </oms-form-row>
          </el-col>
        </el-row>
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
          contractId: [],
          customerId: [],
          projectId: []
        },
        showSearch: false,
        list: [],
        times: [],
        createTime: ''
      };
    },
    mounted() {

    },
    computed: {
      billItemList() {
        return this.$store.state.billItemList;
      }
    },
    methods: {
      search() {
        this.searchCondition.startTime = this.createTime && this.createTime[0] || '';
        this.searchCondition.endTime = this.createTime && this.createTime[1] || '';
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          contractId: [],
          customerId: [],
          projectId: []
        };
        this.createTime = '';
        this.orgGoodsList = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
