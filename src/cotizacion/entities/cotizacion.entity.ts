export class Cotizacion {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Cotizacion>) {
    Object.assign(this, partial);
  }
}
