export class ProyectoSolar {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProyectoSolar>) {
    Object.assign(this, partial);
  }
}
