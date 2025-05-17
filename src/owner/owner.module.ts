import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ownerSchema } from 'src/owner/schema/owner.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Owner', schema: ownerSchema }]),
    JwtModule.register({
      secret: process.env.OWNER_SECRET_KEY,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
