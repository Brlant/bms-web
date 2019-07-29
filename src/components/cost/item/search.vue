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
          <oms-form-row label="名称" :span="5">
            <oms-input placeholder="请输入计费模型名称" type="input" v-model="searchCondition.billingItemName"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="计费类型" :span="5">
            <el-select placeholder="请选择计费类型" v-model="searchCondition.billingType" clearable>
              <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in calculateType"></el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="业务模型" :span="5">
            <el-select placeholder="请选择计费类型" v-model="searchCondition.businessType" clearable>
              <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in bizType"></el-option>
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

    data: function () {
      return {
        searchCondition: {
          billingItemName: '',
          businessType: '',
          billingType: ''
        },
        showSearch: false,
        list: [],
        times: [],
        orgList: []
      };
    },
    computed: {
      calculateType() {
        return this.$getDict('calculateType');
      },
      bizType() {
        return this.$getDict('bizType');
      },
      measurementUnitList() {
        return this.$getDict('measurementUnit');
      },
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
          billingItemName: '',
          businessType: '',
          billingType: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
