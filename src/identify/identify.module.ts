import { Module } from '@nestjs/common';
import { IdentifyService } from './identify.service';
import { IdentifyController } from './identify.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({ 
  imports:[DatabaseModule],
  controllers: [IdentifyController],
  providers: [IdentifyService],
})
export class IdentifyModule {}
