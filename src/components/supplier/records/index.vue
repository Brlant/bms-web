<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="10">单位名称</el-col>
        <el-col :span="7">金额</el-col>
        <el-col :span="7">发生时间</el-col>
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
        <div :class="[{'active':currentItemId===item.id}]" class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="10" class="R">{{item.orgName}}</el-col>
            <el-col :span="7" class="R">{{item.changeAmount | formatMoney}}</el-col>
            <el-col :span="7" class="R">{{item.createTime | time}}</el-col>
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
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {AccountTurnover} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {

        },
        defaultPageRight: {'width': '700px', 'padding': 0}
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
      queryList(pageNo) {
        const http = AccountTurnover.query;
        const params = this.queryUtil(http, pageNo);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
