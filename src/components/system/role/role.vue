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
    }
  }
</style>
<template>
  <div>
    <div>

      <status-list :activeStatus="filters.usableStatus" :statusList="orgType"
                   :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                   :formatClass="formatClass"></status-list>
      <div class="d-table">
        <div class="d-table-left">
          <div :style="'height:'+bodyHeight">
            <h2 class="header">
                <span class="pull-right">
                    <a v-has="'ccs-access-role-add'" href="#" class="btn-circle" @click.stop.prevent="addType"><i
                      class="el-icon-t-plus"></i> </a>
                    <a href="#" class="btn-circle" @click.prevent="searchType"><i
                      class="el-icon-t-search"></i> </a>
                </span>
              角色管理
            </h2>
            <el-scrollbar tag="div" class="d-table-left_scroll">
              <div class="search-left-box mr-10" v-show="showTypeSearch">
                <oms-input v-model="filters.keyWord" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
              </div>
              <div v-if="!currentItem.title" class="empty-info">
                暂无信息
              </div>
              <div v-else>
                <ul class="show-list">
                  <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                      :class="{'active':item.id===currentItem.id}">
                    <oms-remove v-has="'ccs-access-role-delete'" :item="item" @removed="removeType"
                                :tips='"确认删除角色\""+item.title +"\"?"'
                                class="hover-show"><i
                      class="el-icon-t-delete"></i></oms-remove>
                    <div class="id-part">
                      {{item.name }}
                    </div>
                    <div>
                      {{item.title }}
                    </div>
                  </li>
                </ul>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="d-table-right">
          <div class="d-table-col-wrap">
            <div v-if="!currentItem.title" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <h2 class="clearfix">
              <span class="pull-right">
               <el-button-group>
                   <el-button v-has="'ccs-access-role-edit'" @click="edit()">
                     <i class="el-icon-t-edit"></i>
                     编辑
                   </el-button>
                  <el-button v-has="'ccs-access-role-stop'" @click="forbid()" v-show="resData.usableStatus == 1">
                    <i class="el-icon-t-forbidden"></i>
                    停用
                  </el-button>
                   <el-button v-has="'ccs-access-role-start'" @click="useNormal()" v-show="resData.usableStatus == 0">
                     <i class="el-icon-t-start"></i>启用
                   </el-button>
                   <el-button v-has="'ccs-access-role-delete'" @click="remove()"><i
                     class="el-icon-t-delete"></i>删除</el-button>
                </el-button-group>
              </span>
              </h2>
              <div class="page-main-body">
                <el-row>
                  <el-col :span="4" class="text-right">
                    角色名称：
                  </el-col>
                  <el-col :span="20">
                    {{ resData.title }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="text-right">
                    角色英文名称：
                  </el-col>
                  <el-col :span="20">
                    {{ resData.name }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="text-right">
                    角色状态：
                  </el-col>
                  <el-col :span="20">
                    {{ resData.usableStatus == 1 ? '可用' : '停用' }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="text-right">
                    角色描述：
                  </el-col>
                  <el-col :span="20">
                    {{resData.remark}}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="text-right">
                    角色权限：
                  </el-col>
                  <el-col :span="20">
                    <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+treeHeight">
                      <el-tree :data="checkedMenuList" :props="defaultProps" default-expand-all></el-tree>
                    </el-scrollbar>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'900px'}">
      <role-form :formItem="form" :action="action" @close="showRight=false" :actionType="showRight"
                 @changed="change" @right-close="resetRightBox"></role-form>
    </page-right>
  </div>
</template>
<script>
  import {Access} from '@/resources';
  import roleForm from './form/form.vue';
  import roleMixin from '@/mixins/roleMixin';

  export default {
    components: {roleForm},
    mixins: [roleMixin],
    data: function () {
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        resData: {'permissionList': []},
        typeList: [],
        showTypeList: [],
        form: {},
        action: '',
        roleText: '',
        currentItem: {},
        orgType: {
          0: {'title': '所有', 'num': 0, 'usableStatus': null},
          1: {'title': '正常', 'num': 0, 'usableStatus': 1},
          2: {'title': '停用', 'num': 0, 'usableStatus': 0}
        },
        filters: {
          usableStatus: 1,
          keyWord: ''
        },
        activeStatus: 1,
        menuList: []
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 40) + 'px';
        return height;
      },
      treeHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 280) + 'px';
        return height;
      },
      user() {
        return this.$store.state.user;
      },
      checkedMenuList() {
        let checkedMenuList = JSON.parse(JSON.stringify(this.menuList));
        let perms = this.resData.permissionList;
        if (!checkedMenuList || !perms) return [];
        this.getMenus(checkedMenuList, perms);
        return checkedMenuList;
      }
    },
    mounted() {
      this.getPageList();
      this.getMenuList();
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList();
        },
        deep: true
      },
      user() {
        this.getMenuList(false);
      }
    },
    methods: {
      changeType(item, key) {
        this.filters.usableStatus = item.usableStatus;
      },
      isShowIcon(item, key, activeStatus) {
        return item.usableStatus === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.usableStatus === activeStatus
        };
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
      getPageList: function () {// 查询角色列表
        let param = Object.assign({}, {
          deleteFlag: false,
          objectId: 'hmcc-system'
        }, this.filters);
        Access.query(param).then(res => {
          if (param.keyWord !== this.filters.keyWord) return;
          this.showTypeList = res.data.list;
          this.typeList = res.data.list;
          this.currentItem = Object.assign({id: ''}, this.showTypeList[0]);
          this.queryRoleDetail(this.currentItem.id);
        });
        this.queryStatusNum(param);
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
        Access.getRoleDetail(id).then(res => {
          this.resData = res.data;
          // this.getMenus(this.resData.permissionList);
        });
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {};
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.resData));
        let checkedIdList = [];
        // 勾选已经有的权限
        this.form.permissionList.forEach(val => {
          checkedIdList.push(val.name);
        });
        this.form.checkedIdList = checkedIdList;
        this.showRight = true;
      },
      forbid: function () {
        this.$confirm('确认停用角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let itemTemp = JSON.parse(JSON.stringify(this.resData));
          itemTemp.usableStatus = 0;
          Access.update(itemTemp.id, itemTemp).then(() => {
            this.resData.usableStatus = 0;
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功停用角色"' + this.resData.title + '"'
            });
          });
        });
      },
      useNormal: function () {
        this.$confirm('确认启用角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let itemTemp = JSON.parse(JSON.stringify(this.resData));
          itemTemp.usableStatus = 1;
          Access.update(itemTemp.id, itemTemp).then(() => {
            this.resData.usableStatus = 1;
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功启用角色"' + this.resData.title + '"'
            });
          });
        });
      },
      remove: function () {
        this.$confirm('确认删除角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Access.delete(this.resData.id).then(() => {
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功删除角色"' + this.resData.title + '"'
            });
          });
        });
      },
      removeType: function (item) {
        Access.delete(item.id).then(() => {
          this.getPageList();
          this.$notify.success({
            title: '成功',
            message: '已成功删除角色"' + item.title + '"'
          });
        });
      },
      showType: function (type) {
        this.currentItem = type;
        this.queryRoleDetail(this.currentItem.id);
      },
      change: function (item) {
        if (this.action === 'add') {
          this.getPageList();
          this.showRight = false;
        } else {
          this.resData = item;
          this.showTypeList.forEach(roleItem => {
            if (roleItem.id === item.id) {
              roleItem.name = item.name;
              roleItem.title = item.title;
            }
          });
          // 重新过滤树
          // this.getMenus(this.resData.permissionList);
          this.showRight = false;
        }
      }
    }
  };
</script>
