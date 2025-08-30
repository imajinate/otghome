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
    // Bepalen wat de volgende actie is en hoe lang wachten
    let delay = speed;
    const fullText = texts[index];

    if (!isDeleting && subIndex === fullText.length) {
      // Volledig getypt → pauze
      delay = pauseDuration;
      setIsDeleting(true);
    } else if (isDeleting && subIndex === 0) {
      // Wissen afgerond → volgende woord
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      delay = speed;
    }

    const timer = setTimeout(() => {
      // Type of delete één karakter
      setSubIndex((prev) =>
        isDeleting ? prev - 1 : prev + 1
      );
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
