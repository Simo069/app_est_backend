FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --only=production
RUN npx prisma generate
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD sh -c "npx prisma db push && node dist/main.js"