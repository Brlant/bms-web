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
            <oms-input placeholder="请输入名称" @keyup.native.enter="search"
                       v-model.trim="searchCondition.name"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="编号" :span="5">
            <oms-input placeholder="请输入编号" @keyup.native.enter="search"
                       v-model.trim="searchCondition.no"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="型号" :span="5">
            <oms-input placeholder="请输入型号" @keyup.native.enter="search"
                       v-model.trim="searchCondition.type"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="所属单位" :span="5">
            <org-select :list="orgList" :remoteMethod="queryAllOrg"
                        placeholder="请输入名称搜索单位" v-model="searchCondition.orgId" @change="search"></org-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="状态" :span="5">
            <el-radio-group v-model="searchCondition.status" size="small">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">停用</el-radio-button>
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
          no: null,
          name: null,
          type: null,
          status: null,
          orgId: ''
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
          no: null,
          name: null,
          type: null,
          status: null,
          orgId: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
