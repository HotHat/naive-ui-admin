<template>
  <n-drawer v-model:show="state.isDrawer" :width="width" :placement="state.placement">
    <n-drawer-content :title="title" closable>
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="100"
      >
        <!-- <n-form-item label="类型" path="type">
          <span>{{ formParams.type === 1 ? '侧边栏菜单' : '' }}</span>
        </n-form-item> -->
        <n-form-item label="父级菜单" path="parentTitle">
          <n-select :disabled="true" v-model:value="parentItem.id" :options="selectOptions" />
        </n-form-item>
        <n-form-item label="标题" path="label">
          <n-input placeholder="请输入标题" v-model:value="formParams.label" />
        </n-form-item>
        <!-- <n-form-item label="副标题" path="subtitle">
          <n-input placeholder="请输入副标题" v-model:value="formParams.subtitle" />
        </n-form-item> -->
        <n-form-item label="路径" path="path">
          <n-input placeholder="请输入路径" v-model:value="formParams.path" />
        </n-form-item>
        <!-- <n-form-item label="打开方式" path="openType">
          <n-radio-group v-model:value="formParams.openType" name="openType">
            <n-space>
              <n-radio :value="1">当前窗口</n-radio>
              <n-radio :value="2">新窗口</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item> -->
        <n-form-item label="菜单权限" path="auth">
          <n-input
            placeholder="请输入权限，多个权限用，分割"
            type="textarea"
            v-model:value="formParams.auth"
          />
        </n-form-item>
        <n-form-item label="排序" path="order">
          <n-input placeholder="请输入排序序号" v-model:value="formParams.order" />
        </n-form-item>
        <n-form-item label="隐藏侧边栏" path="hidden">
          <n-switch v-model:value="formParams.hidden" />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space>
          <n-button type="primary" :loading="state.subLoading" @click="formSubmit">提交</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
  import { reactive, ref, toRefs, nextTick } from 'vue';
  import { useMessage } from 'naive-ui';
  import { addMenu } from '@/api/system/menu';
  interface MenuParent {
    id: number;
    label: string;
    value: number;
  }

  const rules = {
    label: {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
    path: {
      required: true,
      message: '请输入路径',
      trigger: 'blur',
    },
    order: {
      validator: (rule, value) => {
        // Convert the string value to a number before validation
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return new Error('排序必须是数字');
        }
        return true;
      },
      trigger: ['input', 'blur'],
    },
  };

  defineProps({
    title: {
      type: String,
      default: '添加顶级菜单',
    },
    width: {
      type: Number,
      default: 450,
    },
  });

  const message = useMessage();
  const formRef: any = ref(null);
  const parentItem = ref<MenuParent>({
    id: 0,
    label: '无父级菜单',
    value: 0,
  });
  let selectOptions = ref<any>([]);

  const defaultValueRef = () => ({
    parentId: 0,
    label: '',
    type: 1,
    subtitle: '',
    openType: 1,
    auth: '',
    path: '',
    order: '',
    hidden: false,
  });
  const formParams = ref(defaultValueRef());
  const state = reactive({
    isDrawer: false,
    subLoading: false,
    placement: 'right' as const,
  });

  function openDrawer(parent: MenuParent) {
    state.isDrawer = true;
    formParams.value.parentId = parent.id;
    parentItem.value = parent;
    selectOptions.value = [
      {
        label: parent.label,
        value: parent.id,
      },
    ];
  }

  function closeDrawer() {
    state.isDrawer = false;
  }

  function formSubmit() {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        message.success('添加成功');
        const data = formParams.value;
        handleReset();
        closeDrawer();
        await addMenu(data);
      } else {
        message.error('请填写完整信息');
      }
    });
  }

  function handleReset() {
    formRef.value.restoreValidation();
    formParams.value = Object.assign(formParams.value, defaultValueRef());
  }
  defineExpose({
    openDrawer,
    closeDrawer,
  });
</script>
