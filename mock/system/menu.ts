import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';
import type { ListMenu } from '@/api/system/menu';

const menuList = () => {
  const result: ListMenu[] = [
    {
      id: 1,
      parentId: 0,
      label: 'Dashboard',
      key: 'dashboard',
      type: 1,
      subtitle: 'dashboard',
      openType: 1,
      auth: 'dashboard',
      path: '/dashboard',
      children: [
        {
          id: 2,
          parentId: 1,
          label: '主控台',
          key: 'console',
          type: 1,
          subtitle: 'console',
          openType: 1,
          auth: 'console',
          path: '/dashboard/console',
        },
        {
          id: 3,
          parentId: 1,
          label: '工作台',
          key: 'workplace',
          type: 1,
          subtitle: 'workplace',
          openType: 1,
          auth: 'workplace',
          path: '/dashboard/workplace',
        },
      ],
    },
    {
      id: 4,
      parentId: 0,
      label: '表单管理',
      key: 'form',
      type: 1,
      subtitle: 'form',
      openType: 1,
      auth: 'form',
      path: '/form',
      children: [
        {
          id: 5,
          parentId: 4,
          label: '基础表单',
          key: 'basic-form',
          type: 1,
          subtitle: 'basic-form',
          openType: 1,
          auth: 'basic-form',
          path: '/form/basic-form',
        },
        {
          id: 6,
          parentId: 4,
          label: '分步表单',
          key: 'step-form',
          type: 1,
          subtitle: 'step-form',
          openType: 1,
          auth: 'step-form',
          path: '/form/step-form',
        },
        {
          id: 7,
          parentId: 4,
          label: '表单详情',
          key: 'detail',
          type: 1,
          subtitle: 'detail',
          openType: 1,
          auth: 'detail',
          path: '/form/detail',
        },
      ],
    },
  ];

  return result;
};

export default defineMock({
  '/api/menu/list': () => {
    const list = menuList();
    return resultSuccess({
      list,
    });
  },
});
