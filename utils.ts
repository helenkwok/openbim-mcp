export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const safeRegExp = (pattern: string) => {
  try {
    return new RegExp(escapeRegExp(pattern));
  } catch {
    return /$^/;
  }
};