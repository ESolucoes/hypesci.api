function req(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const PORT = parseInt(req('PORT', '3000'), 10);
export const DEFAULT_SOURCE = req('DEFAULT_SOURCE', 'auto'); // vamos detectar quando vier 'auto'
export const DEFAULT_TARGET = req('DEFAULT_TARGET', 'pt');
export const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || ''; // opcional (aumenta limites)
export const MYMEMORY_BASE = 'https://api.mymemory.translated.net';
