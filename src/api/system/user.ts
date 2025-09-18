import { Alova } from '@/utils/http/alova/index';
import Mock from 'mockjs';

const Random = Mock.Random;

export interface Login {
  access_token: string;
  expires_at: number;
}

/**
 * @description: 获取用户信息
 */
export async function getUserInfo() {
  const resp: any = await Alova.Get<InResult>('/v1/user', {
    meta: {
      // isReturnNativeResponse: true,
    },
  });
  console.log('getUserInfo', resp);
  return {
    code: resp.success ? 200 : 400,
    result: {
      userId: resp.id,
      username: resp.username,
      realName: resp.name,
      avatar: Random.image(),
      desc: 'manager',
      permissions: resp.permissions,
    },
  } as any;
}

/**
 * @description: 用户登录
 */
export async function login(params) {
  const resp = await Alova.Post<Login>('/v1/login', params);
  return {
    code: 200,
    result: {
      token: resp.access_token,
      username: '',
      email: '',
    },
    type: 'success',
  };
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

/**
 * @description: 用户列表
 */
export function getUserList(params) {
  return Alova.Get<{ data: any[]; page: any }>('/v1/users', {
    params,
  });
}

/**
 * @description: 用户列表
 */
export function addUser(params) {
  return Alova.Post('/v1/users', params);
}
