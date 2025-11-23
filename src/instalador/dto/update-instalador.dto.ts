import { PartialType } from '@nestjs/swagger';
import { CreateInstaladorDto } from './create-instalador.dto';

export class UpdateInstaladorDto extends PartialType(CreateInstaladorDto) {}
