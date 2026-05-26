import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const TELEGRAM_URL = 'https://t.me/vremke';

const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_RADIUS = 120;

/**
 * MagneticButton — интерактивная CTA с дыханием, магнитом и elastic pop.
 */
function MagneticButton() {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 22 });
  const springY = useSpring(y, { stiffness: 350, damping: 22 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!buttonRef.current || isExploding) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance < MAGNETIC_RADIUS) {
        const force = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
        x.set(deltaX * force);
        y.set(deltaY * force);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [x, y, isExploding]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (isExploding) return;

      setIsExploding(true);
      x.set(0);
      y.set(0);

      setTimeout(() => {
        window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
        setIsExploding(false);
      }, 600);
    },
    [isExploding, x, y]
  );

  return (
    <div
      className="relative flex justify-center py-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Breathing glow — idle state */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{
          scale: isHovered ? 1.15 : [1, 1.08, 1],
          opacity: isHovered ? 0.6 : [0.3, 0.5, 0.3],
        }}
        transition={{
          scale: isHovered
            ? { type: 'spring', stiffness: 200, damping: 20 }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          opacity: isHovered
            ? { type: 'spring', stiffness: 200, damping: 20 }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="h-24 w-64 rounded-full bg-gradient-to-r from-white/10 via-white/20 to-white/10 blur-2xl sm:h-28 sm:w-80" />
      </motion.div>

      <motion.a
        ref={buttonRef}
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        style={{ x: springX, y: springY }}
        className="relative z-10 inline-block"
        aria-label="Заказать дизайн в Telegram"
      >
        <motion.span
          className="relative flex items-center justify-center overflow-hidden rounded-sm border border-white/20 bg-white/[0.04] px-10 py-5 font-mono text-sm uppercase tracking-[0.25em] sm:px-14 sm:py-6 sm:text-base"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          animate={
            isExploding
              ? {
                  scale: [1, 1.2, 0.95, 1.05, 1],
                  rotate: [0, -2, 2, 0],
                }
              : isHovered
                ? {
                    scale: 1.04,
                    borderColor: 'rgba(255,255,255,0.4)',
                    boxShadow: '0 0 50px rgba(255,255,255,0.15)',
                  }
                : {
                    scale: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 30px rgba(255,255,255,0.05)',
                  }
          }
          transition={
            isExploding
              ? {
                  type: 'spring',
                  stiffness: 500,
                  damping: 12,
                  mass: 0.6,
                }
              : { type: 'spring', stiffness: 300, damping: 25 }
          }
          whileTap={!isExploding ? { scale: 0.96 } : undefined}
        >
          {/* Animated gradient border */}
          <motion.span
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.15), transparent)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner fill */}
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              animate={isHovered ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
            >
              Заказать дизайн
            </motion.span>
            <motion.span
              animate={isHovered ? { x: 6 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </span>

          {/* Explosion particles */}
          {isExploding &&
            [...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-white"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 80,
                  y: Math.sin((i / 8) * Math.PI * 2) * 80,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: i * 0.02,
                }}
              />
            ))}
        </motion.span>
      </motion.a>
    </div>
  );
}

/**
 * Footer — футер с интерактивной кнопкой заказа.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden pb-12 pt-8 sm:pb-16"
    >
      <div className="layout-container">
        <div className="hairline mb-16" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 20 }}
          className="text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
            04 — Контакт
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
            Готовы к новому проекту?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
            Напишите в Telegram — обсудим задачу, сроки и формат сотрудничества.
          </p>
        </motion.div>

        <MagneticButton />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/[0.08] pt-8 sm:flex-row"
        >
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-display text-lg font-semibold tracking-tight">
              VREMKE
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              © {currentYear} — Все права защищены
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-white"
            >
              Telegram
            </a>
            <span className="h-3 w-px bg-white/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Designed with precision
            </span>
          </div>
        </motion.div>
      </div>

      {/* Large background wordmark */}
      <motion.span
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none font-display text-[12vw] font-bold leading-none text-white/[0.02]"
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        VREMKE
      </motion.span>
    </footer>
  );
}
