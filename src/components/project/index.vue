<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'add-project'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.projectState" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="8">项目名称</el-col>
        <el-col :span="4">项目编号</el-col>
        <el-col :span="3">业务员</el-col>
        <el-col :span="3">所属部门</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="4">操作</el-col>
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
        <div :class="[{'active':currentItemId===item.projectId}]"
             class="order-list-item order-list-item-bg no-pointer" v-for="item in dataList">
          <el-row>
            <el-col :span="8">{{item.projectName}}</el-col>
            <el-col :span="4">{{item.projectNumber}}</el-col>
            <el-col :span="3">{{item.businessManageName}}</el-col>
            <el-col :span="3">{{item.companyDepartmentName}}</el-col>
            <el-col :span="2">
              {{item.projectState === '0' ? '停用': '启用'}}
            </el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'edit-project'">编辑</des-btn>
              <des-btn @click="start(item)" icon="start" v-has="'enable-project'" v-show="item.projectState === '0'">
                启用
              </des-btn>
              <des-btn @click="stop(item)" icon="stop" v-has="'enable-project'" v-show="item.projectState === '1'">停用
              </des-btn>
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
  import {project} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          projectState: '1'
        },
        dialogComponents: {
          0: addForm,
        },
        orgType: {
          0: {'title': '正常', 'num': 0, 'projectState': '1'},
          1: {'title': '停用', 'num': 0, 'projectState': '0'}
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
        this.filters.projectState = item.projectState;
      },
      isShowIcon(item, key, activeStatus) {
        return item.projectState === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.projectState === activeStatus
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
        this.currentItemId = '';
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = project.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        project.queryStateNum(Object.assign({}, params, {projectState: null})).then(res => {
          let data = res.data.data;
          utils.setStatusCount(this.orgType, data, 'projectState');
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItemId = item.projectId;
        this.form = item;
        this.showPart(0);
      },
      start(item) {
        this.currentItemId = item.projectId;
        this.$confirmOpera(`是否启用项目"${item.projectName}"`, () => {
          this.$httpRequestOpera(project.start(item), {
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
        this.currentItemId = item.projectId;
        this.$confirmOpera(`是否停用项目"${item.projectName}"`, () => {
          this.$httpRequestOpera(project.stop(item), {
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
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
