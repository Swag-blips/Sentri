import { Module } from '@nestjs/common';
import { OwnerModule } from './owner/owner.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    OwnerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
