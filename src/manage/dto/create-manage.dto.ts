import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManageDto {
  @ApiProperty({
    description: '운영 게시판 게시물의 제목',
    example: '운영 게시판 1번입니다.',
  })
  @IsString()
  title_m: string;

  @ApiProperty({
    description: '운영 게시판 게시물의 내용',
    example: '운영 게시판 1번 내용입니다.',
  })
  @IsString()
  contents_m: string;
}