<style lang="scss" scoped="">
  @import "../../assets/scss/mixins";

  body {
    background: #f5f5f5
  }

  .main-card-box {
    width: 550px;
    z-index: 1;
  }


  .login-menu {
    cursor: pointer;

    padding: 20px 0;

    > div {
      text-align: center;
      line-height: 40px;
      width: 50%;
      border-bottom: 3px solid #eee;
      color: #999;
      font-weight: bold;
      font-size: 14px;

      &.active {
        border-color: $activeColor;
        color: $activeColor;
      }
    }
  }
</style>
<template>
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix">计费管理系统</div>
      <div style="padding:0 20px">
        <h3 class="text-center">重置密码</h3>
        <div class="login-menu">
          <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                   @submit.prevent="done" onsubmit="return false">
            <el-form-item label="新密码" prop="password">
              <oms-input v-model="user.password" type="password"></oms-input>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-button type="warning" @click="done" style="display:block;width:100%;" native-type="submit">
                {{btnString}}
              </el-button>

            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <div class="login-bg"></div>

  </div>
</template>

<script>
  import {http} from '../../resources';

  export default {
    name: 'resetpwd',
    data: function () {
      let checkPasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
          if (!rl.test(this.user.password)) {
            callback('新密码必须包含数字、大写字母,小写字母,至少8-16个字符');
          } else {
            callback();
          }
        }
      };
      return {
        user: {password: '', code: ''},
        loading: false,
        showInfo: false,
        codeUrl: '',
        showCode: false,
        btnString: '提交',
        rules: {
          password: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: checkPasswd, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            http.put('/oms/user/reset/password', this.user).then(() => {// 验证
              this.showInfo = true;
              this.$notify.info({
                message: '重置成功'
              });
              setTimeout(() => {
                this.$router.push('/login');
              }, 1000);
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              this.loading = false;
            });
          }
        });

      }
    },
    mounted: function () {
      this.user.code = this.$route.params.id;
    }
  };
</script>
