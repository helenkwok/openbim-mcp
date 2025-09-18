export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const safeRegExp = (pattern: string) => {
  try {
    return new RegExp(escapeRegExp(pattern));
  } catch {
    // Intentionally return a regex that matches nothing as a safe fallback
    return /$^/;
  }
};