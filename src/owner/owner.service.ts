import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Owner } from './schema/owner.schema';
import { Model } from 'mongoose';
import { createOwnerDto, LoginDto } from './dto/owner.dto';
import * as argon2 from 'argon2';

@Injectable()
export class OwnerService {
  private readonly logger = new Logger();
  constructor(@InjectModel(Owner.name) private ownerModel: Model<Owner>) {}

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
      throw new UnauthorizedException('invalid xredentials');
    }

    
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
