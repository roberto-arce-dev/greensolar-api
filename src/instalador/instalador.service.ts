import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInstaladorDto } from './dto/create-instalador.dto';
import { UpdateInstaladorDto } from './dto/update-instalador.dto';
import { Instalador, InstaladorDocument } from './schemas/instalador.schema';

@Injectable()
export class InstaladorService {
  constructor(
    @InjectModel(Instalador.name) private instaladorModel: Model<InstaladorDocument>,
  ) {}

  async create(createInstaladorDto: CreateInstaladorDto): Promise<Instalador> {
    const nuevoInstalador = await this.instaladorModel.create(createInstaladorDto);
    return nuevoInstalador;
  }

  async findAll(): Promise<Instalador[]> {
    const instaladors = await this.instaladorModel.find();
    return instaladors;
  }

  async findOne(id: string | number): Promise<Instalador> {
    const instalador = await this.instaladorModel.findById(id);
    if (!instalador) {
      throw new NotFoundException(`Instalador con ID ${id} no encontrado`);
    }
    return instalador;
  }

  async update(id: string | number, updateInstaladorDto: UpdateInstaladorDto): Promise<Instalador> {
    const instalador = await this.instaladorModel.findByIdAndUpdate(id, updateInstaladorDto, { new: true });
    if (!instalador) {
      throw new NotFoundException(`Instalador con ID ${id} no encontrado`);
    }
    return instalador;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.instaladorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Instalador con ID ${id} no encontrado`);
    }
  }
}
