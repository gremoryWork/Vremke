import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import BackgroundAmbient from './components/BackgroundAmbient';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Bonus from './components/Bonus';
import Footer from './components/Footer';

/**
 * App — корневой контейнер одностраничного портфолио.
 * Фоновая анимация (mesh + частицы) на z-index: -1.
 */
export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.lang = 'ru';
  }, []);

  return (
    <div className="relative min-h-screen bg-deep">
      {/* Живой фон: плавающие шарики (24/7) */}
      <BackgroundAmbient />

      {/* Глобальный индикатор прогресса */}
      <motion.div
        className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-gradient-to-r from-white/20 via-white to-white/20"
        style={{ scaleX }}
      />

      {/* Модульная сетка — едва заметная (поверх шариков) */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <main className="relative z-10">
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Gallery />
        <Divider />
        <Bonus />
        <Footer />
      </main>
    </div>
  );
}

/** Разделитель по модульной сетке */
function Divider() {
  return <div className="layout-container"><div className="hairline" /></div>;
}
