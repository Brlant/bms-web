import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';
import './assets/css/basic.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import App from './App.vue';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/dataZoom';
import ECharts from 'vue-echarts/components/ECharts.vue';

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

// // 初始化视口宽度
// initViewPort(router);

Vue.component('ECharts', ECharts);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

if (process.env.NODE_ENV === 'production') {
  // 日志工具
  Raven
    .config('https://62f56ceea555483fab3d6238ff4a80d0@f-log.cdcerp.net/3', {
      serverName: 'ccs',
      shouldSendCallback: (date) => {// 过滤错误日志
        let filterArray = ['Request failed with status code 401', 'Request failed with status code 502'];
        if (date && date.hasOwnProperty('exception') && date.exception.hasOwnProperty('values') && filterArray.indexOf(date.exception.values[0].value) > -1 || date && date.transaction && date.transaction.indexOf('http://requirejs.org/docs/errors.html') > -1) {
          return false;
        }
        return date;
      }
    })
    .addPlugin(RavenVue, Vue)
    .install();
}

init(Vue);

Vue.prototype.$getDict = function (groupName) {
  if (!groupName) return [];
  const state = this.$store.state;
  if (state.dict[groupName]) {
    return state.dict[groupName];
  } else {
    const ary = state.requestingDictAry;
    if (ary.includes(groupName)) return [];
    ary.push(groupName);
    this.$store.commit('initRequestingDictAry', ary);
    this.$http.get(`/dictGroup/${groupName}/items`).then(res => {
      state.dict[groupName] = res.data;
      this.$store.commit('initDict', state.dict);
      const ary_new = state.requestingDictAry;
      let index = ary_new.indexOf(groupName);
      if (index !== -1) {
        ary_new.splice(index, 1);
      }
      this.$store.commit('initRequestingDictAry', ary_new);
    });
    return [];
  }
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

