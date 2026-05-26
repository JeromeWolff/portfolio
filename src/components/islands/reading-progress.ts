export function initializeReadingProgress(root: HTMLElement): void {
  if (root.dataset.enhanced === 'true') {
    return;
  }

  const bar = root.querySelector<HTMLElement>('[data-reading-progress-bar]');

  if (!bar) {
    return;
  }

  root.dataset.enhanced = 'true';

  let ticking = false;

  const update = (): void => {
    const scrollTop = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight <= 0 ? 0 : Math.min(1, scrollTop / totalHeight);

    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };

  const scheduleUpdate = (): void => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
}
