import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',//将激活的路由添加一个mui-active类名称
  routes: [
    {
      path: '/',
      redirect: 'index'
    },
    {
      path: '/login',
      component: resolve => require(['../page/login.vue'], resolve),
      name: 'login'
    },
    {
      path: '/index',
      component: resolve => require(['../page/index.vue'], resolve),
      children: [
        {
          path: '/',
          name: 'index',
          redirect: 'charts'
        },
        {
          path: '/index/buildInsert',
          component: resolve => require(['../page/buildInsert.vue'], resolve),
          name: 'buildInsert'
        },
        {
          path: '/index/buildList',
          component: resolve => require(['../page/buildList.vue'], resolve),
          name: 'buildList'
        },
        {
          path: '/index/userInsert',
          component: resolve => require(['../page/userInsert.vue'], resolve),
          name: 'userInsert'
        },
        {
          path: '/index/inviteManage',
          component: resolve => require(['../page/inviteManage.vue'], resolve),
          name: 'inviteManage'
        },
        {
          path: '/index/maintainManage',
          component: resolve => require(['../page/maintainManage.vue'], resolve),
          name: 'maintainManage'
        },
        {
          path: '/index/noteManage',
          component: resolve => require(['../page/noteManage.vue'], resolve),
          name: 'noteManage'
        },
        {
          path: '/index/changeRoom',
          component: resolve => require(['../page/changeRoom.vue'], resolve),
          name: 'changeRoom'
        },
        {
          path: '/index/lockManage',
          component: resolve => require(['../page/lockManage.vue'], resolve),
          name: 'lockManage'
        },
        {
          path: '/index/lockInsert',
          component: resolve => require(['../page/lockInsert.vue'], resolve),
          name: 'lockInsert'
        },
        {
          path: '/index/authList',
          component: resolve => require(['../page/authList.vue'], resolve),
          name: 'authList'
        },
        {
          path: '/index/lockRecord',
          component: resolve => require(['../page/lockRecord.vue'], resolve),
          name: 'lockRecord'
        },
        {
          path: '/index/noticeManage',
          component: resolve => require(['../page/noticeManage.vue'], resolve),
          name: 'noticeManage'
        },
        {
          path: '/index/charts',
          component: resolve => require(['../page/charts.vue'], resolve),
          name: 'charts'
        },
        {
          path: '/index/xiaoquManage',
          component: resolve => require(['../page/xiaoquManage.vue'], resolve),
          name: 'xiaoquManage'
        }
      ]
    }
  ]
})
