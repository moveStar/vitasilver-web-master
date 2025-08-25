/*
 * @Description:
 * @Author: zhangweijuan
 * @Date: 2025-08-14 08:53:24
 * @LastEditTime: 2025-08-25 10:18:56
 */
import type { ListResult } from '@/api/model/listMember';
import { request } from '@/utils/request';

const Api = {
  MemberList: '/get-member-list',
};
export function getMemberList() {
  return request.get<ListResult>({
    url: Api.MemberList,
  });
}
