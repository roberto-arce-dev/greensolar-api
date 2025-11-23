import { PartialType } from '@nestjs/swagger';
import { CreateMonitoreoConsumoDto } from './create-monitoreoconsumo.dto';

export class UpdateMonitoreoConsumoDto extends PartialType(CreateMonitoreoConsumoDto) {}
