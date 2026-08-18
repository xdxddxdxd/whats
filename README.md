# 💬 WHATS ✦ WhatsApp Sohbet Analiz & Yıllık Özet (Wrapped)

Arkadaş grupları için WhatsApp sohbet dışa aktarımlarını (`.txt` ve iPhone `.zip`) derinlemesine analiz eden, yapay zeka destekli kişilik ödülleri dağıtan ve **Spotify Wrapped / Instagram Story** formatında tam ekran interaktif Yıl Özeti sunan modern web uygulaması.

---

## ✨ Özellikler

- **📱 Spotify Wrapped Tarzı Tam Ekran Story Deneyimi:**
  - 7 interaktif slayt: Giriş, Büyük Rakamlar, 24-Saatlik Ritim & Gece Kuşu, Kişilik Oscar'ları, Emoji DNA'sı, AI Kehaneti ve Kapanış.
  - Hikaye akışını dikey yüksek çözünürlüklü **PDF albümü** olarak tek tıkla indirme.
- **🏆 Grup Kişilik Ödülleri (Superlatives):**
  - *Gece Kuşu 🦉*, *Grup Hayaleti 👻*, *Jet Yanıtçı ⚡*, *En Sabırsız ⏳*, *Konu Açan 📢*, *Emoji Hükümdarı 👑*, *Mini Makaleci 📜*.
- **📊 Derin Sohbet İstatistikleri:**
  - Saatlik ve haftalık mesaj aktivite dağılımı (Recharts).
  - Apple Color Emoji sıklık tablosu ve emoji liderliği.
  - Katılımcı karnesi: Mesaj sayısı, yüzde pay, kelime sayısı, medya sayısı, gece mesajı oranı ve yanıt hızı.
- **🔒 Şifreli Davet & Yetkili Misafir Girişi:**
  - Sohbet sahibi için otomatik üretilen davet linki ve 6 haneli PIN.
  - Misafirler için hesap açmadan anında isim + PIN ile giriş.
  - Sohbet sahibine özel davetli yönetimi ve tek tıkla **erişim iptali (revoke)**.
- **🔄 Artımlı Analiz Motoru (Incremental Delta Tracker):**
  - Hash tabanlı mesaj tanıma ile yeni export yüklendiğinde eski mesajlar tekrarlanmaz, yalnızca yeni mesajlar eklenir.
- **🛡️ Sıfır Veri Depolama Güvencesi:**
  - Ham mesaj metinleri veritabanında asla saklanmaz. Sadece hesaplanan istatistikler ve unvanlar işlenir.

---

## 🛠️ Teknoloji Yığını

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Dil:** TypeScript
- **Stil & Tasarım:** Tailwind CSS, Framer Motion, Lucide Icons
- **Tipografi:** Google Fonts *Fraunces* (Editorial Display), *Caveat* (Handwriting Accent), *Plus Jakarta Sans*, *JetBrains Mono*
- **Grafikler:** Recharts
- **Dışa Aktarım:** jsPDF + html2canvas
- **Veritabanı:** Supabase (PostgreSQL)

---

## 🚀 Başlangıç

### 1. Depoyu klonlayın
```bash
git clone https://github.com/xdxddxdxd/whats.git
cd whats
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Çevre değişkenlerini ayarlayın
`.env.example` dosyasını `.env.local` olarak kopyalayın ve ortam değişkenlerinizi girin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Geliştirme sunucusunu başlatın
```bash
npm run dev
```
Uygulamayı tarayıcınızda açın: `http://localhost:3000`

---

## 📄 Lisans
Bu proje açık kaynak topluluğu ve grup etkileşimi için MIT lisansı altında sunulmuştur.
