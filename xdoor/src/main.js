import Vue from 'vue'
import App from './App'
import router from './router'

// 引用api文件
import ajax from './api/index.js'
// 将API方法绑定到全局
Vue.prototype.$http = ajax;

// 引用工具文件
import utils from './utils/index.js';

// 将工具方法绑定到全局
Vue.prototype.$utils = utils;

// 引入 Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/element-variables.scss';
import './style/_style.scss';

Vue.use(ElementUI);

import Print from 'vue-print-nb'

Vue.use(Print);

import '../static/iconfont/iconfont.css'

// 图片懒加载
import VueLazyLoad from 'vue-lazyload'

// Vue.use(VueLazyLoad);
// Vue.use(VueLazyLoad, {
//   preLoad: 1,
//   error: './static/image/error.png',
//   loading: './static/image/loading.gif',
//   attempt: 1
// });

import 'babel-polyfill'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
