import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type InstaladorProfileDocument = InstaladorProfile & Document;

/**
 * InstaladorProfile - Profile de negocio para rol INSTALADOR
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class InstaladorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreCompleto: string;

  @Prop()
  telefono?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: string[];

  @Prop()
  especialidad?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const InstaladorProfileSchema = SchemaFactory.createForClass(InstaladorProfile);

// Indexes para optimizar queries
InstaladorProfileSchema.index({ user: 1 });
