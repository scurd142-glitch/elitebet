# Build from repository root:
#   docker build -f backend/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

RUN npm install

COPY shared ./shared
COPY backend ./backend

RUN npm run build --workspace=@elitebet/shared
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build
WORKDIR /app

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/backend ./backend

WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "dist/index.js"]
