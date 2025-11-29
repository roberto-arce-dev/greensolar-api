import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { Cotizacion, CotizacionDocument } from './schemas/cotizacion.schema';

@Injectable()
export class CotizacionService {
  constructor(
    @InjectModel(Cotizacion.name) private cotizacionModel: Model<CotizacionDocument>,
  ) {}

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const nuevoCotizacion = await this.cotizacionModel.create(createCotizacionDto);
    return nuevoCotizacion;
  }

  async findAll(): Promise<Cotizacion[]> {
    const cotizacions = await this.cotizacionModel.find();
    return cotizacions;
  }

  async findOne(id: string | number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionModel.findById(id)
    .populate('proyecto', 'nombre capacidadKW');
    if (!cotizacion) {
      throw new NotFoundException(`Cotizacion con ID ${id} no encontrado`);
    }
    return cotizacion;
  }

  async update(id: string | number, updateCotizacionDto: UpdateCotizacionDto): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionModel.findByIdAndUpdate(id, updateCotizacionDto, { new: true })
    .populate('proyecto', 'nombre capacidadKW');
    if (!cotizacion) {
      throw new NotFoundException(`Cotizacion con ID ${id} no encontrado`);
    }
    return cotizacion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.cotizacionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Cotizacion con ID ${id} no encontrado`);
    }
  }
  async findByCliente(clienteId: string): Promise<Cotizacion[]> {
    const result = await this.cotizacionModel.find({ cliente: clienteId });
    return result;
  }
  async crear(dto: any): Promise<Cotizacion> {
    const nuevo = await this.cotizacionModel.create(dto);
    return nuevo;
  }


}
