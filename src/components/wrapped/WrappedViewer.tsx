'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Download, Pause, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WrappedSlideData } from '@/lib/ai/types';
import { WrappedSlide } from './WrappedSlide';

interface WrappedViewerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: WrappedSlideData[];
  chatTitle: string;
  onOpenPdf: () => void;
}

const SLIDE_DURATION = 7000;

export const WrappedViewer: React.FC<WrappedViewerProps> = ({
  isOpen,
  onClose,
  slides,
  chatTitle,
  onOpenPdf,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, slides.length, onClose]);

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
      if (currentIndex === 0 || currentIndex === 3 || currentIndex === slides.length - 1) {
        triggerConfetti();
      }
    }
  }, [currentIndex, isOpen, slides.length]);

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
    if (!isOpen || isPaused || slides.length === 0) return;

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
  }, [isOpen, isPaused, currentIndex, nextSlide, slides.length]);

  const handlePointerDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setIsPaused(true);
    }, 180);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPaused(false);
    startTimeRef.current = null;
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${chatTitle} ✦ WHATS Wrapped 2026`,
          text: `"${chatTitle}" sohbetimizin 2026 Wrapped analizi ve grup unvanları hazır! 🎉🍿`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Sohbet linki panoya kopyalandı! 📋');
    }
  };

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Story Container */}
      <div
        className="relative w-full h-full sm:max-w-md sm:h-[90vh] sm:max-h-[860px] sm:rounded-3xl overflow-hidden shadow-2xl bg-[#0A0A0A] border border-white/10 flex flex-col justify-between"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
      >

        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 sm:p-5 bg-gradient-to-b from-black/80 to-transparent">
          
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 mb-3">
            {slides.map((_, idx) => (
              <div
                key={`story-bar-${idx}`}
                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
              >
                <div
                  className="h-full bg-[#38BDF8] transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-serif tracking-wider uppercase opacity-90 truncate max-w-[150px]">
                {chatTitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141414] text-[#7DD3FC] border border-[#38BDF8]/30 font-mono">
                {currentIndex + 1}/{slides.length}
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
            <WrappedSlide
              key={`slide-${currentSlide.id || currentIndex}`}
              slide={currentSlide}
              isActive={true}
            />
          </AnimatePresence>
        </div>

        {/* Left / Right Invisible Tap Areas */}
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
