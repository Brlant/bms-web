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
      padding-bottom: 10px;
      left: $leftWidth;
    }
  }

  .oms-row {
    margin-bottom: 10px;
  }


</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter" v-loading="loading">
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
          <oms-row label="业务员/部门" :span="6">{{formItem.businessManageName}}/{{formItem.companyDepartmentName}}</oms-row>
          <oms-row label="状态" :span="6">{{formItem.contractState === '0' ? '停用': '启用'}}</oms-row>
        </el-col>
      </el-row>
      <div v-if="data.projectId">
        <h2 class="detail-title">绑定货品计费模型</h2>
        <oms-row label="项目" :span="3">{{data.projectName}}</oms-row>
        <oms-row label="计费模型" :span="3">
          {{data.billingModelName}} <i class="el-icon-arrow-down" style="cursor: pointer" @click="showBillingItems = !showBillingItems"></i>
        </oms-row>
        <cost-table-util class="mb-10" :data="billingItems" :showBtn="false" v-show="showBillingItems"/>
        <el-table :data="data.orgGoodsList" border class="clearfix " ref="orderDetail">
          <el-table-column prop="orgGoodsName" label="货品"/>
          <el-table-column prop="goodsSpecification" label="规格" width="200px"/>
        </el-table>
      </div>
      <div v-if="costModel.projectId" class="mt-10">
        <h2 class="detail-title">绑定非货品计费模型</h2>
        <oms-row label="计费模型" :span="3">
          {{costModel.billingModelName}} <i class="el-icon-arrow-down" style="cursor: pointer"
                                            @click="showCostBillingItems = !showCostBillingItems"></i>
        </oms-row>
        <cost-table-util class="mb-10" :data="costBillingItems" :showBtn="false" v-show="showCostBillingItems"/>
      </div>
    </div>
  </div>
</template>
<script>
  import {contractBindGoods, costModel} from '@/resources';
  import costTableUtil from '../../cost/info/costTableUtil';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      index: Number
    },
    components: {costTableUtil},
    watch: {
      index(val) {
        if (val !== 2) return;
        this.queryItems();
        this.queryCostModel();
      }
    },
    data() {
      return {
        data: {},
        billingItems: [],
        costModel: {},
        costBillingItems: [],
        showBillingItems: false,
        showCostBillingItems: false,
        loading: false
      };
    },
    methods: {
      queryItems() {
        this.data = {
          orgGoodsList: []
        };
        this.billingItems = [];
        this.loading = true;
        contractBindGoods.query({contractId: this.formItem.contractId}).then(res => {
          this.loading = false;
          if (res.data.data.projectId) {
            this.data = res.data.data;
            costModel.queryDetail(this.data).then(res => {
              this.billingItems = res.data.data.billingItems;
            });
          }
        });
      },
      queryCostModel() {
        this.costModel = {};
        this.costBillingItems = [];
        contractBindGoods.queryCostModel({contractId: this.formItem.contractId}).then(res => {
          if (res.data.data.projectId) {
            this.costModel = res.data.data;
            costModel.queryDetail(this.costModel).then(res => {
              this.costBillingItems = res.data.data.billingItems;
            });
          }
        });
      }
    }
  };
</script>
