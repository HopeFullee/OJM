import { api } from '../core/index.js';
import { getUser } from './get-user.js';

export const updatePassword = async ({ uuid, currentPassword, newPassword } = {}) => {
  // 회원이 없으면 getUser가 status 404 에러를 던짐
  const user = await getUser({ uuid });

  if (user.password !== currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }

  try {
    await api.put(`/users/${user.id}`, { password: newPassword });
  } catch (err) {
    throw new Error('비밀번호 변경에 실패했습니다.', { cause: err });
  }
};
