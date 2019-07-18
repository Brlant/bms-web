<template>
  <el-form :model="form" :rules="rules" label-width="120px" ref="form">
    <h2 class="clearfix">{{showTitle}}部门</h2>
    <el-form-item label="部门名称" prop="name">
      <oms-input placeholder="请输入部门名称" type="text" v-model="form.name"></oms-input>
    </el-form-item>
    <el-form-item label="部门编码">
      <oms-input placeholder="请输入部门编码" type="text" v-model="form.code"></oms-input>
    </el-form-item>
    <el-form-item label="部门电话">
      <oms-input placeholder="请输入部门电话" type="text" v-model="form.phone"></oms-input>
    </el-form-item>
    <el-form-item label="部门邮箱">
      <oms-input placeholder="请输入部门邮箱" type="text" v-model="form.email"></oms-input>
    </el-form-item>
    <el-form-item label="部门传真">
      <oms-input placeholder="请输入部门传真" type="text" v-model="form.fax"></oms-input>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button :disabled="doing" @click="onSubmit('form')" type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {Department} from '@/resources';

  export default {
    data: function () {
      let checkEmail = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback();
        } else {
          let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的邮箱'));
          } else {
            callback();
          }

        }
      };
      return {
        rules: {
          name: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ]
        },
        form: this.formItem,
        doing: false,
        attachmentList: [],
        x: ''
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      },
      exceptionType: function () {
        return this.$getDict('exceptionType');
      },
      executionBody: function () {
        return this.$getDict('executionBody');
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        this.$refs['form'].clearValidate();
        this.form = Object.assign({}, val);
        this.attachmentList = [];
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (this.form.email) {
              let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
              if (!re.test(this.form.email)) {
                this.$notify.warning({
                  duration: 2000,
                  message: '输入的邮箱格式不正确'
                });
                return;
              }
            }
            if (this.action === 'add') {
              this.doing = true;
              Department.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增部门目成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增部门目失败'
                });
                this.doing = false;
              });
            } else {
              this.doing = true;
              Department.update(this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改部门目"' + this.form.name + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改部门目' + this.form.name + '"失败'
                });
                this.doing = false;
              });
            }
          } else {

          }
        });
      },
      cancel: function () {
        this.$emit('close');
      }
    }
  };
</script>
