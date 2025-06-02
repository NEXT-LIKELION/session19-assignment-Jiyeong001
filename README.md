[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gZq6QRLR)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 주요 기능 렌더링 방식 분석

-   게시글 목록 페이지 (`/`)
    *   **방식:** SSR
    *   **이유:** SEO 유리함. 초기 로딩 빠름. 데이터 최신성 유지됨.

-   게시글 상세 페이지 (`/post/[id]`)
    *   **방식:** SSR + CSR 하이브리드
    *   **이유:** 본문 SSR로 SEO 및 초기 로딩 확보됨. 댓글은 CSR로 동적 처리 및 클라이언트 상호작용 용이함.

-   게시글 작성 페이지 (`/post/write`)
    *   **방식:** CSR
    *   **이유:** 정적 페이지. 클라이언트 상호작용 중심임. SEO 불필요함.

-   게시글 수정 페이지 (`/post/edit/[id]`)
    *   **방식:** SSR 또는 CSR
    *   **이유:** 데이터 로딩 방식에 따라 선택됨. (현재 CSR 구현됨)

-   게시글/댓글 삭제 (상세 페이지 내 기능)
    *   **방식:** CSR
    *   **이유:** 클라이언트 이벤트로 API 호출 발생함. 페이지 렌더링과 직접 관련 없음.

-   댓글 목록 표시 (상세 페이지 내 기능)
    *   **방식:** CSR
    *   **이유:** 동적 데이터임. SEO 비중 낮음. 클라이언트 상태 관리 필요함.

-   댓글 추가/수정 (상세 페이지 내 기능)
    *   **방식:** CSR
    *   **이유:** 클라이언트 폼 입력 및 인터랙션으로 API 호출 발생함. 페이지 렌더링과 직접 관련 없음.
