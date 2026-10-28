import { api } from '../core/index.js';

export const getUser = async ({ uuid } = {}) => {
  const query = new URLSearchParams({ uuid });

  try {
    const users = await api.get(`/users?${query}`);
    // MockAPI 필터는 부분 일치라서 정확히 같은 uuid만 골라냄
    const user = users.find((user) => user.uuid === uuid);

    if (!user) throw new Error('uuid가 일치하는 회원이 없습니다');
    return user;
  } catch (err) {
    throw new Error('회원 정보를 가져오지 못했습니다.', { cause: err });
  }
};
