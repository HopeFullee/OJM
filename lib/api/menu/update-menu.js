import { api } from '../core/index.js';
import { MENU_RECORD_ID } from '../../constants/menu.js';

// 메뉴들의 liked 수를 증감값만큼 변경
// deltas: { [메뉴 id]: 증감값 } 예) { 1: 1, 3: -1 }
// 다른 사람의 변경을 덮어쓰지 않도록 최신 배열을 받아서 증감값만 더함
export const updateMenuLikes = async ({ categoryId, deltas }) => {
  const recordId = MENU_RECORD_ID[categoryId];

  try {
    const record = await api.get(`/menu/${recordId}`);

    const nextMenus = record[categoryId].map((menu) => {
      const delta = deltas[menu.id];
      if (!delta) return menu;

      return { ...menu, liked: String(Math.max(0, Number(menu.liked) + delta)) };
    });

    const updated = await api.put(`/menu/${recordId}`, { [categoryId]: nextMenus });
    return updated[categoryId];
  } catch (err) {
    throw new Error('찜 정보를 저장하지 못했습니다.', { cause: err });
  }
};
