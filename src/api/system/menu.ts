import { Alova } from '@/utils/http/alova/index';

export interface MenuParent {
  id: number;
  label: string;
  value: number;
  type: string;
}

export interface Resource {
  method: string;
  path: string;
}

export interface ListMenu {
  id: number;
  parentId: number;
  label: string;
  key: string;
  type: number;
  subtitle: string;
  openType: number;
  auth: string;
  path: string;
  children?: ListMenu[];
  resources?: Resource[];
}

export interface MenuItem {
  id: number;
  parent_id: number;
  name: string;
  key: string;
  type: string;
  path: string;
  children?: MenuItem[];
  resources?: Resource[];
}

export const RespMethods = [
  {
    label: 'GET',
    value: 'GET',
  },
  {
    label: 'POST',
    value: 'POST',
  },
  {
    label: 'PUT',
    value: 'PUT',
  },
  {
    label: 'DELETE',
    value: 'DELETE',
  },
  {
    label: 'PATCH',
    value: 'PATCH',
  },
  {
    label: 'HEAD',
    value: 'HEAD',
  },
];

export function flattenTree(nodes: any[]): any[] {
  let flatNodes: any[] = [];

  for (const node of nodes) {
    // Add the current node to the flat array
    flatNodes.push({
      id: node.id,
      label: node.label,
      key: node.id,
      type: node.type,
      value: node.id,
    });

    // Recursively flatten children if they exist
    if (node.children && node.children.length > 0) {
      flatNodes = flatNodes.concat(flattenTree(node.children));
    }
  }

  return flatNodes;
}

export function travelTree(nodes: any[]): any[] {
  const flatNodes: any[] = [];

  for (const node of nodes) {
    // Add the current node to the flat array
    const item = {
      id: node.id,
      parentId: node.parent_id,
      label: node.name,
      key: node.id,
      type: node.type,
      value: node.id,
      path: node.path,
      children: null as any,
      resources: node.resources,
      order: node.sequence,
    };

    // Recursively flatten children if they exist
    if (node.children && node.children.length > 0) {
      item.children = travelTree(node.children);
    }
    flatNodes.push(item);
  }

  return flatNodes;
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
  return Alova.Get<MenuItem[]>('/v1/menus', {
    params,
  });
}

/**
 * 添加菜单
 * @param data
 */
export function addMenu(data) {
  return Alova.Post('/v1/menus', data);
}


