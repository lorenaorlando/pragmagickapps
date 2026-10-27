// Counts what people do in the app (readings, stickers, coin flips) so the "read my story"
// nudge shows up only after someone has played a while, and never once they've read it.

const COUNT_KEY = 'pragmagick_interactions_v1';
const SEEN_KEY = 'pragmagick_story_seen_v1';
// The nudge appears after the 3rd, 10th and 20th interaction, and no more
const SHOW_AT = [3, 10, 20];

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

let count = Number(read(COUNT_KEY)) || 0;
const listeners = new Set<() => void>();

export const noteInteraction = () => {
  count += 1;
  write(COUNT_KEY, String(count));
  if (SHOW_AT.includes(count) && !read(SEEN_KEY)) listeners.forEach((fn) => fn());
};

export const markStorySeen = () => write(SEEN_KEY, '1');

export const onStoryNudge = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
