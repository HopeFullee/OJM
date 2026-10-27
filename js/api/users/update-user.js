import { api } from '../core/index.js';

export const updateNickname = async ({ id, nickname } = {}) => {
  const trimmed = nickname?.trim();
  if (!trimmed) {
    throw new Error('닉네임을 입력해주세요.');
  }

  try {
    const updated = await api.put(`/users/${id}`, { nickname: trimmed });
    return { uuid: updated.uuid, nickname: updated.nickname };
  } catch (err) {
    throw new Error('닉네임 변경에 실패했습니다.', { cause: err });
  }
};

export const updatePassword = async ({ id, password } = {}) => {
  try {
    await api.put(`/users/${id}`, { password });
  } catch (err) {
    throw new Error('비밀번호 변경에 실패했습니다.', { cause: err });
  }
};
