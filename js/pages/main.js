// 메인 페이지 전용 스크립트
import { getUser, registerUser, signInUser } from './api/index.js';
import { clearSession, getSession, saveSession } from './utils/session.js';

// await registerUser({ nickname: 'tester', email: 'ttest@test.com', password: '1234' });
