import { Module } from '@nestjs/common';
import { IdentifyService } from './identify.service';
import { IdentifyController } from './identify.controller';

@Module({
  controllers: [IdentifyController],
  providers: [IdentifyService],
})
export class IdentifyModule {}
