import { api } from '../core/index.js';
import { MENU_RECORD_ID } from '../../constants/menu.js';

// 카테고리의 메뉴 배열 조회
// 레코드 구조: { id: '1', korea: [{ id, name, price, category, liked, thumbnail }, ...] }
export const getMenus = async (categoryId) => {
  try {
    const record = await api.get(`/menu/${MENU_RECORD_ID[categoryId]}`);
    return record[categoryId] ?? [];
  } catch (err) {
    throw new Error('메뉴를 불러오지 못했습니다.', { cause: err });
  }
};
