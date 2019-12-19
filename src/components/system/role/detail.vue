<style lang="scss" scoped="">
  @import "../../.././assets/scss/mixins";

  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      padding-left: 10px;
      padding-right: 10px;
      left: $leftWidth;
    }
  }

  .oms-row {
    margin-bottom: 10px;
  }

</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">角色详情</h3>
      <h2 class="detail-title">基础信息</h2>
      <el-row>
        <el-col :span="24">
          <el-col :span="12">
            <oms-row label="角色名称" :span="8">{{ formItem.title }}</oms-row>
            <oms-row label="角色英文名称" :span="8">{{ formItem.name }}</oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="角色状态" :span="8">{{ formItem.usableStatus == 1 ? '可用' : '停用' }}</oms-row>
            <oms-row label="角色描述" :span="8">{{ formItem.accountCheckTime | time }}</oms-row>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <h2 class="detail-title">角色权限</h2>
          <el-row>
            <el-tree :data="checkedMenuList" :props="defaultProps" default-expand-all></el-tree>
          </el-row>
        </el-col>
        <el-col :span="14">
          <div v-show="dataList.length">
            <h2 class="detail-title">数据权限</h2>
            <el-table :data="orgList" border  class="mt-10">
              <el-table-column prop="objectTypeName" label="甲方"></el-table-column>
            </el-table>

            <el-table :data="contractList" border  class="mt-10">
              <el-table-column prop="objectTypeName" label="合同"></el-table-column>
            </el-table>

            <el-table :data="projectList" border  class="mt-10">
              <el-table-column prop="objectTypeName" label="项目"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {roleDataRight} from '@/resources';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      showDetailRight: Boolean,
      checkedMenuList: Array
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        dataList: []
      };
    },
    computed: {
      orgList() {
        return this.dataList.filter(f => f.objectType === '0')
      },
      contractList() {
        return this.dataList.filter(f => f.objectType === '1')
      },
      projectList() {
        return this.dataList.filter(f => f.objectType === '2')
      }
    },
    watch: {
      showDetailRight(val) {
        this.dataList = [];
        if (!val) return;
        roleDataRight.query({roleId: this.formItem.id}).then(res => {
          this.dataList = res.data.data.dataPermissionsRolesDTOList || [];
        });
      }
    }
  };
</script>
