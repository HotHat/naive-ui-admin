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

/**
 * 获取角色详情
 * @param id
 */
export function getRoleDetail(id: number) {
  return Alova.Get<any>(`/v1/roles/${id}`);
}

/**
 * 添加角色
 * @param params
 */
export function addRole(params: any) {
  return Alova.Post<any>(`/v1/roles`, params);
}

/**
 * 更新角色权限
 * @param params
 */
export function updateRolePermissions(id: number, params: any) {
  return Alova.Put<any>(`/v1/roles/${id}`, params);
}
