import type { ListMember } from '@/api/model/listMember';
import { request } from '@/utils/request';

const Api = {
  MemberList: '/get-member-list',
};
export function getMemberList() {
  return request.get<ListMember[]>({
    url: Api.MemberList,
  });
}
