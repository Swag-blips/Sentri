import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
    index: true,
  })
  ownerId: mongoose.Types.ObjectId;

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({
    required: true,
    index: true,
  })
  apiKey: string;
}

export const tenantSchema = SchemaFactory.createForClass(Tenant);
