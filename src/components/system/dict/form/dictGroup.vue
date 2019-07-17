<template>
  <el-form ref="dictForm" :model="dictForm" :rules="dictRules" label-width="120px">
    <h2 class="clearfix">{{showTitle}}字典组</h2>
    <el-form-item label="字典组标题" prop="label">
      <oms-input v-model="dictForm.label" placeholder="请输入字典组标题"></oms-input>
    </el-form-item>
    <el-form-item label="字典组值" prop="name">
      <oms-input v-model="dictForm.name" placeholder="请输入字典组值"></oms-input>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="onTypeSubmit('dictForm')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {DictGroup} from '../../../../resources';

  export default {
    data: function () {
      let checkGroupName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入字典组标题'));
        } else {
          DictGroup.checkGroupName(value, this.dictForm.id).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('字典组标题已经存在'));
            }
          });
        }
      };
      return {
        dictRules: {
          name: [
            {required: true, message: '请输入字典组项Key', trigger: 'blur'},
            {validator: checkGroupName, trigger: 'blur'}
          ],
          label: [
            {required: true, message: '请输入字典组项Value', trigger: 'blur'}
          ]
        },
        dictForm: this.formItem,
        doing: false,
        x: ''
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.dictForm.id) {
          title = '修改';
        }
        return title;
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        this.dictForm = Object.assign({}, val);
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['dictForm'].resetFields();
        }
      }
    },
    methods: {
      onTypeSubmit: function (formName) {
        this.doing = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              DictGroup.save(this.dictForm).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增字典组成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增字典组失败'
                });
                this.doing = false;
              });
              //  window.localStorage.removeItem("dictForm");
            } else {
              DictGroup.update(this.dictForm).then(res => {
                this.$notify.success({
                  name: '成功',
                  duration: 2000,
                  message: '修改字典组"' + this.dictForm.label + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改字典组"' + this.dictForm.label + '"失败'
                });
                this.doing = false;
              });
            }
          } else {
          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      }
    }
  };
</script>
