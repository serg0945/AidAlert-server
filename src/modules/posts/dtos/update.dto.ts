import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsArray()
  readonly content: string[];

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  readonly _id: string;

  @IsArray()
  readonly imageFileNames: string[];

  @IsArray()
  readonly images: string[];

  @IsNotEmpty()
  @IsString()
  readonly owner: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;
}
