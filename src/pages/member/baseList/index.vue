<template>
  <div>
    <top-panel class="row-container" />
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="handleSetupContract"> 新建用户 </t-button>
          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">导出用户</t-button>
          <p v-if="!!selectedRowKeys.length" class="selected-count">已选 {{ selectedRowKeys.length }} 项</p>
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" placeholder="请输入内容搜索" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        :sort="sort"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @sort-change="sortChange"
        @change="rehandleChange"
        @select-change="(value: (string | number)[]) => rehandleSelectChange(value)"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === USER_STATUS.ACTIVE" theme="success" variant="light">活跃</t-tag>
          <t-tag v-if="row.status === USER_STATUS.INACTIVE" theme="warning" variant="light">未激活</t-tag>
          <t-tag v-if="row.status === USER_STATUS.BANNED" theme="danger" variant="light">已禁用</t-tag>
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
        <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="handleClickDetail()"> 查看</t-link>
            <t-link theme="warning" @click="handleClickEdit(slotProps)"> 编辑</t-link>
            <t-link theme="danger" @click="handleClickDelete(slotProps)"> 删除</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选用户？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>
<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import type { PrimaryTableCol, TableProps, TableRowData } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getMemberList } from '@/api/member';
import { prefix } from '@/config/global';
import { USER_STATUS } from '@/constants';
import { useSettingStore } from '@/store';

import TopPanel from './components/topPanel.vue';

defineOptions({
  name: 'ListMember',
});

const store = useSettingStore();

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '用户ID',
    width: 100,
    ellipsis: true,
    colKey: 'id',
  },
  {
    title: '头像',
    align: 'left',
    width: 100,
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
    title: '昵称',
    align: 'left',
    width: 120,
    colKey: 'nickname',
    fixed: 'left',
  },
  {
    title: '性别',
    width: 100,
    ellipsis: true,
    colKey: 'gender',
  },
  {
    title: '年龄',
    width: 100,
    ellipsis: true,
    colKey: 'age',
    sorter: true,
  },
  {
    title: '手机号码',
    width: 160,
    ellipsis: true,
    colKey: 'phone',
  },
  { title: '状态', colKey: 'status', width: 160 },
  {
    title: '标签',
    width: 260,
    ellipsis: true,
    colKey: 'tags',
  },

  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];
const sort = ref<TableProps['sort']>({
  sortBy: 'status',
  descending: true,
});
const data = ref([]);
const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { list } = await getMemberList({
      sortBy: sort.value?.sortBy,
      descending: sort.value?.descending,
    });
    data.value = list;
    pagination.value = {
      ...pagination.value,
      total: list.length,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { nickname } = data.value[deleteIdx.value];
    return `删除后，${nickname}的所有信息将被清空，且无法恢复`;
  }
  return '';
});

onMounted(() => {
  fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref<(string | number)[]>([1, 2]);

const router = useRouter();

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1);
  pagination.value.total = data.value.length;
  const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
  if (selectedIdx > -1) {
    selectedRowKeys.value.splice(selectedIdx, 1);
  }
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

const rowKey = 'index';

const rehandleSelectChange = (val: (string | number)[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const sortChange: TableProps['onSortChange'] = async (newSort) => {
  sort.value = newSort;
  dataLoading.value = true;
  try {
    // 根据新的排序条件重新获取数据
    const { list } = await getMemberList({
      sortBy: newSort.sortBy,
      descending: newSort.descending,
    });
    data.value = list;
  } catch (e) {
    console.error('排序获取数据失败:', e);
    MessagePlugin.error('排序获取数据失败');
  } finally {
    dataLoading.value = false;
  }
};
const handleClickDetail = () => {
  router.push('/detail/base');
};
const handleSetupContract = () => {
  router.push('/form/base');
};
const handleClickDelete = (row: { rowIndex: any }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};
const handleClickEdit = (row: { rowIndex: any }) => {
  router.push(`/form/base?id=${data.value[row.rowIndex].id}`);
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.row-container:not(:last-child) {
  margin-bottom: 16px;
}

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

.page-title {
  display: inline-block;
  color: var(--td-text-color-secondary);
  font-size: 20px;
  font-weight: 600;
}

.search-input {
  width: 360px;
}
</style>
