// 로그인 페이지 전용 스크립트
import { saveSession, ROUTES } from '../utils/index.js';

const form = document.querySelector('.signin-form');
const btnSignup = document.querySelector('.btn-signup');

const emailElem = document.querySelector('input[name="email"]');
const pwdElem = document.querySelector('input[name="password"]');

const goPage = (pathName, message) => {
  return function () {
    if (confirm(message)) {
      const path = window.location.origin + pathName;
      location.href = path;
    }
  };
};

function validateUser() {
  if (emailElem.value === '') {
    alert('이메일을 입력해주세요.');
    emailElem.focus();
    return false;
  }

  if (pwdElem.value === '') {
    alert('비밀번호를 입력해주세요.');
    pwdElem.focus();
    return false;
  }

  return true;
}

async function signinHandler(e) {
  e.preventDefault();
  if (!validateUser()) return;

  const email = emailElem.value;
  const password = pwdElem.value;
  const url = import.meta.env.VITE_API_END_POINT + '/users';
  const query = new URLSearchParams({ email, password });
  await fetch(`${url}?${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      return response.json();
    })
    .then((user) => {
      alert('로그인 성공!');
      const uuid = user[0].uuid;
      const nickname = user[0].nickname;
      saveSession({ uuid, nickname });
      location.href = window.location.origin;
    })
    .catch((error) => {
      alert(error);
    });
}

form.addEventListener('submit', signinHandler);
btnSignup.addEventListener('click', goPage(ROUTES.signUp, '회원가입 페이지로 이동하시겠습니까?'));
