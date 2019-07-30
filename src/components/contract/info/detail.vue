<style lang="scss" scoped="">
  @import "../../.././assets/scss/mixins";

  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }
      padding-left: 10px;
      padding-right: 10px;
      left: $leftWidth;
    }
  }

  .oms-row {
    margin-bottom: 10px;
  }
  .detail-title {
    margin: 0 0 10px 0;
    padding: 0 10px;
    border-left: 4px solid $activeColor;
  }
</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">合同详情</h3>
      <h2 class="detail-title">基础信息</h2>
      <el-row>
        <el-col :span="12">
          <oms-row label="合同名称" :span="6">{{formItem.contractName}}</oms-row>
          <oms-row label="合同编号" :span="6">{{formItem.contractNo}}</oms-row>
          <oms-row label="甲方" :span="6">{{formItem.orgName}}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="合同日期" :span="6">
            {{formItem.contractSignTime | date}}~{{formItem.contractOverTime | date}}
          </oms-row>
          <oms-row label="业务员/部门" :span="6">{{formItem.businessManageName}} {{formItem.companyDepartmentName}}</oms-row>
          <oms-row label="状态" :span="6">{{formItem.contractState === '0' ? '停用': '启用'}}</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">甲方货品</h2>
      <oms-row label="项目" :span="3">{{formItem.contractName}}</oms-row>
      <el-table :data="billingItemList" border class="clearfix mb-10" ref="orderDetail">
        <el-table-column prop="operationTime" label="货主货品">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="billingItemList" border class="clearfix" ref="orderDetail">
        <el-table-column prop="operationTime" label="计费模型">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      index: Number
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.queryItems();
      }
    },
    data() {
      return {
        billingItemList: []
      };
    },
    methods: {
      queryItems() {
        if (this.formItem.billingModelTemplate === '0') return;
        this.$http.get(`/bms-billing-item/query-item/${this.formItem.billingModelId}`).then(res => {
          if (res.data.code === 200) {
            this.billingItemList = res.data.data;
          }
        });
      }
    }
  };
</script>
