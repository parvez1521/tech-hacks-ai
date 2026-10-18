import React, { useState, useEffect, useRef } from 'react';

export type PetState = 'idle' | 'hover' | 'welcome' | 'thinking' | 'responding' | 'error';

export interface AiOrb3DProps {
  size?: 'sm' | 'md' | 'lg';
  isGenerating?: boolean;
  hasUnread?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  state?: PetState;
  mood?: string;
}

/**
 * AiOrb3D Component — Cute 3D AI Pet Companion
 *
 * An expressive, tactually-modeled 3D companion creature with:
 * - Expressive minimal glowing eyes with 6 distinct states:
 *   (idle, hover, welcome, thinking, responding, error)
 * - Subtle pointer-following gaze and 3D body tilt dynamics (coarse-pointer safe)
 * - Multi-layer translucent sphere with realistic specular curved highlights
 * - Gyroscopic orbital halo ring with orbiting satellite photon
 * - Soft cheek blush on happy hover/welcome states
 * - Seamless dark mode (midnight obsidian & cyan) and light mode (frosted opal & sapphire) styling
 * - Strict prefers-reduced-motion compliance
 * - Zero heavy WebGL or Three.js dependencies (CSS 3D transforms & vector graphics)
 */
export const AiOrb3D: React.FC<AiOrb3DProps> = ({
  size = 'md',
  isGenerating = false,
  hasUnread = false,
  interactive = true,
  className = '',
  onClick,
  state: explicitState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Compute active state with priority: explicitState -> isGenerating -> isHovered -> idle
  const activeState: PetState =
    explicitState || (isGenerating ? 'thinking' : isHovered ? 'hover' : 'idle');

  // Determine pixel dimensions based on size variant
  const dimension = size === 'sm' ? 32 : size === 'lg' ? 64 : 48;

  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;

    // Check if fine pointer is available
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (finePointer && !finePointer.matches) return;

    // Check reduced motion
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reducedMotion && reducedMotion.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from pointer to center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      // Apply tilt and gaze tracking when pointer is within 200px proximity
      if (distance < 200) {
        const factor = Math.max(0, 1 - distance / 200);
        const maxTilt = 15;
        const tiltY = ((deltaX / 200) * maxTilt * factor).toFixed(2);
        const tiltX = ((-deltaY / 200) * maxTilt * factor).toFixed(2);
        setTilt({ x: parseFloat(tiltX), y: parseFloat(tiltY) });
      } else if (tilt.x !== 0 || tilt.y !== 0) {
        setTilt({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, tilt.x, tilt.y]);

  // Dimensions for eyes and facial features based on size
  const eyeWidth = size === 'sm' ? 3.5 : size === 'lg' ? 6.5 : 5;
  const eyeHeight = size === 'sm' ? 6 : size === 'lg' ? 12 : 9;
  const eyeGap = size === 'sm' ? 5 : size === 'lg' ? 11 : 8;

  // Eye and aura color styles depending on state
  const isError = activeState === 'error';
  const isThinking = activeState === 'thinking';
  const isResponding = activeState === 'responding';
  const isHappy = activeState === 'hover' || activeState === 'welcome';

  const eyeColorClass = isError
    ? 'bg-rose-400 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
    : 'bg-cyan-300 dark:bg-cyan-300 light:bg-blue-600 text-cyan-300 dark:text-cyan-300 light:text-blue-600 shadow-[0_0_8px_rgba(6,182,212,0.85)]';

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: dimension,
        height: dimension,
        perspective: 500,
      }}
      aria-hidden="true"
      data-pet-state={activeState}
    >
      {/* Dynamic 3D Gimbal Container */}
      <div
        className={`relative w-full h-full rounded-full transition-transform duration-200 ease-out ${
          isHappy ? 'animate-pet-float' : ''
        }`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.06 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Outer Volumetric Ambient Aura */}
        <div
          className={`absolute inset-[-4px] rounded-full blur-md transition-all duration-500 pointer-events-none ${
            isError
              ? 'bg-gradient-to-tr from-rose-500/40 via-amber-500/30 to-red-500/40 opacity-90'
              : isThinking
              ? 'bg-gradient-to-tr from-cyan-500 via-purple-500 to-blue-500 animate-spin opacity-95 [animation-duration:3s]'
              : isResponding
              ? 'bg-gradient-to-tr from-cyan-400 via-blue-400 to-emerald-400 opacity-90 animate-pulse'
              : 'bg-gradient-to-tr from-cyan-500/35 via-blue-500/25 to-purple-500/35 opacity-75 animate-pulse-subtle'
          }`}
        />

        {/* Layer 2: Outer Gyroscopic Orbital Ring */}
        <div
          className={`absolute inset-[-2px] rounded-full border border-cyan-400/30 dark:border-cyan-400/35 border-dashed pointer-events-none ${
            isThinking
              ? 'animate-spin [animation-duration:2.5s]'
              : 'animate-spin [animation-duration:14s]'
          }`}
          style={{
            transform: 'rotateX(68deg) rotateY(15deg)',
          }}
        >
          {/* Orbital Satellite Photon */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'
            } ${
              isError
                ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                : 'bg-cyan-300 shadow-[0_0_8px_#38bdf8]'
            }`}
          />
        </div>

        {/* Layer 3: Secondary Counter-Rotating Orbital Ring */}
        <div
          className={`absolute inset-[-2px] rounded-full border border-purple-400/20 dark:border-purple-400/25 border-dotted pointer-events-none ${
            isThinking
              ? 'animate-spin [animation-duration:2s] [animation-direction:reverse]'
              : 'animate-spin [animation-duration:18s] [animation-direction:reverse]'
          }`}
          style={{
            transform: 'rotateX(52deg) rotateY(-35deg)',
          }}
        >
          <div
            className={`absolute bottom-0 right-1/4 rounded-full ${
              size === 'sm' ? 'w-0.5 h-0.5' : 'w-1 h-1'
            } bg-purple-300 shadow-[0_0_6px_#c084fc]`}
          />
        </div>

        {/* Layer 4: Primary Translucent Spherical Glass Creature Body */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden border border-white/25 dark:border-white/10 shadow-lg shadow-black/30 backdrop-blur-md transition-colors duration-300"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.28) 0%, rgba(30, 41, 59, 0.72) 48%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        >
          {/* Layer 5: Nucleus Energy Core (Radiant Companion Heart) */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 pointer-events-none ${
              isError
                ? 'w-3/5 h-3/5 bg-gradient-to-tr from-rose-500 via-amber-500 to-rose-600 blur-[2px] opacity-80'
                : isThinking
                ? 'w-3/5 h-3/5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 blur-[2px] animate-pulse'
                : isResponding
                ? 'w-3/5 h-3/5 bg-gradient-to-tr from-cyan-300 via-sky-400 to-blue-500 blur-[2px] animate-pulse'
                : 'w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/80 via-blue-500/70 to-purple-500/80 blur-[1px]'
            }`}
            style={{
              boxShadow: isError
                ? '0 0 14px rgba(244, 63, 94, 0.8)'
                : isThinking
                ? '0 0 16px rgba(6, 182, 212, 0.9), 0 0 24px rgba(168, 85, 247, 0.7)'
                : '0 0 10px rgba(56, 189, 248, 0.7), 0 0 14px rgba(139, 92, 246, 0.5)',
            }}
          />

          {/* Layer 6: Expressive Cute Glowing Eyes (Face Center) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${tilt.y * 0.18}px, ${-tilt.x * 0.18}px)`,
            }}
          >
            {/* Expressive Eye Pair Rendering */}
            {activeState === 'hover' ? (
              /* Cheerful Arch Eyes (^ ^) */
              <div className="flex items-center" style={{ gap: eyeGap }}>
                <svg
                  width={eyeWidth * 2.2}
                  height={eyeHeight}
                  viewBox="0 0 14 10"
                  className="overflow-visible"
                >
                  <path
                    d="M 1 9 Q 7 0 13 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={size === 'sm' ? '2' : '2.5'}
                    strokeLinecap="round"
                    className={eyeColorClass}
                  />
                </svg>
                <svg
                  width={eyeWidth * 2.2}
                  height={eyeHeight}
                  viewBox="0 0 14 10"
                  className="overflow-visible"
                >
                  <path
                    d="M 1 9 Q 7 0 13 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={size === 'sm' ? '2' : '2.5'}
                    strokeLinecap="round"
                    className={eyeColorClass}
                  />
                </svg>
              </div>
            ) : activeState === 'thinking' ? (
              /* Focused Thinking / Scanning Pupils */
              <div className="flex items-center animate-pet-think" style={{ gap: eyeGap }}>
                <div
                  className={`rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth * 1.3,
                    height: eyeHeight * 0.5,
                  }}
                />
                <div
                  className={`rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth * 1.3,
                    height: eyeHeight * 0.5,
                  }}
                />
              </div>
            ) : activeState === 'error' ? (
              /* Concerned Asymmetric Eyes (> < or subtle tilt) */
              <div className="flex items-center" style={{ gap: eyeGap }}>
                <div
                  className={`rounded-full ${eyeColorClass} transform -rotate-12`}
                  style={{
                    width: eyeWidth,
                    height: eyeHeight * 0.8,
                  }}
                />
                <div
                  className={`rounded-full ${eyeColorClass} transform rotate-12`}
                  style={{
                    width: eyeWidth,
                    height: eyeHeight * 0.8,
                  }}
                />
              </div>
            ) : activeState === 'welcome' ? (
              /* Wide Curious Welcoming Eyes (• • with bright sparkle) */
              <div className="flex items-center" style={{ gap: eyeGap }}>
                <div
                  className={`relative rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth * 1.25,
                    height: eyeHeight * 1.1,
                  }}
                >
                  <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white opacity-95 shadow-[0_0_3px_#fff]" />
                </div>
                <div
                  className={`relative rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth * 1.25,
                    height: eyeHeight * 1.1,
                  }}
                >
                  <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white opacity-95 shadow-[0_0_3px_#fff]" />
                </div>
              </div>
            ) : (
              /* Idle / Responding: Calm Pill Eyes with Periodic Cute Blink */
              <div
                className={`flex items-center ${
                  isResponding ? 'animate-pet-respond' : 'animate-pet-blink'
                }`}
                style={{ gap: eyeGap }}
              >
                <div
                  className={`rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth,
                    height: eyeHeight,
                  }}
                />
                <div
                  className={`rounded-full ${eyeColorClass}`}
                  style={{
                    width: eyeWidth,
                    height: eyeHeight,
                  }}
                />
              </div>
            )}
          </div>

          {/* Soft Cheek Blush on Happy / Welcoming Hover */}
          {isHappy && (
            <div
              className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none z-10"
              style={{
                transform: `translate(${tilt.y * 0.15}px, ${-tilt.x * 0.15 + (size === 'sm' ? 2 : 4)}px)`,
              }}
            >
              <span
                className="rounded-full bg-rose-400/40 blur-[1px] shadow-[0_0_4px_rgba(251,113,133,0.5)]"
                style={{
                  width: size === 'sm' ? 4 : size === 'lg' ? 8 : 6,
                  height: size === 'sm' ? 2.5 : size === 'lg' ? 5 : 3.5,
                }}
              />
              <span
                className="rounded-full bg-rose-400/40 blur-[1px] shadow-[0_0_4px_rgba(251,113,133,0.5)]"
                style={{
                  width: size === 'sm' ? 4 : size === 'lg' ? 8 : 6,
                  height: size === 'sm' ? 2.5 : size === 'lg' ? 5 : 3.5,
                }}
              />
            </div>
          )}

          {/* Layer 7: Specular Curved Glass Glare Highlight */}
          <div className="absolute top-1 left-2 w-2/5 h-1/4 rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none transform -rotate-25 blur-[0.5px]" />

          {/* Layer 8: Secondary Rim Light Bounce */}
          <div className="absolute bottom-1 right-2 w-1/4 h-1/5 rounded-full bg-gradient-to-t from-cyan-400/40 to-transparent pointer-events-none blur-[1px]" />
        </div>

        {/* Layer 9: Unread Status Notification Node */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-background" />
          </div>
        )}
      </div>
    </div>
  );
};
