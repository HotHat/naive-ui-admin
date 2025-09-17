import { h } from 'vue';
import { NTag, NSpace } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '姓名',
    key: 'name',
  },
  {
    title: '所属角色',
    key: 'roles',
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () =>
            row['roles'].map((item) =>
              h(
                NTag,
                {},
                {
                  default: () => item['name'],
                }
              )
            ),
        }
      );
    },
  },
  {
    title: '电话',
    key: 'phone',
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      if (row.status === 1) {
        return h(
          NTag,
          {},
          {
            default: () => '正常',
          }
        );
      } else {
        return h(
          NTag,
          { type: 'warning' },
          {
            default: () => '锁定',
          }
        );
      }
    },
  },
  {
    title: '说明',
    key: 'remark',
  },
  {
    title: '创建时间',
    key: 'created_at',
  },
  {
    title: '更新时间',
    key: 'updated_at',
  },
];
