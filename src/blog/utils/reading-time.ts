const WORDS_PER_MINUTE = 220;

export interface ReadingTime {
  words: number;
  minutes: number;
  text: string;
}

export function stripMarkdownForText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateReadingTime(markdown: string): ReadingTime {
  const text = stripMarkdownForText(markdown);
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return {
    words,
    minutes,
    text: `${minutes} min read`,
  };
}
