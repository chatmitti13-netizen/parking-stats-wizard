const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadCollection = <T>(key: string, fallback: T): T => {
  const stored = parseJson<T>(localStorage.getItem(key), fallback);
  if (stored === fallback) {
    localStorage.setItem(key, JSON.stringify(fallback));
  }
  return stored;
};

export const saveCollection = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};
