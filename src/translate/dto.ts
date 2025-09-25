import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { IsStringOrStringArray } from './validators';

const LANG_CODES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ru', 'zh'] as const;
type LangCode = (typeof LANG_CODES)[number];

export class TranslateDto {
  @IsDefined()
  @IsStringOrStringArray()
  q!: string | string[];

  @IsOptional()
  @IsString()
  source?: string; // pode ser 'auto'

  @IsString()
  @IsIn(LANG_CODES as readonly string[])
  target!: LangCode;

  @IsOptional()
  @IsIn(['text', 'html'])
  format?: 'text' | 'html';
}
