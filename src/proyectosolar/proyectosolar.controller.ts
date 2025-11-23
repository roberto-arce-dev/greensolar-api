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
import { ProyectoSolarService } from './proyectosolar.service';
import { CreateProyectoSolarDto } from './dto/create-proyectosolar.dto';
import { UpdateProyectoSolarDto } from './dto/update-proyectosolar.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('ProyectoSolar')
@ApiBearerAuth('JWT-auth')
@Controller('proyecto-solar')
export class ProyectoSolarController {
  constructor(
    private readonly proyectosolarService: ProyectoSolarService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo ProyectoSolar' })
  @ApiBody({ type: CreateProyectoSolarDto })
  @ApiResponse({ status: 201, description: 'ProyectoSolar creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createProyectoSolarDto: CreateProyectoSolarDto) {
    const data = await this.proyectosolarService.create(createProyectoSolarDto);
    return {
      success: true,
      message: 'ProyectoSolar creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Proyectosolar' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Proyectosolar' })
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
  @ApiResponse({ status: 404, description: 'Proyectosolar no encontrado' })
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
    const updated = await this.proyectosolarService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { proyectosolar: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los ProyectoSolars' })
  @ApiResponse({ status: 200, description: 'Lista de ProyectoSolars' })
  async findAll() {
    const data = await this.proyectosolarService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ProyectoSolar por ID' })
  @ApiParam({ name: 'id', description: 'ID del ProyectoSolar' })
  @ApiResponse({ status: 200, description: 'ProyectoSolar encontrado' })
  @ApiResponse({ status: 404, description: 'ProyectoSolar no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.proyectosolarService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ProyectoSolar' })
  @ApiParam({ name: 'id', description: 'ID del ProyectoSolar' })
  @ApiBody({ type: UpdateProyectoSolarDto })
  @ApiResponse({ status: 200, description: 'ProyectoSolar actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'ProyectoSolar no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateProyectoSolarDto: UpdateProyectoSolarDto
  ) {
    const data = await this.proyectosolarService.update(id, updateProyectoSolarDto);
    return {
      success: true,
      message: 'ProyectoSolar actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar ProyectoSolar' })
  @ApiParam({ name: 'id', description: 'ID del ProyectoSolar' })
  @ApiResponse({ status: 200, description: 'ProyectoSolar eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'ProyectoSolar no encontrado' })
  async remove(@Param('id') id: string) {
    const proyectosolar = await this.proyectosolarService.findOne(id);
    if (proyectosolar.imagen) {
      const filename = proyectosolar.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.proyectosolarService.remove(id);
    return { success: true, message: 'ProyectoSolar eliminado exitosamente' };
  }
}
