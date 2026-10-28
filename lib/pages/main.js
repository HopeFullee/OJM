// 메인 페이지 전용 스크립트
import { updateUser } from '../api/index.js';
import { getMenus, updateMenuLikes } from '../api/menu/index.js';
import { getCurrentUser, redirectToSignIn, requireAuth, getChildElems } from '../utils/index.js';
import { CATEGORY_LABEL, ACTIVE_TAB_CLASSES, INACTIVE_TAB_CLASSES } from '../constants/menu.js';

const HEART_ICON = {
  filled: './assets/icons/icon-heart-filled.svg',
  empty: './assets/icons/icon-heart-empty.svg',
};

// 하트를 마지막으로 누른 뒤 서버에 저장하기까지 기다리는 시간
const LIKE_SAVE_DELAY = 1000;

const GUEST_NICKNAME = '게스트';

const formatPrice = (price) => Number(price).toLocaleString('ko-KR');

/* ---------- DOM ---------- */

const candidateCount = document.getElementById('candidate-count');
const candidateItems = document.getElementById('candidate-items');
const candidateClearButton = document.getElementById('candidate-clear');
const candidateItemTemplate = document.getElementById('candidate-item-template');
const candidateEmptyTemplate = document.getElementById('candidate-empty-template');

const decisionViews = {
  default: document.getElementById('decision-default'),
  result: document.getElementById('decision-result'),
  custom: document.getElementById('custom-form'),
};
const decisionActions = document.getElementById('decision-actions');
const decisionMenu = document.getElementById('decision-menu');
const decisionMap = document.getElementById('decision-map');
const decisionMapLabel = document.getElementById('decision-map-label');
const decisionStatus = document.getElementById('decision-status');
const pickButton = document.getElementById('pick-random');
const customOpenButton = document.getElementById('custom-open');
const customCancelButton = document.getElementById('custom-cancel');
const customForm = decisionViews.custom;

const categoryButtons = document.querySelectorAll('[data-category]');
const sortButtons = document.querySelectorAll('[data-sort]');
const sortIndicator = document.getElementById('sort-indicator');
const menuItems = document.getElementById('menu-items');
const menuItemTemplate = document.getElementById('menu-item-template');

/* ---------- 상태 ---------- */

let isMember = false; // 로그인한 회원인지 (비회원은 서버 저장 기능 제한)
let candidates = []; // 오늘의 후보: { key, name, price, category }
let menus = []; // 현재 카테고리의 메뉴: { key, id, categoryId, name, price, liked, thumbnail }
let currentCategory = 'korea';
let currentSort = 'popular'; // 'popular' | 'liked'
let currentView = 'default';
let previousView = 'default'; // 커스텀 등록을 닫았을 때 돌아갈 화면
let lastPickedKey = null;

let likedKeys = new Set(); // 화면에 보이는 찜 상태 (낙관적 업데이트)
let savedLikedKeys = new Set(); // 서버에 저장된 찜 상태
const pendingLikes = new Map(); // 저장 대기 중인 변경: key → { categoryId, id, delta }
let likeTimer = null;

const menuCards = new Map(); // 화면에 그려진 메뉴 카드: key → 카드 요소들

/* ---------- 공통 ---------- */

const renderNickname = (nickname) => {
  document.querySelectorAll('[data-nickname]').forEach((el) => {
    el.textContent = nickname;
  });
};

const findMenu = (key) => menus.find((menu) => menu.key === key);

// 비회원이 회원 전용 기능을 눌렀을 때 로그인 안내
const askSignIn = () => {
  if (confirm('해당 기능은 회원전용입니다. 로그인을 하시겠습니까?')) redirectToSignIn();
};

/* ---------- 오늘의 후보 ---------- */

const hasCandidate = (key) => candidates.some((candidate) => candidate.key === key);

const createCandidateItem = (candidate) => {
  const item = candidateItemTemplate.content.firstElementChild.cloneNode(true);
  const { name, badge, price, deleteButton } = getChildElems(item);

  name.textContent = candidate.name;
  badge.textContent = CATEGORY_LABEL[candidate.category];
  badge.classList.add(candidate.category);
  price.textContent = `${formatPrice(candidate.price)}원`;

  deleteButton.setAttribute('aria-label', `${candidate.name} 후보에서 삭제하기`);
  deleteButton.addEventListener('click', () => removeCandidate(candidate.key));

  return item;
};

// 메뉴 카드의 '후보에 담기' 버튼 상태 맞추기
const syncCartButton = (key) => {
  const card = menuCards.get(key);
  if (!card) return;

  const isAdded = hasCandidate(key);
  card.cartButton.textContent = isAdded ? '담김 ✓' : '+ 후보에 담기';
  card.cartButton.classList.toggle('btn-cart', !isAdded);
  card.cartButton.classList.toggle('btn-cart-added', isAdded);
  card.cartButton.setAttribute('aria-pressed', String(isAdded));
};

const renderCandidates = () => {
  const isEmpty = candidates.length === 0;

  candidateCount.textContent = `${candidates.length}개 담김`;
  candidateClearButton.disabled = isEmpty;
  pickButton.disabled = isEmpty;

  if (isEmpty) {
    candidateItems.replaceChildren(candidateEmptyTemplate.content.cloneNode(true));
    // 후보가 모두 사라지면 결과 화면도 기본 화면으로 되돌림
    if (currentView === 'result') showView('default');
  } else {
    candidateItems.replaceChildren(...candidates.map(createCandidateItem));
  }

  menuCards.forEach((_, key) => syncCartButton(key));
};

const addCandidate = (candidate) => {
  if (hasCandidate(candidate.key)) return;
  candidates = [...candidates, candidate];
  renderCandidates();
};

const removeCandidate = (key) => {
  candidates = candidates.filter((candidate) => candidate.key !== key);
  renderCandidates();
};

// 메뉴 카드에서 담기/담김 해제
const toggleCandidate = (key) => {
  if (hasCandidate(key)) {
    removeCandidate(key);
    return;
  }

  const menu = findMenu(key);
  addCandidate({ key, name: menu.name, price: menu.price, category: menu.categoryId });
};

candidateClearButton.addEventListener('click', () => {
  candidates = [];
  renderCandidates();
});

/* ---------- 오늘의 결정 ---------- */

const showView = (name) => {
  Object.entries(decisionViews).forEach(([viewName, el]) => {
    el.hidden = viewName !== name;
  });

  decisionActions.hidden = name === 'custom';
  if (name === 'default') pickButton.textContent = '랜덤 고르기';

  currentView = name;
};

// 회원의 추천 기록(user.record)에 저장 → 마이페이지 추천 목록에 표시됨
const saveRecord = async ({ name, price, category }) => {
  try {
    const user = await requireAuth();
    if (!user) return;

    const record = {
      createdAt: new Date().toISOString(),
      name,
      category: CATEGORY_LABEL[category], // 마이페이지와 같은 형식('한식', '커스텀' 등)
      price,
    };

    await updateUser({ id: user.id, record: [...(user.record ?? []), record] });
  } catch (err) {
    // 기록 저장에 실패해도 추천 결과는 그대로 보여 줌
    console.error(err);
  }
};

const pickRandom = () => {
  // 후보가 2개 이상이면 직전 결과는 제외하고 고름
  const pool =
    candidates.length > 1
      ? candidates.filter((candidate) => candidate.key !== lastPickedKey)
      : candidates;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  lastPickedKey = picked.key;
  decisionMenu.textContent = picked.name;
  decisionMap.href = `https://map.naver.com/p/search/${encodeURIComponent(picked.name)}`;
  decisionMapLabel.textContent = `네이버 지도에서 근처 '${picked.name}' 찾기`;
  pickButton.textContent = '다시 고르기';

  showView('result');
  decisionStatus.textContent = `오늘의 추천 메뉴는 ${picked.name}입니다.`;

  // 비회원은 추천 결과를 서버에 기록하지 않음
  if (isMember) saveRecord(picked);
};

const openCustomForm = () => {
  previousView = currentView;
  showView('custom');
  customForm.elements.name.focus();
};

const closeCustomForm = () => {
  customForm.reset();
  showView(previousView);
  customOpenButton.focus();
};

pickButton.addEventListener('click', pickRandom);
customOpenButton.addEventListener('click', openCustomForm);
customCancelButton.addEventListener('click', closeCustomForm);

customForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const { name, price } = Object.fromEntries(new FormData(customForm));

  addCandidate({
    key: `custom-${crypto.randomUUID()}`,
    name: name.trim(),
    price: Number(price),
    category: 'custom',
  });

  closeCustomForm();
  decisionStatus.textContent = `${name.trim()}을(를) 후보에 담았어요.`;
});

/* ---------- 기본 메뉴: 찜하기 ---------- */

const isSameSet = (a, b) => a.size === b.size && [...a].every((key) => b.has(key));

// 메뉴 카드의 하트 아이콘과 인기도 숫자 맞추기
const syncHeart = (key) => {
  const card = menuCards.get(key);
  const menu = findMenu(key);
  if (!card || !menu) return;

  const isLiked = likedKeys.has(key);
  card.likeIcon.setAttribute('href', isLiked ? HEART_ICON.filled : HEART_ICON.empty);
  card.likeButton.setAttribute('aria-pressed', String(isLiked));
  card.liked.textContent = menu.liked;
};

// 저장 대기 중인 변경을 카테고리별 { 메뉴 id: 증감값 }으로 묶기
const groupPendingByCategory = () => {
  const groups = {};

  pendingLikes.forEach(({ categoryId, id, delta }) => {
    if (delta === 0) return; // 눌렀다가 다시 눌러 원래대로 돌아온 메뉴는 저장하지 않음
    groups[categoryId] = { ...groups[categoryId], [id]: delta };
  });

  return groups;
};

// 쌓인 찜 변경 사항을 서버에 한 번에 저장
const flushLikes = async () => {
  clearTimeout(likeTimer);
  if (pendingLikes.size === 0) return;

  const groups = groupPendingByCategory();
  const nextLikedKeys = new Set(likedKeys);

  pendingLikes.clear();

  try {
    await Promise.all(
      Object.entries(groups).map(([categoryId, deltas]) => updateMenuLikes({ categoryId, deltas })),
    );

    if (!isSameSet(nextLikedKeys, savedLikedKeys)) {
      const user = await requireAuth();
      if (!user) return;

      await updateUser({ id: user.id, liked: [...nextLikedKeys] });
      savedLikedKeys = nextLikedKeys;
    }
  } catch (err) {
    // 저장에 실패하면 서버 상태로 되돌림
    console.error(err);
    likedKeys = new Set(savedLikedKeys);
    loadMenus(currentCategory);
  }
};

// 화면은 바로 바꾸고, 서버 저장은 debounce
const toggleLike = (key) => {
  // 비회원은 서버와 통신하지 않고 로그인 안내만 띄움
  if (!isMember) {
    askSignIn();
    return;
  }

  const menu = findMenu(key);
  if (!menu) return;

  const pending = pendingLikes.get(key) ?? { categoryId: menu.categoryId, id: menu.id, delta: 0 };

  if (likedKeys.has(key)) {
    likedKeys.delete(key);
    menu.liked -= 1;
    pending.delta -= 1;
  } else {
    likedKeys.add(key);
    menu.liked += 1;
    pending.delta += 1;
  }

  pendingLikes.set(key, pending);
  syncHeart(key);

  clearTimeout(likeTimer);
  likeTimer = setTimeout(flushLikes, LIKE_SAVE_DELAY);
};

// 다른 탭으로 이동하거나 페이지를 떠날 때 남은 변경 사항 저장
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushLikes();
});

/* ---------- 기본 메뉴: 정렬 ---------- */

const SORTERS = {
  // 인기순: 인기도(liked) 높은 순
  popular: (a, b) => b.liked - a.liked,
  // 찜한순: 내가 찜한 메뉴 먼저, 같은 그룹 안에서는 인기도 높은 순
  liked: (a, b) => Number(likedKeys.has(b.key)) - Number(likedKeys.has(a.key)) || b.liked - a.liked,
};

const renderSortButtons = () => {
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === currentSort;
    button.classList.toggle('text-ink-soft', !isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  sortIndicator.classList.toggle('translate-x-0', currentSort === 'popular');
  sortIndicator.classList.toggle('translate-x-70', currentSort === 'liked');
};

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { sort } = button.dataset;
    if (sort === currentSort) return;

    // 비회원은 찜 목록이 없으므로 찜한순 정렬은 반응하지 않음
    if (sort === 'liked' && !isMember) return;

    currentSort = sort;
    renderSortButtons();
    renderMenus();
  });
});

/* ---------- 기본 메뉴: 목록 ---------- */

const createMenuCard = (menu) => {
  const { key } = menu;
  const item = menuItemTemplate.content.firstElementChild.cloneNode(true);
  const { fallback, image, likeButton, likeIcon, name, price, liked, cartButton } =
    getChildElems(item);

  name.textContent = menu.name;
  price.textContent = formatPrice(menu.price);

  if (menu.thumbnail) {
    image.src = menu.thumbnail;
    image.hidden = false;
    fallback.hidden = true;

    // 이미지를 불러오지 못하면 대체 문구 표시
    image.addEventListener(
      'error',
      () => {
        image.hidden = true;
        fallback.hidden = false;
      },
      { once: true },
    );
  }

  likeButton.setAttribute('aria-label', `${menu.name} 찜하기`);
  likeButton.addEventListener('click', () => toggleLike(key));
  cartButton.addEventListener('click', () => toggleCandidate(key));

  menuCards.set(key, { likeButton, likeIcon, liked, cartButton });
  syncHeart(key);
  syncCartButton(key);

  return item;
};

// 정렬은 목록을 새로 그릴 때만 적용 (하트를 누를 때마다 카드가 움직이지 않도록)
const renderMenus = () => {
  menuCards.clear();

  if (menus.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'text-14 text-ink-muted';
    emptyItem.textContent = '등록된 메뉴가 없어요.';
    menuItems.replaceChildren(emptyItem);
    return;
  }

  const sorted = [...menus].sort(SORTERS[currentSort]);
  menuItems.replaceChildren(...sorted.map(createMenuCard));
};

const renderCategoryTabs = () => {
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === currentCategory;

    ACTIVE_TAB_CLASSES.forEach((name) => button.classList.toggle(name, isActive));
    INACTIVE_TAB_CLASSES.forEach((name) => button.classList.toggle(name, !isActive));
    button.setAttribute('aria-pressed', String(isActive));
  });
};

const loadMenus = async (categoryId) => {
  currentCategory = categoryId;
  renderCategoryTabs();

  try {
    const result = await getMenus(categoryId);

    // 응답을 기다리는 사이 다른 카테고리를 눌렀다면 이 응답은 버림
    if (categoryId !== currentCategory) return;

    // 메뉴 id는 카테고리 안에서만 고유하므로 카테고리와 합쳐 key로 사용 (예: 'korea-1')
    // price, liked는 문자열로 저장되어 있어 숫자로 변환
    menus = result.map((menu) => ({
      ...menu,
      key: `${categoryId}-${menu.id}`,
      categoryId,
      price: Number(menu.price),
      liked: Number(menu.liked) || 0,
    }));
    renderMenus();
  } catch (err) {
    console.error(err);
    if (categoryId !== currentCategory) return;

    const errorItem = document.createElement('li');
    errorItem.className = 'text-14 text-ink-muted';
    errorItem.textContent = '메뉴를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';
    menuItems.replaceChildren(errorItem);
  }
};

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { category } = button.dataset;
    if (category === currentCategory) return;

    // 다른 카테고리를 불러오기 전에 저장 대기 중인 찜을 먼저 저장
    flushLikes();
    loadMenus(category);
  });
});

/* ---------- 초기화 ---------- */

const init = async () => {
  // 비회원도 이용할 수 있는 페이지라 로그인 페이지로 보내지 않음
  let user = null;

  try {
    user = await getCurrentUser();
  } catch (err) {
    // 회원 여부를 확인하지 못하면 비회원으로 이용
    console.error(err);
  }

  isMember = Boolean(user);
  likedKeys = new Set(user?.liked ?? []);
  savedLikedKeys = new Set(likedKeys);

  renderNickname(user?.nickname ?? GUEST_NICKNAME);
  renderCandidates();
  showView('default');
  renderSortButtons();
  loadMenus(currentCategory);
};

init();
