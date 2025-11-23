import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CotizacionDocument = Cotizacion & Document;

@Schema({ timestamps: true })
export class Cotizacion {
  @Prop({ type: Types.ObjectId, ref: 'ProyectoSolar', required: true })
  proyecto: Types.ObjectId;

  @Prop({ min: 0 })
  costoEquipo: number;

  @Prop({ min: 0 })
  costoInstalacion: number;

  @Prop({ min: 0 })
  total: number;

  @Prop({ required: true })
  vigenciaHasta: Date;

  @Prop({ enum: ['pendiente', 'aprobada', 'rechazada'], default: 'pendiente' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const CotizacionSchema = SchemaFactory.createForClass(Cotizacion);

CotizacionSchema.index({ proyecto: 1 });
CotizacionSchema.index({ estado: 1 });
