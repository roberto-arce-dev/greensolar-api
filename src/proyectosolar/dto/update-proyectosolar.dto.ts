import { PartialType } from '@nestjs/swagger';
import { CreateProyectoSolarDto } from './create-proyectosolar.dto';

export class UpdateProyectoSolarDto extends PartialType(CreateProyectoSolarDto) {}
