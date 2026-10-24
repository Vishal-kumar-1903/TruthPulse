'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Video, 
  Layers, 
  Image as ImageIcon,
  Activity,
  Radio,
  Cpu,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { MediaType } from './NewsCard';

export interface AnimatedMediaProps {
  mediaType?: MediaType;
  mediaUrl?: string;
  imageUrl?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  showBadge?: boolean;
  isHero?: boolean;
  isReel?: boolean;
  category?: string;
}

export default function AnimatedMedia({
  mediaType = 'IMAGE',
  mediaUrl,
  imageUrl,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  aspectRatio,
  showBadge = true,
  isHero = false,
  isReel = false,
  category = 'General'
}: AnimatedMediaProps) {
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fallbackImg = imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000';
  const effectiveMediaType = videoFailed ? 'IMAGE' : mediaType;

  // 1. Intersection Observer: Autoplay video only when in viewport to preserve battery & CPU
  useEffect(() => {
    if (effectiveMediaType !== 'VIDEO_LOOP' || !videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {
            // Autoplay policy fallback
            setIsPlaying(false);
          });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [effectiveMediaType]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-slate-900 group select-none ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* =========================================================================
          FORMAT 1: VIDEO LOOP (Lightweight, Autoplay, Muted WebM/MP4)
         ========================================================================= */}
      {effectiveMediaType === 'VIDEO_LOOP' && (
        <div className="relative w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            src={mediaUrl || imageUrl}
            poster={fallbackImg}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => {
              console.warn('Video loop failed to load, falling back to Ken-Burns image:', mediaUrl);
              setVideoFailed(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${className}`}
          />

          {/* Sound & Play Controls Overlay */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-sm"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-sm"
              title={isPlaying ? 'Pause Loop' : 'Play Loop'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
            </button>
          </div>

          {/* Video Loop Indicator Badge */}
          {showBadge && (
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-0.5"></span>
              <Video className="w-3 h-3 text-cyan-400" />
              <span>LOOP</span>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          FORMAT 2: LOTTIE / VECTOR MOTION GRAPHICS (Interactive 60fps Vector Scene)
         ========================================================================= */}
      {effectiveMediaType === 'LOTTIE_ANIMATION' && (
        <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center overflow-hidden">
          {/* Animated Background Mesh Grid */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Dynamic Vector Motion Engine tailored by Category */}
          {category?.toLowerCase() === 'business' ? (
            /* FINANCE & MARKET OSCILLATOR VECTOR */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-[280px] h-32 relative flex items-end justify-between gap-1.5 px-4 pb-4 border-b border-l border-emerald-500/30">
                {[45, 62, 38, 85, 72, 94, 60, 88, 100, 78, 92].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-emerald-600/30 to-emerald-400 rounded-t-sm transition-all duration-1000 animate-pulse"
                    style={{
                      height: `${val}%`,
                      animationDelay: `${idx * 120}ms`,
                      animationDuration: '2.4s'
                    }}
                  />
                ))}
                {/* Flowing Trendline Ribbon */}
                <div className="absolute inset-x-4 top-8 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-300 to-cyan-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                <TrendingUp className="w-4 h-4 animate-bounce" />
                <span>REAL-TIME CAPITAL TELEMETRY</span>
              </div>
            </div>
          ) : category?.toLowerCase() === 'weather' || category?.toLowerCase() === 'environment' ? (
            /* ATMOSPHERIC CLIMATE RADAR VECTOR */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border border-sky-500/30 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-sky-400/40 animate-ping opacity-30"></div>
                <div className="w-20 h-20 rounded-full border border-cyan-300/60 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_15px_#38bdf8]"></div>
                {/* Rotating Sweep Arm */}
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/40 via-transparent to-transparent animate-spin"
                  style={{ animationDuration: '4s' }}
                ></div>
              </div>
              <div className="absolute bottom-3 text-sky-300 text-[11px] font-mono tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>ATMOSPHERIC RADAR ACTIVE</span>
              </div>
            </div>
          ) : (
            /* DEFAULT CYBER INVESTIGATIVE MERKLE VECTOR */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
              <div className="relative flex items-center justify-center">
                {/* Outer Pulsing Aura */}
                <div className="w-36 h-36 rounded-full bg-cyan-500/10 blur-xl animate-pulse"></div>
                
                {/* Center Merkle Core */}
                <div className="absolute p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] flex flex-col items-center">
                  <Cpu className="w-8 h-8 text-cyan-400 animate-pulse mb-1.5" />
                  <span className="text-[10px] font-mono text-cyan-200 font-bold uppercase tracking-wider">
                    SHA-256 SEALED
                  </span>
                </div>

                {/* Orbiting Satellite Rings */}
                <div 
                  className="absolute w-44 h-44 rounded-full border border-dashed border-cyan-400/30 animate-spin"
                  style={{ animationDuration: '14s' }}
                ></div>
                <div 
                  className="absolute w-52 h-52 rounded-full border border-dotted border-indigo-400/25 animate-spin"
                  style={{ animationDuration: '22s', animationDirection: 'reverse' }}
                ></div>
              </div>

              <div className="flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>AUTONOMOUS AUDIT REGISTER</span>
              </div>
            </div>
          )}

          {/* Lottie / Vector Motion Badge */}
          {showBadge && (
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-indigo-500/30 text-[10px] font-mono text-indigo-300 pointer-events-none">
              <Layers className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>VECTOR MOTION</span>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          FORMAT 3: STATIC IMAGE WITH HIGH-FIDELITY KEN-BURNS ZOOM & PAN
         ========================================================================= */}
      {effectiveMediaType === 'IMAGE' && (
        <div className="relative w-full h-full overflow-hidden bg-slate-950">
          {/* Shimmer Skeleton Placeholder while loading */}
          {!imageLoaded && !imageFailed && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                <ImageIcon className="w-4 h-4 animate-spin" />
                <span>Hydrating Visual...</span>
              </div>
            </div>
          )}

          {/* Primary Ken-Burns Animated Image */}
          {!imageFailed ? (
            <img
              src={fallbackImg}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${
                isReel ? 'scale-100 hover:scale-105' : ''
              } ${className}`}
            />
          ) : (
            /* Graceful Fallback if image link 404s */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400">
              <ShieldAlert className="w-8 h-8 text-amber-500 mb-2" />
              <span className="text-xs font-mono font-bold text-slate-300">Verified Dispatch Archive</span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5">TruthPulse Cryptographic Record</span>
            </div>
          )}

          {/* Ken-Burns Mode Subtle Indicator on Hover */}
          {showBadge && imageLoaded && (
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>HD KEN-BURNS</span>
            </div>
          )}
        </div>
      )}

      {/* Atmospheric Vignette & Contrast Overlay for News Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none"></div>
    </div>
  );
}
