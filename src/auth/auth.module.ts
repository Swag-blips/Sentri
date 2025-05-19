import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/auth.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
