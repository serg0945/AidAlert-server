import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'modules/categories/schemas/category.schema';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ collection: 'posts' })
export class Post {
  @Prop()
  readonly title: string;

  @Prop()
  readonly content: string[];

  @Prop()
  readonly imageFileNames: string[];

  @Prop()
  readonly owner: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  readonly categoryId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
