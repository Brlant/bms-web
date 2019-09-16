<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'add-billing-model'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.billingModelState" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="10">模板名称</el-col>
        <el-col :span="6">是否绑定货品计费</el-col>
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
        <div :class="[{'active':currentItemId===item.billingModelId}]"
             class="order-list-item order-list-item-bg" @click="showDetail(item)"
             v-for="item in dataList">
          <el-row>
            <el-col :span="10">{{item.billingModelName}}</el-col>
            <el-col :span="6">{{item.billingModelType === '1' ? '是' : '否'}}</el-col>
            <el-col :span="2">
              {{item.billingModelState === '0' ? '停用': '启用'}}
            </el-col>
            <el-col :span="6" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'edit-billing-model'">编辑</des-btn>
              <des-btn @click="start(item)" icon="start" v-has="'enable-billing-model'"
                       v-show="item.billingModelState === '0'">启用</des-btn>
              <des-btn @click="stop(item)" icon="stop" v-has="'disable-billing-model'"
                       v-show="item.billingModelState === '1'">停用</des-btn>
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
  import {costModel} from '@/resources';
  import Detail from './detail.vue';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          billingModelState: '1'
        },
        dialogComponents: {
          0: addForm,
          1: Detail
        },
        orgType: {
          0: {'title': '正常', 'num': 0, 'billingModelState': '1'},
          1: {'title': '停用', 'num': 0, 'billingModelState': '0'}
        },
        defaultPageRight: {'width': '920px', 'padding': 0}
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
        this.filters.billingModelState = item.billingModelState;
      },
      isShowIcon(item, key, activeStatus) {
        return item.billingModelState === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.billingModelState === activeStatus
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
        this.defaultPageRight.width = '900px';
        this.form = item;
        this.showPart(1);
      },
      queryList(pageNo) {
        const http = costModel.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        costModel.queryStateNum(params).then(res => {
          let data = res.data.data;
          this.orgType[0].num = data['enableState'];
          this.orgType[1].num = data['disableState'];
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
        this.showPart(0);
      },
      start(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.$confirmOpera(`是否启用计费模板"${item.billingModelName}"`, () => {
          this.$httpRequestOpera(costModel.start(item), {
            successTitle: '启用成功',
            errorTitle: '启用失败',
            success: (res) => {
              if (res.data.code === 200) {
                this.queryList(this.pager.currentPage);
                this.resetRightBox()
              } else {
                this.$notify.error({message: res.data.msg});
              }
            }
          });
        });
      },
      stop(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.$confirmOpera(`是否停用计费模板"${item.billingModelName}"`, () => {
          this.$httpRequestOpera(costModel.stop(item), {
            successTitle: '停用完成',
            errorTitle: '停用失败',
            success: (res) => {
              if (res.data.code === 200) {
                this.queryList(this.pager.currentPage);
                this.resetRightBox()
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
