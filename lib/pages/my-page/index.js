// 마이 페이지 전용 스크립트
import { updateNickname, updatePassword } from '../../api/index.js';
import { renderRecords } from './record.js';
import {
  requireAuth,
  getSession,
  saveSession,
  showError,
  clearError,
  renderNickname,
  renderEmail,
} from '../../utils/index.js';

const status = document.getElementById('user-info-status');

// 토글 버튼과 취소 버튼으로 폼 열고 닫기
const setupToggle = (toggleButton, form) => {
  const open = () => {
    form.hidden = false;
    toggleButton.setAttribute('aria-expanded', 'true');
    form.querySelector('input').focus();
  };

  const close = () => {
    form.hidden = true;
    form.reset();
    clearError(form);
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.focus();
  };

  toggleButton.addEventListener('click', () => (form.hidden ? open() : close()));
  form.querySelector('[data-action="cancel"]').addEventListener('click', close);

  return close;
};

// 닉네임 변경 폼
const setupNicknameForm = () => {
  const form = document.getElementById('nickname-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const close = setupToggle(document.getElementById('nickname-toggle'), form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError(form);

    const nickname = form.nickname.value.trim();
    if (nickname === getSession()?.nickname) {
      showError(form, '현재 닉네임과 같습니다.');
      return;
    }

    submitButton.disabled = true;

    try {
      const user = await requireAuth();
      if (!user) return;

      const updatedSession = await updateNickname({ id: user.id, nickname });

      saveSession(updatedSession);
      renderNickname(updatedSession.nickname);
      close();
      status.textContent = '닉네임이 변경되었습니다.';
    } catch (err) {
      showError(form, err.message);
    } finally {
      submitButton.disabled = false;
    }
  });
};

// 비밀번호 변경 폼
const setupPasswordForm = () => {
  const form = document.getElementById('password-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const close = setupToggle(document.getElementById('password-toggle'), form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError(form);

    const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(
      new FormData(form),
    );

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError(form, '모든 항목을 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError(form, '새 비밀번호가 서로 일치하지 않아요.');
      return;
    }
    if (newPassword === currentPassword) {
      showError(form, '현재 비밀번호와 다른 비밀번호를 입력해주세요.');
      return;
    }

    submitButton.disabled = true;

    try {
      const user = await requireAuth();
      if (!user) return;

      if (user.password !== currentPassword) {
        showError(form, '현재 비밀번호가 일치하지 않습니다.');
        return;
      }

      await updatePassword({ id: user.id, password: newPassword });

      close();
      status.textContent = '비밀번호가 변경되었습니다.';
    } catch (err) {
      showError(form, err.message);
    } finally {
      submitButton.disabled = false;
    }
  });
};

const init = async () => {
  let user;

  try {
    user = await requireAuth();
  } catch {
    alert('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.');
    return;
  }

  if (!user) return;

  document.body.hidden = false;
  renderEmail(user.email);
  renderNickname(user.nickname);
  renderRecords(user.record);
  setupNicknameForm();
  setupPasswordForm();

  console.log(user);
};

init();
