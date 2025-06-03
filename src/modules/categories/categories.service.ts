import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/udpateCategory.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { Nullable } from 'shared/types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoriesModel: Model<CategoryDocument>,
  ) {}

  async get(): Promise<Category[]> {
    return await this.categoriesModel.find().sort({ name: 1 }).lean();
  }

  async getById(byId: string): Promise<Nullable<Category>> {
    return await this.categoriesModel.findById(byId).lean();
  }

  async create(body: CreateCategoryDto): Promise<void> {
    const createdArticle = new this.categoriesModel(body);
    await createdArticle.save();
  }

  async update(_id: string, dto: UpdateCategoryDto) {
    await this.categoriesModel.findByIdAndUpdate(_id, dto);
  }

  async delete(_id: string): Promise<void> {
    await this.categoriesModel.findByIdAndDelete(_id);
  }
}
