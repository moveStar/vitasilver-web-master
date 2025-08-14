/*
 * @Description:
 * @Author: zhangweijuan
 * @Date: 2025-08-13 15:58:59
 * @LastEditTime: 2025-08-13 16:33:14
 */
export interface ListMember {
  list: Array<ListMember>;
}
export interface ListMember {
  UID: number;
  avatar: string;
  nickname: string;
  gender: 'male' | 'female';
  age: number;
  // status: 'active' | 'disabled' | 'deleted';
  status: '正常' | '禁用' | '已注销';
  tags: string[];
  phone: string;
  createTime: string;
}
