import { Alova } from '@/utils/http/alova/index';
export interface ListDate {
  id: number;
  label: string;
  key: string;
  type: number;
  subtitle: string;
  openType: number;
  auth: string;
  path: string;
  children?: ListDate[];
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return Alova.Get('/menus');
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return Alova.Get<{ list: ListDate[] }>('/menu/list', {
    params,
  });
}

/**
 * 添加菜单
 * @param data
 */
export function addMenu(data) {
  return Alova.Post('/menu/add', data);
}
