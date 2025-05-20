import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiKeyGuard } from './guard/apiKey.guard';
import { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseGuards(ApiKeyGuard)
  async signup(@Body() dto: AuthDto, @Request() req) {
    const user = await this.authService.signup(dto, req.tenantId);

    return user;
  }

  @Post('login')
  @UseGuards(ApiKeyGuard)
  async login(
    @Body() dto: AuthDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto, req.tenantId);

    const { accessToken, refreshToken } = user;
    const tenDays = 1000 * 60 * 60 * 24 * 10;
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(new Date().valueOf() + tenDays),
      secure: true,
    });
    return { success: true, message: 'Login successful', accessToken };
  }

  @Post('logout')
  @UseGuards(ApiKeyGuard)
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh-token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return { success: true, message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req) {
    const user = await this.authService.getMe(req.userId);

    return user;
  }

  @Post('refresh')
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      return { success: false, message: 'Refresh token is missing' };
    }
    const user = await this.authService.refreshToken(refreshToken);

    return {
      success: true,
      message: 'Refresh token successful',
      token: user.accessToken,
    };
  }
}
