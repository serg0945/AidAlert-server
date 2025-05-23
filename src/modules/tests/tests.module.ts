import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from 'modules/tests/schemas/tests.schema';
import { TestsController } from 'modules/tests/tests.controller';
import { TestsService } from 'modules/tests/tests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
