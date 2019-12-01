<template>
  <div class="page-right-wrap">
    <div class="page-right-part" :class="[{'on':show},partClass]" :style="style">
      <div class="right-close-icon" @click="close"><i class="el-icon-t-remove"></i></div>
      <slot @right-close="close"></slot>
    </div>
    <div class="page-right-part-bg" @click="modelClose" v-show="show"></div>
  </div>
</template>

<script>
  import HandleClass from '@/tools/handleClass';

  export default {
    name: 'pageRight',

    props: {
      show: {
        type: Boolean,
        default: false
      },
      css: {
        type: Object
      },
      partClass: {
        type: String,
        default: 'pr-animation'
      },
      doCloseOnModalClick: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show: function (val) {
        if (val) {
          HandleClass.addClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        } else {
          HandleClass.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        }
      }
    },
    computed: {
      style: function () {
        let defaultObj = {
          width: '550px',
          padding: '30px'
        };
        let cssArr = [];
        let obj = {};
        obj = Object.assign({}, defaultObj, this.css);
        for (let i in obj) {
          cssArr.push(i + ':' + obj[i]);
        }
        return cssArr.join(';');
      }
    },
    methods: {
      close: function () {
        this.$emit('right-close');
      },
      modelClose() {
        if (this.doCloseOnModalClick) return;
        this.close();
      }
    }
  };
</script>
