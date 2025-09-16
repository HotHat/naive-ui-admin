import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return Alova.Get<{ data: any[]; page: any }>('/v1/roles', { params });
}
