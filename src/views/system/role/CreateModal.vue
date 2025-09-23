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

  const emit = defineEmits(['submit', 'register']);

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      rules: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
    },
    {
      field: 'description',
      component: 'NInput',
      label: '角色说明',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入角色角色说明',
      },
    },
    {
      field: 'status',
      component: 'NSwitch',
      label: '状态',
      defaultValue: 1,
      componentProps: {
        checkedValue: 1,
        uncheckedValue: 0,
      },
    },
  ];

  const [registerForm, { submit }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增角色',
    subBtuText: '保存',
  });

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      console.log('formRes', formRes);
      emit('submit', formRes);
      closeModal();
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    openModal,
  });
</script>
