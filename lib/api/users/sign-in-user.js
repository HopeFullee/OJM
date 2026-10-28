import { api } from '../core/index.js';

export const signInUser = async ({ email, password }) => {
  const query = new URLSearchParams({ email });

  try {
    const users = await api.get(`/users?${query}`);

    // MockAPI 필터는 부분 일치라서 정확히 같은 값만 골라냄
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) return { uuid: user.uuid, nickname: user.nickname };
  } catch (err) {
    // MockAPI 서버에서 계정을 찾을 수 없을 때 반환되는 404 에러는 제외
    if (err.status !== 404) throw new Error('로그인에 실패했습니다.', { cause: err });
  }

  // 404인 경우 + 부분 일치 결과만 있고 정확히 맞는 유저가 없는 경우
  throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
};
