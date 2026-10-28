export const validation = { nickname: false, email: false, password: false };

export function emailValidator(input) {
  const messageField = input.nextElementSibling;
  const regExp = new RegExp('(\\w|\\d){2,}@(\\w){2,}.(\\w){3,}', 'g');
  const bool = regExp.test(input.value);

  if (!bool) {
    messageField.classList.add('text-red-700');
    messageField.textContent = '입력한 값이 이메일 형식에 맞지 않습니다.';
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
    validation.email = true;
  }
}

export function passwordValidator(input) {
  const messageField = input.nextElementSibling;
  const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
  const bool = regExp.test(String(input.value).toLowerCase());

  if (!bool) {
    messageField.classList.add('text-red-700');
    messageField.textContent = '입력한 값이 형식에 맞지 않습니다.';
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
    if (window.location.pathname.includes('sign-in')) validation.password = true;
  }
}

// 비밀번호와 비밀번호 확인이 일치하는지 비교하는 함수
export function isCorrespondPassword() {
  const pwd = document.querySelector('input[name="password"]');
  const pwdCheck = document.querySelector('input[name="passwordCheck"]');
  const messageField = pwdCheck.nextElementSibling;

  if (pwd.value === pwdCheck.value) {
    validation.password = true;
  } else {
    pwd.focus();
    messageField.classList.add('text-red-700');
    messageField.textContent = '비밀번호가 비밀번호 확인과 일치하지 않습니다. 다시 입력해주세요.';
    validation.password = false;
  }
}

export function nicknameValidator(input) {
  const messageField = input.nextElementSibling;
  const regExp = new RegExp('(\\w|[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]){2,}', 'g');
  const bool = regExp.test(input.value);

  if (!bool) {
    messageField.classList.add('text-red-700');
    messageField.textContent = '입력한 값이 형식에 맞지 않습니다. 최소 2글자, 최대 20글자 입니다.';
    validation.nickname = false;
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
    validation.nickname = true;
  }
}
