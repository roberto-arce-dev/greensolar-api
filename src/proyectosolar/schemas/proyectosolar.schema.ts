import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProyectoSolarDocument = ProyectoSolar & Document;

@Schema({ timestamps: true })
export class ProyectoSolar {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  cliente: Types.ObjectId;

  @Prop({ required: true })
  direccion: string;

  @Prop({ min: 0 })
  capacidadKW: number;

  @Prop({ enum: ['cotizacion', 'aprobado', 'instalacion', 'completado', 'cancelado'], default: 'cotizacion' })
  estado?: string;

  @Prop({ type: Types.ObjectId, ref: 'Instalador' })
  instalador: Types.ObjectId;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProyectoSolarSchema = SchemaFactory.createForClass(ProyectoSolar);

ProyectoSolarSchema.index({ cliente: 1 });
ProyectoSolarSchema.index({ instalador: 1 });
ProyectoSolarSchema.index({ estado: 1 });
