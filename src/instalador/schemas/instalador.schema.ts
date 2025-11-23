import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstaladorDocument = Instalador & Document;

@Schema({ timestamps: true })
export class Instalador {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: any;

  @Prop()
  telefono?: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const InstaladorSchema = SchemaFactory.createForClass(Instalador);

InstaladorSchema.index({ email: 1 });
