<template>
  <div :class="{up: showSearch}" class="opera-btn-group">
    <div class="opera-icon">
      <el-col :span="titleSpan">
        <h2 class="header f-dib">
          <slot name="title"></slot>
        </h2>
      </el-col>
      <el-col :span="midSpan">
        <slot name="mid"></slot>
      </el-col>
      <el-col :span="24-midSpan-titleSpan" class="text-right">
        <el-button-group v-show="isShowButton">
          <el-button @click="search" plain size="small" v-has="'show'">
            <f-a class="icon-small" name="search"></f-a>
            查询
          </el-button>
          <el-button @click="reset" plain size="small" v-has="'show'">
            <f-a class="icon-small" name="reset"></f-a>
            重置
          </el-button>
          <el-button @click="showSearch = !showSearch" plain
                     size="small" type="primary" v-has="'show'" v-show="isShowAdvance">高级检索
          </el-button>
          <slot name="btn"></slot>
        </el-button-group>
        <slot name="btnNoGroup"></slot>
      </el-col>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script>
  export default {
    name: 'searchTemplate',
    props: {
      isShow: Boolean,
      isShowAdvance: {
        type: Boolean,
        default: true
      },
      isShowButton: {
        type: Boolean,
        default: true
      },
      titleSpan: {
        type: Number,
        default: 4
      },
      midSpan: {
        type: Number,
        default: 4
      }
    },
    data: function () {
      return {
        showSearch: false
      };
    },
    watch: {
      showSearch(val) {
        this.$emit('isShow', val);
      },
      isShow(val) {
        this.showSearch = val;
      }
    },
    methods: {
      search() {
        this.$emit('search');
      },
      reset() {
        this.$emit('reset');
      }
    }
  };
</script>
