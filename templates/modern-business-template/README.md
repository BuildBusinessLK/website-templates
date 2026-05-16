# modern-business-template

Next.js 14 App Router public microsite for one SME slug.

## Setup

```bash
cd website-templates/templates/modern-business-template
npm install
cp .env.local.example .env.local   # optional
npm run dev
```

Default dev server: `http://localhost:3001`

## Environment

- `NEXT_PUBLIC_API_BASE_URL` — Spring Boot origin (default `http://localhost:8083`)

## Route

- `/business/[slug]` — loads `GET {API}/api/public/business/{slug}`
