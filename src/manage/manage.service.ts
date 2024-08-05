import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manage } from './entities/manage.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateManageDto } from './dto/create-manage.dto';
import { UpdateManageDto } from './dto/update-manage.dto';

@Injectable()
export class ManageService {
  constructor(
    @InjectRepository(Manage)
    private readonly manageRepository: Repository<Manage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
    // 게시물 생성
    async create(user: User, createManageDto: CreateManageDto) {
      const users = await this.userRepository.findOne({
        where: {id: user.id},
      })
  
      if (!users) {
        throw new BadRequestException('사용자를 찾을 수 없습니다.');
      }
  
      const newManagePost = new Manage()
      newManagePost.user_id = user.id
      newManagePost.title_m = createManageDto.title_m;
      newManagePost.contents_m = createManageDto.contents_m;
  
      const post =  await this.manageRepository.save(newManagePost);
  
      return post
    }

  // 게시물 전체 조회
  async findAllPost() {
    const posts = await this.manageRepository.find();
    return posts;
  }

      // 운영 게시물 단건 조회
      async findOneManageByPostId(postId: number) {
        const post = await this.manageRepository.findOne({ where: { id: postId } });
        if (!post) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.');
        }
        return post;
      }

  // 게시물 삭제
  async removeMangePost(user: User, postId: number) {
    const post = await this.findOneManageByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.user_id !== user.id) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }
    await this.manageRepository.remove(post);
    return { message: '게시물이 삭제되었습니다.' };
  }

      // 게시물 수정
      async updateManagePost(postId: number, updateManageDto: UpdateManageDto, user: User) {
        const post = await this.findOneManageByPostId(postId);
        if (!post) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.');
        }
        if (post.user_id !== user.id) {
          throw new BadRequestException('작성자만 수정할 수 있습니다.');
        }
        const isChangedData =
          user.id !== undefined ||
          updateManageDto.title_m !== undefined ||
          updateManageDto.contents_m !== undefined;
        if (!isChangedData) {
          throw new BadRequestException('변경된 내용이 없습니다.')
        }
        await this.manageRepository.update({ id: postId }, updateManageDto);
        return { message: '게시물이 수정되었습니다.' };
      }
}
