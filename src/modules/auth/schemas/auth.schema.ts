import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ collection: 'auth' })
export class Auth {
  @Prop()
  readonly username: string;

  @Prop()
  readonly password: string;

  @Prop()
  readonly dateLogin: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
