# 1. Node versiyonunu belirt
FROM node:20-alpine AS builder

# 2. Çalışma dizini oluştur
WORKDIR /app

# 3. Paketleri yükle
COPY package*.json ./
RUN npm install

# 4. Kodları kopyala
COPY . .

# 5. Build al
RUN npm run build

# 6. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Sadece gerekli dosyaları al
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Uygulamayı başlat
CMD ["npm", "start"]

EXPOSE 3000
