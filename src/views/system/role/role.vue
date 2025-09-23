<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="角色权限管理">
        页面数据为 Mock 示例数据，非真实数据。
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button type="primary" @click="openAddRole" v-if="hasPermission(['/system/role/add'])">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新增角色
          </n-button>
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
      <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="treeData"
          :expandedKeys="expandedKeys"
          :checked-keys="checkedKeys"
          style="max-height: 950px; overflow: hidden"
          @update:checked-keys="checkedTree"
          @update:expanded-keys="onExpandedKeys"
        />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" ghost icon-placement="left" @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
          </n-button>

          <n-button type="info" ghost icon-placement="left" @click="checkedAllHandle">
            全部{{ checkedAll ? '取消' : '选择' }}
          </n-button>
          <n-button type="primary" :loading="formBtnLoading" @click="confirmForm">提交</n-button>
        </n-space>
      </template>
    </n-modal>
    <CreateModal ref="createModalRef" @submit="handleAddRole" />
    <EditModal ref="editModalRef" @submit="handleEditRole" />
  </div>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref, unref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { addRole, getRoleDetail, getRoleList, updateRolePermissions } from '@/api/system/role';
  import type { ListMenu } from '@/api/system/menu';
  import { getMenuList, travelTree } from '@/api/system/menu';
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { getTreeAll2 } from '@/utils';
  import CreateModal from './CreateModal.vue';
  import EditModal from './EditModal.vue';
  import { usePermission } from '@/hooks/web/usePermission';

  const { hasPermission } = usePermission();

  const message = useMessage();
  const actionRef = ref();
  const createModalRef = ref();
  const editModalRef = ref();
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const checkedAll = ref(false);
  const editRoleTitle = ref('');
  const treeData = ref<ListMenu[]>([]);
  const expandedKeys = ref<number[]>([]);
  const checkedKeys = ref<number[]>([]);
  let currentItem: Recordable | null = null;

  const params = reactive({
    name: '',
  });

  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '菜单权限',
            onClick: handleMenuAuth.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: [],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['/system/role/edit'],
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['/system/role/delete'],
          },
        ],
      });
    },
  });

  const loadDataTable = async (res: any) => {
    let _params = {
      ...unref(params),
      ...res,
    };
    // return await getRoleList(_params);
    const { data, page } = await getRoleList(_params);
    return {
      page: page.current,
      pageSize: page.pageSize,
      pageCount: Math.floor(page.total / page.pageSize),
      itemCount: page.total,
      list: data,
    };
  };

  function openAddRole() {
    createModalRef.value.openModal();
  }

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  async function confirmForm(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;
    console.log('confirmFrom', currentItem, checkedKeys.value);
    const params: any = unref(currentItem);
    params.menus = checkedKeys.value.map((item) => {
      return {
        role_id: params.id,
        menu_id: item,
      };
    });
    await updateRolePermissions(currentItem?.id, params);
    formBtnLoading.value = false;
    showModal.value = false;
    reloadTable();
  }

  async function handleAddRole(record: Recordable) {
    await addRole(record);
    reloadTable();
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    currentItem = record;
    editModalRef.value.showModal(record);
  }

  async function handleEditRole(record: Recordable) {
    const { id, ...params } = record;
    console.log('handleEditRole', record);
    await updateRolePermissions(currentItem?.id, params);
    reloadTable();
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  async function handleMenuAuth(record: Recordable) {
    console.log('handleMenuAuth', record);
    const detail = await getRoleDetail(record.id);
    console.log('handleMenuAuth', detail);
    expandedKeys.value = detail.menus.map((item) => item.menu_id);
    checkedKeys.value = detail.menus.map((item) => item.menu_id);
    editRoleTitle.value = `分配 ${record.name} 的菜单权限`;
    showModal.value = true;
    currentItem = record;
    console.log('handleMenuAuth expandedKeys', expandedKeys.value);
  }

  function checkedTree(keys) {
    console.log('checked Tree', keys);
    checkedKeys.value = [...keys];
  }

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = treeData.value.map((item: any) => item.id) as [];
    }
  }

  function checkedAllHandle() {
    if (!checkedAll.value) {
      checkedKeys.value = getTreeAll2(treeData.value, 'id');
      checkedAll.value = true;
    } else {
      checkedKeys.value = [];
      checkedAll.value = false;
    }
  }

  onMounted(async () => {
    const treeMenuList = await getMenuList();
    // expandedKeys.value = getTreeAll2(treeMenuList, 'id');
    treeData.value = travelTree(treeMenuList);
  });
</script>

<style lang="less" scoped></style>
