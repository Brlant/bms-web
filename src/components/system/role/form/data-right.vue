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
</style>
<template>
  <div class="content-part">
    <div class="content-left">
      <h2 class="right-title">数据权限</h2>
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
      <h3>{{formItem.title}}</h3>
      <el-form ref="roleform" :rules="rules" :model="form" label-width="100px"
               @submit.prevent="onSubmit('roleform')" onsubmit="return false">
        <el-form-item label="对象类型" prop="objectType">
          <el-radio-group v-model="form.objectType" @change="objectTypeChange">
            <el-radio :label="item.key" v-for="item in dataRightType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对象" prop="objectId" class="contact-check" v-if="form.objectType">
          <org-select :list="orgList" :remoteMethod="queryAllOrgOms" v-if="form.objectType === '0'"
                      placeholder="请输入名称搜索对象" v-model="form.objectId"></org-select>
          <el-select placeholder="请输入名称搜索对象" v-model="form.objectId" v-else-if="form.objectType === '1'"
                     filterable clearable remote :remote-method="queryContractList" @focus="queryContractList()">
            <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                       v-for="item in contractList"></el-option>
          </el-select>
          <el-select filterable remote placeholder="请输入名称搜索对象" v-else-if="form.objectType === '2'"
                     :remote-method="queryProjectList" @focus="queryProjectList()"
                     :clearable="true" v-model="form.objectId" popperClass="good-selects">
            <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                       v-for="item in projectList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addItem">加入列表</el-button>
        </el-form-item>
        <el-form-item label-width="20px">
          <span>对象列表</span>
          <el-table :data="dataList" :row-style="{cursor: 'pointer'}"
                    border class="clearfix" ref="orderDetail">
            <el-table-column prop="usableStatus" label="对象类型" width="150px">
              <template slot-scope="scope">
                {{ dataRightType[scope.row.objectType] && dataRightType[scope.row.objectType].label}}
              </template>
            </el-table-column>
            <el-table-column prop="objectTypeName" label="对象">
              <template slot-scope="scope">
                {{ scope.row.objectTypeName }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="100">
              <template slot-scope="scope">
                <des-btn icon="delete" v-has="'access-role-edit'" @click="deleteItem(scope.row)">删除</des-btn>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script type="text/jsx">
  import {roleDataRight} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      showDataRight: Boolean
    },
    mixins: [methodsMixin],
    data: function () {
      return {
        form: {
          objectType: '',
          objectId: ''
        },
        doing: false,
        rules: {
          objectType: [
            {required: true, message: '请选择对象类型', trigger: 'blur'}
          ],
          objectId: [
            {required: true, message: '请选择对象', trigger: 'change'}
          ]
        },
        dataList: []
      };
    },
    computed: {
      dataRightType() {
        return this.$store.state.dataRightType;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      showDataRight: function (val) {
        this.$refs['roleform'].resetFields();
        this.dataList = [];
        if(!val) return;
        roleDataRight.query({roleId: this.formItem.id}).then(res => {
          this.dataList = res.data.data.dataPermissionsRolesDTOList || [];
        });
      }
    },
    methods: {
      objectTypeChange(val) {
        this.form.objectId = '';
      },
      deleteItem(item) {
        this.dataList = this.dataList.filter(f => f !== item);
      },
      addItem() {
        this.$refs.roleform.validate(v => {
          if (!v) return;
          if (this.form.objectType === '0') {
            this.orgList.forEach(i => {
              if(i.id === this.form.objectId) {
                this.form.objectTypeName = i.name;
              }
            })
          } else if (this.form.objectType === '1') {
            this.contractList.forEach(i => {
              if(i.contractId === this.form.objectId) {
                this.form.objectTypeName = i.contractName;
              }
            })
          } else {
            this.projectList.forEach(i => {
              if(i.projectId === this.form.objectId) {
                this.form.objectTypeName = i.projectName;
              }
            })
          }
          this.dataList.push(Object.assign({}, this.form));
          let objectType = this.form.objectType;
          this.$refs.roleform.resetFields();
          this.form.objectType = objectType;
        });
      },
      onSubmit: function (formName) {
        if(this.doing) return;
        if(!this.dataList.length) return this.$notify.info('请添加对象');
        this.doing = true;
        let obj = {
          roleId: this.formItem.id,
          dataPermissionsRolesDTOList: this.dataList
        };
        this.$httpRequestOpera(roleDataRight.save(obj), {
          errorTitle: '保存失败',
          success: res => {
            if (res.data.code === 200) {
              this.$notify.success('保存成功');
              this.doing = false;
              this.$emit('close');
            } else {
              this.doing = false;
            }
          },
          error: () => {
            this.doing = false;
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
