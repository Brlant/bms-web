<style lang="scss">
  .total-info {
    align-items: flex-end;
    position: absolute;
    right: 20px;

    &__item {
      margin: 0 10px;
      font-weight: 500;
    }
  }
  .collect-status-list {
    min-width: min-content;
    .status-item {
      height: 60px !important;
      cursor: auto !important;
      width: 130px !important;
      margin-right: 5px !important;
      font-size: 12px;

      .status-num {
        font-size: 16px !important;
      }
      > div {
        box-sizing: border-box;
        padding: 10px 4px 4px 4px;
      }
      &:hover {
        height: 60px !important;
        > div.status-bg {
          opacity: 0.3;
        }
      }
    }
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult" ref="search">
      <template slot="btn">
        <el-button @click="exportExcel" plain size="small" v-has="'export-boa-total'">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </template>
    </search-part>
    <el-scrollbar style="height: 75px" v-if="totalCount">
      <status-list  class="collect-status-list" :statusList="totalCount" :checkStatus="()=>{}"></status-list>
    </el-scrollbar>
    <el-table :data="dataList" v-loading="loadingData" row-key="billingOfAccountId"
              border class="clearfix mt-20" ref="table">
      <el-table-column prop="customerName" label="甲方" width="180">
      </el-table-column>
      <el-table-column prop="contractName" label="合同" width="300">
      </el-table-column>
      <el-table-column prop="projectName" label="项目" width="140">
      </el-table-column>
      <el-table-column prop="billingTotal" label="计费合计" width="120">
      </el-table-column>
      <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计">
      </el-table-column>
      <el-table-column prop="noAccountCheckAmount" label="实际计费未对账" width="150">
      </el-table-column>
      <el-table-column prop="accountCheckAmount" label="实际计费已对账" width="150">
      </el-table-column>
      <el-table-column prop="invoiceAmount" label="已开票" width="120">
      </el-table-column>
      <el-table-column prop="noInvoiceAmount" label="已对账未开票" width="150">
      </el-table-column>
      <el-table-column prop="backAmount" label="已回款金额" width="150">
      </el-table-column>
      <el-table-column prop="nobackAmount" label="已开票未回款金额" width="150px">
      </el-table-column>
    </el-table>

<!--    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">-->
<!--      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"-->
<!--                     :page-sizes="[10,20,50,100, 100000]"-->
<!--                     :total="pager.count" @current-change="handleCurrentChange"-->
<!--                     @size-change="handleSizeChange"-->
<!--                     layout="total, sizes, prev, pager, next, jumper">-->
<!--      </el-pagination>-->
<!--    </div>-->
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {accountBill, contractAccountDetail} from '@/resources';
  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    computed: {
      totalCount() {
        if(!this.dataList.length) return null;
        let obj =  {
          0: {'title': '计费合计', 'num': 0},
          1: {'title': '实际计费合计', 'num': 0},
          2: {'title': '实际计费未对账', 'num': 0},
          3: {'title': '实际计费已对账', 'num': 0},
          4: {'title': '已开票', 'num': 0},
          5: {'title': '已对账未开票', 'num': 0},
          6: {'title': '已回款金额', 'num': 0},
          7: {'title': '已开票未回款金额', 'num': 0},
        };
        this.dataList.forEach(i => {
          obj[0].num += Number(i.billingTotal);
          obj[1].num += Number(i.realityBillingTotal);
          obj[2].num += Number(i.noAccountCheckAmount);
          obj[3].num += Number(i.accountCheckAmount);
          obj[4].num += Number(i.invoiceAmount);
          obj[5].num += Number(i.noInvoiceAmount);
          obj[6].num += Number(i.backAmount);
          obj[7].num += Number(i.nobackAmount);
        });
        Object.values(obj).forEach(obj => {
          obj.num = this.$formatMoney(obj.num)
        });
        return obj;
      }
    },
    mounted() {
      this.queryList(1);
    },
    methods: {
      searchResult: function (search) {
        this.queryList(1)
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.queryList(1);
      },
      handleCurrentChange(val) {
        this.queryList(val);
      },
      queryList() {
        this.loadingData = true;
        let params= Object.assign({}, this.$refs.search.searchCondition);
        this.$http.post('/bms-boa/query-boa-total', params).then(res => {
          this.dataList = res.data;
          this.loadingData = false;
        })
      },
      exportExcel() {
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        this.$http.post('/bms-boa/export-boa-total', this.$refs.search.searchCondition).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch(() => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        });
      }
    }
  };
</script>
