// 회원가입 페이지 전용 스크립트

const tosToggle = document.querySelector('.ToS-toggle');
const btnInsert = document.querySelector('.btn-insert');
// input 
const form = document.querySelector('.user-form');
const nickname = document.querySelector('input[name="nickname"]');
const email = document.querySelector('input[name="email"]');
const pwd = document.querySelector('input[name="password"]');
const tosCheck = document.querySelector('#ToS-check');

// 이용약관(Terms of Service) 핸들링(on/off)
const termsOfServiceHandler = (() => {
    const ToS = document.querySelector('.ToS-container');
    let status = false;

    return function(e) {
        const TosToggle = e.target;
        if(!status) {
            TosToggle.textContent = '약관 접기';
            ToS.classList.remove('invisible');
            status = !status;
        } else {
            TosToggle.textContent = '약관 펼치기';
            ToS.classList.add('invisible');
            status = !status;
        }
    }
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
    const uuid = crypto.randomUUID();

    return {
        'uuid' : uuid
        , 'nickname' : nickname.value
        , 'email' : email.value
        , 'password' : pwd.value
        , 'createdAt' : getToday()
    }
}

const validation = {
    'nickname' : false
    , 'email' : false
    , 'password' : false
}

function emailValidator(input) {
    const messageField = input.nextElementSibling;
    const regExp = new RegExp('(\\w|\\d){2,}@(\\w){2,}.(\\w){3,}', 'g');
    const bool = regExp.test(input.value);

    if(!bool) {
        messageField.classList.add('text-red-700');
        messageField.textContent = '입력한 값이 이메일 형식에 맞지 않습니다.(your email ID@email domain)';
    } else {
        messageField.classList.remove('text-red-700');
        messageField.textContent = ' ';
        validation.email = true;
    }
}

function passwordValidator(input) {
    const messageField = input.nextElementSibling;
    const regExp =  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
    const bool = regExp.test(String(input.value).toLowerCase());

    if(!bool) {
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

    if(pwd.value === pwdCheck.value) {
        validation.password = true;
    }else {
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

    if(!bool) {
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

    if(el.ELEMENT_NODE === 1 && el.tagName === 'INPUT') {
        const type = el.getAttribute('type');

        if(type === 'email') {
            // 이메일 validation 실행
            emailValidator(el);
        }
        if(type === 'password') {
            // 비밀번호 validation 실행
            passwordValidator(el);
        }
        if(type === 'text') {
            // 닉네임 validation 실행
            nicknameValidator(el);
        }
    }
}

// 회원가입 하기 전에 종합적인 형식 확인
function validateUser() {

    if(nickname.value === '') {
        alert('닉네임을 입력해주세요.');
        nickname.focus();
        return false;
    }

    if(email.value === '') {
        alert('이메일을 입력해주세요.');
        email.focus();
        return false;
    }

    if(pwd.value === '') {
        alert('비밀번호를 입력해주세요.');
        pwd.focus();
        return false;
    }

    if(!tosCheck.checked) {
        alert('회원가입에는 이용 약관 동의가 필요합니다.');
        tosCheck.focus();
        return false;
    }

    isCorrespondPassword();

    if(!validation.nickname) {
        return false;
    }
    if(!validation.email) {
        return false;
    }
    if(!validation.password) {
        return false;
    }

    return true;
}

// 회원가입 
async function signupHandler() {

    if(!validateUser()) return;

    const body = getBody();
    const END_POINT = 'https://6ad8585795e98f36aef328a2.mockapi.io/users';
    
    //console.log(body);
    const response = await fetch(END_POINT, {
        method: 'POST', // 또는 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    const result = await response.json();
    console.log(result);
}

tosToggle.addEventListener('click', termsOfServiceHandler);
btnInsert.addEventListener('click', signupHandler);
form.addEventListener('input', inputHandler);
