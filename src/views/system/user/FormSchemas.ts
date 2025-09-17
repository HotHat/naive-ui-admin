import { h } from 'vue';
import { NTag, NSpace } from 'naive-ui';
import { FormSchema } from '@/components/Form/index';

export const formSchemas: FormSchema[] = [
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
    field: 'mobile',
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
    field: 'type',
    component: 'NSelect',
    label: '',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        {
          label: '舒适性',
          value: 1,
        },
        {
          label: '经济性',
          value: 2,
        },
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
  },
];
