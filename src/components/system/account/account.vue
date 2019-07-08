<style lang="scss" scoped>

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="searchType"><i
                class="el-icon-t-search"></i> </a>
          </span>
          单位用户管理
        </h2>
        <div class="search-left-box" v-show="showTypeSearch">
          <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
        </div>
        <div v-if="!currentItem.id" class="empty-info">
          暂无信息
        </div>
        <div v-else>
          <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight"
                        @scroll="scrollLoadingData">
            <div>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div class="id-part">
                    系统代码 {{item.manufacturerCode }}
                  </div>
                  <div>
                    {{item.name }}
                  </div>
                </li>
              </ul>
            </div>
          </el-scrollbar>
          <div class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight">
          <div class="scrollbar-content">
           <span class="pull-right" style="margin-top: 10px">
                <span class="btn-search-toggle open" v-show="showSearch">
                    <single-input v-model="keyTxt" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                    <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                </span>
               <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="el-icon-t-search"></i>
               </a>
                <a href="#" v-has="'ccs-org-user-add'" class="btn-circle" @click.stop.prevent="add">
                  <i class="el-icon-t-plus"></i>
                </a>
            </span>
            <h2 class="org-name-h2" v-show="orgNo">系统代码:{{orgNo}}</h2>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>姓名</th>
                <th>角色</th>
                <th>手机号码</th>
                <th>邮箱</th>
                <th>状态</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-show="dataRows.length === 0">
              <tr>
                <td colspan="10" class="text-center">
                  <div class="empty-info">暂无信息</div>
                </td>
              </tr>
              </tbody>
              <tbody>
              <tr v-for="row in dataRows">
                <td>
                  {{row.name}}
                  <el-tag type="success" v-show="row.adminFlag">主账号</el-tag>
                </td>
                <td>
                  {{ row.list | formatRole }}
                </td>
                <td>
                  {{row.phone}}
                </td>
                <td>
                  {{row.email}}
                </td>
                <td>
                  <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(row.status)"></dict>
                </td>
                <td class="list-op">
                  <a v-has="'ccs-org-user-edit'" class="btn-line-block" href="#" @click.stop.prevent="edit(row)"><i
                    class="el-icon-t-edit"></i>编辑</a>
                  <oms-forbid v-has="'ccs-org-user-edit'" class="btn-line-block" :item="row" @forbided="forbid"
                              :tips='"确认停用单位用户\""+row.name+"\"？"'
                              v-show="row.status!=='2'">
                    <i class="el-icon-t-forbidden"></i>停用
                  </oms-forbid>
                  <oms-forbid v-has="'ccs-org-user-edit'" class="btn-line-block" :item="row" @forbided="useNormal"
                              :tips='"确认启用单位用户 \""+row.name+"\" ?"'
                              v-show="row.status=== '2' "><i
                    class="el-icon-t-start"></i>启用
                  </oms-forbid>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center" v-show="dataRows.length">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pager.currentPage"
                             :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="pager.count">
              </el-pagination>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" :orgId="filters.orgId"
                 @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {BaseInfo, http, OrgUser, User} from '../../../resources';
  import editForm from './form/form.vue';

  export default {
    components: {
      editForm
    },
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        filters: {
          orgId: ''
        },
        form: {list: [{roleId: ''}]},
        formTitle: '新增',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
          totalPage: 1
        },
        typePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        orgName: '', // 单位名称
        currentItem: {}, //  左边列表点击时，添加样式class
        isInit: true,
        orgNo: ''
      };
    },
    filters: {
      formatRole: function (list) {
        return list.map(m => m.title).join('，');
      }
    },
    computed: {
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
      }
    },
    mounted() {
      this.getOrgsList(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.orgName = '';
        this.getOrgsList(1);
      },
      'keyTxt': function () {
        this.getPageList(1);
      },
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getPageList(1);
      },
      handleCurrentChange(val) {
        this.getPageList(val);
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {

        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          deleteFlag: false,
          keyWord: this.typeTxt
        }, this.filters);

        BaseInfo.query(params).then(res => {
          if (params.keyWord !== this.typeTxt) return;
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.orgName = this.showTypeList[0].name;
              this.filters.orgId = this.currentItem.id;
              this.getPageList(1);
            } else {
              this.currentItem = Object.assign({'id': ''});
              this.filters.orgId = '';
            }
          }
          this.goAccountUrl();
          this.typePager.totalPage = res.data.totalPage;
          //           this.showTypeList = res.data.list;
          //           if (this.showTypeList.length > 0) {
          //             this.orgName = this.showTypeList[0].name;
          //           }
          //           this.currentItem = Object.assign({}, {"id": ""}, this.showTypeList[0]);
          //           this.filters.orgId = "";
          this.isInit = false;
        });
        //        this.$nextTick(() => {
        //          this.filters.orgId = this.currentItem.id;
        //        });
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      getPageList: function (pageNo) {
        if (!this.filters.orgId) return;
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.keyTxt
        });
        OrgUser.queryOrgInfo(this.filters.orgId, data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.getCurrentOrg(this.filters.orgId);
        });

      },
      add: function () {
        this.action = 'add';
        this.formTitle = '新增 ' + this.orgName + '用户';
        this.form = {
          list: [{roleId: ''}],
          orgId: this.filters.orgId
        };
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑 ' + this.orgName + '用户';
        this.oldItem = item;
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      remove: function () {

      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '2';
        User.stopUser(itemTemp.id).then(() => {
          item.status = '2';
          this.$notify.success({
            title: '成功',
            message: '已成功停用单位用户"' + itemTemp.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '0';
        User.enableUser(itemTemp.id).then(() => {
          item.status = '0';
          this.$notify.success({
            title: '成功',
            message: '已成功启用单位用户"' + item.name + '"'
          });
        });
      },
      removeType: function (item) {
        BaseInfo.delete(item.id).then(() => {
          this.getOrgsList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功删除单位用户"' + item.name + '"'
          });
        });
      },
      showType: function (item) {
        this.filters.orgId = item.id;
        this.orgName = item.name;
        this.currentItem = item;
        this.goAccountUrl();
      },
      itemChange: function (formData) {
        if (!formData.id) {
          this.getPageList(1);
        } else {
          let index = -1;
          this.dataRows.forEach((f, key) => {
            if (f.id === formData.id) {
              index = key;
            }
          });
          if (index !== -1) {
            this.dataRows.splice(index, 1, formData);
          } else {
            this.getPageList(this.pager.currentPage);
          }
        }
        this.showRight = false;
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      },
      goAccountUrl() {
        /*
         if (this.currentItem.id) {
         this.$router.replace('/#/permission/account/' + this.currentItem.id);
         // history.pushState({}, this.currentItem.name, '/#/permission/account/' + this.currentItem.id);
         }
         */
      },
      getCurrentOrg(id) {
        http.get('/orgs/' + id).then(res => {
          this.orgNo = res.data.orgDto.manufacturerCode;
        });
      }
    }
  };
</script>
