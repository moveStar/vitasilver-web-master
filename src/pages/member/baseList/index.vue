<!--
 * @Description: 用户信息
 * @Author: zhangweijuan
 * @Date: 2025-08-11 17:28:37
 * @LastEditTime: 2025-08-15 15:25:32
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
      <t-table
        :data="tableData"
        :columns="COLUMNS"
        row-key="id"
        vertical-align="middle"
        :hover="true"
        :selected-row-keys="selectedRowKeys"
        :pagination="pagination"
        :loading="dataLoading"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === '正常'" theme="success"> {{ '正常' }}</t-tag>
          <t-tag v-if="row.status === '已注销'" theme="warning"> {{ '已注销' }}</t-tag>
          <t-tag v-if="row.status === '禁用'" theme="danger"> {{ '禁用' }}</t-tag>
        </template>
        <template #tags="{ row }">
          <div style="display: flex; gap: 4px">
            <t-tag
              v-for="tag in row.tags"
              :key="tag.id"
              variant="light"
              size="small"
              :style="{
                color: tag.color,
                backgroundColor: `${tag.color}22`, // 半透明背景
                borderColor: tag.color,
                borderRadius: '4px',
                padding: '0 8px',
                margin: '2px',
              }"
            >
              {{ tag.title }}
            </t-tag>
          </div>
        </template>
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
    title: '状态',
    align: 'left',
    width: 100,
    colKey: 'status',
  },
  {
    title: '手机号码',
    align: 'left',
    width: 150,
    colKey: 'phone',
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
const selectedRowKeys = ref<(string | number)[]>([1, 2]);
const pagination = ref({
  defaultPageSize: 10,
  total: 100,
  defaultCurrent: 1,
});
const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { list } = await getMemberList();
    tableData.value = list;
    pagination.value = {
      ...pagination.value,
      total: list.length,
    };
  } catch (error) {
    console.log(error);
  } finally {
    dataLoading.value = false;
  }
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
