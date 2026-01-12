# 1단계: 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치를 위해 package 파일들 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

ARG NEXT_PUBLIC_API_BASE_URL=http://52.78.217.109:3001/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# 전체 소스 코드 복사
COPY . .

# Next.js 빌드 (이때 .env.production 등에 설정된 환경변수가 주입됩니다)
RUN npm run build

# 2단계: 실행 스테이지
FROM node:20-alpine AS runner

WORKDIR /app

# 운영 환경 설정
ENV NODE_ENV=production

# 빌드 스테이지에서 생성된 Next.js 결과물 중 실행에 필요한 것만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

# Next.js 기본 포트
EXPOSE 3000

# 앱 실행
CMD ["npm", "run", "start"]