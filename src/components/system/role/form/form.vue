<style lang="scss" scoped="">
  $leftWidth: 200px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
      }
      left: $leftWidth;
    }
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgba(238, 238, 238, 0.5);
    padding: 2px 10px;
    border-radius: 4px;
    line-height: 30px;
    .el-checkbox {
      margin-left: 15px;
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .check-all {
    margin-left: 24px;
  }

  .filter-input.el-input {
    padding-right: 40px;
    margin-bottom: 10px;
    margin-left: 22px;
    width: 67.5%;
  }

  .role-title {
    margin: 10px 0 10px 10px;
  }

  .el-tree {
    width: 70%;
  }

  .dialog-template-role_scroll {
    position: absolute;
    top: 340px;
    left: 20px;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
</style>
<template>
  <div class="content-part">
    <div class="content-left">
      <h2 class="right-title">角色管理</h2>
      <div class="btn-submit-save">
        <div>
          <el-button type="primary" style="width: 100px;margin-bottom: 10px" @click="onSubmit('roleform')"
                     native-type="submit" :disabled="doing">保存
          </el-button>
        </div>
        <div>
          <el-button style="width: 100px" @click.prevent.stop="doClose">关闭</el-button>
        </div>
      </div>
    </div>
    <div class="content-right min-gutter">
      <h3></h3>
      <el-form ref="roleform" :rules="rules" :model="form" label-width="100px"
               @submit.prevent="onSubmit('roleform')" onsubmit="return false">
        <el-form-item label="角色名称" prop="title">
          <oms-input type="text" v-model="form.title" placeholder="请输入"></oms-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="name">
          <oms-input type="text" v-model="form.name" placeholder="请输入"></oms-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <oms-input type="text" v-model="form.remark" placeholder="请输入"></oms-input>
        </el-form-item>
        <h4 class="clearfix role-title">配置角色权限</h4>
        <el-input class="filter-input"
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <el-scrollbar tag="div" class="dialog-template-role_scroll">
          <div class="check-all">
            <el-checkbox label="全选" v-model="checkAllRoles"
                         @change="checkAll()"></el-checkbox>
          </div>
          <el-tree :data="tree" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
                   :default-checked-keys="checkedIdList" :props="defaultProps"
                   :filter-node-method="filterNode">
          </el-tree>
        </el-scrollbar>

      </el-form>
    </div>
  </div>
</template>
<script type="text/jsx">
  import {Access} from '@/resources';
  import roleMixin from '@/mixins/roleMixin';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    mixins: [roleMixin],
    data: function () {
      let checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入角色英文名称'));
        } else {
          let re = /^[A-Za-z]+$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的角色英文名称'));
          } else {
            callback();
          }
        }
      };
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        form: {},
        tree: [], // 新封装的权限菜单的数据结构
        checkAllRoles: false,
        doing: false,
        filterText: '',
        rules: {
          title: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入角色英文名称', trigger: 'blur'},
            {type: 'name', message: '请输入正确的角色英文名称', validator: checkName, trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {
      checkedIdList() {
        let menuParentIds = this.$store.state.menuParentIds;
        return this.form.checkedIdList && this.form.checkedIdList.filter(f => !menuParentIds.includes(f)) || [];
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      formItem: function (val) {
        this.$refs['roleform'].clearValidate();
        this.filterText = '';
        this.getMenus();
        if (val.id) {
          this.form = JSON.parse(JSON.stringify(this.formItem));
        } else {
          this.form = {
            title: '',
            name: '',
            remark: '',
            permissionList: []
          };
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['roleform'].resetFields();
        }
      },
      checkedIdList(val) {
        this.$refs.tree.setCheckedKeys(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getMenus: function () {
        this.getRoleMenus().then(res => {
          this.tree = res.data;
        });
      },
      checkAll: function () {
        if (this.checkAllRoles) {
          this.$refs.tree.setCheckedNodes(this.tree);
        }
        if (!this.checkAllRoles) {
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      getCheckedMenu: function (data, menuList) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].indeterminate || data[i].checked) {
            menuList.push(data[i].key);
          }
          if (data[i].childNodes) {
            this.getCheckedMenu(data[i].childNodes, menuList);
          }
        }
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          let rolelist = [];
          // 获取选中的菜单
          let menuList = [];
          this.getCheckedMenu(this.$refs['tree'].root.childNodes, menuList);
          menuList.forEach(val => {
            rolelist.push({name: val});
          });
          this.form.permissionList = rolelist;
          if (this.action === 'add') {
            this.form.objectId = 'ccs-system';
            Access.save(this.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增角色"' + this.form.title + '"成功'
              });
              this.$emit('changed', this.form);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增角色"' + this.form.title + '"失败'
              });
              this.doing = false;
            });
          } else {
            Access.update(this.form.id, this.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改角色"' + this.form.title + '"成功'
              });
              this.$emit('changed', this.form);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改角色"' + this.form.title + '"失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['roleform'].resetFields();
      }
    }
  };
</script>
