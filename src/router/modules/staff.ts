import { User1FilledIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/base',
    name: 'staff',
    meta: {
      title: {
        zh_CN: '用户管理',
        en_US: 'Staff',
      },
      icon: shallowRef(User1FilledIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'baseList',
        name: 'StaffBase',
        component: () => import('@/pages/staff/baseList/index.vue'),
        meta: {
          title: {
            zh_CN: ' 用户信息',
            en_US: 'Staff Info',
          },
        },
      },
      {
        path: 'realnameVerification',
        name: 'Real-name Verification',
        component: () => import('@/pages/staff/realnameVerification/index.vue'),
        meta: {
          title: {
            zh_CN: '实名认证',
            en_US: 'Real-name Verification',
          },
        },
      },
    ],
  },
];
