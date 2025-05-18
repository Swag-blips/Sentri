import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import { createOwnerDto, LoginDto } from './dto/owner.dto';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('owner')
export class OwnerController {
  private readonly logger = new Logger();
  constructor(private ownerService: OwnerService) {}

  @Post('signup')
  async ownerSignup(@Body() dto: createOwnerDto) {
    const signup = this.ownerService.createOwnerAccount(dto);

    return signup;
  }

  @Post('login')
  async ownerLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const login = await this.ownerService.loginOwnerAccount(dto);
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const expires = new Date(new Date().valueOf() + sevenDays);
    const { refreshToken, accessToken } = login;
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      expires,
      secure: true,
    });

    return { success: true, message: 'Login successful', accessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Get('tenants')
  async getTenants(@Req() req: Request) {
    const tenants = await this.ownerService.getTenants(req.user!['sub']);
    return tenants;
  }
}
