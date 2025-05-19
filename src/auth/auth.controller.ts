import { Body, Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userSignupDto } from './dto/auth.dto';
import { ApiKeyGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signup')
  @UseGuards(ApiKeyGuard)
  async signup(@Body() dto: userSignupDto, @Request() req) {
    console.log("Request tenant Id and apiKey", req.tenantId, req.apiKey )
  }
}
