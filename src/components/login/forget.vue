<style lang="scss" scoped>
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
    display: flex;
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

  .el-form-item {
    margin-bottom: 20px;
  }
</style>
<template>
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix">
        <img :src="Logo">
        计费管理系统
      </div>
      <div style="padding:20px">

        <div v-if="showInfo" class="text-center">
          已发送重置密码邮件至邮箱 {{user.email}}
          <el-button type="primary" @click="resend" style="display:block;width:100%;margin:30px 0">
            没有收到？点击重新发送验证邮件
          </el-button>
        </div>
        <div v-else-if="showPhoneCode">
          <h3 class="text-center">短信激活账号/重置密码</h3>
          <el-form key="el-form--reset" label-position="top" ref="resetForm" label-width="80px" :model="resetUser"
                   :rules="resetUserRules"
                   @submit.prevent="resetPass" onsubmit="return false">

            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="resetUser.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input type="password" v-model="resetUser.password2"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码" prop="code" v-show="showPhoneCode">
              <div style="display:flex">
                <div style="width:300px;margin-right:50px">
                  <el-input v-model="resetUser.code"></el-input>
                </div>
                <div style="line-height:0;">
                  <el-button :disabled="leftTime>0" @click="resendSMS">重新发送<span
                    v-show="leftTime>0">({{leftTime}})</span></el-button>
                </div>
              </div>
            </el-form-item>

            <el-button-group style="width: 100%;margin-top:20px">

              <el-button type="primary" @click="resetPass" style="width:50%;" native-type="submit" :disabled="loading">
                重置密码
              </el-button>
              <el-button style="width:50%;">
                <router-link to="/login" style="display: block">返回登录</router-link>
              </el-button>
            </el-button-group>
          </el-form>
        </div>
        <div v-else>
          <h3 class="text-center">激活账号/忘记密码</h3>
          <el-form key="el-form--login" label-position="top" ref="loginForm" label-width="80px" :model="user"
                   :rules="rules"
                   @submit.prevent="done" onsubmit="return false">
            <el-form-item label="账号" prop="account">
              <el-input v-model="user.account" placeholder="手机号/邮箱/用户名"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <div style="display:flex">
                <div style="width:300px;margin-right:50px">
                  <el-input v-model="user.code"></el-input>
                </div>
                <div style="line-height:1px;"><img :src="codeUrl" @click="getCode" height="42" style="cursor:pointer">
                </div>
              </div>

            </el-form-item>


            <el-form-item label-width="0">
              <el-button-group style="width: 100%;">

                <el-button type="primary" @click="done" style="width:50%;" native-type="submit" :disabled="loading">
                  {{btnString}}
                </el-button>
                <el-button style="width:50%;" @click="$router.push('/login')">
                  返回登录
                </el-button>
              </el-button-group>
            </el-form-item>

          </el-form>
        </div>
      </div>
    </el-card>
    <div class="login-bg"></div>
  </div>
</template>

<script>
  import {http, User} from '@/resources';
  import Logo from '@/assets/img/logo_pic.png'

  const timeInterval = 60;
  let phoneReg = /^1[0-9]{10}$/;
  export default {
    name: 'forget',
    data: function () {
      let self = this;
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          // let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
          // if (!rl.test(self.resetUser.password)) {
          //   callback('新密码必须包含数字、大写字母,小写字母,至少8-16个字符');
          // } else {
            if (self.resetUser.password2 !== '') {
              this.$refs.resetForm.validateField('password2');
            }
            callback();
          // }
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== self.resetUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        user: {
          account: '',
          code: '',
          type: 0,
          orgCode: '',
          email: '',
          phoneCode: '',
          phone: ''
        },
        resetUser: {userId: '', code: '', password: '', password2: ''},
        resetUserRules: {
          orgCode: [
            {required: true, message: '请输入系统代码', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入短信验证码', trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, required: true, trigger: 'blur'}
          ],
          password2: [
            {validator: validatePass2, required: true, trigger: 'blur'}
          ]
        },
        loading: false,
        showInfo: false,
        codeUrl: '',
        showCode: false,
        btnString: '提交',
        rules: {
          orgCode: [
            {required: true, message: '请输入系统代码', trigger: 'blur'}
          ],
          account: [
            {required: true, message: '请输入账号'}
          ],
          validateCode: [
            {required: true, message: '请输入验证码'}
          ]
        },
        showPhoneCode: false,
        leftTime: timeInterval,
        userId: '',
        Logo
      };
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            User.forget(this.user).then(response => {// 验证
              if (response.data.phone) {
                this.user.phone = response.data.phone;
                this.showPhoneCode = true;
                this.loading = false;
                this.setTimer();
              } else {
                this.showInfo = true;
                this.user.email = response.data.email;
              }
              this.userId = response.data.userId;
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              this.getCode();
              this.loading = false;
            });
          }
        });
      },
      getCode: function () {
        this.user.code = '';
        this.showCode = true;
        this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
      },
      resend: function () {
        http.get('/oms/user/' + this.userId + '/password/verifyMail/resend').then(response => {// 验证
          this.user.email = response.data.email;
          this.$notify.info({
            message: '发送成功'
          });
        }, () => {
          this.$notify.error({
            message: '发送失败,请联系管理员'
          });
        });
      },
      resendSMS: function () {
        this.leftTime = timeInterval;
        this.setTimer();
        http.get('/oms/user/' + this.userId + '/password/verifySMS/resend').then(response => {// 验证
          this.$notify.info({
            message: '发送成功'
          });
        }, () => {
          this.$notify.error({
            message: '发送失败,请联系管理员'
          });
        });
      },
      setTimer: function () {
        if (this.leftTime > 0) {
          this.leftTime = this.leftTime - 1;
          setTimeout(() => {
            this.setTimer();
          }, 1000);
        }
      },
      resetPass: function () {
        this.$refs['resetForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            let data = Object.assign({}, this.resetUser, {userId: this.userId});
            http.put('/oms/user/phone/reset-psw', data).then(response => {// 验证
              this.$notify.info({
                message: '重置成功'
              });
              this.$router.push('/login');
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              this.getCode();
              this.loading = false;
            });
          }
        });
      }
    },
    mounted: function () {
      this.getCode();
    }
  };
</script>
