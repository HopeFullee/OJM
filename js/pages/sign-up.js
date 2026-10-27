// 회원가입 페이지 전용 스크립트
const tosToggle = document.querySelector('.ToS-toggle');

// input
const form = document.querySelector('.user-form');
const nickname = document.querySelector('input[name="nickname"]');
const emailElem = document.querySelector('input[name="email"]');
const pwdElem = document.querySelector('input[name="password"]');
const tosCheck = document.querySelector('#ToS-check');


const icon_down = `
<span class="flex-3 font-medium text-left text-14">약관 펼치기</span>
<svg width="16" height="16" class="felx-1">
  <use href="./assets/icons/icon-chevron-down.svg"></use>
</svg>`;

const icon_up = `
<span class="flex-3 font-medium text-left text-14">약관 접기</span>
<svg width="16" height="16" class="felx-1">
  <use href="./assets/icons/icon-chevron-up.svg"></use>
</svg>`;


// 체크박스의 체크 여부에 따라 가짜 체크박스(아이콘)이 변경됨
function changeIconCheckbox(e) {
  const iconCheckbox = document.querySelector('.icon-checkbox');
  const svgUse = iconCheckbox.children[0];

  if(e.target.checked) {
    svgUse.setAttribute('href', './assets/icons/icon-checked.svg');
  } else {
    svgUse.setAttribute('href', './assets/icons/icon-unchecked.svg');
  }
}

// 대체할 토글 생성
function createToggle() {
  // ToS-toggle flex flex-row justify-between h-44 px-12 py-12 rounded-button-md bg-canvas text-ink-muted
    const button = document.createElement('button');
    button.classList.add('ToS-toggle', 'flex', 'flex-row', 'justify-between', 'bg-canvas', 'text-ink-muted', 'h-44', 'p-12');
    button.addEventListener('click', termsOfServiceHandler);
    
    return button;
}
// 이용약관 on//off에 따라 보여지는 토글 변경
function changeTosToggle(origin, replacement) {
  const toggle = createToggle();

  toggle.innerHTML = replacement;
  origin.replaceWith(toggle);
}

// 이용약관(Terms of Service) 핸들링(on/off)
const termsOfServiceHandler = (() => {
  const ToS = document.querySelector('.ToS-container');
  let status = false;

  return function (e) {
    let TosToggle = e.target;

    if(TosToggle.tagName !== 'BUTTON') 
      TosToggle = TosToggle.closest('.ToS-toggle');

    if (!status) {
      changeTosToggle(TosToggle, icon_up);
      ToS.classList.remove('hidden');
      status = !status;
    } else {
      changeTosToggle(TosToggle, icon_down);
      ToS.classList.add('hidden');
      status = !status;
    }
  };
})();

// 오늘 날짜(YYYY-MM-DD) getter
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// POST BODY getter
function getBody() {
  return {
    uuid: crypto.randomUUID(),
    nickname: nickname.value,
    email: emailElem.value,
    password: pwdElem.value,
    createdAt: getToday(),
  };
}

const validation = {
  nickname: false,
  email: false,
  password: false,
};

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
  } else {
    messageField.classList.remove('text-red-700');
    messageField.textContent = ' ';
  }
}

// 비밀번호와 비밀번호 확인이 일치하는지 비교하는 함수
function isCorrespondPassword() {
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

function nicknameValidator(input) {
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
  }).then((res) => {
    if(res.ok) {
      if(confirm('회원가입 성공!\n로그인 페이지로 이동하시겠습니까?')) {
        location.href = location.origin + '/sign-in.html';
      }
    } else {
      throw new Error('데이터 전송 실패\n에러가 반복되면 문의해주세요.');
    }
  }).catch((error) => {
    alert(error);
  })

}

tosToggle.addEventListener('click', termsOfServiceHandler);
form.addEventListener('submit', signupHandler);
form.addEventListener('input', inputHandler);
tosCheck.addEventListener('change', changeIconCheckbox);