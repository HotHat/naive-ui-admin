import { Alova } from '@/utils/http/alova/index';

export interface Captcha {
  captcha_id: string;
}

/**
 * @description: 获取验证码id
 */
export async function getCaptchaId() {
  return Alova.Get<Captcha>('/v1/captcha/id');
  // console.log('getCaptchaId', data.captcha_id);
  // return respond;
}

/**
 * @description: 用户登录
 */
export function getCaptcha(id: string, reload = false): Promise<string> {
  return Alova.Get(`/v1/captcha/image?id=${id}&reload=${reload ? 1 : 0}`, {
    cacheFor: null,
    meta: {
      isReturnNativeResponse: true,
    },
  }).then(async (response: any) => {
    console.log('response', response, typeof response);
    const blob = await response.blob();
    // console.log('blob', blob);
    return URL.createObjectURL(blob);
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
