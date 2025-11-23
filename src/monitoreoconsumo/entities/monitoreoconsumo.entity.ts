export class MonitoreoConsumo {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MonitoreoConsumo>) {
    Object.assign(this, partial);
  }
}
