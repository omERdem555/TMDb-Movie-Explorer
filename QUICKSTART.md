# Vercel Deployment - Hızlı Başlama Rehberi

## ✅ Tamamlanan Ayarlamalar

Projeniz Vercel deployment'a hazır hale getirilmiştir. İşte yapılan değişiklikler:

### 🆕 Yeni Dosyalar/Klasörler

```
/api/                          # Serverless functions (Vercel backend)
├── movies.ts                  # GET /api/movies endpoint
├── movies/[id].ts            # GET /api/movies/:id endpoint  
├── services/tmdb.service.ts  # TMDb API calls
└── utils/mapper.ts           # Data mapping utilities

vercel.json                    # Vercel deployment configuration
package.json                   # Root package.json (updated)
tsconfig.json                  # TypeScript configuration
.env.example                   # Environment variables template
.env.local                     # Local development variables (add your API key)
DEPLOYMENT.md                  # Detailed deployment guide
```

### 📝 Değiştirilen Dosyalar

- **`frontend/src/api/movies.api.ts`** - API_BASE URL'i ortam değişkenine bağlanacak şekilde güncellenmiştir
- **`README.md`** - Projeye genel bakış ve talimatlar eklendi

---

## 🚀 Deployment Adımları

### 1️⃣ **API Anahtarınızı Ekleyin**

`.env.local` dosyasını açın ve TMDb API anahtarınızı girin:

```
TMDB_API_KEY=your_actual_tmdb_api_key
```

API anahtarını https://www.themoviedb.org/settings/api adresinden alın.

### 2️⃣ **Local'de Test Edin**

```bash
# Root directory'de
npm install

# Backend (bir terminal'de)
cd backend && npm run dev

# Frontend (başka bir terminal'de) - Backend çalışırken
cd frontend && npm run dev
```

Frontend'in açıldığı URL'e gidin (genellikle http://localhost:5173)

### 3️⃣ **GitHub'a Push Edin**

```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### 4️⃣ **Vercel'de Deploy Edin**

1. https://vercel.com adresine gidin
2. "Add New" → "Project" seçin
3. GitHub repository'inizi seçin
4. "Import" tıklayın

**Environment Variables bölümünde:**
```
TMDB_API_KEY = your_actual_tmdb_api_key
```

5. "Deploy" tıklayın ✨

---

## 🔄 Nasıl Çalışıyor?

```
User Browser
    ↓
Vercel Frontend (React App)
    ↓
    ├─→ /api/movies.ts (Serverless Function)
    │   ↓
    │   TMDb API
    │   ↓
    │   Response
    │
    └─→ /api/movies/[id].ts (Serverless Function)
        ↓
        TMDb API
        ↓
        Response
```

---

## 📁 Dosya Yapısı Özeti

```
TMDb Movie Explorer/
├── api/                    # ← Vercel'de deploy edilecek backend
│   ├── movies.ts          # ← GET /api/movies
│   ├── movies/[id].ts     # ← GET /api/movies/:id
│   ├── services/
│   └── utils/
├── frontend/              # ← Vercel'de deploy edilecek frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/               # ← Sadece lokal development için
│   ├── src/
│   └── package.json
├── vercel.json           # ← Vercel konfigürasyonu
├── package.json          # ← Root package.json
└── .env.local            # ← API key'i buraya ekleyin
```

---

## ⚠️ Önemli Notlar

1. **`.env.local` dosyasını asla GitHub'a yüklemeyin!**
   - `.gitignore` zaten yapılandırılmıştır, fakat yine de kontrol edin

2. **Local development'da:**
   - Backend: `http://localhost:5000` üzerinde çalışır
   - Frontend: Backend URL'i `.env.local`'dan alır

3. **Vercel'de (Production):**
   - Frontend otomatik olarak `/api` endpoint'lerini çağırır
   - `TMDB_API_KEY` Vercel Environment Variables'dan gelir

---

## 🆘 Sorun Giderme

### Problem: "Cannot find module @vercel/node"
```bash
# Root directory'de çalıştırın
npm install
```

### Problem: Frontend API call'ı başarısız
- Browser Developer Tools → Network tab'ını kontrol edin
- API URL'in doğru olduğundan emin olun (`.env.local` veya production)
- Server logs'u kontrol edin (Vercel Dashboard → Logs)

### Problem: "INVALID_ID" hatası
- TMDb API documentation'ı kontrol edin
- Geçerli bir movie ID gönderdiğinizden emin olun

---

## 📚 Faydalı Linkler

- 🔗 [Vercel Docs](https://vercel.com/docs)
- 🔗 [TMDb API](https://developer.themoviedb.org/docs)
- 🔗 [React Router](https://reactrouter.com)
- 🔗 [Vite](https://vitejs.dev)

---

## ✨ Son Adımlar

- [ ] `.env.local`'da TMDB_API_KEY'i ekledim
- [ ] Local'de test ettim
- [ ] GitHub'a push ettim
- [ ] Vercel'de project oluşturdum
- [ ] Environment variables'ı Vercel'de ayarladım
- [ ] Deploy ettim
- [ ] Live site'ı test ettim

**Başarılı deployments! 🎉**

---

Herhangi bir sorun yaşarsanız, `DEPLOYMENT.md` dosyasını okuyun veya Vercel documentation'ını ziyaret edin.
