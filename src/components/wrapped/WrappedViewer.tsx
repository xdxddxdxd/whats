'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Download, Pause, Share2, Crown, Lock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WrappedSlideData } from '@/lib/ai/types';
import { WrappedSlide } from './WrappedSlide';
import { getLicenseInfo } from '@/lib/utils/license';
import { Button } from '../ui/Button';

interface WrappedViewerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: WrappedSlideData[];
  chatTitle: string;
  onOpenPdf: () => void;
  onOpenLicenseModal?: () => void;
}

const SLIDE_DURATION = 7000;
const FREE_MAX_SLIDES = 5;

export const WrappedViewer: React.FC<WrappedViewerProps> = ({
  isOpen,
  onClose,
  slides,
  chatTitle,
  onOpenPdf,
  onOpenLicenseModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPro, setIsPro] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const info = getLicenseInfo();
      setIsPro(info.isPro);
    }
  }, [isOpen]);

  const totalVisibleSlides = isPro ? slides.length : Math.min(slides.length, FREE_MAX_SLIDES) + (slides.length > FREE_MAX_SLIDES ? 1 : 0);
  const isCurrentSlideLocked = !isPro && currentIndex === FREE_MAX_SLIDES && slides.length > FREE_MAX_SLIDES;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#7DD3FC', '#38BDF8', '#0284C7', '#FFFFFF'],
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore in tests
    }
  };

  const nextSlide = useCallback(() => {
    if (currentIndex < totalVisibleSlides - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, totalVisibleSlides, onClose]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      if (currentIndex === 0 || currentIndex === 3 || currentIndex === totalVisibleSlides - 1) {
        triggerConfetti();
      }
    }
  }, [currentIndex, isOpen, totalVisibleSlides]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, nextSlide, prevSlide, onClose]);

  useEffect(() => {
    if (!isOpen || isPaused || isCurrentSlideLocked || slides.length === 0) return;

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time - pausedTimeRef.current;
      const elapsed = time - startTimeRef.current;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

      setProgress(currentProgress);

      if (elapsed >= SLIDE_DURATION) {
        nextSlide();
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, isPaused, currentIndex, nextSlide, slides.length, isCurrentSlideLocked]);

  const handlePointerDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setIsPaused(true);
      if (startTimeRef.current) {
        pausedTimeRef.current = performance.now() - startTimeRef.current;
      }
    }, 150);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isPaused) {
      setIsPaused(false);
      startTimeRef.current = null;
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${chatTitle} — WhatsApp Wrapped 2026`,
          text: `${chatTitle} sohbetimizin Wrapped hikaye özetine göz at! 🎉`,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Sohbet linki panoya kopyalandı!');
    }
  };

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[Math.min(currentIndex, slides.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none font-sans">
      
      {/* 9:16 Responsive Mobile Container */}
      <div
        className="relative w-full h-full sm:h-[88vh] sm:max-w-[420px] sm:rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 flex flex-col justify-between"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        
        {/* Top Floating Controls */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 pt-5 sm:pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3">
          
          {/* Progress Indicators Bar */}
          <div className="flex gap-1.5 w-full">
            {Array.from({ length: totalVisibleSlides }).map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${isCurrentSlideLocked ? 100 : progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase opacity-90 truncate max-w-[150px]">
                {chatTitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141414] text-[#7DD3FC] border border-[#38BDF8]/30 font-sans">
                {currentIndex + 1}/{totalVisibleSlides}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-2 rounded-full bg-[#141414] border border-white/10 hover:border-[#38BDF8] text-white transition-colors"
                title="Paylaş"
              >
                <Share2 className="w-4 h-4 text-[#7DD3FC]" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPdf();
                }}
                className="p-2 rounded-full bg-[#141414] border border-white/10 hover:border-[#38BDF8] text-white transition-colors"
                title="Wrapped PDF İndir"
              >
                <Download className="w-4 h-4 text-[#7DD3FC]" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 rounded-full bg-[#141414] border border-white/10 hover:bg-white/20 text-white transition-colors"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Slide Content */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isCurrentSlideLocked ? (
              /* GATED PRO STORY CARD */
              <motion.div
                key="locked-pro-slide"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full p-6 flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-b from-slate-950 via-slate-900 to-black relative z-10"
              >
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <Crown className="w-8 h-8 fill-amber-300" />
                </div>

                <div className="space-y-2 max-w-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5" />
                    Kalan Slaytlar Kilitli
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    Trip, Dedikodu & Gizli Uyum Slaytlarını Aç
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sohbetinizin en hararetli tartışma anlarını, psikolojik rollerini ve özel unvanlarını görmek için PRO'ya geçin.
                  </p>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <Button
                    variant="blue"
                    className="w-full font-bold text-sm py-3.5 shadow-glow-blue flex items-center justify-center gap-2"
                    onClick={() => {
                      onClose();
                      if (onOpenLicenseModal) onOpenLicenseModal();
                    }}
                  >
                    <Crown className="w-4 h-4 text-black fill-black" />
                    <span>Tüm Slaytları Aç (₺49)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenLicenseModal) onOpenLicenseModal();
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors block mx-auto pt-1"
                  >
                    Lisans anahtarım var
                  </button>
                </div>
              </motion.div>
            ) : (
              <WrappedSlide
                key={`slide-${currentSlide.id || currentIndex}`}
                slide={currentSlide}
                isActive={true}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Left / Right Invisible Tap Areas */}
        {!isCurrentSlideLocked && (
          <>
            <div
              className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              title="Önceki Slayt"
            />
            <div
              className="absolute inset-y-16 right-0 w-2/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              title="Sonraki Slayt"
            />
          </>
        )}

        {/* Bottom Pause Bar */}
        <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center pointer-events-none text-white/50 text-[11px]">
          {isPaused ? (
            <span className="flex items-center gap-1 bg-black/70 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm text-[#7DD3FC]">
              <Pause className="w-3 h-3" /> Duraklatıldı
            </span>
          ) : (
            <span className="opacity-0 hover:opacity-100 transition-opacity">
              Basılı tutarak duraklatın • Tıklayarak ilerleyin
            </span>
          )}
        </div>

      </div>

    </div>
  );
};
