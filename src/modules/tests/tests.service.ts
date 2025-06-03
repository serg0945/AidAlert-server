import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './schemas/tests.schema';
import { Nullable } from 'shared/types/types';
import { CreateTestDto, UpdateTestDto } from './dtos/create.dto';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testsModel: Model<TestDocument>,
  ) {}

  async findById(_id: string): Promise<Nullable<Test>> {
    const item = await this.testsModel.findById(_id).exec();
    return item;
  }

  async getRandom(limit: number = 3): Promise<Test[]> {
    return await this.testsModel.aggregate([{ $sample: { size: limit } }]);
  }

  async getByCategoryId(categoryId: string): Promise<Nullable<Test[]>> {
    return await this.testsModel.find({ categoryId }).lean();
  }

  async create(dto: CreateTestDto): Promise<void> {
    const test = new this.testsModel(dto);
    await test.save();
  }

  async put(dto: UpdateTestDto): Promise<void> {
    await this.testsModel.findByIdAndUpdate(dto._id, dto);
  }

  async delete(_id: string): Promise<void> {
    await this.testsModel.findByIdAndDelete(_id);
  }
}
