<style lang="scss" scoped="">
  @import "../../assets/scss/mixins";

  body {
    background: #f5f5f5
  }

  .main-card-box {
    width: 550px;
    z-index: 1;
  }

  .login-style {
    margin-bottom: 30px;

    .btn {
      color: deepskyblue;
      right: 20px;
      position: fixed;
      top:170px;
      font-size: 16px;
    }
  }

</style>
<template>
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix">
        <img :src="Logo">
        计费管理系统
      </div>

      <div class="login-style">
        <el-button v-show="loginStyle === 0" class="btn" type="text" @click="changeLoginStyle(1)">用短信验证码登录</el-button>
        <el-button v-show="loginStyle === 1" class="btn" type="text" @click="changeLoginStyle(0)">用短信验证码登录</el-button>
      </div>

      <div style="padding:20px">
<!--        账号密码-->
        <el-form v-show="loginStyle===0" label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                 @submit.prevent="done" onsubmit="return false">
          <el-form-item label="用户名" prop="username">
            <oms-input v-model="user.username" :showFocus="isFocus === 2" placeholder="手机号/邮箱/用户名"
                       @blur="check()"></oms-input>
          </el-form-item>
          <el-form-item label="密码" style="position:relative" prop="password">
            <oms-input v-model="user.password" :showFocus="isFocus === 3" type="password"
                       placeholder="请输入密码"></oms-input>
            <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
          </el-form-item>
          <el-form-item label="验证码" v-show="showCode">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <oms-input v-model="user.validateCode"></oms-input>
              </div>
              <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>
            </div>

          </el-form-item>

          <el-form-item label-width="80px">
            <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
              {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

          </el-form-item>
        </el-form>


        <!--手机验证码登录-->
        <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"
                 :model="user1" :rules="rules1"
                 onsubmit="return false">
          <el-form-item label="手机号" prop="phone">
            <oms-input v-model="user1.phone" placeholder="请输入手机号"></oms-input>
          </el-form-item>
          <el-form-item label="短信验证码" prop="validateCode">
            <div style="display:flex">
              <div style="width:400px;margin-right:50px">
                <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>
              </div>
              <div style="line-height:0;">
                <el-button :disabled="smsBtnDisabled" @click="sendSMS">{{ smsBtnText }}</el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item label-width="80px">
            <el-button type="primary" @click="phoneFormSubmit" style="display:block;width:100%;" native-type="submit">
              {{ btnString }} <i class="el-icon-loading" v-show="loading"></i></el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="login-bg"></div>
  </div>

</template>

<script>
  import {Auth,http} from '@/resources';
  import AppFooter from '../layout/app.footer.vue';
  import {base64} from '@dtop/dtop-web-common';
  import Logo from '@/assets/img/logo_pic.png';

  export default {
    name: 'login',
    components: {AppFooter},
    data: () => {
      let orgCodeList = JSON.parse(window.localStorage.getItem('orgCodeList')) || [];
      let needCode = !!orgCodeList.length;

      return ({
        // 登录方式：0-账号密码登录，1-手机验证码登录
        loginStyle: 0,
        user: {
          username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
          password: '',
          validateCode: '',
          type: 0,
          orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
        },
        user1: {
          phone: '',
          validateCode: '',
          type: 0
        },
        loading: false,
        codeUrl: '',
        showCode: false,
        btnString: '登录',
        isFocus: -1,
        rules: {
          orgCode: [
            {required: true, message: '请输入系统代码', trigger: ['blur', 'change']}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        needCode,
        orgCodeList,
        Logo,
        rules1: {
          phone: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入手机号'));
                } else {
                  if (!/^1[0-9]{10}$/.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                  }else {
                    callback();
                  }
                }
              }, trigger: 'blur'
            }
          ],
          validateCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          // password: [
          //   {required: true, message: '请输入密码', trigger: 'blur'}
          // ]
        },
        maxTimes: 60,
        leftTime: 0,
        smsBtnText: '获取验证码'
      });
    },
    computed: {
      // smsBtnText() {
      //   if (this.showSendSms){
      //     return '获取验证码';
      //   }
      //
      //   if (this.showResendSms){
      //     return '重新发送';
      //   }
      //
      //   return this.leftTime + 's';
      // }
      smsBtnDisabled() {
        return !/^1[0-9]{10}$/.test(this.user1.phone) || this.leftTime > 0;
      }
    },
    methods: {
      sendSMS: function () {
        this.leftTime = this.maxTimes;
        this.setTimer();
        http.post('/sendSms', {phone: this.user1.phone}).then(response => {// 验证
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
          this.smsBtnText = this.leftTime + 's';
          setTimeout(() => {
            this.setTimer();
          }, 1000);
        } else {
          this.smsBtnText = '重新发送';
        }
      },
      phoneFormSubmit(){
        this.$refs['phoneForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登录中..';
            this.loading = true;
            // let userCopy = JSON.parse(JSON.stringify(this.user));
            // userCopy.orgCode = this.needCode ? this.trim(this.user.orgCode) : '';
            // userCopy.username = this.trim(this.user.username);
            // userCopy.encryptionPsw = base64(userCopy.password);
            // delete userCopy.password;
            Auth.loginByPhone(this.user1).then(response => {
              if (!response.data) return;
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              this.$store.commit('initCode', this.user.orgCode);
              // this.$nextTick(function () {
              //   if (userId === response.data.userId) {
              //     let lastUrl = window.localStorage.getItem('lastUrl');
              //     if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
              //       window.localStorage.removeItem('lastUrl');
              //       window.location.href = lastUrl;
              //       return lastUrl;
              //     }
              //   } else {
              //     this.$router.replace('/');
              //   }
              //   this.$router.replace('/');
              // });
              this.$emit('login');
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg || '无法登录'
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              if (data.code === 405) {
                this.needCode = true;
              }
              this.btnString = '登录';
              this.loading = false;
            });
          }
        });
      },
      changeLoginStyle(loginStyle) {
        this.loginStyle = loginStyle;
      },
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登录中..';
            this.loading = true;
            let userCopy = JSON.parse(JSON.stringify(this.user));
            userCopy.orgCode = this.needCode ? this.trim(this.user.orgCode) : '';
            userCopy.username = this.trim(this.user.username);
            userCopy.encryptionPsw = base64(userCopy.password);
            delete userCopy.password;
            Auth.login(userCopy).then(response => {
              if (!response.data) return;
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              this.$store.commit('initCode', this.user.orgCode);
              // this.$nextTick(function () {
              //   if (userId === response.data.userId) {
              //     let lastUrl = window.localStorage.getItem('lastUrl');
              //     if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
              //       window.localStorage.removeItem('lastUrl');
              //       window.location.href = lastUrl;
              //       return lastUrl;
              //     }
              //   } else {
              //     this.$router.replace('/');
              //   }
              //   this.$router.replace('/');
              // });
              this.$emit('login');
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg || '无法登录'
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              if (data.code === 405) {
                this.needCode = true;
              }
              this.btnString = '登录';
              this.loading = false;
            });
          }
        });
      },
      check() {
        // 为空时, 不用做判断
        if (!this.user.username) return;
        this.$http.post('/login/check', {username: this.trim(this.user.username)}).catch(error => {
          if (error.response.status === 405) {
            this.needCode = true;
            let list = error.response.data && error.response.data.map(m => ({value: m}));
            window.localStorage.setItem('orgCodeList', JSON.stringify(list || ''));
          }
        });
      },
      getCode: function () {
        this.showCode = true;
        this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
      },
      isFocusIndex() {
        this.isFocus = 2;
      },
      trim: function (str) {
        if (!str) return str;
        if (typeof str !== 'string') {
          str = str + '';
        }
        return str.replace(/(^\s*)|(\s*$)/g, '');
      }
    },
    mounted: function () {
      // 清空权限列表
      this.$store.commit('initPermissions', []);
      this.isFocusIndex();
    }
  };
</script>
