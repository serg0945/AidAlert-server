import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Nullable } from 'shared/types/types';
import { CreatePostDto } from './dtos/create.dto';
import { UpdatePostDto } from './dtos/update.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<PostDocument>,
  ) {}

  async findById(_id: string): Promise<Nullable<Post>> {
    const item = await this.postsModel.findById(_id).exec();
    return item;
  }

  async getByCategoryId(categoryId: string): Promise<Nullable<Post[]>> {
    return await this.postsModel.find({ categoryId }).lean();
  }

  async getRandom(limit: number = 3): Promise<Post[]> {
    return await this.postsModel.aggregate([{ $sample: { size: limit } }]);
  }

  async update(_id: string, dto: UpdatePostDto) {
    await this.postsModel.findByIdAndUpdate(_id, dto);
  }

  async create(dto: CreatePostDto): Promise<void> {
    const createdArticle = new this.postsModel(dto);
    await createdArticle.save();
  }

  async delete(_id: string): Promise<void> {
    await this.postsModel.findByIdAndDelete(_id);
  }
}
