import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Owner {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, min: 6 })
  password: string;

  @Prop({ required: true })
  orgName: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tenants',
    default: [],
  })
  tenants: Array<mongoose.Types.ObjectId>;

  @Prop({ required: true, default: 'Owner' })
  role: string;
}


export const ownerSchema = SchemaFactory.createForClass(Owner);
