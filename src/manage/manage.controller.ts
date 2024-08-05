import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ManageService } from './manage.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { CreateManageDto } from './dto/create-manage.dto';
import { AdminGuard } from 'src/utils/admin.guard';
import { Manage } from './entities/manage.entity';
import { UpdateManageDto } from './dto/update-manage.dto';

@UseGuards(AdminGuard)
@ApiTags('운영게시판 API')
@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) { }

    // 운영게시판 게시물 생성
    @Post()
    @ApiOperation({ summary: '운영게시판 게시물 생성', description: '운영게시판에 새로운 게시물을 작성합니다.' })
    @ApiResponse({ status: 201, description: '게시물 생성 성공' })
    @ApiBody({ type: CreateManageDto })
    async createPost(
      @UserInfo() user: User,
      @Body() createManageDto: CreateManageDto
    ) {
      const createdManage = await this.manageService.create(user, createManageDto)
  
      return createdManage
    }

        // 운영 게시물 전체 조회
        @ApiOperation({ summary: '운영 게시물 전체 조회', description: '운영게시판의 모든 게시물을 조회합니다.' })
        @ApiResponse({ status: 200, description: '운영게시물 전체 조회 성공' })
      @Get()
      async findAllPost() {
        const posts = await this.manageService.findAllPost();
        return posts;
      }

          // 게시물 단건 조회
    @Get(':postId')
    @ApiOperation({ summary: '운영 게시물 단건 조회', description: '운영게시판의 특정 게시물을 조회합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiResponse({ status: 200, description: '게시물 단건 조회 성공', type: Manage })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async findOneManageByPostId(@Param('postId') postId: number) {
      const post = await this.manageService.findOneManageByPostId(postId);
      return post;
    }


        // 게시물 삭제
        @Delete(':postId')
        @ApiOperation({ summary: '운영 게시물 삭제', description: '운영게시판의 특정 게시물을 삭제합니다.' })
        @ApiParam({ name: 'postId', description: '게시물 ID' })
        @ApiResponse({ status: 204, description: '게시물 삭제 성공' })
        @ApiResponse({ status: 403, description: '접근 권한 없음' })
        @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
        async removePost(@UserInfo() user: User, @Param('postId') postId: number) {
          return this.manageService.removeMangePost(user, postId);
        }

            // 게시물 수정
    @UseGuards(AuthGuard('jwt'))
    @Patch(':postId')
    @ApiOperation({ summary: '운영 게시물 수정', description: '운영게시판의 특정 게시물을 수정합니다.' })
    @ApiParam({ name: 'postId', description: '게시물 ID' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title_m: { type: 'string', description: '수정할 제목 예시',  example: '1번 운영 게시물 수정입니다.' },
          contents_m: { type: 'string', description: '수정할 내용 예시', example: '운영 2번입니다.' },
        },
      },
    })
    @ApiResponse({ status: 200, description: '게시물 수정 성공' })
    @ApiResponse({ status: 403, description: '접근 권한 없음' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없음' })
    async updatePost(
      @Param('postId') postId: number,
      @Body() updateFreeDto: UpdateManageDto,
      @UserInfo() user: User,
    ) {
      return this.manageService.updateManagePost(postId, updateFreeDto, user);
    }
}
