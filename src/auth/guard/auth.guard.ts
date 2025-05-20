import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from 'src/owner/schema/tenant.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel('Tenant') private tenantModel: Model<Tenant>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization'].split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is a missing');
    }

    try {
      const jwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_USER_ACCESS_SECRET,
      });
      request.userId = jwtPayload.sub
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }

    return true;
  }

  async getTenantAccount(apiKey: string) {
    const tenantAccount = await this.tenantModel.findOne({
      apiKey,
    });

    return tenantAccount;
  }
}
