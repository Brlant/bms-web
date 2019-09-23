<template>
  <div class="order-page">
    <search-part @search="searchResult">
    </search-part>
      <status-list :activeStatus="filters.accountCheckType" :statusList="orgType"
                   :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                   :formatClass="formatClass"></status-list>
    <el-table :data="dataList" v-loading="loadingData"
              :row-style="{cursor: 'pointer'}" @row-click="showDetail"
              border class="clearfix mt-20" ref="orderDetail">
      <el-table-column prop="accountCheckNo" label="对账单号">
        <template slot-scope="scope">{{scope.row.accountCheckNo}}</template>
      </el-table-column>
      <el-table-column prop="customerName" label="甲方">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同">
        <template slot-scope="scope">{{scope.row.contractName}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckAmount" label="对账单金额" width="200">
        <template slot-scope="scope">{{scope.row.accountCheckAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="实际对账金额" width="200">
        <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckType" label="状态" width="120">
        <template slot-scope="scope">
          {{orgType[scope.row.accountCheckType].title}}
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="120" v-if="filters.accountCheckType === '0' || filters.accountCheckType === '1'">
        <template slot-scope="scope">
          <des-btn icon="edit" v-has="'edit-account-check'" @click="edit(scope.row)">编辑</des-btn>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :orgType="orgType" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {accountBill} from '@/resources';
  import Detail from './detail.vue';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {
          accountCheckType: '0'
        },
        dialogComponents: {
          0: addForm,
          1: Detail
        },
        orgType: {
          0: {'title': '待确定', 'num': 0, 'accountCheckType': '0'},
          1: {'title': '待审核', 'num': 0, 'accountCheckType': '1'},
          2: {'title': '已审核', 'num': 0, 'accountCheckType': '2'},
          3: {'title': '审核不通过', 'num': 0, 'accountCheckType': '3'},
          9: {'title': '已取消', 'num': 0, 'accountCheckType': '9'},
        },
        defaultPageRight: {'width': '920px', 'padding': 0},
        billItems: []
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
      this.$store.state.costTypes.forEach(i => {
        this.billItems.push(...i.items);
      });
      this.queryList(1);
    },
    methods: {
      changeType(item, key) {
        this.filters.accountCheckType = item.accountCheckType;
      },
      isShowIcon(item, key, activeStatus) {
        return item.accountCheckType === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.accountCheckType === activeStatus
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
        this.defaultPageRight.width = '920px';
        this.showIndex = -1;
        this.currentItemId = '';
        this.currentItem = {};
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      showDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.defaultPageRight.width = '800px';
        this.form = item;
        this.showPart(1);
      },
      queryList(pageNo) {
        this.selectList = [];
        const http = accountBill.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        accountBill.queryStateNum(params).then(res => {
          let data = res.data.data;
          this.orgType[0].num = data['toBeConfirmed'];
          this.orgType[1].num = data['noCheck'];
          this.orgType[2].num = data['checkedNum'];
          this.orgType[3].num = data['notCheckedNum'];
          this.orgType[9].num = data['cancelNum'];
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.form = item;
        this.defaultPageRight.width = '600px';
        this.showPart(0);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
