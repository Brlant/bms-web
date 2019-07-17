<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
    <h2 class="clearfix">{{showTitle}}数据字典项</h2>
    <el-form-item label="字典项标题" prop="label">
      <oms-input v-model="form.label" placeholder="请输入字典项标题"></oms-input>
    </el-form-item>
    <el-form-item label="字典项" prop="key">
      <oms-input v-model="form.key" placeholder="请输入字典项"></oms-input>
    </el-form-item>
    <el-form-item label="字典项排序" prop="sort">
      <oms-input type='number' v-model.number="form.sort" min="0" placeholder="请输入字典项排序"></oms-input>
    </el-form-item>
    <el-form-item label="字典项备注" prop="remarks">
      <oms-input type="textarea" v-model="form.remarks" placeholder="请输入字典项备注"></oms-input>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="onSubmit('form')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {DictGroup, DictItem} from '../../../../resources';

  export default {
    data: function () {
      let checkItemKey = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入字典项'));
        } else {
          DictGroup.checkItemKey(value, this.form.id, this.form.groupId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('字典项已经存在'));
            }
          });
        }
      };
      return {
        rules: {
          key: [
            {required: true, message: '请输入字典项', trigger: 'blur'},
            {validator: checkItemKey, trigger: 'blur'}
          ],
          label: [
            {required: true, message: '请输入字典项标题', trigger: 'blur'}
          ],
          sort: [
            {required: true, type: 'number', message: '请输入字典项排序值', trigger: 'blur'}
          ]
        },
        form: this.formItem,
        doing: false,
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
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.doing = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              DictItem.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增字典项成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增字典项失败'
                });
                this.doing = false;
              });
//               window.localStorage.removeItem("dictTypeForm");
            } else {
              DictItem.update(this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改字典项"' + this.form.label + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改字典项"' + this.form.label + '"失败'
                });
                this.doing = false;
              });
            }
          } else {
            return false;
          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      }
    }
  };
</script>
