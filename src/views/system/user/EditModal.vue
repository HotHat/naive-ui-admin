<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { nextTick, onUpdated } from 'vue';
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { SelectOption } from 'naive-ui';
  import { getSchemas } from './columns';

  interface Props {
    roleOption: SelectOption[];
  }

  const props = defineProps<Props>();

  let [registerForm, { submit, setFieldsValue }] = useForm({});

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑角色',
    subBtuText: '保存',
  });

  function showModal(record: any) {
    openModal();
    nextTick(() => {
      record && setFieldsValue({ ...record });
    });
  }

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      closeModal();
      console.log('formRes', formRes);
    } else {
      setSubLoading(false);
    }
  }

  onUpdated(() => {
    [registerForm, { submit, setFieldsValue }] = useForm({
      gridProps: { cols: 1 },
      collapsedRows: 3,
      labelWidth: 80,
      layout: 'horizontal',
      submitButtonText: '保存',
      showActionButtonGroup: false,
      schemas: getSchemas(props.roleOption, false),
    });
  });
  defineExpose({
    showModal,
  });
</script>
