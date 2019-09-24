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
          <oms-form-row label="项目名称" :span="5">
             <el-input v-model.trim="searchCondition.projectName"></el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="项目编号" :span="5">
            <el-input v-model.trim="searchCondition.projectNumber"></el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="所属部门" :span="5">
            <el-select filterable remote placeholder="请输入名称搜所属部门" :remote-method="queryDepartment" @focus="queryDepartment()"
                       :clearable="true" v-model="searchCondition.companyDepartment" popperClass="good-selects"
                       @change="companyDepartmentChange">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in departmentList">
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="业务员" :span="5">
            <el-select placeholder="请选择业务员" v-model="searchCondition.businessManageId"
                       filterable clearable remote :remote-method="queryDepartmentUserNew" @focus="queryDepartmentUserNew()">
              <el-option :label="item.name" :value="item.id" :key="item.id"
                         v-for="item in departmentUserList"></el-option>
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
          projectName: '',
          projectNumber: '',
          companyDepartment: '',
          businessManageId: ''
        },
        showSearch: false,
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          projectName: '',
          projectNumber: '',
          companyDepartment: '',
          businessManageId: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      companyDepartmentChange(val) {
        this.departmentUserList = [];
        this.searchCondition.businessManageId = '';
      },
      queryDepartmentUserNew(query) {
        if (!this.searchCondition.companyDepartment) {
          this.departmentUserList = [];
          return;
        }
        let params = {
          id: this.searchCondition.companyDepartment,
          keyWord: query
        };
        this.queryDepartmentUser(params);
      }
    }
  };
</script>
