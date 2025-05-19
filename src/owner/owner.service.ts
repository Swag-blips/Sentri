import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Owner } from './schema/owner.schema';
import mongoose, { Model } from 'mongoose';
import { createOwnerDto, LoginDto } from './dto/owner.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/owner/schema/tenant.schema';
import { v4 as uuidv4 } from 'uuid';
import { createTenantDto } from 'src/owner/dto/tenant.dto';

@Injectable()
export class OwnerService {
  private readonly logger = new Logger();
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    private jwtService: JwtService,
  ) {}

  async createOwnerAccount(ownerDto: createOwnerDto) {
    const { email, password, orgName } = ownerDto;
    const exisitingOwner = await this.getOwner(email);

    if (exisitingOwner) {
      throw new UnauthorizedException('owner already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const owner = await this.ownerModel.create({
      email,
      password: hashedPassword,
      orgName,
    });

    return {
      success: true,
      message: 'owner account successfully created',
      data: {
        email,
        orgName,
        id: owner._id,
      },
    };
  }

  async loginOwnerAccount(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const ownerAccount = await this.getOwner(email);

    if (!ownerAccount) {
      throw new NotFoundException('Owner account not found');
    }

    const verifyPassword = await argon2.verify(ownerAccount.password, password);

    if (!verifyPassword) {
      throw new UnauthorizedException('invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      ownerAccount._id,
      ownerAccount.orgName,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async getTenants(ownerId: mongoose.Types.ObjectId) {
    const tenants = await this.tenantModel.find({
      ownerId: ownerId,
    });

    if (!tenants) {
      return { success: true, tenants: [] };
    }

    return { success: true, data: tenants };
  }

  async createTenant(ownerId: mongoose.Types.ObjectId, dto: createTenantDto) {
    const { name } = dto;
    const existingTenant = await this.getOwnerTenant(ownerId, name);
    const owner = await this.ownerModel.findById(ownerId);

    if (!owner) {
      throw new NotFoundException('Owner does not exist');
    }

    if (existingTenant) {
      throw new BadRequestException('Tenant already exists in your account');
    }

    const apiKey = uuidv4();
    const tenantId = uuidv4();

    const tenant = await this.tenantModel.create({
      name,
      apiKey,
      tenantId,
      ownerId,
    });

    owner?.tenants.push(tenant._id);

    await owner?.save();

    return {
      success: true,
      message: 'Tenant successfully created',
      data: {
        name,
        id: tenant._id,
      },
    };
  }

  async getTenantById(
    ownerId: mongoose.Types.ObjectId,
    tenantId: mongoose.Types.ObjectId,
  ) {
    const tenant = await this.tenantModel.findById(tenantId);

    if (!tenant) {
      throw new NotFoundException('tenant not found');
    }

    if (ownerId.toString() !== tenant.ownerId.toString()) {
      throw new UnauthorizedException('Cannot access this data');
    }

    return { success: true, data: tenant };
  }

  async generateTokens(userId: mongoose.Types.ObjectId, orgName: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          orgName: orgName,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          orgName,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async getOwnerTenant(ownerId: mongoose.Types.ObjectId, name: string) {
    const tenant = await this.tenantModel.findOne({
      ownerId: ownerId,
      name: name,
    });

    return tenant;
  }
  private getOwner(email: string) {
    const owner = this.ownerModel.findOne({
      email,
    });

    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    return owner;
  }
}
