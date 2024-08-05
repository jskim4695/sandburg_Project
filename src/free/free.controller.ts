import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateFreeDto } from './dto/create-free.dto';
import { FreeService } from './free.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateFreeDto } from './dto/update-free.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Free } from './entities/free.entity';

@Controller('free')
@ApiTags('자유게시판 API')
export class FreeController {
  constructor(private readonly freeService: FreeService) { }

  // 자유게시판 게시물 생성
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '자유게시판 게시물 생성', description: '자유게시판에 새로운 게시물을 작성합니다.' })
  @ApiResponse({ status: 201, description: '게시물 생성 성공' })
  @ApiBody({ type: CreateFreeDto })
  async createPost(
    @UserInfo() user: User,
    @Body() createFreeDto: CreateFreeDto
  ) {
    const createFree = await this.freeService.create(user, createFreeDto)

    return createFree
  }

    // 게시물 전체 조회
    @ApiOperation({ summary: '게시물 전체 조회', description: '자유게시판의 모든 게시물을 조회합니다.' })
    @ApiResponse({ status: 200, description: '게시물 전체 조회 성공' })
  @Get()
  async findAllPost() {
    const posts = await this.freeService.findAllPost();
    return posts;
  }

    // 게시물 단건 조회
    @Get(':postId')
    @ApiOperation({ summary: '게시물 단건 조회', description: '자유게시판의 특정 게시물을 조회합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiResponse({ status: 200, description: '게시물 단건 조회 성공', type: Free })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async findOnePostByPostId(@Param('postId') postId: number) {
      const post = await this.freeService.findOnePostByPostId(postId);
      return post;
    }

    // 게시물 삭제
    @UseGuards(AuthGuard('jwt'))
    @Delete(':postId')
    @ApiOperation({ summary: '게시물 삭제', description: '자유게시판의 특정 게시물을 삭제합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiResponse({ status: 204, description: '게시물 삭제 성공' })
    @ApiResponse({ status: 403, description: '접근 권한 없음' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async removePost(@UserInfo() user: User, @Param('postId') postId: number) {
      return this.freeService.removePost(user, postId);
    }

    // 게시물 수정
    @UseGuards(AuthGuard('jwt'))
    @Patch(':postId')
    @ApiOperation({ summary: '게시물 수정', description: '자유게시판의 특정 게시물을 수정합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: '수정할 제목 예시',  example: '1번 게시물 수정입니다.' },
          contents: { type: 'string', description: '수정할 내용 예시', example: '2번입니다.' },
        },
      },
    })
    @ApiResponse({ status: 200, description: '게시물 수정 성공' })
    @ApiResponse({ status: 403, description: '접근 권한 없음' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async updatePost(
      @Param('postId') postId: number,
      @Body() updateFreeDto: UpdateFreeDto,
      @UserInfo() user: User,
    ) {
      return this.freeService.updatePost(postId, updateFreeDto, user);
    }
}
