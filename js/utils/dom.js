export const renderNickname = (nickname) => {
  document.querySelectorAll('[data-nickname]').forEach((el) => {
    el.textContent = nickname;
  });
};
