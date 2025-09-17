import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return Alova.Get<{ data: any[]; page: any }>('/v1/roles', { params });
}

/**
 * @description: 所有角色列表
 */
export function getAllRoles() {
  return Alova.Get<any[]>('/v1/roles', {});
}
