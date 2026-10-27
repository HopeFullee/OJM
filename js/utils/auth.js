import { getUser } from '../api/index.js';
import { clearSession, getSession, saveSession } from './session.js';

const redirectToSignIn = () => {
  const query = new URLSearchParams({ redirect: location.pathname + location.search });
  location.replace(`/sign-in?${query}`);
};

// 세션의 uuid로 실제 회원인지 확인하고 user 객체를 반환
// - 비로그인 또는 존재하지 않는 회원: 세션 정리 후 로그인 페이지로 이동, null 반환
// - 서버 에러: 회원 여부를 판단할 수 없으므로 그대로 throw (호출한 쪽에서 처리)
export const requireAuth = async () => {
  const session = getSession();

  if (!session?.uuid) {
    redirectToSignIn();
    return null;
  }

  try {
    const user = await getUser({ uuid: session.uuid });
    saveSession(user);
    return user;
  } catch (err) {
    if (err.status !== 404) throw err;

    clearSession();
    alert('회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
    redirectToSignIn();
    return null;
  }
};
