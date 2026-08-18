'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { setClientGuestSession } from '@/lib/utils/session';
import { Button } from '@/components/ui/Button';

export default function InviteGatePage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = (params.inviteCode as string) || '';

  const [passwordPin, setPasswordPin] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordPin.trim() || !guestName.trim()) {
      setError('Lütfen PIN/Şifreyi ve isminizi girin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/invites/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode,
          passwordPin: passwordPin.trim(),
          guestName: guestName.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Giriş yapılamadı.');
      }

      if (data.chatId && data.sessionToken) {
        setClientGuestSession(data.chatId, {
          sessionToken: data.sessionToken,
          guestName: data.guestName
        });

        router.push(`/chat/${data.chatId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Giriş sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#7DD3FC]/40">
      
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E9F0] shadow-soft">
        
        {/* Header Icon */}
        <div className="text-center mb-6">
          <span className="w-14 h-14 rounded-3xl bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] inline-flex items-center justify-center text-3xl font-emoji mb-3 shadow-sm">
            💌
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0A0A0A]">
            Sohbet Analizine Katıl
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-sans">
            Sohbet sahibi tarafından paylaşılan şifreyi ve isminizi girerek analizi ve Wrapped Yıl Özetini görüntüleyin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* PIN / Password Input */}
          <div>
            <label className="text-xs font-semibold text-[#6B7280] block mb-1">
              Giriş Şifresi / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={passwordPin}
                onChange={(e) => setPasswordPin(e.target.value)}
                placeholder="Örn: 849201"
                className="w-full text-sm font-mono tracking-widest pl-10 pr-4 py-3 bg-[#F7F9FC] border border-[#E5E9F0] rounded-2xl text-[#0A0A0A] focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-colors"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Name / Nickname Input */}
          <div>
            <label className="text-xs font-semibold text-[#6B7280] block mb-1">
              İsminiz veya Lakabınız
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Örn: Burak veya Zeynep"
                className="w-full text-sm pl-10 pr-4 py-3 bg-[#F7F9FC] border border-[#E5E9F0] rounded-2xl text-[#0A0A0A] focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-semibold text-sm sm:text-base mt-2 shadow-soft hover:shadow-soft-hover"
          >
            <span>Analizi Görüntüle</span>
            <ArrowRight className="w-4 h-4 text-[#7DD3FC]" />
          </Button>

        </form>

        <div className="mt-6 pt-4 border-t border-[#E5E9F0] flex items-center justify-center gap-2 text-[11px] text-[#6B7280]">
          <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          <span>Şifreli & Yetkili Misafir Girişi</span>
        </div>

      </div>

    </main>
  );
}
