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
          <oms-form-row label="甲方" :span="5">
            <org-select :list="orgList" @change="customerIdChange"
                        :remoteMethod="queryAllOrg"
                        placeholder="请输入名称搜索甲方" v-model="searchCondition.customerId"></org-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="甲方货品" :span="5">
            <el-select filterable remote placeholder="请输入名称搜甲方货品" :remote-method="queryOrgGoodsListNew"
                       @focus="queryOrgGoodsListNew()"
                       :clearable="true" v-model="searchCondition.orgGoodsId" popperClass="good-selects">
              <el-option v-for="item in orgGoodsList" :key="item.orgGoodsDto.id"
                         :label="item.orgGoodsDto.name"
                         :value="item.orgGoodsDto.id">
                <div style="overflow: hidden">
                  <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                </div>
                <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                </span>
                  <span class="select-other-info pull-left"><span
                    v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                </span>
                </div>
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="货品批号" :span="5">
            <el-select filterable placeholder="请输入名称搜索货品批号" :clearable="true"
                       remote :remote-method="queryBatchNumberListNew" @focus="queryBatchNumberListNew()"
                       v-model="searchCondition.batchNumber" popperClass="good-selects">
              <el-option v-for="item in batchNumberList" :key="item.id"
                         :label="item.batchNumber" :value="item.batchNumber">
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="订单号" :span="5">
            <oms-input placeholder="请输入订单号" type="input" v-model="searchCondition.orderNumber"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="对账单号" :span="5">
            <oms-input placeholder="请输入对账单号" type="input" v-model="searchCondition.accountCheckNo"/>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="计费项" :span="5">
            <el-select filterable placeholder="请选择计费项"
                       :clearable="true" v-model="searchCondition.billingItemName" popperClass="good-selects">
              <el-option :label="item.name" :value="item.name" :key="item.id"
                         v-for="item in billItemList">
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="" :span="5">
            <el-checkbox style="margin-top: 8px" v-model="searchCondition.noStatementType" true-label="1">存在未结算金额
            </el-checkbox>
          </oms-form-row>
        </el-col>
        <el-col :span="12">
          <oms-form-row label="创建时间" :span="3">
            <el-date-picker v-model="contractTime" type="datetimerange"  :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
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
          contractId: '',
          customerId: '',
          accountCheckNo: '',
          orderNumber: '',
          noStatementType: '',
          projectId: '',
          orgGoodsId: '',
          batchNumber: '',
          billingItemName: ''
        },
        showSearch: false,
        list: [],
        times: [],
        contractTime: ''
      };
    },
    mounted() {
      let no = this.$route.query.no;
      if (!no) return;
      this.searchCondition.no = no;
      this.search();
    },
    computed: {
      billItemList() {
        return this.$store.state.billItemList;
      }
    },
    methods: {
      customerIdChange() {
        this.searchCondition.orgGoodsId = '';
        this.orgGoodsList = [];
        this.batchNumberList = [];
      },
      queryBatchNumberListNew(query) {
        if (!this.searchCondition.orgGoodsId) {
          return this.$notify.info('请选择甲方货品');
        }
        let item = this.orgGoodsList.find(f => f.orgGoodsDto.id === this.searchCondition.orgGoodsId);
        if (!item) return;
        let params = {
          keyWord: query,
          goodsId: item.orgGoodsDto.goodsId
        };
        this.queryBatchNumberList(params);
      },
      queryOrgGoodsListNew(query) {
        if (!this.searchCondition.customerId) {
          return this.$notify.info('请选择甲方');
        }
        let params = {
          orgId: this.searchCondition.customerId,
          keyWord: query
        };
        this.queryOrgGoodsList(params);
      },
      search() {
        this.searchCondition.startTime = this.contractTime && this.contractTime[0] || '';
        this.searchCondition.endTime = this.contractTime && this.contractTime[1] || '';
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          contractId: '',
          customerId: '',
          accountCheckNo: '',
          orderNumber: '',
          noStatementType: '',
          projectId: '',
          orgGoodsId: '',
          batchNumber: '',
          billingItemName: '',
          startTime: '',
          endTime: ''
        };
        this.contractTime = '';
        this.orgGoodsList = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
