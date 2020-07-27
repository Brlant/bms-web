<style lang="scss" scoped="">


  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .role-perm-list {
    h2 {
      font-size: 14px;
      margin: 0;
      padding: 0;
      line-height: 24px;
      font-weight: normal;
    }

    ul {
      margin: 10px 0;

      li {
        padding: 5px 10px;
        display: inline-block;
        border: 1px solid #eee;
        margin-right: 20px;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }

    .group-list {

      border: 1px solid #eee;
      padding: 10px 20px;
      margin: 10px 0;
    }

    .d-table-col-wrap {
      overflow: auto;
      padding-right: 8px;

    }
  }

  .d-table-col-wrap {
    padding-right: 8px;
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':item.usableStatus==filters.usableStatus}"
             v-for="(item,key) in orgType"
             @click="filters.usableStatus=item.usableStatus">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div class="status-title"><i class="el-icon-caret-right"
                                       v-if="item.usableStatus==filters.usableStatus"></i>{{item.title}}<span
            class="status-num">{{item.num}}</span></div>
        </div>
        <span class="btn-group-right">
            <span class="btn-search-toggle open" style="margin-right: 10px">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索"></single-input>
            </span>
          <perm label="wms-access-platfrom-permission-export">
           <span @click.stop.prevent="exportRoleInfo">
               <a href="#" class="btn-circle" @click.prevent=""
                  style="margin-right: 5px"><i
                 class="el-icon-t-print"></i> </a>导出角色权限信息
            </span>
          </perm>
            <perm label="access-role-add">
               <a href="#" class="btn-circle" @click.stop.prevent="addType"><i class="el-icon-t-plus"></i></a>新增
            </perm>
        </span>
      </div>

      <el-table :data="showTypeList" :row-style="{cursor: 'pointer'}" @row-click="showType"
                border class="clearfix mt-20" ref="orderDetail" v-loading="loadingData">
        <el-table-column prop="title" label="角色" min-width="200"></el-table-column>
        <el-table-column prop="usableStatus" label="状态" width="100px">
          <template slot-scope="scope">
            {{ scope.row.usableStatus == 1 ? '可用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="300">
          <template slot-scope="scope">
            <des-btn icon="edit" v-has="'access-role-edit'" @click="edit(scope.row)">编辑</des-btn>
            <des-btn icon="forbidden" v-has="'wms-access-role-stop'" @click="forbid(scope.row)"
                     v-show="scope.row.usableStatus == 1">停用
            </des-btn>
            <des-btn icon="start" v-has="'wms-access-role-start'" @click="useNormal(scope.row)"
                     v-show="scope.row.usableStatus == 0">启用
            </des-btn>
            <des-btn icon="allot" v-has="'bms-dpr-add'" @click="editDataRight(scope.row)">数据权限</des-btn>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="text-center" v-show="showTypeList.length && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px'}">
      <role-form :formItem="form" :action="action" @close="showRight=false" :actionType="showRight"
                 @changed="change"></role-form>
    </page-right>
    <page-right :show="showDetailRight" @right-close="resetRightBox" :css="{'width':'800px'}">
      <detail :formItem="form" :showDetailRight="showDetailRight" :checkedMenuList="checkedMenuList"
              @close="showDetailRight=false"
              @changed="change"></detail>
    </page-right>
    <page-right :show="showDataRight" @right-close="resetRightBox" :css="{'width':'800px'}">
      <data-right :formItem="form" :showDataRight="showDataRight" @close="showDataRight=false"
                  @changed="change"></data-right>
    </page-right>
  </div>
</template>
<script>
  import {Access} from '@/resources';
  import roleForm from './form/form.vue';
  import roleMixin from '@/mixins/roleMixin';
  import utils from '@/tools/utils';
  import detail from './detail';
  import dataRight from './form/data-right';

  export default {
    components: {roleForm, detail, dataRight},
    mixins: [roleMixin],
    data: function () {
      return {
        showRight: false,
        showDetailRight: false,
        showDataRight: false,
        resData: {},
        showTypeList: [],
        form: {},
        action: '',
        roleText: '',
        orgType: {
          0: {'title': '所有', 'num': '', 'usableStatus': null},
          1: {'title': '正常', 'num': '', 'usableStatus': 1},
          2: {'title': '停用', 'num': '', 'usableStatus': 0}
        },
        filters: {
          usableStatus: 1,
          keyWord: ''
        },
        activeStatus: 1,
        menuList: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        loadingData: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 30) + 'px';
        return height;
      },
      user() {
        return this.$store.state.user;
      },
      checkedMenuList() {
        let checkedMenuList = JSON.parse(JSON.stringify(this.menuList));
        if (!this.resData.id) return [];
        let perms = this.resData.permissionList;
        if (!checkedMenuList || !perms) return [];
        this.getMenus(checkedMenuList, perms);
        return checkedMenuList;
      }
    },
    mounted() {
      this.getPageList(1);
      this.getMenuList();
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      },
      user() {
        this.getMenuList(false);
      }
    },
    methods: {
      exportRoleInfo() {
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: this.$route.path,
          text: '拼命导出中'
        });
        let params = {
          objectId: 'bms-system', type: 0
        };
        this.$http.get('/access/statement/permission/export', {params}).then(res => {
          utils.download(res.data.path);
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path,
            text: '拼命导出中'
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path,
            text: '拼命导出中'
          });
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getPageList(1);
      },
      handleCurrentChange(val) {
        this.getPageList(val);
      },
      getMenuList: function (cache = true) {
        this.getRoleMenus(cache).then(res => {
          this.menuList = res.data;
        });
      },
      getCheckedMenu: function (data, permissionList) {
        for (let i = 0; i < data.length; i++) {
          if (permissionList.indexOf(data[i].id) === -1) {
            data.splice(i, 1);
            i--;
          } else if (data[i].children) {
            this.getCheckedMenu(data[i].children, permissionList);
          }
        }
      },
      getMenus: function (checkedMenuList, permissionList) {
        let permissionIdList = [];
        permissionList.forEach(val => {
          permissionIdList.push(val.name);
        });
        this.getCheckedMenu(checkedMenuList, permissionIdList);
      },
      getPageList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyword: this.typeTxt,
          deleteFlag: false,
          objectId: 'bms-system'
        }, this.filters);
        this.loadingData = true;
        Access.query(param).then(res => {
          if (param.keyword !== this.typeTxt) return;
          this.showTypeList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          this.queryStatusNum(param);
        });
      },
      queryStatusNum: function (params) {
        Access.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = data['all'];
          this.orgType[1].num = data['valid'];
          this.orgType[2].num = data['stop'];
        });
      },
      queryRoleDetail: function (id) {
        if (!id) return;
        return Access.getRoleDetail(id).then(res => {
          this.resData = res.data;
        });
      },
      resetRightBox: function () {
        this.showRight = false;
        this.form = {};
        this.resData = {};
        this.showDetailRight = false;
        this.showDataRight = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {};
        this.showRight = true;
      },
      edit: function (item) {
        this.queryRoleDetail(item.id).then(res => {
          this.action = 'edit';
          this.form = JSON.parse(JSON.stringify(this.resData));
          let checkedIdList = [];
          // 勾选已经有的权限
          this.form.permissionList.forEach(val => {
            checkedIdList.push(val.name);
          });
          this.form.checkedIdList = checkedIdList;
          this.showRight = true;
        });
      },
      showType: function (item) {
        this.queryRoleDetail(item.id).then(res => {
          this.action = 'edit';
          this.form = JSON.parse(JSON.stringify(this.resData));
          let checkedIdList = [];
          // 勾选已经有的权限
          this.form.permissionList.forEach(val => {
            checkedIdList.push(val.name);
          });
          this.form.checkedIdList = checkedIdList;
          this.showDetailRight = true;
        });
      },
      editDataRight(item) {
        this.queryRoleDetail(item.id).then(res => {
          this.form = JSON.parse(JSON.stringify(this.resData));
          let checkedIdList = [];
          // 勾选已经有的权限
          this.form.permissionList.forEach(val => {
            checkedIdList.push(val.name);
          });
          this.form.checkedIdList = checkedIdList;
          this.showDataRight = true;
        });
      },
      forbid: function (item) {
        this.$confirm('确认停用角色"' + item.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Access.update(item.id, {usableStatus: 0, id: item.id}).then(() => {
            this.getPageList(this.pager.currentPage);
            this.$notify.success({
              title: '成功',
              message: '已成功停用角色"' + item.title + '"'
            });
          });
        });
      },
      useNormal: function (item) {
        this.$confirm('确认启用角色"' + item.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Access.update(item.id, {usableStatus: 1, id: item.id}).then(() => {
            this.getPageList(this.pager.currentPage);
            this.$notify.success({
              title: '成功',
              message: '已成功启用角色"' + item.title + '"'
            });
          });
        });
      },

      change: function (item) {
        this.resetRightBox();
        this.getPageList(this.pager.currentPage);
      }
    }
  };
</script>
