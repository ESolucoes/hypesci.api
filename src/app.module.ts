import { Module } from '@nestjs/common';
import { TranslateModule } from './translate/translate.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TranslateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
