<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { SelectOption } from 'naive-ui';
  import { ref } from 'vue';
  import { onUpdated } from 'vue';
  import { getSchemas } from './columns';

  interface Props {
    roleOption: SelectOption[];
  }

  const emit = defineEmits(['submit', 'register']);

  const props = defineProps<Props>();

  console.log('CreateModal', props);
  const modalRef = ref(null);

  let [registerForm, { submit, setFieldsValue, getFieldsValue }] = useForm({});

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增用户',
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

  onUpdated(() => {
    [registerForm, { submit, setFieldsValue, getFieldsValue }] = useForm({
      gridProps: { cols: 1 },
      collapsedRows: 3,
      labelWidth: 80,
      layout: 'horizontal',
      submitButtonText: '保存',
      showActionButtonGroup: false,
      schemas: getSchemas(props.roleOption),
    });
  });

  defineExpose({
    openModal,
  });
</script>
