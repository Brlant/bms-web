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
        <el-col :span="12">
          <oms-form-row label="计费模型名称" :span="5">
            <oms-input placeholder="请输入计费模型名称" type="input" v-model="searchCondition.billingModelName"/>
          </oms-form-row>
        </el-col>
        <el-col :span="12">
          <oms-form-row label="合同" :span="5">
            <el-select placeholder="请输入名称搜索合同" v-model="searchCondition.contractId"
                       filterable clearable remote :remote-method="queryContractList" @focus="queryContractList()">
              <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                         v-for="item in contractList"></el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="12">
          <oms-form-row label="是否绑定货品计费" :span="6">
            <el-radio-group v-model="searchCondition.bindingGoodStatus">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
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
          billingModelName: '',
          contractId: '',
          bindingGoodStatus: ''
        },
        showSearch: false,
        list: [],
        times: []
      };
    },
    mounted() {
      let no = this.$route.query.no;
      if (!no) return;
      this.searchCondition.no = no;
      this.search();
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          billingModelName: '',
          contractId: '',
          bindingGoodStatus: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
