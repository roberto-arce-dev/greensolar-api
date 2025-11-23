import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Cotizacion')
@ApiBearerAuth('JWT-auth')
@Controller('cotizacion')
export class CotizacionController {
  constructor(
    private readonly cotizacionService: CotizacionService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Cotizacion' })
  @ApiBody({ type: CreateCotizacionDto })
  @ApiResponse({ status: 201, description: 'Cotizacion creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createCotizacionDto: CreateCotizacionDto) {
    const data = await this.cotizacionService.create(createCotizacionDto);
    return {
      success: true,
      message: 'Cotizacion creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Cotizacion' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Cotizacion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Cotizacion no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.cotizacionService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { cotizacion: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Cotizacions' })
  @ApiResponse({ status: 200, description: 'Lista de Cotizacions' })
  async findAll() {
    const data = await this.cotizacionService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Cotizacion por ID' })
  @ApiParam({ name: 'id', description: 'ID del Cotizacion' })
  @ApiResponse({ status: 200, description: 'Cotizacion encontrado' })
  @ApiResponse({ status: 404, description: 'Cotizacion no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.cotizacionService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Cotizacion' })
  @ApiParam({ name: 'id', description: 'ID del Cotizacion' })
  @ApiBody({ type: UpdateCotizacionDto })
  @ApiResponse({ status: 200, description: 'Cotizacion actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cotizacion no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateCotizacionDto: UpdateCotizacionDto
  ) {
    const data = await this.cotizacionService.update(id, updateCotizacionDto);
    return {
      success: true,
      message: 'Cotizacion actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Cotizacion' })
  @ApiParam({ name: 'id', description: 'ID del Cotizacion' })
  @ApiResponse({ status: 200, description: 'Cotizacion eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cotizacion no encontrado' })
  async remove(@Param('id') id: string) {
    const cotizacion = await this.cotizacionService.findOne(id);
    if (cotizacion.imagen) {
      const filename = cotizacion.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.cotizacionService.remove(id);
    return { success: true, message: 'Cotizacion eliminado exitosamente' };
  }
}
