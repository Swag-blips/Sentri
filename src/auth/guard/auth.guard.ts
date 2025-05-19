import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from 'src/owner/schema/tenant.schema';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@InjectModel('Tenant') private tenantModel: Model<Tenant>) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is a missing');
    }

    const tenant = await this.getTenantAccount(apiKey);
    if (!tenant) {
      throw new NotFoundException('Tenant does not exist');
    }

    request.tenantId = tenant.tenantId;
    request.apiKey = apiKey;

    return true;
  }

  async getTenantAccount(apiKey: string) {
    const tenantAccount = await this.tenantModel.findOne({
      apiKey,
    });

    return tenantAccount;
  }
}
