import { api } from './core/index.js';

export const getUser = async (uuid) => {
  try {
    const users = await api.get(`/users?uuid=${encodeURIComponent(uuid)}`);
    return users[0] ?? null;
  } catch (err) {
    throw new Error('유저 정보를 가져오지 못했습니다.', { cause: err });
  }
};
