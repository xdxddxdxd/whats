'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { AIChatMessage } from '@/types/chat';
import { getClientOwnerToken, getClientGuestSession } from '@/lib/utils/session';

interface AskChatAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle: string;
}

const MAX_QUESTIONS = 5;

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
  chatTitle
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Merhaba! Ben **${chatTitle}** yapay zeka asistanıyım. Tüm sohbet geçmişinizi ve istatistiklerinizi hafızamda tutuyorum. Sohbetinizle ilgili bana istediğiniz somut soruyu sorabilirsiniz!`,
      timestamp: 'Şimdi'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && chatId) {
      const stored = localStorage.getItem(`ai_q_count_${chatId}`);
      if (stored) {
        setQuestionCount(parseInt(stored, 10) || 0);
      }
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    if (questionCount >= MAX_QUESTIONS) {
      setError(`Soru limitiniz doldu (${MAX_QUESTIONS}/${MAX_QUESTIONS}). Her sohbet için maksimum 5 soru sorabilirsiniz.`);
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

      const res = await fetch(`/api/chats/${chatId}/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question: q })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI yanıtı alınamadı.');
      }

      const nextCount =
        typeof data.questionCount === 'number'
          ? data.questionCount
          : questionCount + 1;
      setQuestionCount(nextCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ai_q_count_${chatId}`, String(nextCount));
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

  const remaining = Math.max(0, MAX_QUESTIONS - questionCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbetinle Konuş (AI Asistanı) 💬"
      subtitle="Sohbet geçmişinize dayalı gerçek ve kanıtlı cevaplar alın."
    >
      <div className="space-y-4 max-h-[75vh] flex flex-col justify-between font-sans">
        
        {/* Top Limit Bar */}
        <div className="flex items-center justify-between p-3 bg-sky-50 dark:bg-white/[0.04] rounded-2xl border border-sky-100 dark:border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-sky-900 dark:text-sky-300">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Sohbete Özel AI Modu</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full font-sans font-bold text-[11px] ${
            remaining === 0 ? 'bg-red-100 text-red-700' : 'bg-white dark:bg-[#161B22] border border-sky-200 dark:border-white/15 text-sky-800 dark:text-sky-300'
          }`}>
            Kalan Soru: {remaining}/{MAX_QUESTIONS}
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
        {remaining > 0 && (
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
        )}

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
            disabled={isLoading || remaining === 0}
            placeholder={remaining === 0 ? '5 soru limitiniz doldu.' : 'Sohbet hakkında bir soru sorun...'}
            className="flex-1 bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:bg-white dark:focus:bg-[#11141A] transition-all disabled:opacity-50 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || remaining === 0}
            className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-40 transition-all shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
