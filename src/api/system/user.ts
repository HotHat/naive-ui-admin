import { permission } from '@/directives/permission';
import { Alova } from '@/utils/http/alova/index';
import { result } from 'lodash';
import { defineMock } from '@alova/mock';
import Mock from 'mockjs';

const Random = Mock.Random;

/**
 * @description: 获取用户信息
 */
export async function getUserInfo() {
  const resp: any = await Alova.Get<InResult>('/api/v1/user', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
  console.log('getUserInfo', resp);
  return {
    code: resp.success ? 200 : 400,
    result: {
      userId: resp.data.id,
      username: resp.data.username,
      realName: resp.data.name,
      avatar: Random.image(),
      desc: 'manager',
      permissions: [
        {
          label: '主控台',
          value: 'dashboard_console',
        },
        {
          label: '监控页',
          value: 'dashboard_monitor',
        },
        {
          label: '工作台',
          value: 'dashboard_workplace',
        },
        {
          label: '基础列表',
          value: 'basic_list',
        },
        {
          label: '基础列表删除',
          value: 'basic_list_delete',
        },
      ],
    },
  } as any;
}

/**
 * @description: 用户登录
 */
export async function login(params) {
  const resp: any = await Alova.Post<InResult>('/api/v1/login', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
  return {
    code: resp.success ? 200 : 400,
    result: { token: resp.data.access_token },
  } as any;
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
