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
          <n-input placeholder="请输入标题" v-model:value="formParams.name" />
        </n-form-item>
        <n-form-item label="类型" path="type">
          <n-radio
            :checked="formParams.type === 'page'"
            value="page"
            name="type"
            @change="handleTypeChange"
          >
            菜单
          </n-radio>
          <n-radio
            :checked="formParams.type === 'button'"
            value="button"
            name="type"
            @change="handleTypeChange"
          >
            按钮
          </n-radio>
        </n-form-item>
        <!-- <n-form-item label="副标题" path="subtitle">
          <n-input placeholder="请输入副标题" v-model:value="formParams.subtitle" />
        </n-form-item> -->
        <n-form-item label="路径" path="path">
          <n-input placeholder="请输入路径" v-model:value="formParams.path" />
        </n-form-item>
        <n-form-item label="菜单权限">
          <n-flex vertical style="width: 100%">
            <!-- <n-input
              type="textarea"
              placeholder="请输入权限，多个权限用，分割"
              v-model:value="formParams.auth"
            /> -->
            <div class="flex-box" v-for="(item, index) in formParams.resources" :key="index">
              <n-form-item
                class="first"
                :path="`resources[${index}].method`"
                :rule="dynamicInputRule"
              >
                <n-select v-model:value="item.method" :options="RespMethods" />
              </n-form-item>
              <n-form-item
                class="middle"
                :path="`resources[${index}].path`"
                :rule="dynamicInputRule"
              >
                <n-input placeholder="请输入路径" v-model:value="item.path" />
              </n-form-item>
              <n-form-item class="last">
                <n-button @click="delMenuResource(index)" text>
                  <template #icon>
                    <n-icon><DeleteOutlined /></n-icon>
                  </template>
                </n-button>
              </n-form-item>
            </div>
            <n-button dashed @click="addMenuResource()">
              <template #icon>
                <n-icon><PlusOutlined /></n-icon>
              </template>
              添加
            </n-button>
          </n-flex>
        </n-form-item>
        <!-- <n-form-item label="打开方式" path="openType">
          <n-radio-group v-model:value="formParams.openType" name="openType">
            <n-space>
              <n-radio :value="1">当前窗口</n-radio>
              <n-radio :value="2">新窗口</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item> -->
        <!--        <n-form-item label="菜单权限" path="auth">-->
        <!--          <n-input-->
        <!--            placeholder="请输入权限，多个权限用，分割"-->
        <!--            type="textarea"-->
        <!--            v-model:value="formParams.auth"-->
        <!--          />-->
        <!--        </n-form-item>-->
        <n-form-item label="排序" path="order">
          <n-input-number placeholder="请输入排序序号" v-model:value="formParams.order" />
        </n-form-item>
        <!--        <n-form-item label="隐藏侧边栏" path="hidden">-->
        <!--          <n-switch v-model:value="formParams.hidden" />-->
        <!--        </n-form-item>-->
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
  import { reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { addMenu, Resource, RespMethods } from '@/api/system/menu';
  import { DeleteOutlined, PlusOutlined } from '@vicons/antd';
  interface MenuParent {
    id: number;
    label: string;
    value: number;
  }

  const rules = {
    name: {
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
    parent_id: 0,
    name: '',
    type: 'page',
    subtitle: '',
    openType: 1,
    auth: '',
    path: '',
    order: 0,
    hidden: false,
    resources: [] as Resource[],
  });
  const formParams = ref(defaultValueRef());
  const state = reactive({
    isDrawer: false,
    subLoading: false,
    placement: 'right' as const,
  });

  function handleTypeChange(e: Event) {
    formParams.value.type = (e.target as HTMLInputElement).value;
  }

  function addMenuResource() {
    formParams.value.resources.push({
      method: 'GET',
      path: '',
    });
  }
  function delMenuResource(index) {
    formParams.value.resources.splice(index, 1);
  }

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
        const { auth, hidden, openType, parentId, subtitle, ...params } = formParams.value;
        params.parent_id = parentId;
        await addMenu(params);
        handleReset();
        closeDrawer();
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

<style scoped lang="less">
  .flex-box {
    display: flex;
    .first {
      width: 100px;
      margin-right: 10px;
    }
    .middle {
      flex-grow: 2;
    }
    .last {
      width: 50px;
      display: flex;
      justify-content: center;
    }
  }
</style>
