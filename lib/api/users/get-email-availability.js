import { api } from '../core/index.js';

export const getEmailAvailability = async ({ email } = {}) => {
  const query = new URLSearchParams({ email });

  try {
    const users = await api.get(`/users?${query}`);
    // MockAPI 필터는 부분 일치라서 정확히 같은 이메일이 있는지 확인
    const hasExistingEmail = users.some((user) => user.email === email);
    return !hasExistingEmail;
  } catch (err) {
    // 검색 결과가 없으면 MockAPI는 404를 반환하므로 사용 가능으로 처리
    if (err.status === 404) return true;
    throw new Error('이메일 중복 확인에 실패했습니다.', { cause: err });
  }
};
