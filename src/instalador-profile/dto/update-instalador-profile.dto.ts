import { PartialType } from '@nestjs/swagger';
import { CreateInstaladorProfileDto } from './create-instalador-profile.dto';

export class UpdateInstaladorProfileDto extends PartialType(CreateInstaladorProfileDto) {}
