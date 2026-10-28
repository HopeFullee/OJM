// form 필드 에러 메시지 표시/제거

export const showError = (form, message) => {
  form.querySelector('.common-error-msg').textContent = message;
};

export const clearError = (form) => {
  form.querySelector('.common-error-msg').textContent = '';
};
