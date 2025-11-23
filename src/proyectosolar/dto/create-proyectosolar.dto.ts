import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProyectoSolarDto {
  @ApiProperty({
    example: 'Nombre del ProyectoSolar',
    description: 'Nombre del ProyectoSolar',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Descripción del ProyectoSolar',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
