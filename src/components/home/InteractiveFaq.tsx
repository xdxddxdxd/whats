'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const InteractiveFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'WhatsApp sohbet analizi güvenli mi?',
      a: 'Evet, tamamen güvenli. Sohbetiniz yüklendiğinde ham mesaj metinleri hiçbir zaman sunucu veritabanımızda saklanmaz. Sistem yalnızca sayısal mesaj/kelime adetlerini ve yapay zeka tarafından üretilen özet unvanları saklar.',
    },
    {
      q: 'Hangi dosya formatları ve platformlar destekleniyor?',
      a: 'WhatsApp uygulamasında "Sohbeti Dışa Aktar" (Medyasız) seçeneğiyle oluşturulan tüm .txt dosyaları desteklenir. Hem iOS hem de Android işletim sistemlerindeki tarih/saat formatları otomatik olarak tanınır.',
    },
    {
      q: 'Arkadaşlarımla nasıl paylaşabilirim?',
      a: 'Sohbet analizi oluştuktan sonra yönetim panelinden tek tıkla sabit bir davet linki ve 6 haneli giriş şifresi alırsınız. Arkadaşlarınız herhangi bir kayıt veya hesap oluşturmadan bu şifreyle doğrudan analize ve Wrapped storylerine erişebilir.',
    },
    {
      q: 'İstediğim davetlinin erişimini kesebilir miyim?',
      a: 'Evet! Sohbet sahibi olarak "Yönetim" butonuna tıkladığınızda giriş yapan tüm davetlileri görebilir ve tek tıkla dilediğiniz kişinin erişimini anında iptal edebilirsiniz.',
    },
    {
      q: 'Spotify Wrapped tarzı Yıl Özeti nedir ve PDF olarak indirilebilir mi?',
      a: 'Wrapped modu, grubunuzun tüm yıl boyunca öne çıkan anlarını, gece mesajlarını ve unvanlarını Instagram Story akışı şeklinde tam ekran canlandırır. Bu kartları dikey yüksek kaliteli PDF albümü olarak indirebilirsiniz.',
    },
    {
      q: 'Sohbete yeni mesajlar eklenirse ne olur?',
      a: 'Artımlı güncelleme özelliğimiz sayesinde, aylar sonra yeni bir export yüklediğinizde sistem eski mesajları tekrar saymaz, yalnızca yeni eklenen mesajları analiz eder.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="space-y-8 py-10 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-[#38BDF8] uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10">
          MERAK EDİLENLER
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sık Sorulan Sorular
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#11141A] border-[#38BDF8]/40 shadow-glow-blue'
                  : 'bg-[#11141A]/60 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#38BDF8] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5 pt-3 font-sans">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
