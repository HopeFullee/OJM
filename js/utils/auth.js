import { getUser } from '../api/index.js';
import { clearSession, getSession, saveSession } from './session.js';

// session(로그인 회원정보) 기반 uuid로 실제 회원인지 확인
export const verifySession = async () => {
  const session = getSession();
  if (!session?.uuid) return null;

  try {
    const user = await getUser({ uuid: session.uuid });

    // 서버의 최신 정보로 세션 갱신 (닉네임 변경, localStorage 훼손 대비)
    const verified = { uuid: user.uuid, nickname: user.nickname };
    saveSession(verified);
    return verified;
  } catch (err) {
    // 존재하지 않는 회원이면 위조/삭제된 세션이므로 제거
    if (err.status === 404) clearSession();
    return null;
  }
};

// 로그인이 필요한 페이지 진입 시 호출
export const requireAuth = async () => {
  const session = await verifySession();

  if (!session) {
    location.replace('/sign-in');
    return null;
  }

  document.body.hidden = false;
  return session;
};

// redirect 파라미터를 읽어서 같은 사이트 안의 경로일 때만 반환 (URL 검증 로직)
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
