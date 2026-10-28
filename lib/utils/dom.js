export const renderNickname = (nickname) => {
  document.querySelectorAll('[data-nickname]').forEach((el) => {
    el.textContent = nickname;
  });
};

// querySelector 난사 대신 all로 받은 배열을 객체로 바꿔서 나이스하게 구조분해
export const getChildElems = (root) => {
  const arrayToObject = Object.fromEntries(
    [...root.querySelectorAll('[data-ref]')].map((el) => [el.dataset.ref, el]),
  );

  return arrayToObject;
};
