import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
