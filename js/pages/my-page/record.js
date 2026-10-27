import { requireAuth } from '../../utils/index.js';
import { updateRecords } from '../../api/index.js';
import { getFormattedDate } from '../../utils/date.js';

const CATEGORY_CLASS = {
  한식: 'korea',
  중식: 'china',
  일식: 'japan',
  양식: 'western',
};

const recordCount = document.getElementById('record-count');
const recordItems = document.getElementById('record-items');
const recordClearButton = document.getElementById('record-clear');
const recordItemTemplate = document.getElementById('record-item-template');
const recordEmptyTemplate = document.getElementById('record-empty-template');

// 화면에 그려진 순서 그대로 보관 (모듈 스코프라 콘솔에서 접근 불가)
let records = [];

// 회원 검증 후 record 배열을 저장하고, 서버 응답으로 다시 그리기
const saveRecords = async (nextRecords) => {
  try {
    const user = await requireAuth();
    if (!user) return;

    const saved = await updateRecords({ id: user.id, records: nextRecords });
    renderRecords(saved);
  } catch (err) {
    alert(err.message);
  }
};

// querySelector 난사 대신 all로 받은 배열을 객체로 바꿔서 나이스하게 구조분해
export const getFields = (root) =>
  Object.fromEntries(
    [...root.querySelectorAll('[data-field]')].map((el) => [el.dataset.field, el]),
  );

// 기록 하나로 <li> 만들기
const createRecordItem = (record, idx) => {
  const { createdAt, name, category, price } = record;
  const item = recordItemTemplate.content.firstElementChild.cloneNode(true);
  const {
    name: nameEl,
    date: dateEl,
    badge: badgeEl,
    price: priceEl,
    mapLink: mapEl,
    deleteButton,
  } = getFields(item);

  dateEl.dateTime = createdAt;
  dateEl.textContent = getFormattedDate(createdAt);
  nameEl.textContent = name;
  badgeEl.textContent = category;
  priceEl.textContent = `${Number(price).toLocaleString('ko-KR')}원`;
  mapEl.href = `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
  mapEl.setAttribute('aria-label', `네이버 지도에서 근처 ${name} 찾기 (새창)`);

  if (CATEGORY_CLASS[category]) badgeEl.classList.add(CATEGORY_CLASS[category]);

  deleteButton.setAttribute('aria-label', `${name} 기록 삭제하기`);
  deleteButton.addEventListener('click', () => {
    saveRecords([...records.slice(0, idx), ...records.slice(idx + 1)]);
  });

  return item;
};

// 목록 전체 그리기
export const renderRecords = (list = []) => {
  records = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  recordCount.textContent = `${records.length}건`;
  recordClearButton.disabled = records.length === 0;

  if (records.length === 0) {
    recordItems.replaceChildren(recordEmptyTemplate.content.cloneNode(true));
    return;
  }

  recordItems.replaceChildren(...records.map(createRecordItem));
};

// 일괄 삭제
recordClearButton.addEventListener('click', () => {
  if (confirm('추천 기록을 모두 삭제할까요?')) saveRecords([]);
});
