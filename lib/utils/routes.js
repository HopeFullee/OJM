const BASE = import.meta.env.BASE_URL;

// 동적 BASE URL 적용
export const ROUTES = {
  home: BASE,
  signIn: `${BASE}sign-in.html`,
  signUp: `${BASE}sign-up.html`,
  myPage: `${BASE}my-page.html`,
};
