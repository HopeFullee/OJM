// 마이 페이지 전용 스크립트
import { requireAuth } from '../utils/auth.js';

const init = async () => {
  const session = await requireAuth();
  if (!session) return;

  console.log('로그인 완료');
};

init();
