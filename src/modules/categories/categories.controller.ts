import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { Category } from './schemas/category.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Nullable } from 'shared/types';
import { Response } from 'express';
import * as fs from 'fs';
import { convertToBase64 } from 'shared/utils';
import * as path from 'path';
import { JwtAuthGuard } from 'modules/auth/jwt.guard';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async get(): Promise<Category[]> {
    return this.categoriesService.get();
  }

  @Post('images')
  async getImages(@Body() body: string[], @Res() res: Response) {
    if (!body || !Array.isArray(body) || body.length === 0) {
      return res.status(400).send('Коллекция из картинок обязательна');
    }

    const filePaths = body.map((name) =>
      path.join(process.cwd(), 'uploads', name),
    );

    const filesExist = filePaths.every((filePath) => fs.existsSync(filePath));
    Logger.log(filePaths);
    Logger.log(process.cwd());

    // if (!filesExist) {
    //   return res.status(404).send('Файлы не были найдены');
    // }

    try {
      const base64Images = await Promise.all(
        filePaths.map((filePath) => convertToBase64(filePath)),
      );
      Logger.log(base64Images);
      res.json(base64Images);
    } catch {
      return res.status(500).send('Ошибка конвертации изображения');
    }
  }

  @Get(':_id')
  async getById(@Param('_id') _id: string): Promise<Nullable<Category>> {
    return this.categoriesService.getById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async delete(@Param('_id') _id: string): Promise<void> {
    await this.categoriesService.delete(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const newArticleData = {
        name: dto.name,
        imageFileName: image.filename,
      };

      await this.categoriesService.create(newArticleData);
    } else {
      throw new BadRequestException('Картинка обязательна');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(@Body() body: any, @UploadedFile() image: Express.Multer.File) {
    const newArticleData: any = {
      name: body.name,
    };

    if (image) {
      newArticleData.imageFileName = image.filename;
    }
    return this.categoriesService.update(body._id, newArticleData);
  }
}
