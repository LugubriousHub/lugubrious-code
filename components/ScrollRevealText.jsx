'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function normalizeWord(value) {
  return value.toLowerCase().replace(/[^a-zA-ZÀ-ÿ]/g, '');
}

function RevealWord({ word, index, total, progress, isGradient }) {
  const start = index / total;
  const end = Math.min(start + 0.18, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span
      className={`mr-2 inline-block md:mr-3 ${
        isGradient ? 'bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' : 'text-white'
      }`}
      style={{ opacity }}
    >
      {word}
    </motion.span>
  );
}

export default function ScrollRevealText({ text, highlightWord }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'center center']
  });

  const words = text.split(' ');
  const normalizedHighlight = normalizeWord(highlightWord);

  return (
    <section ref={containerRef} className="relative mx-auto flex max-w-5xl items-center justify-center py-24">
      <p className="text-4xl font-semibold leading-tight md:text-6xl">
        {words.map((word, index) => {
          const normalized = normalizeWord(word);
          const nextNormalized = normalizeWord(words[index + 1] || '');
          const isGradient =
            normalized === normalizedHighlight ||
            ((normalized === 'le' || normalized === 'the') && nextNormalized === normalizedHighlight);

          return (
            <RevealWord
              key={`${word}-${index}`}
              word={word}
              index={index}
              total={words.length}
              progress={scrollYProgress}
              isGradient={isGradient}
            />
          );
        })}
      </p>
    </section>
  );
}
