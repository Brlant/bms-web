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


  .box-part {
    background: #eee;
    margin: 10px;
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
      <div>
        <h2 class="detail-title">绑定货品计费模型</h2>
        <div class="box-part" v-for="dataItem in dataList">
          <el-row style="padding: 5px 0;display: flex;align-items: center">
            <el-col :span="11">
              <oms-row label="项目" :span="5" style="margin-bottom: 0">{{dataItem.projectName}}</oms-row>
            </el-col>
            <el-col :span="11">
              <oms-row label="计费模型" :span="5" style="margin-bottom: 0">
                {{dataItem.billingModelName}}
              </oms-row>
            </el-col>
          </el-row>
          <el-table :data="dataItem.orgGoodsList" border class="clearfix " ref="orderDetail">
            <el-table-column prop="orgGoodsName" label="货品"/>
            <el-table-column prop="goodsSpecification" label="规格" width="200px"/>
            <el-table-column prop="projectName" label="创建时间" width="160">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <des-btn @click="deleteItem(scope.row, true,  `${scope.row.orgGoodsName}`)" icon="delete">删除</des-btn>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="mt-10">
        <h2 class="detail-title">绑定非货品计费模型</h2>
        <el-table :data="costModelList" border class="clearfix " ref="orderDetail">
          <el-table-column prop="billingModelName" label="计费模型"/>
          <el-table-column prop="projectName" label="项目"/>
          <el-table-column prop="projectName" label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | time}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opa" label="操作" width="100px">
            <template slot-scope="scope">
              <des-btn @click="deleteItem(scope.row, costModelList, `${scope.row.billingModelName}`)" icon="delete">删除
              </des-btn>
            </template>
          </el-table-column>
        </el-table>
        <!--        <cost-table-util class="mb-10" :data="costBillingItems" :showBtn="false" v-show="showCostBillingItems"/>-->
      </div>
    </div>
  </div>
</template>
<script>
  import {contractBindGoods} from '@/resources';
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
        dataList: [],
        billingItems: [],
        costModelList: [],
        costBillingItems: [],
        showBillingItems: false,
        showCostBillingItems: false,
        loading: false
      };
    },
    methods: {
      queryItems() {
        this.data = [];
        this.billingItems = [];
        this.loading = true;
        contractBindGoods.query({contractId: this.formItem.contractId}).then(res => {
          this.loading = false;
          this.dataList = res.data.data;
        });
      },
      queryCostModel() {
        this.costModel = [];
        this.costBillingItems = [];
        contractBindGoods.queryCostModel({contractId: this.formItem.contractId}).then(res => {
          this.costModelList = res.data.data;
        });
      },
      deleteItem(item, list, title) {
        this.$confirm('确认删除"' + title + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          contractBindGoods.delete(item.contractGoodsBillingModelId).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '删除成功'
            });
            if (typeof list === 'boolean') {
              this.queryItems()
            } else {
              let index = list.indexOf(item);
              list.splice(index, 1);
            }
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除失败'
            });
          });
        });
      }
    }
  };
</script>
