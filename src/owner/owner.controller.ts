import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { createOwnerDto, LoginDto } from './dto/owner.dto';
import { Response } from 'express';

@Controller('owner')
export class OwnerController {
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
      secure:true
    });

    return { success: true, message: 'Login successful', accessToken };
  }

  @Get("tenants")
  async getTenants(){
    
  }
}
