import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ownerSchema } from 'src/schema/owner.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: "Owner", schema: ownerSchema}])],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
