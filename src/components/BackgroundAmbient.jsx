import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Плавающие стеклянные шарики — ч/б, движение 24/7 по всему экрану.
 * z-index: 1 (НЕ -1 — иначе уходит под фон родителя и пропадает).
 */
function buildOrbs(count) {
  return Array.from({ length: count }, (_, i) => {
    const size = 72 + (i % 5) * 44;
    return {
      id: `orb-${i}`,
      size,
      left: `${(i * 17 + 4) % 86}%`,
      top: `${(i * 23 + 6) % 80}%`,
      x: [0, 140 - (i % 4) * 35, -110 + (i % 3) * 30, 90, 0],
      y: [0, -100 + (i % 5) * 15, 75, -55, 0],
      scale: [1, 1.08, 0.94, 1.05, 1],
      duration: 28 + (i % 7) * 8,
      delay: i * 0.4,
      opacity: 0.18 + (i % 4) * 0.06,
    };
  });
}

export default function BackgroundAmbient() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const orbs = useMemo(() => buildOrbs(isMobile ? 8 : 16), [isMobile]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            opacity: orb.opacity,
            border: '1px solid rgba(255, 255, 255, 0.18)',
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.04) 65%, transparent 100%)',
            boxShadow:
              '0 0 60px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.1)',
          }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: orb.x,
            y: orb.y,
            scale: orb.scale,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
