<template>
  <div class="order-page">
    <search-part ref="search" @search="searchResult" :statusList="orgType">
      <template slot="btn">
        <el-button  v-has="'batch-collection-jobs-statement'" @click="batchCreateReceiveTask" plain size="small"
                   v-show="filters.statementType === '2'">
          <f-a class="icon-small" name="allot"></f-a>
          批量生成收款作业
        </el-button>
        <el-button @click="exportExcel" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出计费明细
        </el-button>
        <el-button @click="exportCloseExcel" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
        <el-button @click="exportCloseBill" plain size="small" v-has="'export-invoicing-after-info'">
          <f-a class="icon-small" name="export"></f-a>
          导出开票明细
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.statementType" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass" v-if="!filters.statementType.includes(',')"></status-list>
    <el-table :data="dataList" v-loading="loadingData"
              @selection-change="selectionChange"
              :row-style="{cursor: 'pointer'}" @row-click="showDetail"
              border class="clearfix mt-20" ref="table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="customerName" label="甲方" min-width="200">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同" min-width="200">
        <template slot-scope="scope">{{scope.row.contractName}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckNo" label="结算单号" width="150">
        <template slot-scope="scope">{{scope.row.statementNo}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckAmount" label="结算单金额" width="120">
        <template slot-scope="scope">{{scope.row.statementAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="待回款金额" width="120">
        <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="结算日期" width="170">
        <template slot-scope="scope">{{scope.row.statementTime | date}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="回款日期" width="170">
        <template slot-scope="scope">{{scope.row.backAmountTime | date}}</template>
      </el-table-column>
      <el-table-column prop="statementType" label="状态" width="120">
        <template slot-scope="scope">
          {{orgType[scope.row.statementType < 9  ?  1*scope.row.statementType + 1 : scope.row.statementType] &&
          orgType[scope.row.statementType < 9  ? 1*scope.row.statementType + 1 : scope.row.statementType].title}}
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="120" v-if="filters.statementType < 4" fixed="right">
        <template slot-scope="scope">
          <des-btn icon="edit" v-has="'edit-statement'" @click="edit(scope.row, 0)" v-show="filters.statementType === '0'">编辑</des-btn>
          <des-btn icon="edit" v-has="'edit-statement'" @click="edit(scope.row, 1)"
                   v-show="['1'].includes(filters.statementType)">开具发票</des-btn>
          <des-btn icon="edit" v-has="'edit-statement'" @click="edit(scope.row, 2)"
                   v-show="['2','3'].includes(filters.statementType)">编辑发票</des-btn>
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
      <component :formItem="form" :dataList="dySelectList" :index="showIndex" :orgType="orgType" :is="currentPart"
                 @change="change"
                 @right-close="resetRightBox" :addType="addType"/>
    </page-right>

  </div>
</template>
<script>
import SearchPart from './search';
import addForm from './form/add-form.vue';
import CommonMixin from '@/mixins/commonMixin';
import {closeAccount} from '@/resources';
import Detail from './detail.vue';
import receiveTask from './receiveTask';
import utils from '@/tools/utils'

export default {
  components: {
    SearchPart,
    receiveTask
  },
  mixins: [CommonMixin],
  data() {
    return {
      filters: {
        statementType: '0'
      },
        dialogComponents: {
          0: addForm,
          1: Detail,
          2: receiveTask
        },
        orgType: {
          0: {'title': '全部', 'num': 0, 'statementType': '', isAll: true},
          1: {'title': '待审核', 'num': 0, 'statementType': '0'},
          2: {'title': '待开票', 'num': 0, 'statementType': '1'},
          3: {'title': '待回款', 'num': 0, 'statementType': '2'},
          4: {'title': '已回款', 'num': 0, 'statementType': '3'},
          9: {'title': '审核未通过', 'num': 0, 'statementType': '9'},
        },
        defaultPageRight: {'width': '920px', 'padding': 0},
        billItems: [],
        addType: -1,
        selectList: [],
        dySelectList: []
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
      exportExcel() {
        if (!this.selectList.length) return this.$notify.info({message: '请选择结算单'});
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        closeAccount.export(this.selectList.map(m => m.statementId)).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch(() => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        });
      },
      exportCloseExcel() {
        this.$refs.search.setSearchCondition();
        let search = this.$refs.search.searchCondition;
        let obj = {};
        if(!search.statementType[0]) {
          obj.statementType = this.filters.statementType.includes(',') ? '0' : this.filters.statementType;
        } else {
          obj.statementType = search.statementType.join(',');
        }
        let filters = Object.assign({}, this.filters, search, obj);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        closeAccount.exportCloseExcel(filters).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch(() => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        });
      },
      exportCloseBill() {
        this.$refs.search.setSearchCondition();
        let search = this.$refs.search.searchCondition;
        let obj = {};
        if(!search.statementType[0]) {
          obj.statementType = this.filters.statementType.includes(',') ? '0' : this.filters.statementType;
        } else {
          obj.statementType = search.statementType.join(',');
        }
        let filters = Object.assign({}, this.filters, search, obj);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        closeAccount.exportCloseBill(filters).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch((error) => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.info({
            duration: 2000,
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      selectionChange(val) {
        this.selectList = val;
      },
      batchCreateReceiveTask() {
        if (!this.selectList.length) return this.$notify.info({message: '请选择结算单'});
        let obj = {};
        this.selectList.forEach(i => obj[i.customerId] = '');
        if(Object.keys(obj).length > 1) {
          return this.$notify.info({message: '请选择相同客户的结算单'})
        }
        let list = JSON.parse(JSON.stringify(this.selectList));
        list.forEach(i => {
          i.collectionAmount = utils.autoformatDecimalPoint(i.unreturnedAmount);
          i.collectionType = i.advanceCollectionType ? '0' : '1';
        });
        this.dySelectList = list;
        this.showPart(2);
      },
      changeType(item, key) {
        this.filters.statementType = item.statementType;
      },
      isShowIcon(item, key, activeStatus) {
        return item.statementType === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.statementType === activeStatus
        };
      },
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      searchResult: function (search) {
        let obj = {};
        if(!search.statementType[0]) {
          obj.statementType = this.filters.statementType.includes(',') ? '0' : this.filters.statementType;
        } else {
          obj.statementType = search.statementType.join(',');
        }
        this.filters = Object.assign({}, this.filters, search, obj);
      },
      resetRightBox() {
        this.defaultPageRight.width = '920px';
        this.showIndex = -1;
        this.currentItemId = '';
        this.currentItem = {};
        this.addType = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      showDetail(item, column) {
        if (column.type === 'selection') {
          this.$refs.table.toggleRowSelection(item);
        } else {
          this.currentItem = item;
          this.currentItemId = item.billingModelId;
          this.defaultPageRight.width = '900px';
          this.form = item;
          this.showPart(1);
        }

      },
      queryList(pageNo) {
        this.selectList = [];
        const http = closeAccount.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        closeAccount.queryStateNum( Object.assign({}, params, {statementType: null})).then(res => {
          let data = res.data.data;
          utils.setStatusCount(this.orgType, data, 'statementType');
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item, addType) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.form = item;
        this.defaultPageRight.width = '700px';
        this.addType = addType;
        this.showPart(0);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
