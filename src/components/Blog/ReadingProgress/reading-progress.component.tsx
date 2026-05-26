import React from 'react';

export const ReadingProgress: React.FC = React.memo(() => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = totalHeight <= 0 ? 0 : Math.min(1, scrollTop / totalHeight);
      setProgress(nextProgress);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden>
      <div className="reading-progress-bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
});
