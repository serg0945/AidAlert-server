import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Res,
  Patch,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostSchema } from 'modules/posts/schemas/post.schema';
import { Nullable } from 'shared/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { convertToBase64 } from 'shared/utils';
import { CreatePostDto } from 'modules/posts/dtos/create.dto';
import { UpdatePostDto } from 'modules/posts/dtos/update.dto';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('random')
  async getRandom(): Promise<PostSchema[]> {
    return this.postsService.getRandom();
  }

  @Get()
  async findById(@Query('_id') _id: string): Promise<Nullable<PostSchema>> {
    return this.postsService.findById(_id);
  }

  @Get('category')
  async getByCategoryId(
    @Query('_id') _id: string,
  ): Promise<Nullable<PostSchema[]>> {
    return await this.postsService.getByCategoryId(_id);
  }

  @Delete(':_id')
  async delete(@Param('_id') _id: string): Promise<void> {
    await this.postsService.delete(_id);
  }

  @Post('images')
  async getImages(@Body() body: string[], @Res() res: Response) {
    if (!body || !Array.isArray(body) || body.length === 0) {
      return res.status(400).send('Images array is required');
    }

    const filePaths = body.map((name) =>
      path.join(process.cwd(), 'uploads', name),
    );

    const filesExist = filePaths.every((filePath) => fs.existsSync(filePath));

    if (!filesExist) {
      return res.status(404).send('One or more files not found');
    }

    try {
      const base64Images = await Promise.all(
        filePaths.map((filePath) => convertToBase64(filePath)),
      );
      res.json(base64Images);
    } catch {
      return res.status(500).send('Error converting images');
    }
  }

  @Patch()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
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
  async update(
    @Body() body: UpdatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const newArticleData: any = {
      title: body.title,
      owner: body.owner,
      content: body.content,
      imageFileNames: [],
    };

    if (images && images.length > 0) {
      newArticleData.imageFileNames = images.map((image) => image.filename);
    } else if (
      Array.isArray(body.images) &&
      body.images.every((image) => image === 'null')
    ) {
      newArticleData.imageFileNames = [];
    }
    return this.postsService.update(body._id, newArticleData);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const { title, owner, content, categoryId } = dto;
    const newArticleData = {
      title,
      owner,
      content,
      categoryId,
      imageFileNames: images.map((image) => image.filename),
    };

    await this.postsService.create(newArticleData);
  }
}
