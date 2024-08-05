import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFreeDto {
  @ApiProperty({
    description: '자유 게시판 게시물의 제목',
    example: '자유 게시판 1번입니다.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '자유 게시판 게시물의 내용',
    example: '자유 게시판 1번 내용입니다.',
  })
  @IsString()
  contents: string;
}