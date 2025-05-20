import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schema/auth.schema';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signup(dto: AuthDto, tenantId: string) {
    const user = await this.getTenantUser(tenantId, dto.email);

    if (user) {
      throw new BadRequestException('user already exists');
    }
    const hashedPassword = await argon2.hash(dto.password);

    const newUser = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      tenantId,
    });

    return {
      success: true,
      message: 'User created successfully',
      data: newUser._id,
    };
  }

  async login(dto: AuthDto, tenantId: string) {
    const user = await this.getTenantUser(tenantId, dto.email);
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    const passwordMatch = await argon2.verify(user.password, dto.password);

    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user._id);

    return { accessToken, refreshToken };
  }

  async getMe(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    if (userId.toString() !== user._id.toString()) {
      throw new BadRequestException('user does not exist');
    }

    return { success: true, data: user };
  }

  async refreshToken(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user._id },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    return { accessToken };
  }

  private async getTenantUser(tenantId: string, email: string) {
    const user = await this.userModel.findOne({
      tenantId,
      email,
    });

    return user;
  }

  async generateTokens(userId: mongoose.Types.ObjectId) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.JWT_USER_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.JWT_USER_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
