import { IsString } from 'class-validator';

export class createTenantDto {
  @IsString()
  name: string;
}
