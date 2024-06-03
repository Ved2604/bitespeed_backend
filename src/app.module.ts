import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentifyModule } from './identify/identify.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [IdentifyModule,DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
