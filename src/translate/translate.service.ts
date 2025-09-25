import { Injectable, BadRequestException } from '@nestjs/common';
import { TranslateDto } from './dto';
import { DEFAULT_SOURCE, DEFAULT_TARGET, MYMEMORY_BASE, MYMEMORY_EMAIL } from '../config';

// Mapeia ISO-639-3 (franc) -> ISO-639-1 (MyMemory)
const ISO3_TO_1: Record<string, string> = {
  eng: 'en',
  por: 'pt',
  spa: 'es',
  fra: 'fr', // ou 'fre'
  deu: 'de', // alemão
  ita: 'it',
  rus: 'ru',
  zho: 'zh', // chinês
  cmn: 'zh', // mandarim (às vezes o franc retorna 'cmn')
  // adicione mais se precisar
};

// detecta idioma com franc (local, grátis)
async function detectLangISO1(text: string): Promise<string> {
  const { franc } = await import('franc');
  const iso3 = franc(text || '', { minLength: 3 }); // retorna 'und' se não souber
  if (!iso3 || iso3 === 'und') return 'en';
  return ISO3_TO_1[iso3] || 'en';
}

// Chamada ao MyMemory
async function callMyMemory(q: string, source: string, target: string) {
  const url = new URL(`${MYMEMORY_BASE}/get`);
  url.searchParams.set('q', q);
  url.searchParams.set('langpair', `${source}|${target}`); // ex.: en|pt
  if (MYMEMORY_EMAIL) url.searchParams.set('de', MYMEMORY_EMAIL); // opcional
  const r = await fetch(url.toString(), { method: 'GET' });
  const txt = await r.text();
  let data: any;
  try { data = JSON.parse(txt); } catch { throw new Error(txt || `HTTP ${r.status}`); }
  if (data?.responseStatus && data.responseStatus !== 200) {
    throw new Error(data?.responseDetails || `MyMemory error ${data.responseStatus}`);
  }
  // normaliza
  const t = data?.responseData?.translatedText;
  if (typeof t === 'string') return t;
  const match0 = data?.matches?.[0]?.translation;
  return typeof match0 === 'string' ? match0 : '';
}

@Injectable()
export class TranslateService {
  async translate(dto: TranslateDto) {
    const target = (dto.target?.trim() || DEFAULT_TARGET);
    const wantedSource = (dto.source?.trim() || DEFAULT_SOURCE); // pode vir 'auto'
    const format = dto.format || 'text';

    const prepare = (val: string) => (format === 'html' ? val : val);

    try {
      if (Array.isArray(dto.q)) {
        // detecta por item (melhor qualidade)
        const outs = await Promise.all(
          dto.q.map(async (text) => {
            const src =
              wantedSource.toLowerCase() === 'auto'
                ? await detectLangISO1(text)
                : wantedSource.toLowerCase();
            const out = await callMyMemory(prepare(text), src, target);
            return { translatedText: out || text };
          }),
        );
        return outs;
      } else {
        const src =
          wantedSource.toLowerCase() === 'auto'
            ? await detectLangISO1(dto.q)
            : wantedSource.toLowerCase();
        const out = await callMyMemory(prepare(dto.q), src, target);
        return { translatedText: out || dto.q };
      }
    } catch (e: any) {
      throw new BadRequestException(e?.message || 'Translate failed');
    }
  }

  async languages() {
    // MyMemory não expõe /languages; retornamos a lista que seu front usa
    return [
      { code: 'en', name: 'English' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
    ];
  }
}
