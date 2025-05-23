import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from 'modules/categories/dtos/createCategory.dto';
import {
  Category,
  CategoryDocument,
} from 'modules/categories/schemas/category.schema';
import { Model } from 'mongoose';
import { Nullable } from 'shared/types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoriesModel: Model<CategoryDocument>,
  ) {}

  async get(): Promise<Category[]> {
    return await this.categoriesModel.find().lean();
  }

  async getById(byId: string): Promise<Nullable<Category>> {
    return await this.categoriesModel.findById(byId).lean();
  }

  async create(body: CreateCategoryDto): Promise<void> {
    const createdArticle = new this.categoriesModel(body);
    await createdArticle.save();
  }

  async delete(_id: string): Promise<void> {
    await this.categoriesModel.findByIdAndDelete(_id);
  }
}
