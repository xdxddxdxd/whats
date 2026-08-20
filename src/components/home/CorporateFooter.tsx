'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, Mail, Globe, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CorporateFooterProps {
  onOpenGuide: () => void;
}

type ModalType = 
  | 'about' 
  | 'privacy' 
  | 'cookies' 
  | 'terms' 
  | 'sales_contract' 
  | 'pre_info' 
  | 'refund' 
  | 'delivery' 
  | 'contact' 
  | null;

export const CorporateFooter: React.FC<CorporateFooterProps> = ({ onOpenGuide }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const getModalContent = () => {
    switch (activeModal) {
      case 'about':
        return {
          title: 'Hakkımızda',
          subtitle: 'WhatsBaba & Yapay Zeka Sohbet Zekası Platformu',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                <strong>WhatsBaba</strong>, arkadaş gruplarının, çiftlerin ve toplulukların WhatsApp mesajlaşma dinamiklerini interaktif bir yıllık özet (Wrapped), eğlenceli kişilik unvanları ve derin istatistikler eşliğinde keşfetmesini sağlayan yeni nesil bir veri analitik platformudur.
              </p>
              <p>
                Platformumuz, Spotify Wrapped deneyimini WhatsApp sohbetlerinize taşırken kullanıcı gizliliğini ve veri güvenliğini en üst öncelik olarak kabul eder.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h5 className="text-white font-bold text-xs uppercase tracking-wider">Misyonumuz</h5>
                <p className="text-xs text-slate-400">
                  Gelişmiş doğal dil işleme algoritmalarımızla en eğlenceli grup istatistiklerini %100 şeffaflık ve sıfır veri depolama garantisiyle kullanıcılara sunmak.
                </p>
              </div>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Gizlilik Politikası & KVKK Aydınlatma Metni',
          subtitle: 'Kişisel Verilerin Korunması ve Sıfır Saklama Garantisi',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                <span><strong>Sıfır Ham Metin Saklama Prensibi:</strong> Sohbet dosyalarınız hiçbir zaman sunucularımızda ham metin olarak kaydedilmez veya depolanmaz.</span>
              </div>
              <p>
                <strong>1. Veri İşleme Amacı:</strong> Yüklenen WhatsApp dışa aktarım dosyaları (.txt veya .zip), yalnızca anlık olarak istatistiksel verilerin (mesaj sayıları, aktif saatler, emoji frekansları ve kişilik unvanları) hesaplanması amacıyla işlenir.
              </p>
              <p>
                <strong>2. Veri Güvenliği:</strong> İstatistiksel hesaplama tamamlandıktan hemen sonra ham metin içeriği bellekten kalıcı olarak temizlenir. Kullanıcıya yalnızca PIN ve token ile korunan anonimleştirilmiş istatistik gösterge paneli sunulur.
              </p>
              <p>
                <strong>3. Üçüncü Taraflarla Paylaşım:</strong> Hiçbir kullanıcı verisi, sohbet içeriği veya kişisel bilgi üçüncü taraflara satılmaz, pazarlama amacıyla kullanılmaz veya paylaşılmaz.
              </p>
            </div>
          ),
        };
      case 'cookies':
        return {
          title: 'Çerez Politikası',
          subtitle: 'Web Sitesi Kullanım ve Yerel Depolama Politikası',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                WhatsBaba web sitesinde kullanıcı deneyimini iyileştirmek, oturum ve analiz kimliklerini (Owner Token) güvenli şekilde saklamak amacıyla yalnızca zorunlu yerel depolama (Local Storage) ve oturum çerezleri kullanılır.
              </p>
              <p>
                Kullanıcıları harici sitelerde izleyen 3. taraf reklam veya takip çerezleri sitemizde kesinlikle yer almamaktadır.
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Kullanım Koşulları',
          subtitle: 'Hizmet Şartları ve Kullanıcı Sorumlulukları',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                1. WhatsBaba platformunu kullanan her kullanıcı, analiz için yüklediği WhatsApp sohbet dosyasının kendi rızası ve/veya grup katılımcılarının bilgisi dahilinde yüklendiğini kabul ve taahhüt eder.
              </p>
              <p>
                2. Platformda üretilen analizler, eğlence ve bilgilendirme amaçlı hazırlanmış istatistiksel özetlerdir.
              </p>
              <p>
                3. Platformun hukuka aykırı amaçlarla veya üçüncü kişilerin haklarını ihlal edecek şekilde kullanılması yasaktır.
              </p>
            </div>
          ),
        };
      case 'sales_contract':
        return {
          title: 'Mesafeli Satış Sözleşmesi',
          subtitle: '6502 Sayılı Tüketicinin Korunması Hakkında Kanun Kapsamında',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                <strong>Madde 1 - Taraflar ve Konu:</strong> İşbu sözleşme, WhatsBaba platformu üzerinden sunulan dijital analiz hizmetlerinin satış ve kullanım koşullarını belirler.
              </p>
              <p>
                <strong>Madde 2 - Hizmet Niteliği:</strong> Sunulan hizmet, anında ifa edilen dijital içerik ve raporlama hizmetidir.
              </p>
              <p>
                <strong>Madde 3 - Ödeme ve Fiyatlandırma:</strong> Tüm hizmet bedelleri KDV dahil olarak açıkça belirtilir.
              </p>
            </div>
          ),
        };
      case 'pre_info':
        return {
          title: 'Ön Bilgilendirme Formu',
          subtitle: 'Dijital Hizmet Alım Öncesi Bilgilendirme',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Alıcı, WhatsBaba üzerinden sağlanan dijital analiz ve raporlama hizmetinin temel nitelikleri, satış fiyatı, ödeme şekli ve teslimatına ilişkin ön bilgileri elektronik ortamda teyit eder.
              </p>
              <p>
                Hizmet dijital ortamda anında ifa edildiğinden fiziksel kargo veya teslimat söz konusu değildir.
              </p>
            </div>
          ),
        };
      case 'refund':
        return {
          title: 'İade ve İptal Koşulları',
          subtitle: 'Dijital İçerik Cayma Hakkı ve İade Politikası',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin (ğ) bendi uyarınca; <em>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde"</em> cayma hakkı kullanılamaz.
              </p>
              <p>
                Bununla birlikte, teknik bir arıza veya sistem kaynaklı rapor oluşturulamaması durumlarında destek ekibimizle iletişime geçildiğinde inceleme yapılarak gerekli telafi ve destek ivedilikle sağlanır.
              </p>
            </div>
          ),
        };
      case 'delivery':
        return {
          title: 'Teslimat Koşulları',
          subtitle: 'Anında Dijital Erişim ve Raporlama',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                WhatsBaba platformunda analiz edilen tüm sohbetler ve oluşturulan Story & PDF raporları, dosya yükleme işleminin tamamlanmasının hemen ardından saniyeler içerisinde tarayıcınızda canlı olarak teslim edilir.
              </p>
              <p>
                Ayrıca oluşturulan rapora istediğiniz zaman erişebilmeniz için size özel şifreli bir davet linki ve PIN tahsis edilir.
              </p>
            </div>
          ),
        };
      case 'contact':
        return {
          title: 'İletişim & Destek',
          subtitle: 'Bize Ulaşın',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                WhatsBaba ile ilgili her türlü soru, geri bildirim, kurumsal iş birliği veya destek talepleriniz için bize aşağıdaki kanallardan 7/24 ulaşabilirsiniz:
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-4 h-4 text-[#38BDF8]" />
                  <span className="font-mono text-xs">destek@whatsbaba.com / dogukan@whatsbaba.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs">WhatsBaba Inc. • İstanbul, Türkiye</span>
                </div>
              </div>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const modalData = getModalContent();

  return (
    <footer className="border-t border-white/10 bg-[#05070A] pt-14 pb-12 mt-28 relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Brand + Security Guarantee Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-emoji text-lg shadow-glow-blue">
              💬
            </span>
            <div>
              <span className="font-bold text-lg text-white tracking-tight block">
                WhatsBaba
              </span>
              <span className="text-[11px] text-slate-400">
                WhatsApp Sohbet Analiz & Yıllık Özet (Wrapped) Platformu
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tüm sohbet verileriniz gizli kalır ve sunucularımızda asla saklanmaz.</span>
          </div>
        </div>

        {/* Corporate Links Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-emerald-400 font-medium">
          <button
            type="button"
            onClick={onOpenGuide}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Rehberler
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('about')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Hakkımızda
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Gizlilik Politikası
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('cookies')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Çerez Politikası
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Kullanım Koşulları
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('sales_contract')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Mesafeli Satış Sözleşmesi
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('pre_info')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Ön Bilgilendirme Formu
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('refund')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            İade ve İptal
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('delivery')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Teslimat Koşulları
          </button>
          <span className="text-white/10 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={() => setActiveModal('contact')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            İletişim
          </button>
        </div>

        {/* Bottom Copyright & Trust Badges */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 WhatsBaba. Tüm hakları saklıdır. Arkadaş grupları ve topluluklar için tasarlanmıştır.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Şifreleme
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-sky-400" /> KVKK & GDPR Uyumlu
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Corporate Modal */}
      {modalData && (
        <Modal
          isOpen={activeModal !== null}
          onClose={() => setActiveModal(null)}
          title={modalData.title}
          subtitle={modalData.subtitle}
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {modalData.content}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <Button variant="primary" onClick={() => setActiveModal(null)}>
                Anladım
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </footer>
  );
};
