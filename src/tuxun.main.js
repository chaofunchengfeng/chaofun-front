import Vue from 'vue';
import Cookies from 'js-cookie';
import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';

import './styles/element-variables.scss';
import '@/styles/index.scss'; // global css

import store from './store';
import router from './tuxun_router';
import getPageTitle from '@/utils/get-page-title';
import * as Sentry from '@sentry/vue';
try {
  // Sentry.init({
  //   Vue,
  //   dsn: 'https://baef8193202a4fc680faf2889e6d5f3a@o4505047283793920.ingest.sentry.io/4505047285170176',
  //   environment: 'production',
  //   integrations: [
  //     new Sentry.BrowserTracing({
  //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //       tracePropagationTargets: ['localhost', /^\//],
  //     }),
  //   ],
  //   // Set tracesSampleRate to 1.0 to capture 100%
  //   // of transactions for performance monitoring.
  //   // We recommend adjusting this value in production
  //   tracesSampleRate: 0.5,
  // });
} catch (e) {
  console.warn(e);
}


Vue.prototype.$EventBus = new Vue();

if (process.env.NODE_ENV === 'development') {
  const VConsole = require('vconsole');
  new VConsole();
}

// 图片开启懒加载
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload);

import Viewer from 'v-viewer';
import './assets/css/viewer.css';
Vue.use(Viewer);
Viewer.setDefaults({
  zIndexInline: 9999,
  // 'inline': false,
  // 'button': true, //右上角按钮
  // "navbar": true, //底部缩略图
  // "title": false, //当前图片标题
  // "toolbar": true, //底部工具栏
  // "tooltip": true, //显示缩放百分比
  // "movable": true, //是否可以移动
  // "zoomable": true, //是否可以缩放
  // "rotatable": true, //是否可旋转
  // "scalable": false, //是否可翻转
  // "transition": true, //使用 CSS3 过度
  // "fullscreen": false, //播放时是否全屏
  // "keyboard": true, //是否支持键盘
  'url': 'data-source',
});

import VueScroller from 'vue-scroller';
Vue.use(VueScroller);

import './icons'; // icon
import './tuxun.permission'; // permission control
import './utils/error-log'; // error log
import * as filters from './filters'; // global filters
import i18n from './lang';
// const {version} = require('./utils/version')


// Vue.prototype.$close = close

import mixins from './mixins/mixins';
Vue.mixin(mixins);

import jquery from 'jquery';
Vue.prototype.$ = jquery;

import {
  Toast,Dialog,Cell,NumberKeyboard,Field,Popup
} from 'vant';
import 'vant/lib/index.css';
Vue.use(Toast).use(Dialog).use(Cell).use(NumberKeyboard).use(Field).use(Popup);

if (process.env.NODE_ENV === 'production') {
}

// Moment.js 设置默认中文
import moment from 'moment';
moment.locale('zh-cn');

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// 版本检查
// version()

Vue.config.productionTip = false;

// 加入百度统计
router.beforeEach((to, from, next) => {

  document.title = getPageTitle(to.meta.title);

  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', to.fullPath]);
    }
  }

  console.log('路由切换， tuxun');
  if(to.path != '/lists'){
    // console.log('aaa')
    store.state.settings.leftNav = 'normal';
    // console.log('aaa',store.state.settings.leftNav)
  }
  // if(to.meta.keepAlive&&!from.path.includes('/p/')){
  //   to.meta.keepAlive = false;
  // }else if(from.path.includes('/p/')&&(to.path.includes('/f/')||to.path.includes('/all')||to.path.includes('/f/'))){

  // }
  next();
});

import L from 'leaflet';
import Tuxun from './Tuxun';
// import {pointCorrection} from '@shzl/shzl-leaflet';
// pointCorrection(L)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  el: '#tuxun',
  router,
  store,
  render: h => h(Tuxun)
});
