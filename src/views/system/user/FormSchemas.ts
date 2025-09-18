import { FormSchema } from '@/components/Form';

export const formSchemas: FormSchema[] = [
  {
    field: 'username',
    // labelMessage: '这是一个提示',
    component: 'NInput',
    label: '',
    componentProps: {
      placeholder: '请输入用户名',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    // rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
  },
  {
    field: 'name',
    // labelMessage: '这是一个提示',
    component: 'NInput',
    label: '',
    componentProps: {
      placeholder: '请输入姓名',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    // rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
  },
  {
    field: 'phone',
    component: 'NInputNumber',
    label: '',
    componentProps: {
      placeholder: '请输入手机号码',
      showButton: false,
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'status',
    component: 'NSelect',
    label: '',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '启用',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
  },
];
