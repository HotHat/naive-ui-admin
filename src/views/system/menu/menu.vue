<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="菜单权限管理">
        页面数据为 Mock 示例数据，非真实数据。
      </n-card>
    </div>
    <n-grid class="mt-4" cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-dropdown trigger="hover" @select="selectAddMenu" :options="addMenuOptions">
                <n-button type="info" ghost icon-placement="right">
                  添加菜单
                  <template #icon>
                    <div class="flex items-center">
                      <n-icon size="14">
                        <DownOutlined />
                      </n-icon>
                    </div>
                  </template>
                </n-button>
              </n-dropdown>
              <n-button type="info" ghost icon-placement="left" @click="packHandle">
                全部{{ expandedKeys.length ? '收起' : '展开' }}
                <template #icon>
                  <div class="flex items-center">
                    <n-icon size="14">
                      <AlignLeftOutlined />
                    </n-icon>
                  </div>
                </template>
              </n-button>
            </n-space>
          </template>
          <div class="w-full menu">
            <n-input type="input" v-model:value="pattern" placeholder="输入菜单名称搜索">
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <SearchOutlined />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  cascade
                  checkable
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  :expandedKeys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @update:selected-keys="selectedTree"
                  @update:expanded-keys="onExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <FormOutlined />
              </n-icon>
              <span>编辑菜单{{ treeItemTitle ? `：${treeItemTitle}` : '' }}</span>
            </n-space>
          </template>
          <n-alert type="info" closable> 从菜单列表选择一项后，进行编辑</n-alert>
          <n-form
            :model="formParams"
            :rules="rules"
            size="small"
            ref="formRef"
            label-placement="left"
            :label-width="100"
            v-if="isEditMenu"
            class="py-4"
          >
            <!-- <n-form-item label="类型" path="type">
              <span>{{ formParams.type === 1 ? '侧边栏菜单' : '' }}</span>
            </n-form-item> -->
            <n-form-item label="父级菜单" path="parentTitle">
              <n-select :disabled="true" v-model:value="optionParentId" :options="selectOptions" />
            </n-form-item>
            <n-form-item label="标题" path="label">
              <n-input placeholder="请输入标题" v-model:value="formParams.label" />
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
            <!-- <n-form-item label="打开方式" path="openType">
              <n-radio-group v-model:value="formParams.openType" name="openType">
                <n-space>
                  <n-radio :value="1">当前窗口</n-radio>
                  <n-radio :value="2">新窗口</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item> -->
            <n-form-item label="菜单权限">
              <!-- <n-dynamic-input
                v-model:value="formParams.resources"
                :on-create="onCreate"
                #="{ index }"
              >
                <div class="flex-box">
                  <n-form-item :path="`resources[${index}].method`" :rule="dynamicInputRule">
                    <n-select
                      class="first"
                      v-model:value="formParams.resources[index].method"
                      :options="RespMethods"
                    />
                  </n-form-item>
                  <n-form-item :path="`resources[${index}].path`" :rule="dynamicInputRule">
                    <n-input
                      class="middle"
                      placeholder="请输入路径"
                      v-model:value="formParams.resources[index].path"
                    />
                  </n-form-item>
                  <n-form-item>
                    <n-button class="last" @click="delMenuResource(index)" text>
                      <template #icon>
                        <n-icon><DeleteOutlined /></n-icon>
                      </template>
                    </n-button>
                  </n-form-item>
                </div>
              </n-dynamic-input> -->

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
            <n-form-item label="排序" path="order">
              <n-input placeholder="请输入排序序号" v-model:value="formParams.order" />
            </n-form-item>
            <n-form-item path="auth" style="margin-left: 100px">
              <n-space>
                <n-button type="primary" :loading="subLoading" @click="formSubmit"
                  >保存修改</n-button
                >
                <n-button @click="handleReset">重置</n-button>
                <n-button @click="handleDel">删除</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
    <CreateDrawer ref="createDrawerRef" :title="drawerTitle" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, computed } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import {
    DownOutlined,
    AlignLeftOutlined,
    SearchOutlined,
    FormOutlined,
    PlusOutlined,
    DeleteOutlined,
  } from '@vicons/antd';
  import { getMenuList, MenuParent, Resource, RespMethods } from '@/api/system/menu';
  import { getTreeItem } from '@/utils';
  import CreateDrawer from './CreateDrawer.vue';
  import type { ListMenu, flattenTree, travelTree } from '@/api/system/menu';
  import { pathToFileURL } from 'url';

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

  const formRef: any = ref(null);
  const createDrawerRef = ref();
  const message = useMessage();
  const dialog = useDialog();

  let treeItemKey = ref([]);
  let treeItemId = ref(0);
  let parentItem = ref<MenuParent>({
    id: 0,
    label: '无父级菜单',
    value: 0,
    type: '',
  });

  let optionParentId = ref(0);

  let expandedKeys = ref([]);
  let selectOptions = ref<any>([]);


  const treeData = ref<ListMenu[]>([]);

  const loading = ref(true);
  const subLoading = ref(false);
  const isEditMenu = ref(false);
  const treeItemTitle = ref('');
  const pattern = ref('');
  const drawerTitle = ref('');

  const isAddSon = computed(() => {
    return !treeItemKey.value.length || parentItem.value.type !== 'page';
  });

  const addMenuOptions = ref([
    {
      label: '添加顶级菜单',
      key: 'home',
      disabled: false,
    },
    {
      label: '添加子菜单',
      key: 'son',
      disabled: isAddSon,
    },
  ]);

  const formParams = reactive({
    type: 'page',
    parentId: 0,
    parentTitle: '',
    label: '',
    subtitle: '',
    path: '',
    auth: '',
    openType: 1,
    order: '',
    resources: [] as Resource[],
  });

  function handleTypeChange(e: Event) {
    formParams.type = (e.target as HTMLInputElement).value;
  }

  function onCreate() {
    return formParams.resources;
  }

  const dynamicInputRule = {
    trigger: 'input',
    validator(rule: unknown, value: string) {
      if (value.trim().length == 0) {
        return new Error('请输入请求路径');
      }
      return true;
    },
  };

  function selectAddMenu(key: string) {
    drawerTitle.value = key === 'home' ? '添加顶栏菜单' : `添加子菜单：${treeItemTitle.value}`;
    if (key === 'home') {
      parentItem.value = {
        id: 0,
        label: '无父级菜单',
        value: 0,
        type: 'page',
      };
    }

    openCreateDrawer(parentItem.value);
  }

  function openCreateDrawer(parent: MenuParent) {
    const { openDrawer } = createDrawerRef.value;
    openDrawer(parent);
  }

  function selectedTree(keys) {
    if (keys.length) {
      const treeItem = getTreeItem(unref(treeData), keys[0]);
      treeItemKey.value = keys;
      treeItemId.value = treeItem.id;
      treeItemTitle.value = treeItem.label;
      treeItem.resources = treeItem.resources || [];
      Object.assign(formParams, treeItem);
      isEditMenu.value = true;
      optionParentId.value = treeItem.parentId;
      parentItem.value = {
        id: treeItem.id,
        label: treeItem.label,
        value: treeItem.id,
        type: treeItem.type,
      };
      console.log('selectedTree', optionParentId.value, treeItem);
    } else {
      isEditMenu.value = false;
      treeItemKey.value = [];
      treeItemTitle.value = '';
      formParams.parentId = 0;
      formParams.parentTitle = '';
      formParams.resources = [];
    }
  }

  function handleDel() {
    dialog.info({
      title: '提示',
      content: `您确定想删除此权限吗?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.success('删除成功');
      },
      onNegativeClick: () => {
        message.error('已取消');
      },
    });
  }

  function handleReset() {
    const treeItem = getTreeItem(unref(treeData), treeItemKey.value[0]);
    Object.assign(formParams, treeItem);
  }

  function formSubmit() {
    formRef.value.validate((errors: boolean) => {
      if (!errors) {
        message.error('抱歉，您没有该权限');
      } else {
        message.error('请填写完整信息' + JSON.stringify(errors));
      }
    });
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = unref(treeData).map((item: any) => item.key as string) as [];
    }
  }



  onMounted(async () => {
    const data = await getMenuList();
    const treeMenuList = travelTree(data);
    console.log('menu data', data);
    console.log('menu list', treeMenuList);
    const flat = flattenTree(treeMenuList);
    const keys = flat.map((item) => item.key);
    flat.unshift({
      id: 0,
      label: '无父级菜单',
      value: 0,
    });
    selectOptions.value = flat;
    console.log('flatten tree', flat);
    console.log(selectOptions.value);
    Object.assign(formParams, keys);
    treeData.value = treeMenuList;
    loading.value = false;
  });

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }
  function addMenuResource() {
    formParams.resources.push({
      method: 'GET',
      path: '',
    });
  }
  function delMenuResource(index) {
    formParams.resources.splice(index, 1);
  }
</script>

<style scoped lang="less">
  .flex-box {
    display: flex;
    .first {
      width: 180px;
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
