# 🍚 OJM (오점무) — 오늘 점심은 무엇입니까

> 후보만 담으면 오늘 점심 메뉴를 랜덤으로 골라드려요.

**EST-CAMP 프론트엔드 16기 2차 팀프로젝트**

- 🔗 **배포 주소**: https://hopefullee.github.io/OJM/
- 📅 **작업 기간**: 2026.10.21 ~ 2026.10.28

<br />

## 👥 팀원 및 역할

| 이름 | 역할 | 담당 업무 |
| :---: | :---: | --- |
| <img src="https://github.com/HopeFullee.png" width="80" alt="이소망 GitHub 프로필" /><br />[이소망](https://github.com/HopeFullee) | 리드 | 저장소 관리 · 배포, 프로젝트 설정(ESLint, Prettier, Tailwind, Vite)<br />Figma 디자인 시안 · 디자인 시스템(토큰)<br />메인 · 마이 페이지 UI/UX<br />공통 API 코어 · 헬퍼 함수, 공통 유틸 함수<br />서포트, 코드 리뷰, 리팩토링 |
| <img src="https://github.com/benchel.png" width="80" alt="조민지 GitHub 프로필" /><br />[조민지](https://github.com/benchel) | 팀원 | MockAPI 기반 DB 세팅<br />로그인 · 회원가입 페이지 UI/UX<br />공통 유틸 함수(인증/인가) |
| <img src="https://github.com/rainyday717.png" width="80" alt="신재훈 GitHub 프로필" /><br />[신재훈](https://github.com/rainyday717) | 팀원 | 메인 페이지 UI/UX |

> 기획 및 설계는 팀 전원이 함께 진행했습니다.

<br />

## ✨ 주요 기능

- **메인 페이지**
  - 카테고리별 기본 메뉴 조회, 인기순 · 찜한순 정렬
  - 오늘의 후보 담기 · 삭제 · 일괄 삭제, 커스텀 메뉴 등록
  - 랜덤 고르기 및 네이버 지도 검색 링크
  - 메뉴 찜하기 (회원 전용)
- **마이 페이지**
  - 닉네임 · 비밀번호 변경
  - 추천받은 메뉴 기록 조회 · 삭제
- **로그인 · 회원가입**

> 비회원도 메뉴 추천을 이용할 수 있으며, 찜하기 · 추천 기록 저장 · 마이 페이지는 회원만 이용할 수 있습니다.

<br />

## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| 마크업 · 스타일 | HTML5, Tailwind CSS |
| 자바스크립트 | Vanilla JS |
| 데이터베이스 | MockAPI |
| 빌드 · 배포 | Vite, GitHub Pages (GitHub Actions) |
| 코드 품질 | ESLint, Prettier |
| 디자인 | Figma, Claude Design, 디자인 토큰 |

<br />

## 📁 폴더 구조

```
OJM/
├── public/
│   └── assets/
│       ├── images/
│       └── icons/
├── lib/
│   ├── API/          # API 코어 및 요청 헬퍼
│   ├── constants/    # 상수
│   ├── pages/        # 페이지별 스크립트
│   └── utils/        # 공통 유틸
├── styles/
│   ├── global.css
│   ├── components.css
│   ├── custom.css
│   ├── animations.css
│   └── tokens.css    # 디자인 토큰
├── index.html        # 메인
├── my-page.html
├── sign-in.html
└── sign-up.html
```

<br />

## 🔀 Git 컨벤션

**브랜치**: `이름-타입/작업내용` (예: `somang-feat/auth`)

**커밋 메시지**

| 접두어 | 설명 |
| --- | --- |
| `chore` | 잡일 (설정, 문서 등) |
| `style` | 마크업 · 스타일 |
| `feat` | 기능 추가 |
| `fix` | 버그 · 에러 수정 |
| `refactor` | 코드 개선 · 최적화 |

<br />

## 🚀 실행 방법

```bash
npm install
npm run dev
```

프로젝트 루트에 `.env` 파일을 만들고 MockAPI 주소를 입력합니다.

```
VITE_API_END_POINT=https://your-project.mockapi.io/api/v1
```
