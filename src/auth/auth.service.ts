import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/auth.schema';

import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async signup(email: string, password: string, tenantId: string) {
    const user = await this.getTenantUser(tenantId, email);

    if (user) {
      throw new BadRequestException('user already exists');
    }
    const hashedPassword = await argon2.hash(password);

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      tenantId,
    });

    return {
      success: true,
      message: 'User created successfully',
      data: newUser._id,
    };
  }

  private async getTenantUser(tenantId: string, email: string) {
    const user = await this.userModel.findOne({
      tenantId,
      email,
    });

    return user;
  }

  
}
