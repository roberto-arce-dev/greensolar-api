import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProyectoSolarDto } from './dto/create-proyectosolar.dto';
import { UpdateProyectoSolarDto } from './dto/update-proyectosolar.dto';
import { ProyectoSolar, ProyectoSolarDocument } from './schemas/proyectosolar.schema';

@Injectable()
export class ProyectoSolarService {
  constructor(
    @InjectModel(ProyectoSolar.name) private proyectosolarModel: Model<ProyectoSolarDocument>,
  ) {}

  async create(createProyectoSolarDto: CreateProyectoSolarDto): Promise<ProyectoSolar> {
    const nuevoProyectoSolar = await this.proyectosolarModel.create(createProyectoSolarDto);
    return nuevoProyectoSolar;
  }

  async findAll(): Promise<ProyectoSolar[]> {
    const proyectosolars = await this.proyectosolarModel.find();
    return proyectosolars;
  }

  async findOne(id: string | number): Promise<ProyectoSolar> {
    const proyectosolar = await this.proyectosolarModel.findById(id)
    .populate('cliente', 'nombre email telefono')
    .populate('instalador', 'nombre certificaciones telefono');
    if (!proyectosolar) {
      throw new NotFoundException(`ProyectoSolar con ID ${id} no encontrado`);
    }
    return proyectosolar;
  }

  async update(id: string | number, updateProyectoSolarDto: UpdateProyectoSolarDto): Promise<ProyectoSolar> {
    const proyectosolar = await this.proyectosolarModel.findByIdAndUpdate(id, updateProyectoSolarDto, { new: true })
    .populate('cliente', 'nombre email telefono')
    .populate('instalador', 'nombre certificaciones telefono');
    if (!proyectosolar) {
      throw new NotFoundException(`ProyectoSolar con ID ${id} no encontrado`);
    }
    return proyectosolar;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.proyectosolarModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`ProyectoSolar con ID ${id} no encontrado`);
    }
  }
}
