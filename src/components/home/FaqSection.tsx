'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'WhatsApp sohbet analizi güvenli mi?',
      a: 'Evet, tamamen güvenli. Ham mesaj metinleriniz veritabanında saklanmaz. Yalnızca hesaplanan istatistikler ve AI unvanları saklanır.',
    },
    {
      q: 'Hangi dosya formatları destekleniyor?',
      a: 'WhatsApp uygulamasından "Sohbeti Dışa Aktar" seçeneğiyle aldığınız .txt formatındaki dosyalar desteklenir. Hem iOS hem de Android biçimleri otomatik ayrıştırılır.',
    },
    {
      q: 'WhatsApp mesaj istatistikleri neleri gösterir?',
      a: 'Mesaj sayıları, en çok kullanılan emojiler, günün en hareketli saatleri, yanıt süreleri, Gece Kuşu / Hayalet gibi kişilik unvanları ve Story formatında Yıl Özeti.',
    },
    {
      q: 'Bir sohbette toplam kaç mesaj attığımı nasıl görürüm?',
      a: "WhatsApp'ın kendisinde bu bilgi görünmez; sohbeti dışa aktarıp WHATS'e yüklediğinizde kişi bazlı tüm mesaj, kelime ve emoji sayılarını detaylıca görebilirsiniz.",
    },
    {
      q: 'Davet bağlantısı ve şifreli giriş nasıl çalışır?',
      a: 'Sohbet yüklendiğinde otomatik bir davet linki ve 6 haneli PIN üretilir. Arkadaşlarınız hesap açmadan bu link ve şifreyle analizi görüntüleyebilir.',
    },
    {
      q: 'Spotify Wrapped tarzı Yıl Özeti nedir?',
      a: 'Sohbetinizin en komik ve dikkat çekici istatistiklerini Instagram Story formatında tam ekran olarak sunan ve PDF olarak indirilebilen görsel özet deneyimidir.',
    },
  ];

  return (
    <section id="faq" className="space-y-8 py-10">
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Sık Sorulan Sorular
        </h2>
        <p className="text-xs sm:text-sm text-[#A3A3A3] font-sans">
          WhatsApp sohbet analizi ve Wrapped hakkında merak edilenler
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#121519] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2 shadow-soft"
          >
            <h4 className="text-base font-bold text-white font-serif tracking-wide">
              {faq.q}
            </h4>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-sans">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
