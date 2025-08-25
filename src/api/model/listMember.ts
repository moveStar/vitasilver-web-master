/*
 * @Description:
 * @Author: zhangweijuan
 * @Date: 2025-08-13 15:58:59
 * @LastEditTime: 2025-08-25 15:16:01
 */
export interface ListResult {
  list: Array<ListModel>;
}
export interface ListModel {
  UID: number;
  avatar: string;
  nickname: string;
  gender: 'male' | 'female';
  age: number;
  status: number;
  tags: string[];
  phone: string;
  createTime: Date;
}
