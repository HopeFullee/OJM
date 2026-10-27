// 회원전용 서비스
import { api } from '../core/index.js';

// 함수 호출 레벨에서 세션의 uuid를 통해 id를 조회하고 updateNickname의 인자값으로 전달함.
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

// 함수 호출 레벨에서 세션의 uuid를 통해 id를 조회하고 updatePassword의 인자값으로 전달함.
export const updatePassword = async ({ id, password } = {}) => {
  try {
    await api.put(`/users/${id}`, { password });
  } catch (err) {
    throw new Error('비밀번호 변경에 실패했습니다.', { cause: err });
  }
};
