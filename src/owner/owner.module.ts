import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ownerSchema } from 'src/owner/schema/owner.schema';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { tenantSchema } from 'src/owner/schema/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Owner', schema: ownerSchema }]),
    MongooseModule.forFeature([{ name: 'Tenant', schema: tenantSchema }]),
    JwtModule.register({}),
  ],
  controllers: [OwnerController],
  providers: [OwnerService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class OwnerModule {}
