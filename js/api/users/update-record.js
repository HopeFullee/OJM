import { api } from '../core/index.js';

export const updateRecords = async ({ id, records } = {}) => {
  try {
    const updated = await api.put(`/users/${id}`, { record: records });
    return updated.record;
  } catch (err) {
    throw new Error('추천 기록을 변경하지 못했습니다.', { cause: err });
  }
};
