<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { SelectOption } from 'naive-ui';
  import { ref, nextTick } from 'vue';
  import { addUser } from '@/api/system/user';

  interface Props {
    roleOption: SelectOption[];
  }

  const emit = defineEmits(['add-user', 'register']);

  const props = defineProps<Props>();

  console.log('CreateModal', props);
  const modalRef = ref(null);

  const schemas: FormSchema[] = [
    {
      field: 'username',
      component: 'NInput',
      label: '用户名称',
      componentProps: {
        placeholder: '请输入用户名称',
      },
      rules: [{ required: true, message: '请输入用户名称', trigger: ['blur'] }],
    },
    {
      field: 'password',
      component: 'NInput',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
      rules: [{ required: true, message: '请输入密码', trigger: ['blur'] }],
    },
    {
      field: 'roles',
      component: 'NSelect',
      label: '角色',
      defaultValue: [],
      componentProps: {
        placeholder: '请输入角色',
        multiple: true,
        options: props.roleOption,
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

  let [registerForm, { submit, setFieldsValue, getFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增用户',
    subBtuText: '保存',
  });

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      console.log('formRes', formRes);
      await addUser(formRes);
      emit('add-user');
      nextTick();
      closeModal();
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    openModal,
  });
</script>
