import { api } from '../core/index.js';

// 함수 호출 레벨에서 세션의 uuid를 통해 id를 조회하고 updateRecords의 인자값으로 전달함.
export const updateRecords = async ({ id, records } = {}) => {
  try {
    const updated = await api.put(`/users/${id}`, { record: records });
    return updated.record;
  } catch (err) {
    throw new Error('추천 기록을 변경하지 못했습니다.', { cause: err });
  }
};
