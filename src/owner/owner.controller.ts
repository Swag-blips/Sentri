import { Body, Controller, Post } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { createOwnerDto, LoginDto } from './dto/owner.dto';

@Controller('owner')
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Post('signup')
  async ownerSignup(@Body() dto: createOwnerDto) {
    const signup = this.ownerService.createOwnerAccount(dto);

    return signup;
  }

  @Post('login')
  async ownerLogin(@Body() dto: LoginDto) {}
}
