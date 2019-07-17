<style lang="scss" scoped="">
  @import "../../.././assets/scss/mixins";

  $leftWidth: 0;
  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
      padding-left: 20px;
      padding-right: 20px;

      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }

      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }

  .vaccine-list {
    margin-top: 20px;
  }

  .el-row {
    margin-bottom: 10px;
  }
</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">详情</h3>
      <el-row>
        <el-col :span="12">
          <oms-row label="单位名称">{{ data.name }}</oms-row>
          <oms-row label="单位简称">{{ data.nameJc }}</oms-row>
          <oms-row label="统一社会信用代码">{{ data.creditCode }}</oms-row>
          <oms-row label="区域代码">{{ data.orgAreaCode }}</oms-row>
          <oms-row label="建立日期">{{ data.createTime | date}}</oms-row>
          <oms-row label="法人代表">{{ data.legalRepresentative }}</oms-row>
          <oms-row label="默认物流中心" v-if="data.type==='0'">{{ data.defaultCenter }}</oms-row>
          <oms-row label="入库扫码标识">{{ data.orgScanCode | isScanCode }}</oms-row>
          <oms-row label="出库扫码标识">{{ data.orgOutScanCode | isScanCode }}</oms-row>
          <oms-row label="是否跳过订单审核">{{ data.skipFlag | formatStatus }}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="单位类型">
                        <span v-for="(relationType,index) in data.orgRelationTypeList">
                          <dict :dict-group="'orgRelationType'" :dict-key="relationType"></dict><span
                          v-if="(data.orgRelationTypeList.length-1)!==index">/</span>
                        </span>
          </oms-row>
          <oms-row label="单位级别">
            <dict :dict-group="'orgLevel'" :dict-key="data.level"></dict>
          </oms-row>
          <oms-row label="联系电话">{{ data.phone }}</oms-row>
          <oms-row label="邮政编码">{{ data.postcode }}</oms-row>
          <oms-row label="联系人">{{ data.contact }}</oms-row>
          <oms-row label="所在地区">{{ companyAddress }}</oms-row>
          <oms-row label="详细地址">{{ data.address }}</oms-row>
        </el-col>
      </el-row>
      <el-row>
        <oms-row label="物流商" :span="5">{{ data.extDto && data.extDto.logisticsDealer }}</oms-row>
      </el-row>
      <el-row>
        <oms-row label="运输时限" :span="5">{{ data.extDto && data.extDto.transportTimeLimit }}</oms-row>
      </el-row>
      <el-row>
        <oms-row label="车牌号" :span="5">{{ data.extDto && data.extDto.licensePlateNumber }}</oms-row>
      </el-row>
      <el-row>
        <oms-row label="备注" :span="5">{{ data.remarks }}</oms-row>
      </el-row>
      <oms-row :span="5" label="">
        <el-button type="primary" v-show="!data.deleteFlag && data.auditDto && data.auditDto.baseInfoStatus === '0'" @click="auditBaseInfo">审核</el-button>
      </oms-row>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import {Audit, BaseInfo} from '@/resources';

  export default {
    props: {
      data: {
        type: Object,
        required: true
      },
      show: Boolean
    },
    computed: {
      companyAddress() {
        let province = this.data.province;
        let city = this.data.city;
        let region = this.data.region;
        return utils.formatAddress(province, city, region);
      }
    },
    filters: {
      isScanCode: function (value) {
        return value ? '扫码' : '不扫码';
      }
    },
    methods: {
      auditBaseInfo() {
        this.$confirm('确认审核通过"' + this.data.name + '"的基础信息、单位证照和经营范围等信息?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BaseInfo.auditBaseInfo(this.data.id, {status: '1'}).then(res => {
            this.data.auditedStatus = '1';
            this.data.auditDto.baseInfoStatus = '1';
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '审核"' + this.data.name + '"的基础信息、单位证照和经营范围等信息成功'
            });
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '审核"' + this.data.name + '"的基础信息、单位证照和经营范围等信息失败'
            });
          });
        }).catch(() => {

        });
      }
    }
  };
</script>
