import React, { useState, useEffect } from 'react';

export interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  speed = 100,
  pauseDuration = 2000,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = texts[index];
    let delay: number;

    // Bepaal delay: typen/wissen = speed, pauze = pauseDuration
    if (!isDeleting && subIndex === fullText.length) {
      delay = pauseDuration;
    } else if (isDeleting && subIndex === 0) {
      delay = speed;
    } else {
      delay = isDeleting ? speed / 2 : speed;
    }

    const timer = setTimeout(() => {
      // Als we aan het einde zijn en nog niet wissen, start wissen
      if (!isDeleting && subIndex === fullText.length) {
        setIsDeleting(true);
      }
      // Als we wissen en bij 0, ga naar volgend woord
      else if (isDeleting && subIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
      // Anders verhoog of verlaag subIndex
      else {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [subIndex, isDeleting, index, texts, speed, pauseDuration]);

  const cursorStyle: React.CSSProperties = {
    display: 'inline-block',
    animation: 'blink 1s steps(2, start) infinite',
  };

  return (
    <span className={className}>
      {texts[index].slice(0, subIndex)}
      <span style={cursorStyle}>_</span>
      <style jsx>{`
        @keyframes blink {
          0%, 50% { visibility: visible; }
          51%, 100% { visibility: hidden; }
        }
      `}</style>
    </span>
  );
};
