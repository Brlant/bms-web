export default [
  {
    id: 'monitoring-center-manager',
    label: '监控中心',
    children: [
      {
        id: 'own-dev-monitoring',
        label: '本单位设备监控'
      },
      {
        id: 'pov-dev-monitoring',
        label: '接种单位设备监控'
      },
      {
        id: 'entrust-store-monitoring',
        label: '委托仓库监控'
      },
      {
        id: 'history-data-manager',
        label: '历史数据查询'
      }
    ]
  },
  {
    id: 'dev-manager',
    label: '设备管理',
    children: [
      {
        id: 'probe-manager',
        label: '探头管理'
      },
      {
        id: 'cool-manager',
        label: '冷链设备管理'
      },
      {
        id: 'gateway-manager',
        label: '网关管理'
      }
    ]
  },
  {
    id: 'config-center-manager',
    label: '配置中心',
    children: [
      {
        id: 'alarm-rule',
        label: '告警规则'
      },
      {
        id: 'alarm-notify-group',
        label: '告警通知组'
      },
      {
        id: 'alarm-test',
        label: '告警测试'
      }
    ]
  },
  {
    id: 'alarm-center',
    label: '告警中心',
    children: [
      {
        id: 'alarm-event',
        label: '告警事件'
      },
      {
        id: 'alarm-notify',
        label: '告警通知'
      }
    ]
  },
  {
    id: 'dev-check',
    label: '设备巡检',
    children: [
      {
        id: 'check-plan',
        label: '巡检计划'
      },
      {
        id: 'check-records',
        label: '巡检记录'
      }
    ]
  },
  {
    id: 'system-setting',
    label: '系统设置',
    children: [
      {
        id: 'user-manager',
        label: '用户管理'
      },
      {
        id: 'role-manager',
        label: '角色管理'
      },
      {
        id: 'system-log',
        label: '系统日志'
      }
    ]
  }
]
