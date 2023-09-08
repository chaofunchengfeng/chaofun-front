import Vue from 'vue';
import Router from 'vue-router';

// import store from '../store'
// console.log('storestorestore',store)
import * as api from '../api/api';
Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/tuxun/TXNewHome'),
    meta: { title: '图寻 - 探索世界，找到你'},
    hidden: true
  },
  {
    path: '/wxPay',
    component: () => import('@/views/tuxun/pay'),
    meta: { title: '支付-图寻'},
    hidden: true
  },
  {
    path: '/wxRedirect',
    component: () => import('@/views/tuxun/WXRedirect'),
    meta: { title: '重定向'},
    hidden: true
  },
  {
    path: '/maps',
    component: () => import('@/views/tuxun/maps'),
    meta: { title: '图寻-题库'},
    hidden: true
  },
  {
    path: '/maps_distribute',
    component: () => import('@/views/tuxun/MapsDistribute'),
    name: 'maps_distribute',
    meta: { title: '题库题目分布'},
    hidden: true
  },
  {
    path: '/party',
    component: () => import('@/views/tuxun/party'),
    name: '派对-图寻',
    meta: { title: '图寻派对'},
    hidden: true
  },
  {
    path: '/message',
    component: () => import('@/views/tuxun/message'),
    name: 'tuxun-message',
    meta: { title: '图寻消息-通知'},
    hidden: true
  },
  {
    path: '/paidui',
    component: () => import('@/views/tuxun/party'),
    name: '派对-图寻',
    meta: { title: '图寻派对'},
    hidden: true
  },
  {
    path: '/team',
    component: () => import('@/views/tuxun/team'),
    name: 'tuxun-team',
    meta: { title: '组队-图寻'},
    hidden: true
  },
  {
    path: '/team-join',
    component: () => import('@/views/tuxun/team-join'),
    name: 'tuxun-team-join',
    meta: { title: '组队加入-图寻'},
    hidden: true
  },
  {
    path: '/join',
    component: () => import('@/views/tuxun/join'),
    name: '加入派对-图寻',
    meta: { title: '加入派对-图寻'},
    hidden: true
  },
  {
    path: '/my_maps',
    component: () => import('@/views/tuxun/MyMaps'),
    meta: { title: '题库-图寻'},
    hidden: true
  },
  {
    path: '/maps_create',
    component: () => import('@/views/tuxun/MapsCreate'),
    meta: { title: '创建题库-图寻'},
    hidden: true
  },
  {
    path: '/replay',
    component: () => import('@/views/tuxun/Replay'),
    name: 'maps',
    meta: { title: '复盘-图寻'},
    hidden: true
  },
  {
    path: '/replay_pano',
    component: () => import('@/views/tuxun/ReplayPanorama'),
    name: 'maps',
    meta: { title: '复盘街景-图寻'},
    hidden: true
  },
  {
    path: '/maps_modify',
    component: () => import('@/views/tuxun/MapsModify'),
    meta: { title: '修改题库-图寻'},
    hidden: true
  },
  {
    path: '/maps-filter',
    component: () => import('@/views/tuxun/maps-jupao'),
    meta: { title: '题库筛选-图寻'},
    hidden: true
  },
  {
    path: '/solo_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-Solo'},
    hidden: true
  },
  {
    path: '/team_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-组队'},
    hidden: true
  },
  {
    path: '/random',
    component: () => import('@/views/tuxun/RandomStreetView'),
    meta: { title: '图寻-随机街景'},
    hidden: true
  },
  {
    path: '/pano-gallary',
    component: () => import('@/views/tuxun/pano-gallary'),
    name: 'pano-gallary',
    meta: { title: '炒饭宇宙-图寻'},
    hidden: true
  },
  {
    path: '/pano-demo',
    component: () => import('@/views/tuxun/pano-demo'),
    hidden: true
  },
  {
    path: '/pano-demo-1',
    component: () => import('@/views/tuxun/pano-demo-1'),
    hidden: true
  },
  {
    path: '/pano-demo-2',
    component: () => import('@/views/tuxun/pano-demo-2'),
    hidden: true
  },
  {
    path: '/pano-demo-3',
    component: () => import('@/views/tuxun/pano-demo-3'),
    hidden: true
  },
  {
    path: '/library',
    component: () => import('@/views/tuxun/tuxun-library'),
    name: 'tuxun-library',
    meta: { title: '实验室-图寻'},
    hidden: true
  },
  {
    path: '/finder',
    component: () => import('@/views/tuxun/finderV2'),
    name: 'tuxun-finder',
    meta: { title: '炒饭寻景-图寻'},
    hidden: true
  },
  {
    path: '/finderV2',
    component: () => import('@/views/tuxun/finderV2'),
    hidden: true
  },
  {
    path: '/map-maker',
    component: () => import('@/views/tuxun/map-maker'),
    name: 'map-maker',
    meta: { title: '题库制作-图寻'},
    hidden: true
  },
  {
    path: '/finder-manager',
    component: () => import('@/views/tuxun/finder-manager'),
    name: 'tuxun-finder-manager',
    meta: { title: '投稿管理-寻景'},
    hidden: true
  },
  {
    path: '/friend',
    component: () => import('@/views/tuxun/friend'),
    name: 'tuxun-friend',
    meta: { title: '好友-图寻'},
    hidden: true
  },
  {
    path: '/finder-upload',
    component: () => import('@/views/tuxun/finder-upload'),
    name: 'tuxun-finder-upload',
    meta: { title: '寻景上传-图寻'},
    hidden: true
  },
  {
    path: '/activities',
    component: () => import('@/views/tuxun/activities'),
    name: 'tuxun-activities',
    meta: { title: '历史记录'},
    hidden: true
  },
  {
    path: '/pano-create',
    component: () => import('@/views/tuxun/pano-create'),
    name: 'pano-create',
    meta: { title: '炒饭宇宙创造-图寻'},
    hidden: true
  },
  {
    path: '/pano-preview',
    component: () => import('@/views/tuxun/pano-preview'),
    name: 'pano-preview',
    meta: { title: '预览-图寻'},
    hidden: true
  },
  {
    path: '/wonders',
    component: () => import('@/views/tuxun/wonders'),
    meta: { title: '图寻-街景奇观'},
    hidden: true
  },
  {
    path: '/wonders-filter',
    component: () => import('@/views/tuxun/wonders-filter'),
    name: 'tuxun-wonders-filter',
    meta: { title: '图寻-街景奇观审核'},
    hidden: true
  },
  {
    path: '/wonders-admin',
    component: () => import('@/views/tuxun/wonders-filter'),
    name: 'tuxun-wonders-filter',
    meta: { title: '图寻-街景奇观审核'},
    hidden: true
  },
  {
    path: '/maps_detail',
    component: () => import('@/views/tuxun/MapsDetail'),
    name: 'maps',
    meta: { title: '题库详情-图寻'},
    hidden: true
  },
  {
    path: '/user-analysis',
    component: () => import('@/views/tuxun/user-analysis'),
    name: 'user-analysis',
    meta: { title: '技术分析-图寻',},
    hidden: true
  },
  {
    path: '/maps-score-manager',
    component: () => import('@/views/tuxun/maps-score-manager'),
    name: 'maps',
    meta: { title: '成绩删除-图寻'},
    hidden: true
  },
  {
    path: '/maps-hot',
    component: () => import('@/views/tuxun/maps-hot'),
    name: 'maps-hot',
    meta: { title: '最热题库-图寻'},
    hidden: true
  },
  {
    path: '/maps-start',
    component: () => import('@/views/tuxun/maps-start'),
    name: 'maps-start',
    meta: { title: '开始-图寻'},
    hidden: true
  },
  {
    path: '/maps-new',
    component: () => import('@/views/tuxun/maps-new'),
    name: 'maps-hot',
    meta: { title: '最新题库-图寻'},
    hidden: true
  },
  {
    path: '/maps-tag-manager',
    component: () => import('@/views/tuxun/maps-tag-manager'),
    name: 'maps-tag-manaager',
    meta: { title: '标签管理-图寻'},
    hidden: true
  },
  {
    path: '/daily_challenge',
    component: () => import('@/views/tuxun/DailyChallenge'),
    name: 'daily-challenge',
    meta: { title: '每日挑战-图寻'},
    hidden: true
  },
  {
    path: '/match',
    component: () => import('@/views/tuxun/match'),
    name: '匹配-图寻',
    meta: { title: '匹配-图寻'},
    hidden: true
  },
  {
    path: '/challenge',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻-挑战',
    meta: { title: '图寻-挑战'},
    hidden: true
  },
  {
    path: '/guoqing',
    component: () => import('@/views/tuxun/TuxunGuoQing'),
    name: '图寻-淘汰赛',
    meta: { title: '图寻-淘汰赛'},
    hidden: true
  },
  {
    path: '/guoqing_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻-淘汰赛',
    meta: { title: '图寻-淘汰赛'},
    hidden: true
  },  {
    path: '/streak_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-连胜'},
    hidden: true
  },
  {
    path: '/main_game',
    component: () => import('@/views/tuxun/TXHome'),
    meta: { title: '图寻-积分赛'},
    hidden: true
  },
  {
    path: '/rank',
    component: () => import('@/views/tuxun/rank'),
    meta: { title: '图寻-积分排行'},
    hidden: true
  },
  {
    path: '/streak',
    component: () => import('@/views/tuxun/TXStreak'),
    meta: { title: '图寻-连胜'},
    hidden: true
  },
  {
    path: '/publicity',
    component: () => import('@/views/tuxun/publicity'),
    meta: { title: '图寻-外宣'},
    hidden: true
  },
  {
    path: '/user/:id',
    component: () => import('@/views/tuxun/profile'),
    meta: { title: '图寻-个人首页'},
    hidden: true
  },
  {
    path: '/tuxunAdmin',
    component: () => import('@/views/tuxun/admin-console'),
    name: 'tuxun-admin-console',
    meta: { title: '图寻-管理'},
    hidden: true
  },
  {
    path: '/admin',
    component: () => import('@/views/tuxun/admin-console'),
    name: 'tuxun-admin-console',
    meta: { title: '图寻-管理'},
    hidden: true
  },
  {
    path: '/pano-filter',
    component: () => import('@/views/tuxun/TXAdmin'),
    name: 'tuxun-pano-filter',
    meta: { title: '图寻-街景审核'},
    hidden: true
  },
  {
    path: '/settings',
    component: () => import('@/views/list/setting'),
    name: 'setting',
    meta: { title: '设置',keepAlive: false},
    hidden: true
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
const asyncRoutesTest = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];
export const asyncRoutes = [

];
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes],
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
