import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    component: () => import('./components/layout/index.vue'),
    children: [
      {
        path: '/org',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '单位主档', icon: 'platform', perm: 'oms-business-unit-manager'},
        children: [
          {
            path: '/org/info',
            component: () => import('./components/supplier/info/list.vue'),
            meta: {moduleId: 'monitoring', title: '单位信息', perm: 'oms-business-unit-query', type: 1}
          },
          {
            path: '/org/fund',
            component: () => import('./components/supplier/fund/index.vue'),
            meta: {moduleId: 'monitoring', title: '单位资金账户', perm: 'query-org-account-page', type: 1}
          },
          {
            path: '/org/fund/records',
            component: () => import('./components/supplier/records/index.vue'),
            meta: {moduleId: 'monitoring', title: '账户流水明细', perm: 'query-org-turnover-details', type: 1}
          }
        ]
      },
      {
        path: '/project',
        component: () => import('./components/project/index.vue'),
        meta: {moduleId: 'monitoring', title: '项目管理', icon: 'order', perm: 'query-project-page'},
        children: []
      },
      {
        path: '/contract',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '合同管理', icon: 'equipment', perm: 'contract-manager'},
        children: [
          {
            path: '/contract/info',
            component: () => import('./components/contract/info/index.vue'),
            meta: {moduleId: 'monitoring', title: '合同基础信息', perm: 'query-contract-page', type: 1}
          },
          {
            path: '/contract/cost',
            component: () => import('./components/contract/costModel/index.vue'),
            meta: {moduleId: 'monitoring', title: '合同计费模型管理', perm: 'query-contract-billing-model-page', type: 1}
          }
        ]
      },
      {
        path: '/cost/template',
        component: () => import('./components/cost/info/index.vue'),
        meta: {moduleId: 'monitoring', title: '计费模型模板', icon: 'validity', perm: 'query-billing-model-page', type: 1},
        children: []
      },
      {
        path: '/income',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '收入计费', icon: 'xiaoshouxiansuo', perm: 'cost-manager', type: 1},
        children: [
          {
            path: '/income/detail/manager',
            component: () => import('./components/income/detail/index.vue'),
            meta: {moduleId: 'monitoring', title: '计费明细管理', perm: 'query-billing-of-account-page', type: 1}
          },
          {
            path: '/income/billing/manager',
            component: () => import('./components/income/bill/index.vue'),
            meta: {moduleId: 'monitoring', title: '对账单管理', perm: 'account-check-query-page', type: 1}
          },
          {
            path: '/income/settle/manager',
            component: () => import('./components/income/close/index.vue'),
            meta: {moduleId: 'monitoring', title: '结算单管理', perm: 'statement-detail-query', type: 1}
          },
          {
            path: '/income/receive/task',
            component: () => import('./components/income/receive/index.vue'),
            meta: {moduleId: 'monitoring', title: '收款作业', perm: 'query-collection-jobs-page', type: 1}
          },
          {
            path: '/income/pre/receive/records',
            component: () => import('./components/income/pre/index.vue'),
            meta: {moduleId: 'monitoring', title: '预收款作业', perm: 'query-advance-collection-jobs', type: 1}
          },
          {
            path: '/income/pre/receive/balance',
            component: () => import('./components/income/balance/index.vue'),
            meta: {moduleId: 'monitoring', title: '预收款余额', perm: 'query-collection-balance', type: 1}
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'wms-system-config'},
        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/user.vue'),
            meta: {moduleId: 'permission', title: '用户管理', perm: 'wms-platform-user-watch'}
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'wms-access-role-watch'}
          },
          {
            path: '/permission/dict',
            component: () => import('./components/system/dict/dict.vue'),
            meta: {moduleId: 'permission', title: '数据字典', perm: 'oms-dict-group-query'}
          },
          {
            path: '/permission/log',
            component: () => import('./components/common/log/list.vue'),
            meta: {moduleId: 'permission', title: '系统日志', perm: 'wms-system-log'}
          }
        ]
      }
    ]
  }
];

export const basicRoutes = [
  {path: '/resetpsw', component: () => import('./components/login/resetpsw.vue')},
  {path: '/404', component: () => import('./components/error/error_404.vue')},
  {path: '/500', component: () => import('./components/error/error_500.vue')},
  {path: '/login', component: () => import('./components/login/login.vue')},
  {path: '/forget', component: () => import('./components/login/forget.vue')},
  {path: '/code/:id', component: () => import('./components/login/resetpwd.vue')}
];

export const ErrorPage = [
  {path: '*', component: () => import('./components/error/error_404.vue')}
];
//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: basicRoutes,
  base: '/'
});

export default router;
