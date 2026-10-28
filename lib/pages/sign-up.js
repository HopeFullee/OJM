// 회원가입 페이지 전용 스크립트
import {
  validation,
  emailValidator,
  passwordValidator,
  isCorrespondPassword,
  nicknameValidator,
  getFormattedDate,
  ROUTES,
} from '../utils/index.js';

// input
const form = document.querySelector('.user-form');
const nickname = document.querySelector('input[name="nickname"]');
const emailElem = document.querySelector('input[name="email"]');
const pwdElem = document.querySelector('input[name="password"]');
const tosCheck = document.querySelector('#ToS-check');

// 체크박스의 체크 여부에 따라 가짜 체크박스(아이콘)이 변경됨
function changeIconCheckbox(e) {
  const iconCheckbox = document.querySelector('.icon-checkbox');
  const svgUse = iconCheckbox.children[0];

  if (e.target.checked) {
    svgUse.setAttribute('href', './assets/icons/icon-checked.svg');
  } else {
    svgUse.setAttribute('href', './assets/icons/icon-unchecked.svg');
  }
}

/* 오늘 날짜(YYYY-MM-DD) getter
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
*/

// POST BODY getter
function getBody() {
  return {
    uuid: crypto.randomUUID(),
    nickname: nickname.value,
    email: emailElem.value,
    password: pwdElem.value,
    createdAt: getFormattedDate(),
  };
}

//  input 이벤트 핸들링
function inputHandler(e) {
  const el = e.target;

  if (el.ELEMENT_NODE === 1 && el.tagName === 'INPUT') {
    const type = el.getAttribute('type');

    if (type === 'email') {
      // 이메일 validation 실행
      emailValidator(el);
    }
    if (type === 'password') {
      // 비밀번호 validation 실행
      passwordValidator(el);
    }
    if (type === 'text') {
      // 닉네임 validation 실행
      nicknameValidator(el);
    }
  }
}

// 회원가입 하기 전에 종합적인 형식 확인
function validateUser() {
  if (nickname.value === '') {
    alert('닉네임을 입력해주세요.');
    nickname.focus();
    return false;
  }

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

  if (!tosCheck.checked) {
    alert('회원가입에는 이용 약관 동의가 필요합니다.');
    tosCheck.focus();
    return false;
  }

  isCorrespondPassword();

  if (!validation.nickname) {
    return false;
  }
  if (!validation.email) {
    return false;
  }
  if (!validation.password) {
    return false;
  }

  return true;
}

// 회원가입
async function signupHandler(e) {
  e.preventDefault();

  if (!validateUser()) return;

  const body = getBody();
  const END_POINT = import.meta.env.VITE_API_END_POINT + '/users';

  await fetch(END_POINT, {
    method: 'POST', // 또는 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) {
        if (confirm('회원가입 성공!\n로그인 페이지로 이동하시겠습니까?')) {
          location.href = ROUTES.signIn;
        }
      } else {
        throw new Error('데이터 전송 실패\n에러가 반복되면 문의해주세요.');
      }
    })
    .catch((error) => {
      alert(error);
    });
}

form.addEventListener('submit', signupHandler);
form.addEventListener('input', inputHandler);
tosCheck.addEventListener('change', changeIconCheckbox);
