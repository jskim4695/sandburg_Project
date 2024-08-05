import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAnnounceDto {
  @ApiProperty({
    description: '공지 게시판 게시물의 제목',
    example: '공지 게시판 1번입니다.',
  })
  @IsString()
  title_a: string;

  @ApiProperty({
    description: '공지 게시판 게시물의 내용',
    example: '공지 게시판 1번 내용입니다.',
  })
  @IsString()
  contents_a: string;
}