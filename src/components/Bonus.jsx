import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BONUS_TEXT =
  'Эксклюзивная программа для друзей: приведи заказчика и получи гарантированную скидку на свой следующий дизайн плюс приоритетное выполнение заказа вне очереди. Важное условие активации: Бонус активируется после подтверждения и оплаты заказа друга.';

const STEPS = [
  { num: '01', title: 'Приведи клиента', desc: 'Расскажи другу о работах и дай ему мой контакт' },
  { num: '02', title: 'Подтверди реферал', desc: 'Друг упоминает тебя при заказе в Telegram' },
  { num: '03', title: 'Получи бонус', desc: 'Скидка + приоритет вне очереди' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 20 },
  },
};

/**
 * Bonus — реферальная бонусная система.
 */
export default function Bonus() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="bonus"
      ref={ref}
      className="section-spacing relative overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="layout-container relative z-10"
      >
        <motion.div variants={fadeUp} className="mb-12 flex items-end gap-6 md:mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
            03 — Бонус
          </span>
          <div className="hairline flex-1" />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={fadeUp}>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Бонусная
              <br />
              <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                система
              </span>
            </h2>

            <motion.div
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-2"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(52, 211, 153, 0.1)',
                  '0 0 40px rgba(52, 211, 153, 0.2)',
                  '0 0 20px rgba(52, 211, 153, 0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                Эксклюзив для друзей
              </span>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="glass-panel rounded-sm p-6 sm:p-8 md:p-10">
              <p className="text-balance text-base leading-[1.8] text-white/75 sm:text-lg md:leading-[1.9]">
                {BONUS_TEXT}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          variants={fadeUp}
          className="mt-16 grid gap-4 sm:grid-cols-3 md:mt-24"
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.num}
              className="glass-card group relative overflow-hidden p-6 sm:p-8"
              whileHover={{
                y: -4,
                borderColor: 'rgba(255,255,255,0.15)',
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                Шаг {step.num}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>

              {index < STEPS.length - 1 && (
                <motion.span
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 font-mono text-2xl text-white/10 sm:block"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <span
        className="pointer-events-none absolute -right-8 bottom-0 select-none font-display text-[18vw] font-bold leading-none text-white/[0.02]"
        aria-hidden="true"
      >
        03
      </span>
    </section>
  );
}
