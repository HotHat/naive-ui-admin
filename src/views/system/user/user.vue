<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户管理">
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
          <template #statusSlot="{ model, field }">
            <n-input v-model:value="model[field]" />
          </template>
        </BasicForm>
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
          <n-button type="primary" @click="addUser">
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
    <CreateModal ref="createModalRef" :roleOption="roleOptions" @add-user="reloadTable" />
    <EditModal ref="editModalRef" :roleOption="roleOptions" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, h, onMounted, nextTick } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { columns } from './columns';
  import { formSchemas } from './FormSchemas';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { getTreeAll } from '@/utils';
  import CreateModal from './CreateModal.vue';
  import EditModal from './EditModal.vue';
  import { getUserList } from '@/api/system/user';
  import { getAllRoles } from '@/api/system/role';
  import { SelectOption } from 'naive-ui';

  const message = useMessage();
  const actionRef = ref();
  const createModalRef = ref();
  const editModalRef = ref();
  const showModal = ref(false);
  const formBtnLoading = ref(false);

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
    console.log('loadDataTable', _params);

    // dataRef.value = data.data
    const { data, page } = await getUserList(_params);
    return {
      page: page.current,
      pageSize: page.pageSize,
      pageCount: Math.floor(page.total / page.pageSize),
      itemCount: page.total,
      list: data,
    };
  };

  function addUser() {
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
  function isNumberArray(value: any): value is number[] {
    return (
      Array.isArray(value) && // Check if the value is an array
      value.every((item) => typeof item === 'number') // Check if every item in the array is a number
    );
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
    if (isNumberArray(record.roles)) {
      editModalRef.value.showModal(record);
    } else {
      record.roles = record.roles.map((it) => it.id);
      editModalRef.value.showModal(record);
    }
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  onMounted(async () => {
    console.log('user modal on mounted');
    const roleList = await getAllRoles();
    nextTick(() => {
      roleOptions.value = roleList.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    });
    console.log('role list', roleOptions.value);
    // updateRole.value = updateRole.value + 1;
    // await nextTick();
    // treeData.value = treeMenuList?.data;
  });

  // form
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:3 l:3 xl:6 2xl:6', xGap: '12' },
    labelWidth: 80,
    schemas: formSchemas,
  });

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }
</script>

<style lang="less" scoped></style>
