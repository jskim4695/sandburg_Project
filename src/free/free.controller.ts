import { Body, Controller, Post } from '@nestjs/common';
import { CreateFreeDto } from './dto/create-free.dto';
import { FreeService } from './free.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('free')
export class FreeController {
  constructor(private readonly freeService: FreeService) { }

  // 자유게시판 게시물 생성
  @Post()
  async createPost(
    @UserInfo() user: User,
    @Body() createFreeDto: CreateFreeDto
  ) {
    // const createFree = await this.freeService.create(user)

    // return createFree
  }
}
