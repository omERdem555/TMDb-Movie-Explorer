# TMDb Movie Explorer - Vercel Ready Project

Bu proje Vercel üzerinde deployment'a hazır hale getirilmiştir.

## Hızlı Başlangıç

### Local Development
```bash
# Root directory'de dependencies yükleyin
npm install

# Her iki tarafı da çalıştırın
npm run dev
```

### Deployment
1. GitHub'a push edin
2. https://vercel.com adresinde yeni project oluşturun
3. `TMDB_API_KEY` environment variable'ını ayarlayın
4. Deploy edin!

📖 Detaylı bilgi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasını okuyun.

## Proje Yapısı

- **`/api`** - Vercel Serverless Functions (Backend)
- **`/frontend`** - React + Vite (Frontend)
- **`/backend`** - Original Express Server (Local development only)
- **`vercel.json`** - Vercel deployment configuration
- **`.env.example`** - Environment variables template

## Key Features

✅ Full-stack application  
✅ Frontend: React 19 + Vite + React Router  
✅ Backend: Node.js Serverless Functions  
✅ API: TMDb Movie Database  
✅ CORS enabled  
✅ Type-safe with TypeScript  
✅ Production ready  

## Important Notes

- ⚠️ Local development'da frontend'i `http://localhost:5000/api` ile backend'e bağlanır
- ✅ Production (Vercel)'da frontend otomatik olarak `/api` ile serverless functions'a bağlanır
- 📝 `.env.local` lokal development için environment variables'ı içerir
- 🔒 Never commit `.env.local` to Git!

---

Başka sorularınız varsa lütfen bana sorunuz.
