import { Body, Controller, Get, Post } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateDto } from './dto';

@Controller()
export class TranslateController {
  constructor(private readonly svc: TranslateService) {}

  @Get('languages')
  languages() {
    return this.svc.languages();
  }

  @Post('translate')
  translate(@Body() dto: TranslateDto) {
    return this.svc.translate(dto);
  }
}
