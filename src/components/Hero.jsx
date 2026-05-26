import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TELEGRAM_URL = 'https://t.me/vremke';

const STATUS_MESSAGES = [
  'Доступен для новых проектов',
  'Открыт к сотрудничеству',
  'Приоритет — премиум-качество',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
    },
  },
};

/**
 * Hero — главный экран. Фоновые шарики — в BackgroundAmbient (глобально).
 */
export default function Hero() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 5000);
    return () => clearInterval(rotate);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
    >
      <div className="hero-inner layout-container section-padding relative z-10 flex min-h-[100dvh] flex-col justify-between py-8 sm:py-12">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4"
        >
          <motion.div variants={itemVariants} className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="truncate font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:text-xs"
            >
              {STATUS_MESSAGES[statusIndex]}
            </motion.span>
          </motion.div>

          <motion.a
            variants={itemVariants}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel shrink-0 border border-white/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft-white sm:px-5 sm:py-3 sm:text-xs"
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            whileHover={{
              scale: 1.03,
              borderColor: 'rgba(255,255,255,0.45)',
              boxShadow: '0 0 28px rgba(255, 255, 255, 0.16)',
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Заказать дизайн
          </motion.a>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center justify-center py-16 text-center"
        >
          <motion.p
            variants={itemVariants}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted sm:text-xs"
          >
            Digital Designer & Visual Architect
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-[-0.04em]"
          >
            <span className="block bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              VREMKE
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base"
          >
            Кибер-минимализм. Бескомпромиссное качество. Доступная цена.
          </motion.p>
        </motion.div>

        <motion.footer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center pb-2"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
            >
              Scroll
            </motion.span>
            <motion.div
              className="h-8 w-px bg-white/20"
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.footer>
      </div>
    </section>
  );
}
