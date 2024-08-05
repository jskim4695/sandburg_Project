import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AnnounceService } from './announce.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/utils/admin.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateAnnounceDto } from './dto/create-announce.dto';
import { User } from 'src/user/entities/user.entity';
import { Announce } from './entities/announce.entity';
import { UpdateAnnounceDto } from './dto/update-announce.dto';

@Controller('announce')
@ApiTags('공지게시판 API')
export class AnnounceController {
  constructor(private readonly announceService: AnnounceService) { }

    // 공지게시판 게시물 생성
    @UseGuards(AdminGuard)
    @Post()
    @ApiOperation({ summary: '자유게시판 게시물 생성', description: '자유게시판에 새로운 게시물을 작성합니다.' })
    @ApiResponse({ status: 201, description: '게시물 생성 성공' })
    @ApiBody({ type: CreateAnnounceDto })
    async createPost(
      @UserInfo() user: User,
      @Body() createFreeDto: CreateAnnounceDto
    ) {
      const createFree = await this.announceService.create(user, createFreeDto)
  
      return createFree
    }

    
    // 공지 게시물 전체 조회
      @ApiOperation({ summary: '공지 게시물 전체 조회', description: '공지게시판의 모든 게시물을 조회합니다.' })
      @ApiResponse({ status: 200, description: '공지게시물 전체 조회 성공' })
    @Get()
    async findAllPost() {
      const posts = await this.announceService.findAllPost();
      return posts;
    }

    // 게시물 단건 조회
    @Get(':postId')
    @ApiOperation({ summary: '공지 게시물 단건 조회', description: '공지게시판의 특정 게시물을 조회합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiResponse({ status: 200, description: '게시물 단건 조회 성공', type: Announce })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async findOneAnnByPostId(@Param('postId') postId: number) {
      const post = await this.announceService.findOneAnnByPostId(postId);
      return post;
    }

    // 게시물 삭제
    @UseGuards(AdminGuard)
    @Delete(':postId')
    @ApiOperation({ summary: '공지 게시물 삭제', description: '공지게시판의 특정 게시물을 삭제합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiResponse({ status: 204, description: '게시물 삭제 성공' })
    @ApiResponse({ status: 403, description: '접근 권한 없음' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async removePost(@UserInfo() user: User, @Param('postId') postId: number) {
      return this.announceService.removeAnnPost(user, postId);
    }

    // 게시물 수정
    @UseGuards(AdminGuard)
    @Patch(':postId')
    @ApiOperation({ summary: '공지 게시물 수정', description: '공지게시판의 특정 게시물을 수정합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title_a: { type: 'string', description: '수정할 제목 예시',  example: '1번 공지 게시물 수정입니다.' },
          contents_a: { type: 'string', description: '수정할 내용 예시', example: '공지 2번입니다.' },
        },
      },
    })
    @ApiResponse({ status: 200, description: '게시물 수정 성공' })
    @ApiResponse({ status: 403, description: '접근 권한 없음' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async updatePost(
      @Param('postId') postId: number,
      @Body() updateAnnounceDto: UpdateAnnounceDto,
      @UserInfo() user: User,
    ) {
      return this.announceService.updateAnnPost(postId, updateAnnounceDto, user);
    }
}
