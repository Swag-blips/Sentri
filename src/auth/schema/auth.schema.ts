import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    ref: 'Tenant',
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  })
  tenantId: string;

  @Prop({ default: 'user' })
  role: string;
}

export const userSchema = SchemaFactory.createForClass(User);
