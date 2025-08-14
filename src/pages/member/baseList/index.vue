<!--
 * @Description: 用户信息
 * @Author: zhangweijuan
 * @Date: 2025-08-11 17:28:37
 * @LastEditTime: 2025-08-14 08:39:05
-->
<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <!-- <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="handleSetupContract"> {{ t('pages.listBase.create') }} </t-button>
          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">
            {{ t('pages.listBase.export') }}</t-button
          >
          <p v-if="!!selectedRowKeys.length" class="selected-count">
            {{ t('pages.listBase.select') }} {{ selectedRowKeys.length }} {{ t('pages.listBase.items') }}
          </p>
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" :placeholder="t('pages.listBase.placeholder')" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row> -->
      <t-table :data="tableData" :columns="COLUMNS" row-key="id">
        <template #empty>
          <t-empty-state description="No data available" />
        </template>
      </t-table>
    </t-card>
  </div>
</template>
<script setup lang="ts">
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import { getMemberList } from '@/api/member';

defineOptions({
  name: 'BaseList',
});

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '用户ID',
    align: 'left',
    width: 160,
    ellipsis: true,
    colKey: 'UID',
    fixed: 'left',
  },
  {
    title: '昵称',
    align: 'left',
    width: 100,
    colKey: 'nickname',
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '头像',
    align: 'left',
    width: 120,
    colKey: 'avatar',
    cell: (h, { row }) => {
      return h('img', {
        src: row.avatar,
        alt: '头像',
        style: {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
        },
      });
    },
  },
  {
    title: '性别',
    align: 'left',
    width: 100,
    colKey: 'gender',
  },
  {
    title: '年龄',
    align: 'left',
    width: 100,
    colKey: 'age',
  },
  {
    title: '手机号码',
    align: 'left',
    width: 150,
    colKey: 'phone',
  },
  {
    title: '状态',
    align: 'left',
    width: 100,
    colKey: 'status',
  },
  {
    title: '标签',
    align: 'left',
    width: 160,
    colKey: 'tags',
  },
  {
    title: '操作',
    align: 'right',
    width: 160,
    colKey: 'action',
    fixed: 'right',
  },
];
const tableData = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
});
const fetchData = async () => {
  const { list, total } = await getMemberList({
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  });
  tableData.value = list;
  pagination.value.total = total;
};
onMounted(() => {
  fetchData();
});
</script>
<style scoped></style>
<style lang="less" scoped>
.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
