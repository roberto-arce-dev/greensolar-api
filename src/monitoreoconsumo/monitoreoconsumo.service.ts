import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMonitoreoConsumoDto } from './dto/create-monitoreoconsumo.dto';
import { UpdateMonitoreoConsumoDto } from './dto/update-monitoreoconsumo.dto';
import { MonitoreoConsumo, MonitoreoConsumoDocument } from './schemas/monitoreoconsumo.schema';

@Injectable()
export class MonitoreoConsumoService {
  constructor(
    @InjectModel(MonitoreoConsumo.name) private monitoreoconsumoModel: Model<MonitoreoConsumoDocument>,
  ) {}

  async create(createMonitoreoConsumoDto: CreateMonitoreoConsumoDto): Promise<MonitoreoConsumo> {
    const nuevoMonitoreoConsumo = await this.monitoreoconsumoModel.create(createMonitoreoConsumoDto);
    return nuevoMonitoreoConsumo;
  }

  async findAll(): Promise<MonitoreoConsumo[]> {
    const monitoreoconsumos = await this.monitoreoconsumoModel.find();
    return monitoreoconsumos;
  }

  async findOne(id: string | number): Promise<MonitoreoConsumo> {
    const monitoreoconsumo = await this.monitoreoconsumoModel.findById(id)
    .populate('proyecto', 'nombre capacidadKW');
    if (!monitoreoconsumo) {
      throw new NotFoundException(`MonitoreoConsumo con ID ${id} no encontrado`);
    }
    return monitoreoconsumo;
  }

  async update(id: string | number, updateMonitoreoConsumoDto: UpdateMonitoreoConsumoDto): Promise<MonitoreoConsumo> {
    const monitoreoconsumo = await this.monitoreoconsumoModel.findByIdAndUpdate(id, updateMonitoreoConsumoDto, { new: true })
    .populate('proyecto', 'nombre capacidadKW');
    if (!monitoreoconsumo) {
      throw new NotFoundException(`MonitoreoConsumo con ID ${id} no encontrado`);
    }
    return monitoreoconsumo;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.monitoreoconsumoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`MonitoreoConsumo con ID ${id} no encontrado`);
    }
  }
}
