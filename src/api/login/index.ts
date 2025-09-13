import { Alova } from '@/utils/http/alova/index';
import { P } from '@faker-js/faker/dist/airline-CLphikKp';

/**
 * @description: 获取验证码id
 */
export async function getCaptchaId(): Promise<string> {
  const respond = await Alova.Get<InResult>('/api/v1/captcha/id', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
  const { data } = respond as any;
  // console.log('getCaptchaId', data.captcha_id);
  return data.captcha_id;
}

/**
 * @description: 用户登录
 */
export function getCaptcha(id: string, reload = false): Promise<string> {
  return Alova.Get(`/api/v1/captcha/image?id=${id}&reload=${reload ? 1 : 0}`, {
    cacheFor: null,
    meta: {
      isReturnNativeResponse: false,
    },
  }).then(async (response: any) => {
    console.log('response', response, typeof response);
    const blob = await response.blob();
    // console.log('blob', blob);
    return URL.createObjectURL(blob);
  });
}

export function reloadCaptcha(id: string) {
  return Alova.Get<InResult>(`/api/v1/captcha/image`, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
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
