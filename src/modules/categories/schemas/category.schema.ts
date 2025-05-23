import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'categories' })
export class Category {
  @Prop()
  readonly name: string;

  @Prop()
  readonly imageFileName: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
