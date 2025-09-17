import { h } from 'vue';
import { NTag, NSpace } from 'naive-ui';
import { FormSchema } from '@/components/Form';

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

export function getSchemas(roleOption, isAdd = true): FormSchema[] {
  const first: FormSchema[] = [
    {
      field: 'username',
      component: 'NInput',
      label: '用户名称',
      componentProps: {
        placeholder: '请输入用户名称',
      },
      rules: [{ required: true, message: '请输入用户名称', trigger: ['blur'] }],
    },
  ];

  if (isAdd) {
    first.push({
      field: 'password',
      component: 'NInput',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
      rules: [{ required: true, message: '请输入密码', trigger: ['blur'] }],
    });
  }

  return [
    ...first,
    {
      field: 'roles',
      component: 'NSelect',
      label: '角色',
      defaultValue: [],
      componentProps: {
        placeholder: '请输入角色',
        multiple: true,
        options: roleOption,
      },
      rules: [{ type: 'array', required: true, message: '请输入角色', trigger: ['blur'] }],
    },
    {
      field: 'name',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
      },
      rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
    },
    {
      field: 'phone',
      component: 'NInput',
      label: '手机号码',
      componentProps: {
        placeholder: '请输入手机号码',
      },
      rules: [{ required: true, message: '请输入手机号码', trigger: ['blur'] }],
    },
    {
      field: 'email',
      component: 'NInput',
      label: '邮箱',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入邮箱姓名',
      },
      rules: [{ required: false, message: '请输入邮箱', trigger: ['blur'] }],
    },
    {
      field: 'remark',
      component: 'NInput',
      label: '备注说明',
      defaultValue: '',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入用户备注',
      },
    },
    {
      field: 'status',
      component: 'NSwitch',
      label: '启用',
      defaultValue: 1,
      componentProps: {
        // checked: true,
        defaultValue: 1,
        checkedValue: 1,
        uncheckedValue: 0,
      },
    },
  ];
}
