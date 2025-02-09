<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'add-contract'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.contractState" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">合同名称</el-col>
        <el-col :span="3">合同编号</el-col>
        <el-col :span="3">甲方</el-col>
        <el-col :span="3">业务员/部门</el-col>
        <el-col :span="4">合同日期</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="6">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="!dataList.length">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.contractId}]"
             class="order-list-item order-list-item-bg"
             v-for="item in dataList" @click="showDetail(item)">
          <el-row>
            <el-col :span="3">{{item.contractName}}</el-col>
            <el-col :span="3">{{item.contractNo}}</el-col>
            <el-col :span="3">{{item.orgName}}</el-col>
            <el-col :span="3" class="R">
              {{item.businessManageName}}/{{item.companyDepartmentName}}
            </el-col>
            <el-col :span="4">
              始 {{item.contractSignTime | date}}
              <div>终 {{item.contractOverTime | date}}</div>
            </el-col>
            <el-col :span="2">
              {{item.contractState === '0' ? '停用': '启用'}}
            </el-col>
            <el-col :span="6" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'edit-contract'">编辑</des-btn>
              <des-btn @click="bind(item)" icon="allot" v-has="'add-contract-goods-model'">绑定货品计费模型</des-btn>
              <des-btn @click="start(item)" icon="start" v-has="'enable-contract'" v-show="item.contractState === '0'">启用</des-btn>
              <des-btn @click="stop(item)" icon="stop" v-has="'disable-contract'" v-show="item.contractState === '1'">停用</des-btn>
              <des-btn @click="addInvoice(item)" icon="detail" v-has="'query-contract-invoice'">发票信息管理</des-btn>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :statusType="statusType" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {Contact} from '@/resources';
  import BindOrgGoodsForm from './form/bind-orgGoods-form';
  import DetailPart from './detail';
  import BindCostModel from './form/bind-cost-model';
  import BindInvoice from './form/bind-invoice'
  export default {
    components: {
      SearchPart,
      BindOrgGoodsForm,
      DetailPart,
      BindCostModel,
      BindInvoice
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          contractState: '1'
        },
        dialogComponents: {
          0: addForm,
          1: BindOrgGoodsForm,
          2: DetailPart,
          3: BindCostModel,
          4: BindInvoice
        },
        orgType: {
          0: {'title': '正常', 'num': 0, 'contractState': '1'},
          1: {'title': '停用', 'num': 0, 'contractState': '0'}
        },
        defaultPageRight: {'width': '900px', 'padding': 0},
      };
    },
    watch: {
      filters: {
        handler: function (val) {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
    },
    methods: {
      changeType(item, key) {
        this.filters.contractState = item.contractState;
      },
      isShowIcon(item, key, activeStatus) {
        return item.contractState === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.contractState === activeStatus
        };
      },
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      resetRightBox() {
        this.defaultPageRight.width = '900px';
        this.showIndex = -1;
        this.currentItemId = '';
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = Contact.queryNew;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        Contact.queryStateNum(Object.assign({}, params, {contractState: null})).then(res => {
          let data = res.data.data;
          utils.setStatusCount(this.orgType, data, 'contractState');
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.form = item;
        this.showPart(0);
      },
      bind(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.form = item;
        this.showPart(1);
      },
      bindCost(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.form = item;
        this.showPart(3);
      },
      showDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.form = item;
        this.showPart(2);
      },
      start(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.$confirmOpera(`是否启用合同"${item.contractName}"`, () => {
          this.$httpRequestOpera(Contact.start(item), {
            successTitle: '启用成功',
            errorTitle: '启用失败',
            success: (res) => {
              if (res.data.code === 200) {
                this.queryList(this.pager.currentPage);
              } else {
                this.$notify.error({message: res.data.msg});
              }
            }
          });
        });
      },
      stop(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.$confirmOpera(`是否停用合同"${item.contractName}"`, () => {
          this.$httpRequestOpera(Contact.stop(item), {
            successTitle: '停用完成',
            errorTitle: '停用失败',
            success: (res) => {
              if (res.data.code === 200) {
                this.queryList(this.pager.currentPage);
              } else {
                this.$notify.error({message: res.data.msg});
              }
            }
          });
        });
      },
      addInvoice(item) {
        this.currentItem = item;
        this.currentItemId = item.contractId;
        this.form = item;
        this.defaultPageRight.width = '700px';
        this.showPart(4);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
