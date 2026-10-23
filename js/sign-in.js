// 로그인 페이지 전용 스크립트
const form = document.querySelector('.signin-form');
const btnSignup = document.querySelector('.btn-signup');

const emailElem = document.querySelector('input[name="email"]');
const pwdElem = document.querySelector('input[name="password"]');
const validation = { email: false, password: false };

function emailValidator(input) {
  const messageField = input.nextElementSibling;
  const regExp = new RegExp('(\\w|\\d){2,}@(\\w){2,}.(\\w){3,}', 'g');
  const bool = regExp.test(input.value);

  if (!bool) {
    messageField.classList.add('text-red-700');
    messageField.textContent =
      '입력한 값이 이메일 형식에 맞지 않습니다.(your email ID@email domain)';
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
    validation.email = true;
  }
}

function passwordValidator(input) {
  const messageField = input.nextElementSibling;
  const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
  const bool = regExp.test(String(input.value).toLowerCase());

  if (!bool) {
    messageField.classList.add('text-red-700');
    messageField.textContent = '입력한 값이 형식에 맞지 않습니다.';
    validation.password = false;
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
    validation.password = true;
  }
}

const goPage = (pathName, message) => {
  return function () {
    if (confirm(message)) {
      const path = window.location.origin + pathName;
      location.href = path;
    }
  };
};

// 회원가입 하기 전에 형식 확인
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

  if (!validation.email) {
    return false;
  }
  if (!validation.password) {
    return false;
  }

  return true;
}

async function signinHandler(e) {
  e.preventDefault();
  if (!validateUser()) return;

  const emailVal = emailElem.value;
  const pwdVal = pwdElem.value;
  const url = import.meta.env.VITE_API_END_POINT + '/users';
  const query = new URLSearchParams({ email: emailVal, password: pwdVal });
  await fetch(`${url}?${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      return response.json();
    })
    .then((user) => {
      // localStorage setter로 대체
      alert('로그인 성공!');
      localStorage.setItem('user-uuid', user[0].uuid);
      localStorage.setItem('user-nickname', user[0].nickname);
      location.href = window.location.origin;
    })
    .catch((error) => {
      alert(error);
    });
}

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
  }
}

form.addEventListener('input', inputHandler);
form.addEventListener('submit', signinHandler);
btnSignup.addEventListener('click', goPage('signup.html', '회원가입 페이지로 이동하시겠습니까?'));
