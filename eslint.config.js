import js from "@eslint/js";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";
import stylistic from "@stylistic/eslint-plugin";

export default [
  // 검사 제외 대상
  {
    ignores: ["node_modules/**", "tailwind.config.js"],
  },

  // ESLint 기본 추천 규칙
  js.configs.recommended,

  // 브라우저에서 실행되는 소스 코드 (바닐라 JS)
  {
    files: ["**/*.{js,mjs}"],
    plugins: { unicorn, "@stylistic": stylistic },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // 파일명은 케밥케이스만 허용 (sign-in.js ✅ / signIn.js ⚠️)
      "unicorn/filename-case": ["warn", { case: "kebabCase" }],

      // 문자열은 작은따옴표만 허용 (안에 '가 들어가면 큰따옴표 허용)
      // "@stylistic/quotes": ["error", "single", { avoidEscape: true }],

      // 매개변수 재할당 금지 (props: true → 매개변수의 프로퍼티 변경도 금지)
      "no-param-reassign": [
        "error",
        {
          props: true,
          // DOM 요소·reduce 누산기처럼 프로퍼티 변경이 흔한 이름은 예외
          ignorePropertyModificationsFor: ["acc", "el", "element"],
        },
      ],

      // 단골 규칙
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // 변수선언만 하고 안쓰면 경고
      "no-var": "error", // var 쓰지마셈
      "prefer-const": "error", // 재할당 없는 let 변수는 const로 바꾸셈
      eqeqeq: ["error", "always"], // == 쓰지말고 === 쓰셈 (엄격)
      "no-console": ["warn", { allow: ["warn", "error"] }], // production 배포전 콘솔로그 쉽게 찾아 지우라고 '경고로만 하이라이팅' 적용
    },
  },

  // Node 환경에서 실행되는 설정 파일
  {
    files: ["vite.config.{js,mjs}", "eslint.config.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
