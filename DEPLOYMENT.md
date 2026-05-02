# Vercel Deployment Guide - TMDb Movie Explorer

## Proje Yapısı

```
.
├── api/                    # Serverless functions (Backend)
│   ├── movies.ts          # GET /api/movies endpoint
│   ├── movies/[id].ts     # GET /api/movies/:id endpoint
│   ├── services/          # TMDB service logic
│   └── utils/             # Utility functions
├── frontend/              # React Vite application
├── backend/               # Original Express server (local development only)
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── .env.example          # Environment variables template
```

## Kurulum Adımları

### 1. **Vercel Hesabı Oluşturun**
   - [https://vercel.com](https://vercel.com) adresine gidin
   - GitHub hesabınızla oturum açın (veya başka bir provider seçin)

### 2. **Repository'i GitHub'a Push Edin**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tmdb-movie-explorer.git
   git push -u origin main
   ```

### 3. **Vercel'e Deploy Edin**
   - Vercel Dashboard'a gidin
   - "Add New..." → "Project" tıklayın
   - GitHub repository'inizi seçin
   - "Import" tıklayın

### 4. **Environment Variables'ı Ayarlayın**
   Vercel Project Settings → "Environment Variables" bölümüne:
   
   ```
   TMDB_API_KEY = your_tmdb_api_key_here
   ```
   
   - https://www.themoviedb.org/settings/api adresinden TMDb API anahtarınızı alın

### 5. **Deploy Edin**
   - "Deploy" butonuna tıklayın
   - Vercel otomatik olarak build işlemini başlatacak
   - Deployment tamamlandığında, size verilen URL'e erişin

## Lokal Geliştirme

### Backend (Express - Lokal)
```bash
cd backend
npm install
npm run dev
# Server şu adresinde çalışacak: http://localhost:5000
```

### Frontend (Vite - Lokal)
```bash
cd frontend
npm install
npm run dev
# App şu adresinde açılacak: http://localhost:5173
```

**Önemli:** Frontend `.env.local` dosyasındaki `VITE_API_BASE_URL` lokal backend'e işaret etmelidir:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Her İki Tarafı Birden Çalıştırmak (Root Directory'den)
```bash
npm install
npm run dev
```

## Vercel'de Nasıl Çalışıyor?

1. **Frontend Build:** Vite React uygulamasını build eder ve `frontend/dist` klasörüne koyar
2. **API Routes:** `/api` klasöründeki dosyalar otomatik olarak serverless functions olarak deploy edilir
3. **Routing:** Vercel otomatik olarak `/api/*` request'lerini ilgili serverless functions'a yönlendirir
4. **SPA Support:** Diğer tüm request'ler `index.html`'e yönlendirilir (React Router çalışması için)

## API Endpoints

### Tüm Filmleri Al
```
GET /api/movies?type=popular&page=1&search=&genres=
```

### Tek Bir Filmi Al (Detay)
```
GET /api/movies/[id]
```

Örnek: `/api/movies/550` (Fight Club)

## Troubleshooting

### Problem: "TMDB_API_KEY is not defined"
- Vercel Project Settings'den `TMDB_API_KEY` environment variable'ını ekleyin

### Problem: Frontend API requests başarısız
- Vercel deployment log'larını kontrol edin
- `.env.local` ve vercel.json dosyalarının düzgün olduğundan emin olun
- Browser console'da network tab'ını kontrol edin

### Problem: "Cannot find module '@vercel/node'"
- Root directory'de `npm install` çalıştırın
- vercel.json'ın doğru olduğundan emin olun

## Sonraki Adımlar

1. **Domain bağlama:** Vercel Settings'den custom domain ekleyin
2. **Analytics:** Vercel Analytics'i etkinleştirin
3. **CI/CD:** GitHub Actions ile otomatik testing ekleyin
4. **Database:** Backend'e veri tabanı ekleyin (eğer gerekirse)

## Faydalı Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [TMDb API Documentation](https://developer.themoviedb.org/docs)

---

**Başarılı deployments dilerim!** 🚀
