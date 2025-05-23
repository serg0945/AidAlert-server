import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsArray()
  readonly content: string[];

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsArray()
  readonly imageFileNames: string[];

  @IsNotEmpty()
  @IsString()
  readonly owner: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;
}
