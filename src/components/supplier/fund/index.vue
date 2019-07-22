<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="perms[0]">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="10">单位名称</el-col>
        <el-col :span="8">账户余额</el-col>
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
        <div :class="[{'active':currentItemId===item.orgAccountId}]"
             class="order-list-item order-list-item-bg no-pointer"
             v-for="item in dataList">
          <el-row>
            <el-col :span="10" class="R">{{item.orgName}}</el-col>
            <el-col :span="8" class="R">{{item.balance | formatMoney}}</el-col>
            <el-col :span="6" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="perms[2]">删除</des-btn>
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
  import {capitalAccount} from '@/resources';

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
        const http = capitalAccount.query;
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
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.orgAccountId;
        this.$confirmOpera(`是否删除单位"${item.orgName}"`, () => {
          this.$httpRequestOpera(capitalAccount.delete(item.orgAccountId), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: (res) => {
              if (res.data.code === 200) {
                this.queryList(1);
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
