import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'modules/auth/jwt.guard';
import { CreateTestDto, UpdateTestDto } from './dtos/create.dto';
import { Test } from './schemas/tests.schema';
import { TestsService } from './tests.service';
import { Nullable } from 'shared/types';

@Controller('/tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  async findById(@Query('_id') _id: string): Promise<Nullable<Test>> {
    return this.testsService.findById(_id);
  }

  @Get('random')
  async getRandom(): Promise<Test[]> {
    return this.testsService.getRandom();
  }

  @Get('category')
  async getByCategoryId(@Query('_id') _id: string): Promise<Nullable<Test[]>> {
    return await this.testsService.getByCategoryId(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async delete(@Param('_id') _id: string): Promise<void> {
    await this.testsService.delete(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateTestDto): Promise<void> {
    await this.testsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async put(@Body() dto: UpdateTestDto): Promise<void> {
    await this.testsService.put(dto);
  }
}
