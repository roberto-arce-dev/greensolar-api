import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstaladorProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreCompleto: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  certificaciones?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  especialidad?: string;

}
