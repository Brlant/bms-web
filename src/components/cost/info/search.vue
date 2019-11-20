<style lang="scss" scoped>
  .el-form::after {
    content: '';
    clear: both;
    display: table;
  }
  .advanced-query-form {
    display: flex;
    align-items: center;
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
          <oms-form-row label="模板名称" :span="5">
            <oms-input placeholder="请输入模板名称" type="input" v-model="searchCondition.billingModelName"/>
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
          billingModelType: ''
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
          billingModelType: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
