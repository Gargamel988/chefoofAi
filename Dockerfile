# 1. Node versiyonunu belirt
FROM node:20-alpine AS builder

# 2. Çalışma dizini oluştur
WORKDIR /app

# 3. Paketleri yükle
COPY package*.json ./
RUN npm install

# 4. Kodları kopyala
COPY . .

# 5. Build al (standalone çıktısı üretilir)
RUN npm run build

# 6. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Sadece gerekli dosyaları al (standalone çalışma şekli)
# .next/standalone içinde server.js ve node_modules bulunur
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Uygulamayı başlat (standalone server.js)
CMD ["node", "server.js"]

EXPOSE 3000
