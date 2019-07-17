<style lang="scss">
  @import "../../assets/scss/mixins";
  $topMenuHeight: 50px;
  $menuHoverColor: $activeColor;
  $menuHoverBg: #f1f1f1;
  .main-header {
    background: $loginBackground;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: $topMenuHeight;
    z-index: 800;

    ul, li {
      padding: 0;
      margin: 0;
      list-style: none
    }

    a {
      text-decoration: none
    }

    .top-logo {
      vertical-align: middle;
      line-height: $topMenuHeight;
      height: $topMenuHeight;
      margin-left: 15px;

      img {
        vertical-align: middle;
      }
    }

    .top-right {
      position: absolute;
      right: 15px;
      width: auto;
      z-index: 3;
      top: 50%;
      transform: translateY(-50%);
      .top-right-item {
        cursor: pointer;
        img {
          vertical-align: middle;
          height: 30px;
          width: 30px;
          border-radius: 50%;
        }
      }

    }
  }

  .top-right-user-dropdown {
    margin-top: 1px;
    padding: 10px;
    box-shadow: 1px 1px 1px #eee;
    border-color: #eee
  }

  .menu-user-part {
    display: flex;
    align-items: center;

    > div > img {
      margin-right: 10px;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      border: 1px solid #eee
    }

    .menu-usr-part-phone {
      color: #666;
      font-size: 12px;
    }
  }

  .menu-user {
    padding: 8px 10px;

    .last-login {
      color: #999;
      font-size: 12px;
      margin: 10px 0;
    }

    a {
      color: $activeColor;
      font-size: 12px;
    }
  }

  .logo_pic {
    height: 30px;
    width: 30px;
    margin-right: 10px;
    margin-top: -8px;
  }

  .logo-span {
    font-size: 22px;
    font-weight: bold;
    color: $activeColor
  }

  .main-nav {
    position: fixed;
    top: $topMenuHeight;
    background: rgb(221, 226, 229);
    border-right: 1px solid #f1f1f1;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 180px;

    .el-menu {
      background-color: inherit;
    }
    .el-menu-item:hover, .el-menu-item:focus, .el-menu-item.is-active {
      background-color: rgb(174, 179, 182);
    }
    .el-submenu__title:hover {
      background-color: rgb(174, 179, 182);
    }

    .menu-wrap {
      max-height: 100%;
    }
    .el-menu {
      li {
        min-width: 40px;
      }
    }

    .horizontal-collapse-transition {
      transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .main-nav-scrollbar {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 30px;
      left: 0;
    }
    .main-nav-scrollbar /deep/ .el-scrollbar__wrap {
      overflow: hidden;
      overflow-y: auto;
    }
    .change-collapse {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      padding: 5px;
      cursor: pointer;
      background: rgba(238, 243, 246, 0.5);
      &:hover {
        background: #cbdce6;
      }
    }
  }

  .el-menu-item, .el-submenu .el-menu-item, .el-submenu__title {
    line-height: 35px;
    height: 35px;
  }

  .el-submenu .el-menu-item {
    font-size: 13px;
  }

  .position-nav {
    margin: 0 0 8px;
    /*padding: 5px;*/
    /*border-bottom: 1px solid #eee;*/
    font-size: 16px;
    font-weight: normal;
    line-height: 30px;
    background: #eee;

    .position-nav-text {
      position: relative;
      left: -20px;
      padding-left: 13px;
      border-left: 4px solid #999;
    }
  }

  .skin-item {
    position: relative;
    top: 4px;
    width: 15px;
    height: 15px;
    display: inline-block;
    border: 1px solid #eee;
    margin-right: 5px;
  }


  .org-title {
    color: #ffffff;
    margin-right: 10px;
  }

  .wechat-info {
    font-size: 12px;

    .weChat-img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      float: left;
    }

    .wechat-nick {
      float: left;
      margin-left: 10px;
    }

    .btn-wechat {
      float: left;
    }

    margin-bottom: 5px;
  }

  a:focus {
    outline: none;
  }

  .top-right-user-dropdown {
    padding: 0;
    .el-dropdown-menu__item {
      padding: 8px 10px;
      display: flex;
      align-items: center;
      height: auto;
      line-height: normal;
      i {
        margin-left: 10px;
        margin-right: 12px;
      }
    }
    .header-user-userinfo {
      line-height: normal;
      border-bottom: 1px solid #eee;
      .el-upload {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

<style>

</style>
<template>
  <div>
    <header class="main-header">
      <div>
        <div class="top-logo">
          <router-link to='/' class="a-link">
            <img class="logo_pic" :src="Logo">
            <span class="logo-span">计费管理系统</span>
          </router-link>
        </div>
        <div class="top-right">
          <div class="top-user">
            <span>
              <span class="org-title">{{orgName}}</span>
            </span>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <compressed-img v-if="user.userIcon" :src="user.userIcon+'?image&action=resize:w_50,h_50,m_2'"/>
                <img v-else :src="userpic">
              </div>
              <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
                <el-dropdown-item class="header-user-userinfo">
                  <oms-upload-picture :photoUrl="user.userIcon ? user.userIcon : ''"
                                      class="user-img"></oms-upload-picture>
                  <div>
                    <div class="menu-usr-part-user">{{user.userName}}</div>
                    <div class="menu-usr-part-phone">{{user.userAccount}}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click.stop.native="$router.push('/resetpsw')">
                  <i class="el-icon-t-password"></i>
                  <router-link to="/resetpsw">重置密码</router-link>
                </el-dropdown-item>
                <el-dropdown-item  @click.stop.native="logout">
                  <i class="el-icon-t-shut-down"></i>
                  <a href="#">退出</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <div class="main-nav" :style="'width:'+menuWidth">
      <el-scrollbar
        tag="div"
        ref="scrollbar"
        class="main-nav-scrollbar"
        v-show="menu.length > 0">
        <el-menu :default-active="currentPath" :collapse="isCollapse" :router="true" :unique-opened="false"
                 :default-openeds="defaultOpenMenus" style="margin-bottom: 27px">
          <template v-for="item in menu">
            <el-submenu :index="item.path" v-if="item.children.length>0">
              <template slot="title">
                <i :class="'el-icon-t-'+item.meta.icon"></i>
                <span slot="title">{{item.meta.title}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                {{child.meta.title}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" v-else-if="item.path">
              <i :class="'el-icon-t-'+item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>
            <el-menu-item :index="item.path" v-else="!item.path" @click="$router.push('/')">
              <i :class="'el-icon-t-'+item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
      <!--<div class="change-collapse" @click="changeMenuCollapse">-->
        <!--<f-a :name="isCollapse?'spread':'collapse'"></f-a>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import {Auth} from '../../resources';
  import logo_pic from '@/assets/img/logo_pic.png';
  import omsUploadPicture from '@/components/common/upload/upload.user.picture.vue';
  import userpic from '@/assets/img/userpic.png'
  import Logo from '@/assets/img/logo_pic.png'
  export default {
    components: {
      omsUploadPicture
    },
    props: ['toRoute'],
    data() {
      return {
        activeId: this.getGroupId(),
        logo_pic: logo_pic,
        isCollapse: false,
        skin: {},
        defaultOpenMenus: [],
        userpic,
        Logo
      };
    },
    computed: {
      menuWidth: function () {
        return this.$store.state.bodySize.left;
      },
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      },
      menu: function () {
        let menu = this.$parent.$parent.menuData;
        menu.forEach(i => {
          i.children && i.children.forEach(i => {
            i.path = i.path.replace(/:id/, 'list');
          });
        });
        return menu;
      },
      activePath: function () {
        return this.$route.path;
      },
      orgName() {
        return this.$store.state.orgName;
      },
      currentPath() {
        return this.$route.path;
      }
    },
    watch: {
      toRoute: function () {
        this.activeId = this.getGroupId();
      }
    },
    methods: {
      goTo: function (item) {
        this.$router.push({path: item.path});
      },
      getGroupId: function () {
        let activeMould = '';
        if (this.toRoute && this.toRoute.path !== undefined) {
          activeMould = this.toRoute.meta.topMould;
          if (!activeMould) {
            activeMould = this.toRoute.path.substr(1);
            let first = activeMould.indexOf('/');
            if (first !== -1) {
              activeMould = activeMould.substr(0, first);
            }
          }
        }
        return activeMould;
      },
      logout: function () {
        window.localStorage.setItem('lastUrl', window.location.href);
        Auth.logout().then(() => {
          location.reload();
        });
      },
      checkSubMenu: function (item) {
        this.goTo(item);
      },
      changeMenuCollapse: function () {
        this.isCollapse = !this.isCollapse;
        this.$store.commit('changeBodyLeft', this.isCollapse);
        window.localStorage.setItem('collapse', this.isCollapse ? 1 : 0);
      }
    },
    mounted: function () {
      let isCollapse = window.localStorage.getItem('collapse');
      if (isCollapse) {
        isCollapse = parseInt(isCollapse, 10);
      }
      this.isCollapse = !!isCollapse;
      this.$store.commit('changeBodyLeft', this.isCollapse);
      let defaultOpenMenus = [];
      this.$route.matched.forEach(item => {
        if (item.path) {
          defaultOpenMenus.push(item.path);
        }
      });
      this.defaultOpenMenus = defaultOpenMenus;

    }
  };
</script>
