import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class Answer {
  @IsInt()
  value: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  isTrue: boolean;

  @IsString()
  color: string;
}

class Question {
  @IsString()
  @IsNotEmpty()
  question: string;

  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested({ each: true })
  @IsArray()
  data: Question[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested({ each: true })
  @IsArray()
  data: Question[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  _id: string;
}
