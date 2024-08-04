import { IsString } from "class-validator";

export class CreateFreeDto {
  @IsString()
  title: string;

  @IsString()
  contents: string
}