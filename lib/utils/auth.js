import { getUser } from '../api/index.js';
import { clearSession, getSession, saveSession, ROUTES } from './index.js';

// 현재 경로를 기록해서 로그인 페이지로 이동
export const redirectToSignIn = () => {
  const query = new URLSearchParams({ redirect: location.pathname + location.search });
  location.replace(`${ROUTES.signIn}?${query}`);
};

// 로그인한 회원이면 user 객체, 아니면 null (페이지 이동 없음)
// - 비로그인: null
// - 존재하지 않는 회원(404): 세션을 지우고 null
// - 서버 에러: 회원 여부를 판단할 수 없으므로 그대로 throw
export const getCurrentUser = async () => {
  const session = getSession();
  if (!session?.uuid) return null;

  try {
    const user = await getUser({ uuid: session.uuid });
    saveSession({ uuid: user.uuid, nickname: user.nickname });
    return user;
  } catch (err) {
    if (err.status !== 404) throw err;

    clearSession();
    return null;
  }
};

// 회원 전용 페이지·기능: 회원이 아니면 로그인 페이지로 이동하고 null 반환
export const requireAuth = async () => {
  const hadSession = Boolean(getSession()?.uuid);
  const user = await getCurrentUser();

  if (!user) {
    // 세션이 있었는데 회원이 아닌 경우(위조·삭제된 계정)만 안내
    if (hadSession) alert('회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
    redirectToSignIn();
    return null;
  }

  return user;
};

// redirect 파라미터를 읽어서 같은 사이트 안의 경로일 때만 반환
export const getRedirectPath = (fallback = '/') => {
  const redirect = new URLSearchParams(location.search).get('redirect');
  if (!redirect) return fallback;

  try {
    const url = new URL(redirect, location.origin);
    if (url.origin !== location.origin) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
};
