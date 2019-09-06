<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <el-button  slot="btn" @click="add" plain size="small" v-has="'add-advance-collection-jobs'">
        <f-a class="icon-small" name="plus"></f-a>
        添加
      </el-button>
    </search-part>
    <el-table :data="dataList" v-loading="loadingData"
              border class="clearfix mt-20" ref="orderDetail">
      <el-table-column prop="customerName" label="甲方" width="200">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column label="预收金额" width="220">
        <template slot-scope="scope">{{scope.row.advanceAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column label="发票号" width="200">
        <template slot-scope="scope">{{scope.row.invoiceNumber}}</template>
      </el-table-column>
      <el-table-column label="发票日期" width="100">
        <template slot-scope="scope">{{scope.row.invoiceTime | date}}</template>
      </el-table-column>
      <el-table-column label="回款日期" width="100">
        <template slot-scope="scope">{{scope.row.backAmountTime | date}}</template>
      </el-table-column>
      <el-table-column label="银行名称">
        <template slot-scope="scope">{{scope.row.bankName}}</template>
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
      <component :formItem="form" :index="showIndex" :statusType="statusType" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {preRecords} from '@/resources';
  import addForm from './form/add-form.vue';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {},
        dialogComponents: {
          0: addForm,
        },
        defaultPageRight: {'width': '700px', 'padding': 0}
      };
    },
    computed: {
      perms() {
        return this.$route.meta.perms || {};
      }
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
      this.queryList(1);
    },
    methods: {
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      resetRightBox() {
        this.defaultPageRight.width = '700px';
        this.showIndex = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = preRecords.query;
        const params = this.queryUtil(http, pageNo);
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.orgAccountId;
        this.form = item;
        this.showPart(0);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
