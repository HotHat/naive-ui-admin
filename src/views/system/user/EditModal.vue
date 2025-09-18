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

  const emit = defineEmits(['submit', 'register']);

  const props = defineProps<Props>();
  let recordId = 0;

  let [registerForm, { submit, setFieldsValue }] = useForm({});

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑角色',
    subBtuText: '保存',
  });

  function showModal(record: any) {
    openModal();
    recordId = record.id;
    nextTick(() => {
      record && setFieldsValue({ ...record });
    });
  }

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      console.log('editModal formRes', formRes);
      emit('submit', recordId, formRes);
      closeModal();
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
