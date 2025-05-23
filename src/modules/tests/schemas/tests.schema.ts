import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'modules/categories/schemas/category.schema';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type TestDocument = HydratedDocument<Test>;

class Answer {
  @Prop({ required: true })
  readonly value: number;

  @Prop({ required: true })
  readonly content: string;

  @Prop({ required: true })
  readonly isTrue: boolean;

  @Prop()
  readonly color: string;
}

class Question {
  @Prop({ required: true })
  readonly question: string;

  @Prop({ type: [Answer], required: true })
  readonly answers: Answer[];
}

@Schema({ collection: 'tests' })
export class Test {
  @Prop({ required: true })
  readonly title: string;

  @Prop()
  readonly owner: string;

  @Prop({ type: [Question], required: true })
  readonly data: Question[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  readonly categoryId: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
