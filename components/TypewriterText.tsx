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
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex(i => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, pauseDuration]);

  const cursorStyle: React.CSSProperties = {
    display: 'inline-block',
    animation: 'blink 1s steps(2, start) infinite',
  };

  return (
    <span className={className}>
      {displayedText}
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
