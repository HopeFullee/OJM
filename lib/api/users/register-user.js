import { api } from '../core/index.js';
import { getEmailAvailability } from '../index.js';

export const registerUser = async ({ nickname, email, password }) => {
  const isAvailable = await getEmailAvailability({ email });

  if (!isAvailable) {
    throw new Error('이미 가입된 이메일입니다.');
  }

  const registerPayload = {
    uuid: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    nickname,
    email,
    password,
  };

  try {
    const newUser = await api.post('/users', registerPayload);
    return newUser;
  } catch (err) {
    throw new Error('회원가입에 실패했습니다.', { cause: err });
  }
};
