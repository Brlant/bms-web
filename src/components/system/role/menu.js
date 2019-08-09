export default [
  {
    id: 'oms-business-unit-manager',
    label: '单位主档',
    children: [
      {
        id: 'oms-business-unit',
        label: '单位信息',
        children: [
          {
            id: 'oms-business-unit-query',
            label: '查看单位信息'
          },
          {
            id: 'oms-business-unit-add',
            label: '增加单位'
          },
          {
            id: 'biz-edit',
            label: '编辑单位'
          },
          {
            id: 'oms-business-unit-delete',
            label: '启用和停用单位'
          },
          {
            id: 'biz-base-info-check',
            label: '审核单位'
          }
        ]
      },
      {
        id: 'query-org-account-page',
        label: '单位资金账户'
      },
      {
        id: 'query-org-turnover-details',
        label: '账户流水明细'
      }
    ]
  },
  {
    id: 'project-manager',
    label: '项目管理',
    children: [
      {
        id: 'query-project-page',
        label: '查看项目'
      },
      {
        id: 'add-project',
        label: '增加项目'
      },
      {
        id: 'edit-project',
        label: '编辑项目'
      },
      {
        id: 'enable-project',
        label: '启用项目'
      },
      {
        id: 'disable-project',
        label: '停用项目'
      }
    ]
  },
  {
    id: 'contract-manager',
    label: '合同管理',
    children: [
      {
        id: 'contract-base-manager',
        label: '合同基础信息',
        children: [
          {
            id: 'query-contract-page',
            label: '查看合同'
          },
          {
            id: 'add-contract',
            label: '增加合同'
          },
          {
            id: 'edit-contract',
            label: '编辑合同'
          },
          {
            id: 'disable-contract',
            label: '停用合同'
          },
          {
            id: 'enable-contract',
            label: '启用合同'
          },
          {
            id: 'add-contract-goods-model',
            label: '绑定货品'
          }
        ]
      },
      {
        id: 'contract-billing-model-manager',
        label: '合同计费模型管理',
        children: [
          {
            id: 'query-contract-billing-model-page',
            label: '查看合同'
          },
          {
            id: 'add-contract-billing-model',
            label: '增加合同'
          },
          {
            id: 'edit-contract-billing-model',
            label: '编辑合同'
          }
        ]
      },
    ]
  },
  {
    id: 'billing-model-manager',
    label: '计费模型模板',
    children: [
      {
        id: 'query-billing-model-page',
        label: '查看计费模型模板'
      },
      {
        id: 'add-billing-model',
        label: '增加计费模型模板'
      },
      {
        id: 'edit-billing-model',
        label: '编辑计费模型模板'
      },
      {
        id: 'enable-billing-model',
        label: '启用计费模型模板'
      },
      {
        id: 'disable-billing-model',
        label: '停用计费模型模板'
      }
    ]
  },
  {
    id: 'cost-manager',
    label: '收入计费',
    children: [
      {
        id: 'cost-detail-manager',
        label: '计费明细管理',
        children: [
          {
            id: 'query-billing-of-account-page',
            label: '查看计费明细'
          },
          {
            id: 'add-billing-of-account',
            label: '增加计费明细'
          },
          {
            id: 'edit-billing-of-account',
            label: '编辑计费明细'
          },
          {
            id: 'create-account-check',
            label: '批量生成对账单'
          },
          {
            id: 'race-blending',
            label: '批量生成结算单'
          }
        ]
      },
      {
        id: 'account-check-manager',
        label: '对账单管理',
        children: [
          {
            id: 'account-check-query-page',
            label: '查看对账单'
          },
          {
            id: 'account-check-audit',
            label: '审核对账单'
          },
          {
            id: 'account-check-confirm',
            label: '确认对账单'
          },
          {
            id: 'edit-account-check',
            label: '编辑对账单'
          }
        ]
      },
      {
        id: 'statement-manager',
        label: '结算单管理',
        children: [
          {
            id: 'statement-detail-query',
            label: '查看结算单'
          },
          {
            id: 'statement-audit',
            label: '审核结算单'
          },
          {
            id: 'edit-statement',
            label: '编辑结算单'
          },
          {
            id: 'batch-collection-jobs-statement',
            label: '批量生成收款作业'
          },
        ]
      },
      {
        id: 'query-collection-jobs-page',
        label: '收款作业',
      },
      {
        id: 'advance-collection-manager',
        label: '预收款作业',
        children: [
          {
            id: 'query-advance-collection-jobs',
            label: '查看预收款作业',
          },
          {
            id: 'add-advance-collection-jobs',
            label: '新增预收款作业',
          }
        ]
      },
      {
        id: 'query-collection-balance',
        label: '预收款余额',
      }
    ]
  },
  {
    'id': 'system-config',
    'parentId': null,
    'label': '系统设置',
    'sort': 5,
    'children': [
      {
        'id': 'access-role-manager',
        'parentId': 'wms-system-config',
        'label': '角色管理',
        'sort': 2,
        'children': [{
          'id': 'access-role-add',
          'parentId': 'wms-access-role-manager',
          'label': '新增角色',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-access-role-stop',
          'parentId': 'wms-access-role-manager',
          'label': '停用角色',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'access-role-edit',
          'parentId': 'wms-access-role-manager',
          'label': '编辑角色',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'access-role-watch',
          'parentId': 'wms-access-role-manager',
          'label': '查看角色',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-access-platfrom-role-export',
          'parentId': 'wms-access-role-manager',
          'label': '平台用户角色分配导出',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-access-role-start',
          'parentId': 'wms-access-role-manager',
          'label': '启用角色',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-access-platfrom-permission-export',
          'parentId': 'wms-access-role-manager',
          'label': '平台角色权限导出',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-access-role-delete',
          'parentId': 'wms-access-role-manager',
          'label': '删除角色',
          'sort': null,
          'children': null,
          'leaf': true
        }],
        'leaf': false
      },
      {
        'id': 'wms-platform-user-manager',
        'parentId': 'wms-system-config',
        'label': '用户管理',
        'sort': 1,
        'children': [{
          'id': 'wms-platform-user-edit',
          'parentId': 'wms-platform-user-manager',
          'label': '编辑平台用户',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-platform-user-add',
          'parentId': 'wms-platform-user-manager',
          'label': '新增平台用户',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-department-edit',
          'parentId': 'wms-platform-user-manager',
          'label': '编辑部门',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-department-delete',
          'parentId': 'wms-platform-user-manager',
          'label': '删除部门',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-platform-user-watch',
          'parentId': 'wms-platform-user-manager',
          'label': '查看平台用户',
          'sort': null,
          'children': null,
          'leaf': true
        }, {
          'id': 'wms-department-add',
          'parentId': 'wms-platform-user-manager',
          'label': '新增部门',
          'sort': null,
          'children': null,
          'leaf': true
        }],
        'leaf': false
      },
      {
        'id': 'dict-manager',
        'label': '数据字典',
        'children': [
          {
            'id': 'oms-dict-group-query',
            'label': '查询数据字典组',
          },
          {
            'id': 'oms-dict-group-add',
            'label': '新增数据字典组',
          },
          {
            'id': 'oms-dict-group-update',
            'label': '编辑数据字典组',
          },
          {
            'id': 'oms-dict-group-softDelete',
            'label': '删除数据字典组',
          },
          {
            'id': 'oms-dict-item-query',
            'label': '查询数据字典项',
          },
          {
            'id': 'oms-dict-item-add',
            'label': '新增数据字典项',
          },
          {
            'id': 'oms-dict-item-update',
            'label': '编辑数据字典项',
          },
          {
            'id': 'oms-dict-item-softDelete',
            'label': '删除数据字典项',
          }
        ]
      },
      {
        'id': 'wms-system-log',
        'parentId': 'wms-system-config',
        'label': '系统日志',
        'sort': 3,
        'children': null,
        'leaf': true
      },
      {
        'id': 'wms-attachment-name-update',
        'parentId': 'wms-system-config',
        'label': '编辑附件名称',
        'sort': 4,
        'children': null,
        'leaf': true
      }],
    'leaf': false
  }
];
