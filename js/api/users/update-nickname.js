import { api } from '../core/index.js';
import { getUser } from '../index.js';

export const updateNickname = async ({ uuid, nickname } = {}) => {
  const trimmed = nickname?.trim();
  if (!trimmed) {
    throw new Error('닉네임을 입력해주세요.');
  }

  try {
    // OJM 프로젝트는 uuid를 쓰기로 정했기에 때문에 id를 찾기 위해 다시 uuid로 회원의 id를 찾아야함.
    const user = await getUser({ uuid });
    // MockAPI PUT 요청은 id 필드가 필요함.
    const updated = await api.put(`/users/${user.id}`, { nickname: trimmed });
    return { uuid: updated.uuid, nickname: updated.nickname };
  } catch (err) {
    // 회원이 없는 경우는 status를 유지한 채 그대로 던짐
    if (err.status === 404) throw err;
    throw new Error('닉네임 변경에 실패했습니다.', { cause: err });
  }
};
