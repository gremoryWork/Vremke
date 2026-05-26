import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  animate,
  useInView,
} from 'framer-motion';
import { GALLERY_PROJECTS } from '../data/galleryProjects';

/** Жёсткий лимит: ровно 6 проектов. Фото: public/images/project-01.jpg … 06 */
const MAX_PROJECTS = 6;
const PROJECTS = GALLERY_PROJECTS.slice(0, MAX_PROJECTS).map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  src: p.image,
}));

const SLIDE_GAP = 24;
const SPRING = { type: 'spring', stiffness: 280, damping: 32, mass: 0.8 };

function padIndex(num, total) {
  return String(num).padStart(2, '0');
}

function getDistanceFromActive(index, activeIndex) {
  return Math.abs(index - activeIndex);
}

function getSlideVisuals(distance) {
  if (distance === 0) {
    return { scale: 1, opacity: 1, blur: 0, y: 0 };
  }
  if (distance === 1) {
    return { scale: 0.9, opacity: 0.75, blur: 2, y: 8 };
  }
  return { scale: 0.82, opacity: 0.5, blur: 5, y: 14 };
}

/**
 * Расчёт ширины слайда под 6 элементов и горизонтальный скролл.
 * На каждом брейкпоинте видно N слайдов + «peek» следующего.
 */
function calcSlideWidth(viewportWidth) {
  const padding =
    viewportWidth < 640 ? 40 : viewportWidth < 1024 ? 64 : viewportWidth < 1536 ? 96 : 128;
  const available = viewportWidth - padding * 2;
  const visibleSlides =
    viewportWidth < 640 ? 1.12 : viewportWidth < 768 ? 1.35 : viewportWidth < 1024 ? 2.1 : viewportWidth < 1536 ? 2.5 : 2.85;
  const gaps = SLIDE_GAP * (Math.ceil(visibleSlides) - 1);
  return Math.floor((available - gaps) / visibleSlides);
}

/**
 * ProjectImage — локальное фото из public/images/ или подсказка, если файла нет.
 */
function ProjectImage({ src, alt, isActive, fileHint }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white/[0.04] p-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          Нет файла
        </span>
        <span className="font-mono text-xs text-white/50">{fileHint}</span>
        <span className="max-w-[200px] text-[11px] leading-relaxed text-muted">
          Положите фото в папку public/images/ — см. КАК-ЗАГРУЗИТЬ-ФОТО.md
        </span>
      </div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      className="h-full w-full object-cover object-center"
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      animate={{ scale: isActive ? 1.04 : 1 }}
      transition={SPRING}
    />
  );
}

/**
 * SlideCard — карточка 4:3 с object-cover.
 */
function SlideCard({ project, index, activeIndex, slideWidth }) {
  const distance = getDistanceFromActive(index, activeIndex);
  const visuals = getSlideVisuals(distance);
  const isActive = distance === 0;
  const fileHint = project.src.replace('/images/', '');

  return (
    <motion.article
      className="relative shrink-0 cursor-grab active:cursor-grabbing"
      style={{ width: slideWidth }}
      animate={{
        scale: visuals.scale,
        opacity: visuals.opacity,
        y: (index - activeIndex) * 6 + visuals.y * 0.25,
        filter: `blur(${visuals.blur}px)`,
      }}
      transition={SPRING}
    >
      <div
        className={`glass-card group relative aspect-[4/3] w-full overflow-hidden ${
          isActive ? 'shadow-glow-strong ring-1 ring-white/20' : ''
        }`}
      >
        <ProjectImage
          src={project.src}
          alt={project.title}
          isActive={isActive}
          fileHint={fileHint}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {project.category}
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight sm:text-xl">
            {project.title}
          </h3>
        </div>

        {isActive && (
          <motion.div
            layoutId="activeBorder"
            className="pointer-events-none absolute inset-0 border border-white/30"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    </motion.article>
  );
}

function ChronographCounter({ current, total }) {
  return (
    <div className="flex items-center gap-3 font-mono">
      <div className="glass-panel flex items-center gap-1 rounded-sm px-4 py-3">
        <motion.span
          key={current}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="text-2xl font-light tabular-nums tracking-wider sm:text-3xl"
        >
          {padIndex(current)}
        </motion.span>
        <span className="text-lg text-white/30 sm:text-xl">/</span>
        <span className="text-lg font-light tabular-nums text-white/40 sm:text-xl">
          {padIndex(total)}
        </span>
      </div>
      <div className="hidden flex-col gap-1 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Проект</span>
        <motion.div
          className="h-px bg-white/40"
          animate={{ width: `${(current / total) * 48}px` }}
          transition={SPRING}
        />
      </div>
    </div>
  );
}

/**
 * Gallery — горизонтальный слайдер (6 проектов, пропорция 4:3).
 */
export default function Gallery() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 280, damping: 32, mass: 0.8 });

  const totalSlides = PROJECTS.length;
  const maxIndex = totalSlides - 1;

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setViewportWidth(vw);
      setSlideWidth(calcSlideWidth(vw));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const snapToIndex = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      const targetX = -clamped * (slideWidth + SLIDE_GAP);
      animate(dragX, targetX, {
        type: 'spring',
        stiffness: 280,
        damping: 32,
        mass: 0.8,
      });
      setActiveIndex(clamped);
    },
    [dragX, slideWidth, maxIndex]
  );

  const handleDrag = useCallback(
    (_, info) => {
      const currentX = -activeIndex * (slideWidth + SLIDE_GAP) + info.offset.x;
      const projected = Math.round(-currentX / (slideWidth + SLIDE_GAP));
      const clamped = Math.max(0, Math.min(projected, maxIndex));
      if (clamped !== activeIndex) {
        setActiveIndex(clamped);
      }
    },
    [activeIndex, slideWidth, maxIndex]
  );

  const handleDragEnd = useCallback(
    (_, info) => {
      setIsDragging(false);
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      let newIndex = activeIndex;

      if (Math.abs(velocity) > 400) {
        newIndex = velocity > 0 ? activeIndex - 1 : activeIndex + 1;
      } else if (offset < -slideWidth * 0.18) {
        newIndex = activeIndex + 1;
      } else if (offset > slideWidth * 0.18) {
        newIndex = activeIndex - 1;
      }

      snapToIndex(newIndex);
    },
    [activeIndex, slideWidth, snapToIndex]
  );

  useEffect(() => {
    snapToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideWidth]);

  const centerOffset = (viewportWidth - slideWidth) / 2;
  const trackWidth = totalSlides * slideWidth + (totalSlides - 1) * SLIDE_GAP;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-spacing relative overflow-hidden"
    >
      <div className="layout-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 70, damping: 20 }}
          className="mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
              02 — Работы
            </span>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Галерея
              <span className="text-white/40"> проектов</span>
            </h2>
          </div>

          <ChronographCounter current={activeIndex + 1} total={totalSlides} />
        </motion.div>

        {/* Стоимость карточки в галерее */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.15 }}
          className="glass-panel mb-10 flex flex-col gap-5 rounded-sm border border-white/[0.08] p-5 sm:mb-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6 md:p-7"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
              Стоимость работы
            </span>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            Разработка визуальных материалов для цифровых продуктов. Фокус на строгой композиции, визуальной иерархии и техническом качестве исполнения. Каждый проект адаптируется под специфику задачи — без визуального шума и избыточных элементов.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start border-t border-white/[0.08] pt-4 sm:items-end sm:border-t-0 sm:pt-0 sm:pl-6 sm:text-right md:border-l md:pl-8">
            <span className="font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-none tracking-tight text-white">
              90 ₽
            </span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              за одну карточку
            </span>
          </div>
        </motion.div>

        {/* Full-bleed slider внутри модульной сетки */}
        <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
          <div
            className="overflow-visible py-6 sm:py-8"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <motion.div
              className="flex items-center"
              style={{
                x: springX,
                paddingLeft: centerOffset,
                gap: SLIDE_GAP,
                width: trackWidth + centerOffset * 2,
              }}
              drag="x"
              dragConstraints={{
                left: -maxIndex * (slideWidth + SLIDE_GAP),
                right: 0,
              }}
              dragElastic={0.08}
              dragMomentum
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              {PROJECTS.map((project, index) => (
                <SlideCard
                  key={project.id}
                  project={project}
                  index={index}
                  activeIndex={activeIndex}
                  slideWidth={slideWidth}
                />
              ))}
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-deep to-transparent sm:w-20 md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-deep to-transparent sm:w-20 md:w-28" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-between gap-4"
        >
          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={() => snapToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-sm font-mono text-lg disabled:opacity-30 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Предыдущий проект"
            >
              ←
            </motion.button>
            <motion.button
              type="button"
              onClick={() => snapToIndex(activeIndex + 1)}
              disabled={activeIndex === maxIndex}
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-sm font-mono text-lg disabled:opacity-30 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Следующий проект"
            >
              →
            </motion.button>
          </div>

          <div className="flex gap-2">
            {PROJECTS.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => snapToIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === activeIndex ? 'w-7 bg-white' : 'w-3.5 bg-white/20'
                }`}
                whileHover={{ scaleY: 1.5, backgroundColor: 'rgba(255,255,255,0.5)' }}
                aria-label={`Проект ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </motion.div>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Drag · Swipe · 6 проектов · 4:3
        </p>
      </div>

      <span
        className="pointer-events-none absolute -left-4 top-1/3 select-none font-display text-[18vw] font-bold leading-none text-white/[0.02]"
        aria-hidden="true"
      >
        02
      </span>
    </section>
  );
}
