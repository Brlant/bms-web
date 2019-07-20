<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="''">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.status" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="6">名称</el-col>
        <el-col :span="5">计费类型</el-col>
        <el-col :span="4">业务类型</el-col>
        <el-col :span="3">是否阶梯</el-col>
        <el-col :span="3">状态</el-col>
        <el-col :span="3">操作</el-col>
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
            <el-col :span="6">{{item.billingTypeName}}</el-col>
            <el-col :span="5">{{item.billingType}}</el-col>
            <el-col :span="4">{{item.businessType}}</el-col>
            <el-col :span="3">{{item.ladderState === '0' ? '否' : '是'}}</el-col>
            <el-col :span="3">
              {{item.billingItemState === '0' ? '停用': '启用'}}
            </el-col>
            <el-col :span="3" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="''">编辑</des-btn>
              <des-btn @click="start(item)" icon="start" v-has="''" v-show="item.billingItemState === '0'">启用</des-btn>
              <des-btn @click="stop(item)" icon="stop" v-has="''" v-show="item.billingItemState === '1'">停用</des-btn>
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
  import {costItem} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          billingItemState: ''
        },
        dialogComponents: {
          0: addForm,
        },
        orgType: {
          1: {'title': '正常', 'num': 0, 'billingItemState': '1'},
          2: {'title': '停用', 'num': 0, 'billingItemState': '0'}
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
      changeType(item, key) {
        this.filters.billingItemState = item.billingItemState;
      },
      isShowIcon(item, key, activeStatus) {
        return item.billingItemState === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.billingItemState === activeStatus
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
        const http = costItem.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        costItem.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = data['all'];
          this.orgType[1].num = data['valid'];
          this.orgType[2].num = data['stop'];
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.form = item;
        this.showPart(0);
      },
      start(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否启用计费项"${item.contractName}"`, () => {
          this.$httpRequestOpera(costItem.start(item.id), {
            successTitle: '启用成功',
            errorTitle: '启用失败',
            success: (res) => {
              if (res.data.code === 200) {
                item.billingItemState = '1';
              } else {
                this.$notify.error({message: res.data.msg});
              }
            }
          });
        });
      },
      stop(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否停用计费项"${item.contractName}"`, () => {
          this.$httpRequestOpera(costItem.stop(item.id), {
            successTitle: '停用完成',
            errorTitle: '停用失败',
            success: (res) => {
              if (res.data.code === 200) {
                item.billingItemState = '0';
              } else {
                this.$notify.error({message: res.data.msg});
              }
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
