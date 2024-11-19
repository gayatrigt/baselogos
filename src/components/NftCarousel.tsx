'use client';

import { AnimatePresence,motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import ShareNft from '@/components/share/ShareNft';

import { BaseLogoToken } from '@/app/congrats/page';

interface CarouselProps {
  ids: string[];
  tokens: BaseLogoToken[];
}

const NftCarousel = ({ ids, tokens }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = tokens.length - 1;

  const next = () => setCurrentIndex(current => current === maxIndex ? 0 : current + 1);
  const prev = () => setCurrentIndex(current => current === 0 ? maxIndex : current - 1);

  const getVisibleIndexes = () => {
    const indexes = [currentIndex];
    if (tokens.length > 1) {
      indexes.unshift(currentIndex === 0 ? maxIndex : currentIndex - 1);
      indexes.push(currentIndex === maxIndex ? 0 : currentIndex + 1);
    }
    return indexes;
  };

  return (
    <div className="relative w-full max-w-4xl h-96 flex items-center justify-center">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={prev}
        className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          {getVisibleIndexes().map((index, i) => (
            <motion.div
              key={ids[index]}
              initial={{ 
                scale: 0.8,
                x: i === 0 ? -300 : i === 1 ? 0 : 300,
                opacity: i === 1 ? 1 : 0.5 
              }}
              animate={{ 
                scale: i === 1 ? 1 : 0.8,
                x: i === 0 ? -300 : i === 1 ? 0 : 300,
                opacity: i === 1 ? 1 : 0.5,
                zIndex: i === 1 ? 20 : 10
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute"
            >
              <ShareNft token={tokens[index]} tokenId={ids[index]} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={next}
        className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white"
      >
        <ChevronRight size={24} />
      </motion.button>
    </div>
  );
};

export default NftCarousel;