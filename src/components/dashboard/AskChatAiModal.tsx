'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, RefreshCw, Crown, Lock, Key, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AIChatMessage } from '@/types/chat';
import { getClientOwnerToken, getClientGuestSession } from '@/lib/utils/session';
import { getLicenseInfo } from '@/lib/utils/license';

interface AskChatAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle: string;
  onOpenLicenseModal?: () => void;
}

const SUGGESTIONS = [
  'İlk nasıl başladık ve ilk plan neresiydi?',
  'Sohbetteki en komik anımız neydi?',
  'En çok hangi konuda tartıştık veya trip attık?',
  'Bize özel komik bir şiir yazar mısın?'
];

export const AskChatAiModal: React.FC<AskChatAiModalProps> = ({
  isOpen,
  onClose,
  chatId,
  chatTitle,
  onOpenLicenseModal
}) => {
  const [isPro, setIsPro] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Merhaba! Ben **${chatTitle}** yapay zeka asistanıyım. Tüm sohbet geçmişinizi ve istatistiklerinizi hafızamda tutuyorum. Sohbetinizle ilgili bana istediğiniz soruyu sınırsızca sorabilirsiniz! 👑`,
      timestamp: 'Şimdi'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const info = getLicenseInfo();
      setIsPro(info.isPro);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleLicenseChange = () => {
      const info = getLicenseInfo();
      setIsPro(info.isPro);
    };
    window.addEventListener('licenseChanged', handleLicenseChange);
    return () => window.removeEventListener('licenseChanged', handleLicenseChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    if (!isPro) {
      if (onOpenLicenseModal) {
        onClose();
        onOpenLicenseModal();
      }
      return;
    }

    setError(null);
    setInput('');

    const newMsgs: AIChatMessage[] = [
      ...messages,
      { role: 'user', content: q, timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const ownerToken = getClientOwnerToken();
      const guestSession = getClientGuestSession(chatId);
      const guestToken = guestSession?.sessionToken || '';

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (ownerToken) headers['x-owner-token'] = ownerToken;
      if (guestToken) headers['x-guest-token'] = guestToken;
      headers['x-is-pro'] = 'true';

      const res = await fetch(`/api/chats/${chatId}/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question: q, isPro: true })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI yanıtı alınamadı.');
      }

      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          factsUsed: data.factsUsed
        }
      ]);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbetinle Konuş (AI Asistanı) 💬"
      subtitle="Sohbet geçmişinize dayalı gerçek ve kanıtlı cevaplar alın."
    >
      {!isPro ? (
        /* Free Plan: Locked AI Screen with Pro Upgrade Call-to-Action */
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-5 relative overflow-hidden font-sans">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto shadow-glow-blue">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              Sadece PRO Üyelere Özel
            </span>
            <h3 className="text-xl font-bold text-white mt-2.5">
              Sohbetinizle Sınırsız Konuşun
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
              Yapay zekamız tüm WhatsApp geçmişinizi tarayarak en komik anlarınızı, sitemlerinizi ve merak ettiğiniz tüm soruları anında yanıtlar.
            </p>
          </div>

          {/* Example Locked Questions Preview */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2 text-left text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SORABİLECEĞİNİZ ÖRNEK SORULAR:
            </span>
            {SUGGESTIONS.slice(0, 3).map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 text-[11px] opacity-75">
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>"{s}"</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              variant="blue"
              className="w-full font-bold text-xs sm:text-sm py-3.5 shadow-glow-blue flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                if (onOpenLicenseModal) onOpenLicenseModal();
              }}
            >
              <Crown className="w-4 h-4 text-black fill-black" />
              <span>PRO'ya Geç ve Sınırsız Soru Sor (₺49)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenLicenseModal) onOpenLicenseModal();
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto pt-1"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Zaten bir lisans anahtarım var</span>
            </button>
          </div>

        </div>
      ) : (
        /* Pro Plan: Unlimited AI Chat Assistant */
        <div className="space-y-4 max-h-[75vh] flex flex-col justify-between font-sans">
          
          {/* Top VIP Bar */}
          <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>PRO VIP • Sınırsız AI Soru Modu</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full font-sans font-bold text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ♾️ Sınırsız
            </span>
          </div>

          {/* Messages Stream Container */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-white/10">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-500 text-white rounded-tr-sm shadow-sm'
                      : 'bg-white dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{m.content}</div>

                  {m.factsUsed && m.factsUsed.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                      <span className="font-bold text-sky-600 dark:text-sky-400 block">Kullanılan Kanıtlar:</span>
                      {m.factsUsed.map((f, i) => (
                        <div key={i} className="font-sans">✓ {f}</div>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] block text-right mt-1 font-sans ${
                    m.role === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200/80 dark:border-white/10 w-36 text-xs text-slate-500 dark:text-slate-400 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />
                <span>Cevap yazılıyor...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ÖNERİLEN SORULAR
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600 dark:hover:text-sky-300 border border-transparent dark:border-white/5 text-slate-700 dark:text-slate-300 text-[11px] font-sans transition-all text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/50">
              {error}
            </p>
          )}

          {/* Input Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              placeholder="Sohbet hakkında istediğiniz soruyu sorun..."
              className="flex-1 bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:bg-white dark:focus:bg-[#11141A] transition-all disabled:opacity-50 font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-40 transition-all shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </Modal>
  );
};
