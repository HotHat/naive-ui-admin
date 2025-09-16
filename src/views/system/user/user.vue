<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="角色管理" />
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
          <n-button type="primary" @click="addRole">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新增用户
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
    <CreateModal ref="createModalRef" :key="updateRole" :roleOption="roleOptions" />
    <EditModal ref="editModalRef" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, h, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { getTreeAll } from '@/utils';
  import CreateModal from './CreateModal.vue';
  import EditModal from './EditModal.vue';
  import { getUserList } from '@/api/system/user';
  import { getRoleList } from '@/api/system/role';
  import { SelectOption } from 'naive-ui';

  const message = useMessage();
  const actionRef = ref();
  const createModalRef = ref();
  const editModalRef = ref();
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const checkedAll = ref(false);
  const editRoleTitle = ref('');

  const params = reactive({
    name: 'NaiveAdmin',
  });

  const roleOptions = ref<SelectOption[]>([]);
  const updateRole = ref(0);

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
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: [],
          },
          {
            label: '删除',
            type: 'error',
            ghost: true,
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: [],
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
    // dataRef.value = data.data
    const { data } = await getUserList(_params);
    return {
      page: Number(1),
      pageSize: Number(15),
      pageCount: 100,
      itemCount: Number(data.length),
      list: data,
    };
  };

  function addRole() {
    createModalRef.value.openModal();
  }

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function confirmForm(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;
    setTimeout(() => {
      showModal.value = false;
      message.success('提交成功');
      reloadTable();
      formBtnLoading.value = false;
    }, 200);
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
    editModalRef.value.showModal(record);
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  onMounted(async () => {
    const roleList = await getRoleList({});
    roleOptions.value = roleList.data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    console.log('role list', roleOptions.value);
    updateRole.value = updateRole.value + 1;
    // treeData.value = treeMenuList?.data;
  });
</script>

<style lang="less" scoped></style>
