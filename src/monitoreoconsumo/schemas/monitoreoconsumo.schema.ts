import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonitoreoConsumoDocument = MonitoreoConsumo & Document;

@Schema({ timestamps: true })
export class MonitoreoConsumo {
  @Prop({ type: Types.ObjectId, ref: 'ProyectoSolar', required: true })
  proyecto: Types.ObjectId;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop({ default: 0, min: 0 })
  generacionKWh?: number;

  @Prop({ default: 0, min: 0 })
  consumoKWh?: number;

  @Prop({ default: 0 })
  ahorro?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const MonitoreoConsumoSchema = SchemaFactory.createForClass(MonitoreoConsumo);

MonitoreoConsumoSchema.index({ proyecto: 1, fecha: -1 });
