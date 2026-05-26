import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MANIFESTO_TEXT =
  'Я — дизайнер, который ломает стереотипы о том, что визуальное совершенство должно стоить дорого. Создаю графику и интерфейсы бескомпромиссного, наивысшего качества по максимально доступной цене. В каждый пиксель я вкладываю душу и авторскую изюминку. За моей спиной более 100 реализованных проектов и восторженные отзывы клиентов.';

const STATS = [
  { value: '100+', label: 'Проектов' },
  { value: '∞', label: 'Идеи' },
  { value: '1', label: 'Стандарт качества' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 20,
    },
  },
};

/**
 * About — манифест дизайнера с премиальной типографикой.
 */
export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      ref={ref}
      className="section-spacing relative overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="layout-container relative z-10"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="mb-12 flex items-end gap-6 md:mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
            01 — Обо мне
          </span>
          <div className="hairline flex-1" />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Headline */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Манифест
              <br />
              <span className="text-white/40">дизайнера</span>
            </h2>
          </motion.div>

          {/* Manifesto body */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="glass-panel rounded-sm p-6 sm:p-8 md:p-10">
              <p className="text-balance text-base leading-[1.8] text-white/80 sm:text-lg md:text-xl md:leading-[1.9]">
                {MANIFESTO_TEXT}
              </p>

              {/* Decorative accent line */}
              <motion.div
                className="mt-8 h-px w-24 bg-gradient-to-r from-white/60 to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3 md:mt-24"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card flex flex-col items-center justify-center gap-2 p-8 sm:p-10"
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                transition: { type: 'spring', stiffness: 300, damping: 25 },
              }}
            >
              <span className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                {stat.label}
              </span>
              {index < STATS.length - 1 && (
                <span className="absolute right-0 hidden h-full w-px bg-white/[0.08] sm:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Background typography */}
      <span
        className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[20vw] font-bold leading-none text-white/[0.02]"
        aria-hidden="true"
      >
        01
      </span>
    </section>
  );
}
