import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/auth.schema';
import { tenantSchema } from 'src/owner/schema/tenant.schema';
import { ApiKeyGuard } from './guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'Tenant', schema: tenantSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyGuard], 
})
export class AuthModule {}
