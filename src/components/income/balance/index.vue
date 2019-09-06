<template>
  <div class="order-page">
    <search-part @search="searchResult">
    </search-part>
    <el-table :data="dataList" v-loading="loadingData"
              border class="clearfix mt-20" ref="orderDetail">
      <el-table-column prop="customerName" label="单位名称">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="contractName" label="预收余额" width="200">
        <template slot-scope="scope">{{scope.row.advanceBalance | formatMoney}}</template>
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
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {preBalance} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {},
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
        const http = preBalance.query;
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
